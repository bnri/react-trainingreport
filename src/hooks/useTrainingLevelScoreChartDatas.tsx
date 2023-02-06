// @ts-nocheck

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

const CommonChartOption = {
  cutoutPercentage: 75,
  responsive: true,
  responsiveAnimationDuration: 1200,
  animation: {
    duration: 1200,
  },
  maintainAspectRatio: false,
};

const useTrainingLevelScoreChartDatas: React.FC = (props) => {
  const { data, selOption, startDate, endDate, language } = props;
  const [dueDate, setDueDate] = useState({ startDate: startDate || "0000-00-00", endDate: endDate || "0000-00-00" });

  const trainingTypesColor = useMemo(
    () => ({
      SentenceMask: "#FA8128",
      VisualSpan: "#28a745",
      KeywordFinding: "#344f66",
      CategoryFinding: "#800080",
      VisualCounting: "#f00",
      TMT: "#46bbbb",
      Stroop: "#a6a55d",
      WordOrdering: "#00f",
    }),
    []
  );

  const CommonDataOptions = useMemo(
    () => ({
      steepedLine: false,
      lineTension: 0,
      fill: false,
      yAxisID: "y1",
      xAxisID: "x1",
      borderWidth: 1.5,
      pointRadius: 3, //데이터 포인터크기
      pointHoverRadius: 3, //hover 데이터포인터크기
    }),
    []
  );

  const displayFormats = useMemo(() => {
    if (selOption === 1) {
      return {
        time: {
          unit: "day",
          displayFormats: { day: "MM월 DD일" },
        },
      };
    } else if (selOption === 2) {
      return {
        time: {
          unit: "week",
          displayFormats: { week: "MM월 DD일" },
        },
      };
    } else if (selOption === 3) {
      return {
        time: {
          unit: "month",
          displayFormats: { month: "YYYY년 MM월" },
        },
      };
    }
  }, [selOption]);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return;
    }

    const selType = { 1: "d", 2: "w", 3: "M" }; // 일별, 주별, 월별

    const midnight = dayjs(endDate).format("YYYY-MM-DD 00:00:00");
    let now = dayjs(endDate);
    let startDate = dayjs(midnight).add(-9, selType[selOption]); // 오늘 포함해야하니까 -9로 이동

    let ptr = dayjs(midnight).add(-9, selType[selOption]);

    // 주별이 선택되어있을때는 월요일로 옮겨야함
    if (selOption === 2) {
      ptr = ptr.day(1);
    }

    // 월별이 선택되어있을때는 1일로 옮겨야함
    if (selOption === 3) {
      ptr.set("date", 1);
    }

    const betweenDateList = [];
    while (ptr <= now) {
      const dayFormat = ptr.format("YYYY-MM-DD");
      const monthFormat = ptr.format("YYYY-MM");
      betweenDateList.push({ dayFormat, dayjs: dayjs(dayFormat), monthFormat });
      ptr = ptr.add(1, selType[selOption]);
    }
    // [레벨스코어 = 점수 + 레벨 * 20]
    // 트레이닝 레벨 가중 점수 = 현재 점수 + 레벨 * 20
    const ds = [];
    for (let i = 0; i < data.length; i++) {
      const task = data[i];
      let trList = [];
      const trDateList = Object.keys(task.trainingResult).sort((a, b) => new Date(a) - new Date(b));
      for (let j = 0; j < trDateList.length; j++) {
        for (let k = 0; k < betweenDateList.length; k++) {
          const trMoment = dayjs(`${trDateList[j]} 00:00:00`);
          if (trMoment < betweenDateList[k].dayjs) {
            // tr 날짜가 기준 날짜보다 이전이면 pass
            continue;
          }
          if (k !== betweenDateList.length - 1 && trMoment >= betweenDateList[k + 1].dayjs) {
            // tr 날짜가 다음 기준 날짜보다 크다면 pass
            // [k] ~ [k+1] 사이에 있는 날짜가 아님
            continue;
          }
          // betweenDateList[k]

          const tr = task.task_type === "Reading" ? task.trainingResult[trDateList[j]].filter((f) => f.tr_language === language) : task.trainingResult[trDateList[j]];
          const score = +(tr.reduce((prev, curr) => prev + (curr.tr_score + curr.tr_level * 20), 0) / tr.length).toFixed(1);
          let f;
          // 3이면 월별
          let x = selOption === 3 ? betweenDateList[k].monthFormat : betweenDateList[k].dayFormat;
          f = trList.find((f) => f.x === x);
          if (!f) {
            trList.push({
              x,
              y: score,
              count: tr.length,
              dayCount: 1,
            });
          } else {
            f.y = +(f.y + score).toFixed(1);
            f.count += tr.length;
            f.dayCount++;
          }
        }
      }
      if (selOption !== 1) {
        trList = trList.map((tr) => {
          return {
            ...tr,
            y: +(tr.y / tr.dayCount).toFixed(1),
          };
        });
      }

      ds.push({
        data: trList,
        borderColor: trainingTypesColor[task.task_name],
        backgroundColor: trainingTypesColor[task.task_name],
        label: task.task_name,
        ...CommonDataOptions,
      });
    }
    // 월별일때 체크
    let labels;
    if (selOption === 3) {
      startDate = startDate.format("YYYY-MM");
      now = now.format("YYYY-MM");
      labels = betweenDateList.map((b) => b.monthFormat);
    } else {
      startDate = startDate.format("YYYY-MM-DD");
      now = now.format("YYYY-MM-DD");
      labels = betweenDateList.map((b) => b.dayFormat);
    }
    setDueDate({ startDate: startDate, endDate: now });

    return {
      labels,
      datasets: ds,
    };
  }, [selOption, data, trainingTypesColor, CommonDataOptions, endDate, language]);

  const chartOption = useMemo(() => {
    if (!chartData) {
      return;
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
          label: (tooltipItem, d) => {
            const index = tooltipItem.index;
            const datasetIndex = tooltipItem.datasetIndex;
            const tr_type = d.datasets[datasetIndex].label;
            const count = d.datasets[datasetIndex].data[index].count;
            return [tr_type, `훈련일 : ${tooltipItem.xLabel}`, `훈련횟수 : ${count}회`, `레벨스코어 : ${tooltipItem.yLabel}점`];
          },
          labelColor: (tooltipItem, chart) => {
            const dataset = chart.config.data.datasets[tooltipItem.datasetIndex];
            return {
              borderColor: dataset.backgroundColor,
              backgroundColor: dataset.backgroundColor,
              borderWidth: 0,
            };
          },
          labelTextColor: function (tooltipItem, chart) {
            return "#666";
          },
          title: function (tooltipItem, data) {
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
          formatter: (value, ctx) => {
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
            type: "time",
            ...displayFormats,
            ticks: {
              source: "labels", // data 속성의 labels 배열을 따라가겠다는 의미
              // min: dueDate.startDate,
              // max: dueDate.endDate,
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
              color: "rgba(0, 0, 0, 0)",
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
              suggestedMax: 250,
            },
          },
        ],
      },
    };
  }, [chartData, displayFormats]);

  return { chartData, chartOption, dueDate };
};

export default useTrainingLevelScoreChartDatas;
