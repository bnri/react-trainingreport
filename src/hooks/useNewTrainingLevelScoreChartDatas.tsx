import { useMemo } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { TaskType } from "../types";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

const CommonChartOption = {
  devicePixelRatio: window?.devicePixelRatio > 1 ? 2 : 1,
  cutoutPercentage: 75,
  responsive: true,
  responsiveAnimationDuration: 1200,
  animation: {
    duration: 1200,
  },
  maintainAspectRatio: false,
};

const divideDateRange = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
  const dateArray = [];

  const duration = endDate.diff(startDate);
  const interval = duration / 9;

  for (let i = 0; i < 10; i++) {
    const newDate = startDate.add(interval * i);
    dateArray.push({
      format: newDate.format("YYYY-MM-DD"),
      dayFormat: newDate.format("MM월 DD일"),
      dayjs: dayjs(newDate).set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0),
    });
  }

  return dateArray;
};

interface LevelScoreChartProps {
  data: TaskType[];
  type: "Reading" | "Cognitive";
  startDate: string;
  endDate: string;
  language: "한국어" | "영어";
}

const useNewTrainingLevelScoreChartDatas = (props: LevelScoreChartProps) => {
  const { data, type, startDate, endDate, language } = props;
  const dueDate = useMemo(() => {
    if (!startDate || !endDate) return;

    const sDate = dayjs(startDate);
    const eDate = dayjs(endDate);

    if (eDate.diff(sDate, "day") < 10) {
      return {
        startDate: dayjs(endDate).add(-9, "day"),
        endDate: eDate,
      };
    } else {
      return { startDate: sDate, endDate: eDate };
    }
  }, [startDate, endDate]);

  const chartData = useMemo(() => {
    if (!data || data.length === 0 || !dueDate) {
      return;
    }

    const trainingTypesColor: { [key: string]: string } = {
      SentenceMask: "#FA8128",
      CategoryFinding: "#800080",
      KeywordFinding: "#344f66",
      WordOrdering: "#00f",
      RSVP: "#888888",
      VisualSpan: "#28a745",
      VisualCounting: "#f00",
      TMT: "#46bbbb",
      Stroop: "#a6a55d",
    };

    const commonDataOptions = {
      steepedLine: false,
      lineTension: 0,
      fill: false,
      yAxisID: "y1",
      xAxisID: "x1",
      borderWidth: 1.5,
      pointRadius: 3, //데이터 포인터크기
      pointHoverRadius: 3, //hover 데이터포인터크기
    };

    // 작업 시작
    // [레벨스코어 = 점수 + 레벨 * 20]

    const { startDate, endDate } = dueDate;
    const dividedDates = divideDateRange(startDate, endDate); // 10등분한 date

    const dataset = [];

    for (let i = 0; i < data.length; i++) {
      const task = data[i];
      const trList = [];
      const trDateList = Object.keys(task.trainingResult).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      let dateIndex = 0;

      for (let j = 0; j < dividedDates.length; j++) {
        // level score는 기간 범위의 전체 평균
        // 차트에 찍히는건 label과 label 사이 중심에 가능하려나?
        let sumScore = 0;
        let sumLength = 0;
        let isNothing = true; // 일단 기준 날짜까지 tr이 없다고 생각(그래프 표시하면 안되기 때문에)
        while (true) {
          // 종료 조건 : 더이상 확인할 tr이 없을 땐 해당 task 끝
          if (dateIndex === trDateList.length) {
            j = dividedDates.length - 1;
            break;
          }

          const trDayjs = dayjs(`${trDateList[dateIndex]} 00:00:00`);
          if (trDayjs > dividedDates[j].dayjs) {
            // 이후 날짜가 됐다면 j 값 증가
            break;
          }

          const tr = task.trainingResult[trDateList[j]].filter((f) => f.tr_language === language);
          if (tr.length > 0) {
            isNothing = false;
          }
          // 일 평균
          sumScore = +(sumScore + +tr.reduce((prev, curr) => prev + (curr.tr_score + curr.tr_level * 20), 0)).toFixed(1);
          sumLength += tr.length;

          dateIndex++;
        }

        // 범위의 평균
        const dueAvgScore = +(sumScore / (sumLength || 1)).toFixed(1);

        if (!isNothing) {
          trList.push({
            x: dividedDates[j].format,
            y: dueAvgScore,
            count: sumLength,
          });
        }
      }
      dataset.push({
        data: trList,
        borderColor: trainingTypesColor[task.task_name],
        backgroundColor: trainingTypesColor[task.task_name],
        label: task.task_name,
        ...commonDataOptions,
      });
    }

    return {
      labels: dividedDates.map((v) => v.format),
      datasets: dataset,
    };
  }, [type, data, dueDate, language]);

  const chartOption = useMemo(() => {
    if (!chartData) {
      return {};
    }

    return {
      ...CommonChartOption,
      tooltips: {
        usePointStyle: true,
        callbacks: {
          labelPointStyle: () => {
            return {
              pointStyle: "triangle",
              rotation: 0,
            };
          },
          label: (tooltipItem: any, d: any) => {
            const index = tooltipItem.index;
            const datasetIndex = tooltipItem.datasetIndex;
            const tr_type = d.datasets[datasetIndex].label;
            const count = d.datasets[datasetIndex].data[index].count;
            const trDate = d.datasets[datasetIndex].data[index].x;
            let dueDate = ``;

            const f = d.labels.findIndex((f: string) => f === trDate);

            if (f === 0) {
              dueDate = dayjs(trDate).format("MM월 DD일");
            } else {
              const sDate = dayjs(d.labels[f - 1])
                .add(1, "day")
                .format("MM월 DD일");
              const eDate = dayjs(d.labels[f]).format("MM월 DD일");
              dueDate = `${sDate} ~ ${eDate}`;
            }
            return [tr_type, `범위 : ${dueDate}`, `훈련횟수 : ${count}회`, `레벨스코어 : ${tooltipItem.yLabel}점`];
          },
          labelColor: (tooltipItem: any, chart: any) => {
            const dataset = chart.config.data.datasets[tooltipItem.datasetIndex];
            return {
              borderColor: dataset.backgroundColor,
              backgroundColor: dataset.backgroundColor,
              borderWidth: 0,
            };
          },
          labelTextColor: function () {
            return "#666";
          },
          title: function () {
            return "";
          },
        },
        backgroundColor: "#FFF",
        titleFontSize: 14,
        titleFontColor: "#0066ff",
        bodyFontColor: "#000",
        bodyFontSize: 14,
        displayColors: true,
        borderColor: "#145894",
        borderWidth: 1,
      },
      plugins: {
        datalabels: {
          formatter: () => {
            return null;
          },
          anchor: "center",
          align: "center",
          color: "#000000",
        },
      },
      scales: {
        xAxes: [
          {
            id: "x1",
            display: true, // 실제시간 임시로 true//
            // type: "time",
            // time: {
            //   unit: "week",
            //   displayFormats: { week: "MM월 DD일" },
            // },
            ticks: {
              source: "labels", // data 속성의 labels 배열을 따라가겠다는 의미
              // min: dueDate.startDate,
              // max: dueDate.endDate,
              callback: function (val: any) {
                return dayjs(val).format("MM월 DD일");
              },
            },
            gridLines: {
              display: true,
              color: "rgb(50,50,50,0.5)",
            },
          },
        ],
        yAxes: [
          {
            id: "y1",
            position: "left",
            gridLines: {
              display: true,
              color: "rgb(50, 50, 50, 0.2)",
            },
            scaleLabel: {
              /////////////////x축아래 라벨
              display: true,
              labelString: "레벨 스코어",
              //fontStyle: 'bold',
              fontSize: 15,
            },
            ticks: {
              source: "data", //auto,data,labels
              suggestedMin: -50,
              suggestedMax: 350,
            },
          },
        ],
      },
    };
  }, [chartData]);

  return { chartData, chartOption, dueDate };
};

export default useNewTrainingLevelScoreChartDatas;
