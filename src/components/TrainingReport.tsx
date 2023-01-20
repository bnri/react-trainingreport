import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { Doughnut, Radar } from "react-chartjs-2";
import "chartjs-plugin-doughnutlabel";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import PDF, { preloadDone } from "../lib/pdf";
import { ReportProps, ReportType, TrainingType, typenames } from "../types";
import { imgbase64forPDF } from "../lib/base64";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

const makeTrainingObject = (type: typenames, language: "한국어" | "영어"): TrainingType => ({
  type,
  language: ["SentenceMask", "WordOrdering", "KeywordFinding", "CategoryFinding"].includes(type) ? language : "한국어",
  // 모든 숫자들은 다 더해서 넣어두기, equalTypeCount로 나눠서 평균내기
  level: 0,
  reculsiveCount: 0,
  weeklyPerformedDays: 0,
  performedCount: 0,
  needPerformedCount: 0,
  performedRatio: 0,
  totDuration: 0,
  avgDuration: 0,
  avgScore: 0,
  totScore: 0,
  equalTypeCount: 0, // 이 type이 지금 몇 개 나왔는지
});

export const getActiveDays = (dayofweek: string): boolean[] => {
  type dayofweekType = "일" | "월" | "화" | "수" | "목" | "금" | "토";
  const weeklyPerformedDays = dayofweek.split(",") as dayofweekType[];
  const daysObj = { 일: 0, 월: 1, 화: 2, 수: 3, 목: 4, 금: 5, 토: 6 };
  const activeDays = Array(7).fill(false);

  for (let k = 0; k < weeklyPerformedDays.length; k++) {
    const d = daysObj[weeklyPerformedDays[k]]; // 수행 날짜를 골라서
    activeDays[d] = true; // 해당 날짜 인덱스에 설정하기
  }

  return activeDays;
};

const makeTrainingList = (language: "한국어" | "영어") => {
  const typenameList: typenames[] = [
    "SentenceMask",
    "WordOrdering",
    "KeywordFinding",
    "CategoryFinding",
    "VisualSpan",
    "VisualCounting",
    "TMT",
    "Stroop",
    "SaccadeTracking",
    "PursuitTracking",
    "AntiTracking",
    "SentenceTracking",
    "ExerciseHorizontal",
    "ExerciseVertical",
    "ExerciseHJump",
    "ExerciseVJump",
  ];
  return typenameList.map((t) => makeTrainingObject(t, language));
};

export interface ImperativeType {
  isPossibleMakePDF: () => boolean;
  generatePDF: () => Promise<boolean>;
  downloadPDF: () => Promise<boolean>;
}

const TrainingReport = forwardRef<ImperativeType, ReportProps>((props, ref) => {
  const { data: trainingData, meIndex, info } = props;
  const [isMobileWidth, setIsMobileWidth] = useState<boolean>(false);
  const [data, setData] = useState<ReportType>();
  const [pdf, setPdf] = useState<PDF>();

  const tier = useMemo(() => {
    if (!data) {
      return;
    }

    if (data.firstScore >= 80000) {
      return "다이아몬드";
    } else if (data.firstScore >= 40000) {
      return "플래티넘";
    } else if (data.firstScore >= 15000) {
      return "골드";
    } else if (data.firstScore >= 5000) {
      return "실버";
    } else {
      return "브론즈";
    }
  }, [data]);

  const medal = useMemo(() => {
    if (!tier) {
      return;
    }

    return imgbase64forPDF[tier];
  }, [tier]);

  useImperativeHandle(ref, () => ({
    isPossibleMakePDF: () => preloadDone && Boolean(data),
    generatePDF: () => {
      return new Promise(async (resolve, reject) => {
        if (!data || !tier) {
          reject("data invalid");
          return;
        }
        const pdf = new PDF(data, tier, data.agencyLogo);
        const response = await pdf.start();
        setPdf(pdf);
        resolve(response);
      });
    },
    downloadPDF: () => {
      return new Promise(async (resolve, reject) => {
        if (!pdf) {
          resolve(false);
          return;
        }

        const response = await pdf.download();
        resolve(response);
      });
    },
  }));

  useEffect(() => {
    const resize = () => {
      const width = window.innerWidth;
      setIsMobileWidth(() => width <= 500);
    };

    window.addEventListener("resize", resize);
    resize();

    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (!trainingData) {
      return;
    }

    // @ts-ignore;
    const resultData: ReportType = {
      agencyID: trainingData[meIndex].agency_ID,
      agencyName: trainingData[meIndex].agency_name,
      agencyLogo: info.agency_logo,

      testeeIdx: trainingData[meIndex].testee_idx,
      testeeID: trainingData[meIndex].user_ID,
      testeeNickname: trainingData[meIndex].testee_nickname,
      testeeClass: trainingData[meIndex].testee_class || "",

      startdate: info.start_date,
      enddate: info.end_date,

      totScore: trainingData[meIndex].tts_totalscore || 0,
      firstScore: trainingData[meIndex].tts_firstscore || 0,
      firstScoreDate: trainingData[meIndex].tts_firstscore_resetdate,
      firstScoreRank: trainingData[meIndex].rank,

      secondScore: trainingData[meIndex].tts_secondscore || 0,
      secondScoreDate: trainingData[meIndex].tts_secondscore_resetdate,

      dueScore: 0,
      performedRatio: 0,
      avgScore: 0,
      avgDuration: 0,

      trainingList: makeTrainingList(info.language),
    };

    // 그룹의 총 점수 계산
    const groupScoreObject = {
      SentenceMask: { avgTotScore: 0, avgTotDuration: 0, cnt: 0 },
      CategoryFinding: { avgTotScore: 0, avgTotDuration: 0, cnt: 0 },
      KeywordFinding: { avgTotScore: 0, avgTotDuration: 0, cnt: 0 },
      WordOrdering: { avgTotScore: 0, avgTotDuration: 0, cnt: 0 },
      VisualSpan: { avgTotScore: 0, avgTotDuration: 0, cnt: 0 },
      VisualCounting: { avgTotScore: 0, avgTotDuration: 0, cnt: 0 },
      TMT: { avgTotScore: 0, avgTotDuration: 0, cnt: 0 },
      Stroop: { avgTotScore: 0, avgTotDuration: 0, cnt: 0 },
      SaccadeTracking: { avgTotScore: 0, avgTotDuration: 0, cnt: 0 },
      PursuitTracking: { avgTotScore: 0, avgTotDuration: 0, cnt: 0 },
      AntiTracking: { avgTotScore: 0, avgTotDuration: 0, cnt: 0 },
      SentenceTracking: { avgTotScore: 0, avgTotDuration: 0, cnt: 0 },
      ExerciseHorizontal: { avgTotScore: 0, avgTotDuration: 0, cnt: 0 },
      ExerciseVertical: { avgTotScore: 0, avgTotDuration: 0, cnt: 0 },
      ExerciseHJump: { avgTotScore: 0, avgTotDuration: 0, cnt: 0 },
      ExerciseVJump: { avgTotScore: 0, avgTotDuration: 0, cnt: 0 },
    };

    let myPerformedCount = 0; // 수행률 계산, 내가 수행한 횟수
    let myNeedPerformedCount = 0; // 수행률 계산, 수행했어야하는 횟수

    let myTotScore = 0; // 수행 총 점수
    let myTotAvgScore = 0; // 수행 평균점수들의 합
    let myTotAvgDuration = 0; // 수행 평균시간들의 합

    // 일단 내 점수부터
    const endDate = dayjs(info.end_date);
    // console.log("resultData", resultData);

    const myTaskList = trainingData[meIndex].taskList;

    let myChartCount = 0; // 차트에 필요한 평균을 낼 개수
    let groupChartCount = 0;

    const myResultObj: { [key: string]: { duration: number } } = {};

    for (let i = 0; i < myTaskList.length; i++) {
      if (myTaskList[i].isactive === 0 || myTaskList[i].language !== info.language) {
        // 비활성 과제는 pass
        continue;
      }

      const task = myTaskList[i];
      // start_date~end_date까지 각 요일별로 체크해서
      // 해당일이 수행해야하는 날이었는지 아닌지 체크
      const activeDays = getActiveDays(task.dayofweek);

      let ptr = dayjs(info.start_date);
      let performedCount = 0; // 해당 과제의 수행횟수
      let taskTotScore = 0; // 해당 과제의 총점
      let taskTotDuration = 0; // 해당 과제의 총 수행시간
      let needPerformedCount = 0; // 해당 과제에서 해야했던 수행횟수
      let totLevel = 0; // 각 결과에 대한 레벨 합계
      let performedDayCount = 0; // 수행한 날짜의 개수

      while (ptr <= endDate) {
        const day = ptr.day();

        if (!activeDays[day]) {
          ptr = ptr.add(1, "day");
          continue;
        }

        // 해야했던 날
        const format = ptr.format("YYYY-MM-DD");
        // 트레이닝 결과가 있는지 확인
        if (task.trainingResult[format]) {
          const taskScore = task.trainingResult[format].reduce((prev, curr) => prev + curr.tr_score, 0);
          const taskLevel = task.trainingResult[format].reduce((prev, curr) => prev + curr.tr_level, 0);
          const taskDuration = task.trainingResult[format].reduce((prev, curr) => prev + curr.tr_duration, 0);

          if (myResultObj.hasOwnProperty(format)) {
            myResultObj[format].duration += taskDuration;
          } else {
            myResultObj[format] = { duration: taskDuration };
          }

          performedCount += task.trainingResult[format].length;
          taskTotScore += taskScore;
          totLevel += taskLevel;
          taskTotDuration += taskDuration;
          performedDayCount++;
        }
        needPerformedCount += task.reculsivecount;

        ptr = ptr.add(1, "day");
      }

      const findIndex = resultData.trainingList.findIndex((f) => f.type === task.task_name);
      if (findIndex === -1) {
        continue;
      }

      resultData.trainingList[findIndex].equalTypeCount = 1;
      resultData.trainingList[findIndex].reculsiveCount = task.reculsivecount;
      resultData.trainingList[findIndex].weeklyPerformedDays = activeDays.reduce((prev, curr) => prev + +curr, 0);
      resultData.trainingList[findIndex].performedCount = performedCount;
      resultData.trainingList[findIndex].totScore = taskTotScore;
      resultData.trainingList[findIndex].totDuration = taskTotDuration;
      resultData.trainingList[findIndex].needPerformedCount = needPerformedCount;
      resultData.trainingList[findIndex].performedRatio = parseFloat((performedCount / (needPerformedCount || 1)).toFixed(4));

      if (performedCount === 0) {
        // 수행을 한 번도 안함,
        // 차트 평균에서는 뺌, 수행한 것의 평균을 내야하기 때문에
        resultData.trainingList[findIndex].level = task.level;
        resultData.trainingList[findIndex].avgScore = 0;
        resultData.trainingList[findIndex].avgDuration = 0;
      } else {
        // 해당 과제의 평균 레벨, 점수, 수행시간
        // 수행한 결과이기 때문에 차트 평균 구할때의 횟수 증가
        resultData.trainingList[findIndex].level = parseFloat((totLevel / performedCount).toFixed(1));
        resultData.trainingList[findIndex].avgScore = parseFloat((taskTotScore / performedCount).toFixed(1));
        resultData.trainingList[findIndex].avgDuration = parseFloat((taskTotDuration / (performedDayCount || 1)).toFixed(1));

        myChartCount++;
      }

      myPerformedCount += performedCount; // 내 총 수행횟수
      myNeedPerformedCount += needPerformedCount; // 내가 해야했던 총 수행횟수

      myTotScore += taskTotScore;
      // myTotAvgScore += resultData.trainingList[findIndex].avgScore;
      // myTotAvgDuration += resultData.trainingList[findIndex].avgDuration;
    }

    const myPerformedDateList = Object.keys(myResultObj);
    myTotAvgDuration = myPerformedDateList.reduce((prev, curr) => prev + myResultObj[curr].duration, 0);
    const avgDuration = myTotAvgDuration / 60; // 분(minute)으로 바꾸기

    resultData.dueScore = myTotScore;
    resultData.performedRatio = parseFloat(((myPerformedCount / (myNeedPerformedCount || 1)) * 100).toFixed(4));
    resultData.avgScore = parseFloat((myTotScore / (myPerformedCount || 1)).toFixed(1));
    resultData.avgDuration = parseFloat(avgDuration.toFixed(1));

    // 과제 없는건 없애버리기
    resultData.trainingList = resultData.trainingList.filter((f) => f.equalTypeCount !== 0);

    // 그룹 점수 내기, 내꺼는 구해놨으니 초기화를 내꺼로
    let groupPerformedCount = 0; // 수행률 계산, 그룹의 수행한 횟수
    let groupNeedPerformedCount = 0; // 수행률 계산, 수행했어야하는 횟수

    let groupTotAvgScore = 0; // 수행 총 평균점수들의 합
    let groupTotAvgDuration = 0; // 수행 총 평균시간들의 합
    let groupTotPerformedCount = 0;

    for (let i = 0; i < trainingData.length; i++) {
      const taskList = trainingData[i].taskList;
      const groupResultObj: { [key: string]: { duration: number; cnt: number } } = {};
      for (let j = 0; j < taskList.length; j++) {
        if (taskList[j].isactive === 0 || taskList[j].language !== info.language) {
          continue;
        }
        const task = taskList[j];

        // start_date~end_date까지 각 요일별로 체크해서
        // 해당일이 수행해야하는 날이었는지 아닌지 체크
        const activeDays = getActiveDays(task.dayofweek);

        let ptr = dayjs(info.start_date);
        let performedCount = 0; // 해당 과제의 수행횟수
        let taskTotScore = 0; // 해당 과제의 총점
        let taskTotDuration = 0; // 해당 과제의 총 수행시간
        let needPerformedCount = 0; // 해당 과제에서 해야했던 수행횟수

        while (ptr <= endDate) {
          const day = ptr.day();

          if (!activeDays[day]) {
            ptr = ptr.add(1, "day");
            continue;
          }

          // 해야했던 날
          const format = ptr.format("YYYY-MM-DD");
          // 그 날짜에 트레이닝 결과가 있는지 확인
          if (task.trainingResult.hasOwnProperty(format)) {
            const taskScore = task.trainingResult[format].reduce((prev, curr) => prev + curr.tr_score, 0);
            const taskDuration = task.trainingResult[format].reduce((prev, curr) => prev + curr.tr_duration, 0);
            const cnt = task.trainingResult[format].length;

            if (groupResultObj.hasOwnProperty(format)) {
              groupResultObj[format].duration += taskDuration;
              groupResultObj[format].cnt += cnt;
            } else {
              groupResultObj[format] = { duration: taskDuration, cnt };
            }

            performedCount += task.trainingResult[format].length;
            taskTotScore += taskScore;
            taskTotDuration += taskDuration;
          }
          groupNeedPerformedCount += task.reculsivecount;

          ptr = ptr.add(1, "day");
        }

        if (performedCount === 0) {
          // 수행을 한 번도 안함,
          // 차트 평균에서는 뺌, 수행한 것의 평균을 내야하기 때문에
          groupScoreObject[task.task_name].avgTotScore += 0;
          groupScoreObject[task.task_name].avgTotDuration += 0;
        } else {
          // 해당 과제의 평균 점수, 수행시간
          // 수행한 결과이기 때문에 차트 평균 구할때의 횟수 증가
          groupScoreObject[task.task_name].avgTotScore += parseFloat((taskTotScore / performedCount).toFixed(1));
          groupScoreObject[task.task_name].avgTotDuration += parseFloat((taskTotDuration / performedCount).toFixed(1));
          groupScoreObject[task.task_name].cnt++;
        }

        groupPerformedCount += performedCount; // 내 총 수행횟수
        groupNeedPerformedCount += needPerformedCount; // 내가 해야했던 총 수행횟수
      }

      if (Object.keys(groupResultObj).length === 0) {
        continue;
      }

      const performedDateList = Object.keys(groupResultObj);
      const groupAvgDuration = performedDateList.reduce((prev, curr) => prev + groupResultObj[curr].duration, 0) / performedDateList.length;
      const minuteDuration = groupAvgDuration / 60; // 분(minute)으로 바꾸기
      groupTotAvgDuration += minuteDuration;
      groupTotPerformedCount++;
    }

    const groupTrainingTypeAvgScore: Record<typenames, number> = {
      SentenceMask: 0,
      CategoryFinding: 0,
      KeywordFinding: 0,
      WordOrdering: 0,
      VisualSpan: 0,
      VisualCounting: 0,
      TMT: 0,
      Stroop: 0,
      SaccadeTracking: 0,
      PursuitTracking: 0,
      AntiTracking: 0,
      SentenceTracking: 0,
      ExerciseHorizontal: 0,
      ExerciseVertical: 0,
      ExerciseHJump: 0,
      ExerciseVJump: 0,
    };

    const typeList = Object.keys(groupScoreObject);

    for (let i = 0; i < typeList.length; i++) {
      // @ts-ignore;
      const key: typenames = typeList[i];
      if (groupScoreObject[key].cnt === 0) {
        groupTrainingTypeAvgScore[key] = 0;
      } else {
        groupTrainingTypeAvgScore[key] = parseFloat((groupScoreObject[key].avgTotScore / groupScoreObject[key].cnt).toFixed(1));
        groupTotAvgScore += groupTrainingTypeAvgScore[key];
        // groupTotAvgDuration += parseFloat((groupScoreObject[key].avgTotDuration / groupScoreObject[key].cnt).toFixed(1));
        groupChartCount++;
      }
    }

    const groupAvgDuration = groupTotPerformedCount !== 0 ? groupTotAvgDuration / groupTotPerformedCount : 0;

    resultData.groupScoreList = {
      performedRatio: parseFloat(((groupPerformedCount / (groupNeedPerformedCount || 1)) * 100).toFixed(1)),
      avgScore: parseFloat((groupTotAvgScore / (groupChartCount || 1)).toFixed(1)),
      avgDuration: parseFloat(groupAvgDuration.toFixed(1)),

      ...groupTrainingTypeAvgScore,
    };

    // // chart title 내용
    if (resultData.performedRatio >= 90) {
      resultData.ratioTitle = "잘하고 있어요";
    } else if (resultData.performedRatio >= 80) {
      resultData.ratioTitle = "조금만 더 분발해요";
    } else if (resultData.performedRatio >= 70) {
      resultData.ratioTitle = "수행이 미흡해요";
    } else {
      resultData.ratioTitle = "수행이 많이 미흡해요";
    }

    if (resultData.avgScore >= 80) {
      resultData.scoreTitle = "쉬워요";
    } else if (resultData.avgScore >= 60) {
      resultData.scoreTitle = "적당해요";
    } else {
      resultData.scoreTitle = "어려워요";
    }

    if (resultData.avgDuration >= 30) {
      resultData.durationTitle = "수행량이 너무 많아요";
    } else if (resultData.avgDuration >= 20) {
      resultData.durationTitle = "수행량이 조금 많아요";
    } else if (resultData.avgDuration >= 10) {
      resultData.durationTitle = "수행량이 적절해요";
    } else {
      resultData.durationTitle = "수행량이 적어요";
    }
    setData(resultData);
  }, [trainingData, meIndex, info]);

  const trainingTypes = useMemo(() => {
    return ["Sentence Mask", "Word Ordering", "Keyword Finding", "Category Finding", "Visual Span", "Visual Counting", "TMT", "Stroop", "Saccade Tracking", "Pursuit Tracking", "Anti Tracking", "Sentence Tracking", "Exercise Horizontal", "Exercise Vertical", "Exercise HJump", "Exercise VJump"];
  }, []);

  const commonChartOption = useMemo(() => {
    return {
      cutoutPercentage: 75,
      responsive: true,
      responsiveAnimationDuration: 1000,
      animation: {
        duration: 1000,
      },
      maintainAspectRatio: false,
      tooltips: {
        enabled: false,
      },
      plugins: {
        datalabels: {
          display: false,
          color: "black",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    };
  }, []);

  const commonResultChartOption = useMemo(() => {
    if (!commonChartOption) {
      return;
    }

    return {
      ...commonChartOption,
      legend: {
        display: true,
        position: "bottom",
        align: "start",
      },
      scale: {
        ticks: {
          beginAtZero: true,
          max: 100,
          min: 0,
          stepSize: 20,
          backdropColor: "transparent",
        },
      },
      plugins: {
        ...commonChartOption.plugins,
      },
    };
  }, [commonChartOption]);

  const datasetKeyProvider = useCallback(() => {
    return btoa(Math.random() + "").substring(0, 12);
  }, []);

  const ratioChartTitle = useMemo(() => {
    if (!data) {
      return;
    }

    return data.ratioTitle;
  }, [data]);

  const ratioChartData = useMemo(() => {
    if (!data) {
      return;
    }

    return {
      labels: [],
      type: "doughnut",
      datasets: [
        {
          data: [data.performedRatio, 100 - data.performedRatio],
          backgroundColor: ["#009bde", "transparent"],
          borderWidth: 0,
          hoverBorderWidth: 0,
        },
        {
          data: [data.groupScoreList.performedRatio, 100 - data.groupScoreList.performedRatio],
          backgroundColor: ["#ada9bb", "transparent"],
          borderWidth: 0,
          hoverBorderWidth: 0,
        },
      ],
    };
  }, [data]);

  const ratioChartOptions = useMemo(() => {
    if (!ratioChartData || !commonChartOption || !data) {
      return;
    }

    return {
      ...commonChartOption,
      title: {
        display: true,
        text: ratioChartTitle,
        color: "#464555",
        fontSize: 16,
        fontFamily: "'FontAwesome','Helvetica Neue', 'Helvetica', 'Arial', sans-serif", //
      },
      plugins: {
        ...commonChartOption.plugins,
        doughnutlabel: {
          labels: [
            {
              text: `${parseFloat(data.performedRatio.toFixed(1))}%`,
              font: {
                size: "24",
              },
              color: ratioChartData.datasets[0].backgroundColor[0],
            },
            {
              text: `기관 평균`,
              font: {
                size: "16",
              },
              color: "#464555",
            },
            {
              text: `${data.groupScoreList.performedRatio}%`,
              font: {
                size: "20",
              },
              color: ratioChartData.datasets[1].backgroundColor[0],
            },
          ],
        },
      },
    };
  }, [data, ratioChartTitle, ratioChartData, commonChartOption]);

  const avgScoreChartTitle = useMemo(() => {
    if (!data) {
      return;
    }

    return data.scoreTitle;
  }, [data]);

  const avgScoreChartData = useMemo(() => {
    if (!data) {
      return;
    }

    return {
      labels: [],
      type: "doughnut",
      datasets: [
        {
          data: [data.avgScore, 100 - data.avgScore],
          backgroundColor: ["#009bde", "transparent"],
          borderWidth: 0,
          hoverBorderWidth: 0,
        },
        {
          data: [data.groupScoreList.avgScore, 100 - data.groupScoreList.avgScore],
          backgroundColor: ["#ada9bb", "transparent"],
          borderWidth: 0,
          hoverBorderWidth: 0,
        },
      ],
    };
  }, [data]);

  const avgScoreChartOptions = useMemo(() => {
    if (!avgScoreChartData || !commonChartOption || !data) {
      return;
    }

    return {
      ...commonChartOption,
      title: {
        display: true,
        text: avgScoreChartTitle,
        color: "#464555",
        fontSize: 16,
        fontFamily: "'FontAwesome','Helvetica Neue', 'Helvetica', 'Arial', sans-serif", //
      },
      plugins: {
        ...commonChartOption.plugins,
        doughnutlabel: {
          labels: [
            {
              text: `${data.avgScore}점`,
              font: {
                size: "24",
              },
              color: avgScoreChartData.datasets[0].backgroundColor[0],
            },
            {
              text: `기관 평균`,
              font: {
                size: "16",
              },
              color: "#464555",
            },
            {
              text: `${data.groupScoreList.avgScore}점`,
              font: {
                size: "20",
              },
              color: avgScoreChartData.datasets[1].backgroundColor[0],
            },
          ],
        },
      },
    };
  }, [data, avgScoreChartTitle, avgScoreChartData, commonChartOption]);

  const avgDurationChartTitle = useMemo(() => {
    if (!data) {
      return;
    }

    return data.durationTitle;
  }, [data]);

  const avgDurationChartData = useMemo(() => {
    if (!data) {
      return;
    }

    return {
      labels: [],
      type: "doughnut",
      datasets: [
        {
          data: [data.avgDuration, 100 - data.avgDuration],
          backgroundColor: ["#009bde", "transparent"],
          borderWidth: 0,
          hoverBorderWidth: 0,
        },
        {
          data: [data.groupScoreList.avgDuration, 100 - data.groupScoreList.avgDuration],
          backgroundColor: ["#ada9bb", "transparent"],
          borderWidth: 0,
          hoverBorderWidth: 0,
        },
      ],
    };
  }, [data]);

  const avgDurationChartOptions = useMemo(() => {
    if (!avgDurationChartData || !commonChartOption || !data) {
      return;
    }

    return {
      ...commonChartOption,
      title: {
        display: true,
        text: avgDurationChartTitle,
        color: "#464555",
        fontSize: 16,
        fontFamily: "'FontAwesome','Helvetica Neue', 'Helvetica', 'Arial', sans-serif", //
      },
      plugins: {
        ...commonChartOption.plugins,
        doughnutlabel: {
          labels: [
            {
              text: `${data.avgDuration}분`,
              font: {
                size: "24",
              },
              color: avgDurationChartData.datasets[0].backgroundColor[0],
            },
            {
              text: `기관 평균`,
              font: {
                size: "16",
              },
              color: "#464555",
            },
            {
              text: `${data.groupScoreList.avgDuration}분`,
              font: {
                size: "20",
              },
              color: avgDurationChartData.datasets[1].backgroundColor[0],
            },
          ],
        },
      },
    };
  }, [data, avgDurationChartTitle, avgDurationChartData, commonChartOption]);

  const resultChartTitle = useMemo(() => {
    if (!data) {
      return;
    }

    return ["Reading Training", "Cognitive Training", "Tracking Training", "Exercise Training"];
  }, [data]);

  const readingChartData = useMemo(() => {
    if (!data) {
      return;
    }
    const sm = data.trainingList.find((f) => f.type === "SentenceMask");
    const wo = data.trainingList.find((f) => f.type === "WordOrdering");
    const kf = data.trainingList.find((f) => f.type === "KeywordFinding");
    const cf = data.trainingList.find((f) => f.type === "CategoryFinding");

    return {
      titleIndex: 0,
      labels: ["SentenceMask", "WordOrdering", "KeywordFinding", "CategoryFinding"],
      type: "radar",
      datasets: [
        {
          label: "Me",
          data: [(sm && sm.avgScore) || 0, (wo && wo.avgScore) || 0, (kf && kf.avgScore) || 0, (cf && cf.avgScore) || 0],
          borderColor: "#009bde",
          backgroundColor: "#009bde",
          fill: false,
        },
        {
          label: "Group",
          data: [data.groupScoreList.SentenceMask || 0, data.groupScoreList.WordOrdering || 0, data.groupScoreList.KeywordFinding || 0, data.groupScoreList.CategoryFinding || 0],
          borderColor: "#ada9bb",
          backgroundColor: "#ada9bb",
          fill: false,
        },
      ],
    };
  }, [data]);

  const readingChartOptions = useMemo(() => {
    if (!readingChartData || !commonResultChartOption || !resultChartTitle) {
      return;
    }

    return {
      ...commonResultChartOption,
      title: {
        display: true,
        text: resultChartTitle[readingChartData.titleIndex],
        color: "#464555",
        fontSize: 14,
        fontFamily: "'FontAwesome','Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      },
    };
  }, [resultChartTitle, readingChartData, commonResultChartOption]);

  const cognitiveChartData = useMemo(() => {
    if (!data) {
      return;
    }
    const vs = data.trainingList.find((f) => f.type === "VisualSpan");
    const vc = data.trainingList.find((f) => f.type === "VisualCounting");
    const tmt = data.trainingList.find((f) => f.type === "TMT");
    const st = data.trainingList.find((f) => f.type === "Stroop");

    return {
      titleIndex: 1,
      labels: ["VisualSpan", "VisualCounting", "TMT", "Stroop"],
      type: "radar",
      datasets: [
        {
          label: "Me",
          data: [(vs && vs.avgScore) || 0, (vc && vc.avgScore) || 0, (tmt && tmt.avgScore) || 0, (st && st.avgScore) || 0],
          borderColor: "#009bde",
          backgroundColor: "#009bde",
          fill: false,
        },
        {
          label: "Group",
          data: [data.groupScoreList.VisualSpan || 0, data.groupScoreList.VisualCounting || 0, data.groupScoreList.TMT || 0, data.groupScoreList.Stroop || 0],
          borderColor: "#ada9bb",
          backgroundColor: "#ada9bb",
          fill: false,
        },
      ],
    };
  }, [data]);

  const cognitiveChartOption = useMemo(() => {
    if (!cognitiveChartData || !commonResultChartOption || !resultChartTitle) {
      return;
    }

    return {
      ...commonResultChartOption,
      title: {
        display: true,
        text: resultChartTitle[cognitiveChartData.titleIndex],
        color: "#464555",
        fontSize: 14,
        fontFamily: "'FontAwesome','Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      },
    };
  }, [resultChartTitle, cognitiveChartData, commonResultChartOption]);

  const trackingChartData = useMemo(() => {
    if (!data) {
      return;
    }
    const st = data.trainingList.find((f) => f.type === "SaccadeTracking");
    const pt = data.trainingList.find((f) => f.type === "PursuitTracking");
    const at = data.trainingList.find((f) => f.type === "AntiTracking");
    const set = data.trainingList.find((f) => f.type === "SentenceTracking");

    return {
      titleIndex: 2,
      labels: ["SaccadeTracking", "PursuitTracking", "AntiTracking", "SentenceTracking"],
      type: "radar",
      datasets: [
        {
          label: "Me",
          data: [(st && st.avgScore) || 0, (pt && pt.avgScore) || 0, (at && at.avgScore) || 0, (set && set.avgScore) || 0],
          borderColor: "#009bde",
          backgroundColor: "#009bde",
          fill: false,
        },
        {
          label: "Group",
          data: [data.groupScoreList.SaccadeTracking || 0, data.groupScoreList.PursuitTracking || 0, data.groupScoreList.AntiTracking || 0, data.groupScoreList.SentenceTracking || 0],
          borderColor: "#ada9bb",
          backgroundColor: "#ada9bb",
          fill: false,
        },
      ],
    };
  }, [data]);

  const trackingChartOption = useMemo(() => {
    if (!trackingChartData || !commonResultChartOption || !resultChartTitle) {
      return;
    }

    return {
      ...commonResultChartOption,
      title: {
        display: true,
        text: resultChartTitle[trackingChartData.titleIndex],
        color: "#464555",
        fontSize: 14,
        fontFamily: "'FontAwesome','Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      },
    };
  }, [resultChartTitle, trackingChartData, commonResultChartOption]);

  const exerciseChartData = useMemo(() => {
    if (!data) {
      return;
    }
    const eh = data.trainingList.find((f) => f.type === "ExerciseHorizontal");
    const ev = data.trainingList.find((f) => f.type === "ExerciseVertical");
    const ehj = data.trainingList.find((f) => f.type === "ExerciseHJump");
    const evj = data.trainingList.find((f) => f.type === "ExerciseVJump");

    return {
      titleIndex: 3,
      labels: ["ExerciseHorizontal", "ExerciseVertical", "ExerciseHJump", "ExerciseVJump"],
      type: "radar",
      datasets: [
        {
          label: "Me",
          data: [(eh && eh.avgScore) || 0, (ev && ev.avgScore) || 0, (ehj && ehj.avgScore) || 0, (evj && evj.avgScore) || 0],
          borderColor: "#009bde",
          backgroundColor: "#009bde",
          fill: false,
        },
        {
          label: "Group",
          data: [data.groupScoreList.ExerciseHorizontal || 0, data.groupScoreList.ExerciseVertical || 0, data.groupScoreList.ExerciseHJump || 0, data.groupScoreList.ExerciseVJump || 0],
          borderColor: "#ada9bb",
          backgroundColor: "#ada9bb",
          fill: false,
        },
      ],
    };
  }, [data]);

  const exerciseChartOption = useMemo(() => {
    if (!exerciseChartData || !commonResultChartOption || !resultChartTitle) {
      return;
    }

    return {
      ...commonResultChartOption,
      title: {
        display: true,
        text: resultChartTitle[exerciseChartData.titleIndex],
        color: "#464555",
        fontSize: 14,
        fontFamily: "'FontAwesome','Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      },
    };
  }, [resultChartTitle, exerciseChartData, commonResultChartOption]);

  if (!data || !tier || !medal) {
    return <></>;
  }

  return (
    <StyledReport id="report">
      <StyledTitleBox id="reportTitle">
        <StyledMainTitle>
          {data.testeeNickname}({data.testeeID})의 리더스아이 트레이닝 수행리포트
        </StyledMainTitle>
        <StyledDueTitle>
          {data.startdate} ~ {data.enddate}
        </StyledDueTitle>
      </StyledTitleBox>
      <StyledInfoBox id="reportInfo">
        <StyledInfoLeftBox>
          <StyledInfoText>
            수행 기관 : {data.agencyName}({data.agencyID})
          </StyledInfoText>
          <StyledInfoText>총 누적점수 : {data.totScore.toLocaleString()}점</StyledInfoText>
          <StyledInfoText>
            기록 1 : {data.firstScore.toLocaleString()}점({data.firstScoreDate} 이후, {tier}, {data.firstScoreRank || 1}
            위)
          </StyledInfoText>
          <StyledInfoText>
            기록 2 : {data.secondScore.toLocaleString()}점({data.secondScoreDate} 이후)
          </StyledInfoText>
          <StyledInfoText>기간 내 총 획득 점수 : {data.dueScore.toLocaleString()}점</StyledInfoText>
        </StyledInfoLeftBox>
        <StyledInfoRightBox>
          <img src={medal} alt="Medal" />
        </StyledInfoRightBox>
      </StyledInfoBox>
      <StyledChartWrapper id="reportChart">
        <StyledChartBox>
          <StyledChartTitle>수행률</StyledChartTitle>
          <StyledChart>
            <Doughnut id="RatioChart" data={ratioChartData} options={ratioChartOptions} datasetKeyProvider={datasetKeyProvider} />
          </StyledChart>
        </StyledChartBox>
        <StyledChartBox>
          <StyledChartTitle>평균 수행 점수</StyledChartTitle>
          <StyledChart>
            <Doughnut id="AvgScoreChart" data={avgScoreChartData} options={avgScoreChartOptions} datasetKeyProvider={datasetKeyProvider} />
          </StyledChart>
        </StyledChartBox>
        <StyledChartBox>
          <StyledChartTitle>일 평균 수행 시간</StyledChartTitle>
          <StyledChart>
            <Doughnut id="AvgDurationChart" data={avgDurationChartData} options={avgDurationChartOptions} datasetKeyProvider={datasetKeyProvider} />
          </StyledChart>
        </StyledChartBox>
      </StyledChartWrapper>
      <StyledChartSpan>* 기관 평균 : 학생이 속한 기관({data.agencyName})의 전체 학생들의 평균 점수</StyledChartSpan>
      <StyledGridWrapper id="reportTable">
        <StyledGridTitle>개별 Training 수행 결과</StyledGridTitle>
        <StyledGrid>
          <StyledGridRow isMobileWidth={isMobileWidth}>
            <StyledGridCell header isMobileWidth={isMobileWidth} style={{ gridRow: isMobileWidth ? "1/3" : "auto" }}>
              할당된 과제
            </StyledGridCell>
            <StyledGridCell order={1} header isMobileWidth={isMobileWidth}>
              레벨
            </StyledGridCell>
            <StyledGridCell order={3} header isMobileWidth={isMobileWidth}>
              일 수행횟수
            </StyledGridCell>
            <StyledGridCell order={4} header isMobileWidth={isMobileWidth} style={{ display: isMobileWidth ? "none" : "flex" }}>
              주당 수행일
            </StyledGridCell>
            <StyledGridCell order={6} header isMobileWidth={isMobileWidth}>
              수행률
            </StyledGridCell>
            <StyledGridCell order={8} header isMobileWidth={isMobileWidth}>
              평균 점수
            </StyledGridCell>
            <StyledGridCell order={2} header isMobileWidth={isMobileWidth}>
              언어
            </StyledGridCell>
            <StyledGridCell order={5} header isMobileWidth={isMobileWidth}>
              총 수행횟수
            </StyledGridCell>
            <StyledGridCell order={7} header isMobileWidth={isMobileWidth}>
              총 수행시간
            </StyledGridCell>
            <StyledGridCell order={9} header isMobileWidth={isMobileWidth}>
              총 획득점수
            </StyledGridCell>
          </StyledGridRow>
          {trainingTypes.map((t, i) => {
            const find = data.trainingList.find((f) => f.type === t.split(" ").join(""));

            if (!find) {
              return (
                <StyledGridRow key={`row_${i}`}>
                  <StyledGridCell
                    isMobileWidth={isMobileWidth}
                    style={{
                      gridRow: isMobileWidth ? "1/3" : "auto",
                    }}
                  >
                    {t}
                  </StyledGridCell>
                  <StyledGridCell
                    isMobileWidth={isMobileWidth}
                    style={{
                      gridRow: isMobileWidth ? "1/3" : "auto",
                      gridColumn: isMobileWidth ? "2/6" : "2/11",
                    }}
                  >
                    수행 없음
                  </StyledGridCell>
                </StyledGridRow>
              );
            }

            return (
              <StyledGridRow key={`row_${i}`}>
                <StyledGridCell
                  isMobileWidth={isMobileWidth}
                  style={{
                    gridRow: isMobileWidth ? "1/3" : "auto",
                  }}
                >
                  {t}
                </StyledGridCell>
                <StyledGridCell order={1} isMobileWidth={isMobileWidth}>
                  {parseFloat(find.level.toFixed(1))}
                </StyledGridCell>
                <StyledGridCell order={3} isMobileWidth={isMobileWidth}>
                  {parseFloat(find.reculsiveCount.toFixed(1))}회
                </StyledGridCell>
                <StyledGridCell order={4} isMobileWidth={isMobileWidth} style={{ display: isMobileWidth ? "none" : "flex" }}>
                  {parseFloat(find.weeklyPerformedDays.toFixed(1))}일
                </StyledGridCell>
                <StyledGridCell order={6} isMobileWidth={isMobileWidth}>
                  {parseFloat((find.performedRatio * 100).toFixed(1))}%
                </StyledGridCell>
                <StyledGridCell order={8} isMobileWidth={isMobileWidth}>
                  {parseFloat(find.avgScore.toFixed(1))}점
                </StyledGridCell>
                <StyledGridCell order={2} isMobileWidth={isMobileWidth} style={{ background: isMobileWidth ? "#eeedff" : "transparent" }}>
                  {find.language}
                </StyledGridCell>
                <StyledGridCell order={5} isMobileWidth={isMobileWidth} style={{ background: isMobileWidth ? "#eeedff" : "transparent" }}>
                  {isMobileWidth ? `${find.performedCount}회` : `${find.performedCount} / ${find.needPerformedCount}`}
                </StyledGridCell>
                <StyledGridCell order={7} isMobileWidth={isMobileWidth} style={{ background: isMobileWidth ? "#eeedff" : "transparent" }}>
                  {parseFloat(find.totDuration.toFixed(1))}분
                </StyledGridCell>
                <StyledGridCell order={9} isMobileWidth={isMobileWidth} style={{ background: isMobileWidth ? "#eeedff" : "transparent" }}>
                  {parseFloat(find.totScore.toFixed(1))}점
                </StyledGridCell>
              </StyledGridRow>
            );
          })}
        </StyledGrid>
      </StyledGridWrapper>
      <StyledResultWrapper id="reportResult">
        <StyledResultTitle>개별 Training 수행 결과</StyledResultTitle>
        <StyledResultRow>
          <StyledResultChartBox>
            <Radar id="ReadingChart" data={readingChartData} options={readingChartOptions} datasetKeyProvider={datasetKeyProvider} />
          </StyledResultChartBox>
          <StyledResultTextBox>
            <StyledResultTextTitle>Reading Training</StyledResultTextTitle>
            <StyledResultText>
              <span>&nbsp;읽기를 기반으로 속도 제어, 안정성 향상, 문장 완성, 어휘의 탐색 및 판단 능력을 향상시키는 훈련입니다.</span>
              <ul>
                <li>Word Ordering : 뒤섞여 있는 어절들을 정상적인 문장이 되도록 순서를 맞춰야 합니다.</li>
                <li>Sentence Mask : 일정한 속도로, 순차적으로 보여지는 글을 속도에 맞춰 읽어야 합니다.</li>
                <li>Keyword Finding : 글에서 특정 키워드를 빠르게 탐지해야 합니다.</li>
                <li>Category Finding : 글에서 특정 카테고리(범주)에 해당하는 단어들을 빠르게 탐지해야 합니다.</li>
              </ul>
            </StyledResultText>
          </StyledResultTextBox>
        </StyledResultRow>
        <StyledDashHR />
        <StyledResultRow>
          <StyledResultChartBox>
            <Radar id="CognitiveChart" data={cognitiveChartData} options={cognitiveChartOption} datasetKeyProvider={datasetKeyProvider} />
          </StyledResultChartBox>
          <StyledResultTextBox>
            <StyledResultTextTitle>Cognitive Training</StyledResultTextTitle>
            <StyledResultText>
              <span>&nbsp;학습의 기초가 되는 시지각, 인지능력, 판단력 및 행동 제어 능력을 향상시키는 훈련입니다.</span>
              <ul>
                <li>Visual Span : 순간적으로 제시되는 무의미한 글자들을 한 눈에 최대한 많이 기억해야 합니다.</li>
                <li>Visual Counting : 순간적으로 제시되는 점의 개수를 패턴화하여 세야 합니다.</li>
                <li>Trail Making Test(TMT) : 어지럽게 배치된 숫자와 문자들을 순서대로 빠르게 연결해야 합니다.</li>
                <li>Stroop Test : 제시되는 문장의 내용과 색깔을 비교하여 빠르게 판단해야 합니다.</li>
              </ul>
            </StyledResultText>
          </StyledResultTextBox>
        </StyledResultRow>
        <StyledDashHR />
        <StyledResultRow>
          <StyledResultChartBox>
            <Radar id="TrackingChart" data={trackingChartData} options={trackingChartOption} datasetKeyProvider={datasetKeyProvider} />
          </StyledResultChartBox>
          <StyledResultTextBox>
            <StyledResultTextTitle>Tracking Training</StyledResultTextTitle>
            <StyledResultText>
              <span>&nbsp;읽기와 시지각의 기본이 되는 안구운동의 제어와 통제, 지각 집중력을 향상시킵니다. 시선추적장치를 활용하며, 게임 형식으로 진행합니다.</span>
              <ul>
                <li>Saccade Tracking : 상하좌우에 나타나는 점을 빠르고 정확하게 움직여 시선을 고정시켜야 합니다.</li>
                <li>Pursuit Tracking : 직선 또는 원운동 하는 점을 부드럽고 안정적으로 추적하며 보아야 합니다.</li>
                <li>Anti Saccade Tracking : 나타난 자극물을 빠르게 판단하여 시선을 보내거나 멈추어야 합니다.</li>
                <li>Sentence Tracking : 글을 순서대로 빠짐없이 읽어야만 시선에 따라 다음 부분이 보여집니다.</li>
              </ul>
            </StyledResultText>
          </StyledResultTextBox>
        </StyledResultRow>
        <StyledDashHR />
        <StyledResultRow>
          <StyledResultChartBox>
            <Radar id="ExerciseChart" data={exerciseChartData} options={exerciseChartOption} datasetKeyProvider={datasetKeyProvider} />
          </StyledResultChartBox>
          <StyledResultTextBox>
            <StyledResultTextTitle>Exercise Training</StyledResultTextTitle>
            <StyledResultText>
              <span>&nbsp;읽기 과정의 핵심 시선이동인 도약안구운동(saccade)을 빠르고 정확하게 훈련합니다. 시선추적장치를 활용합니다.</span>
              <ul>
                <li>Horizontal Sweep : 수평방향으로 최대 폭의 시선이동을 훈련합니다.</li>
                <li>Vertical Sweep : 수직방향으로 최대 폭의 시선이동을 훈련합니다.</li>
                <li>Horizontal Jump : 읽기에 필요한 너비의 수평방향 시선이동을 훈련합니다.</li>
                <li>Vertical Jump : 읽기에 필요한 너비의 수직방향 시선이동을 훈련합니다.</li>
              </ul>
            </StyledResultText>
          </StyledResultTextBox>
        </StyledResultRow>
      </StyledResultWrapper>
    </StyledReport>
  );
});

export default TrainingReport;

const StyledWrapper = styled.div`
  margin-bottom: 2em;
`;

const StyledHeaderTitle = styled.h2`
  font-size: 1.6em;

  @media screen and (min-width: 800px) {
    font-size: 1.8em;
  }
`;

const StyledReport = styled.div`
  width: 100%;
  max-width: 1024px;
  margin: 0;
  padding: 1em;
  font-size: 62.5%; // 16px -> 10px
  position: relative;
  color: #464555;
  transition: 0.2s;
  user-select: none;

  &,
  & * {
    box-sizing: border-box;
  }
`;

const StyledTitleBox = styled(StyledWrapper)`
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledMainTitle = styled.h2`
  margin: 0;
  display: flex;
  flex-wrap: nowrap;
  text-align: center;
  font-size: 1.6em;

  @media screen and (min-width: 500px) {
    font-size: 2em;
  }

  @media screen and (min-width: 800px) {
    font-size: 2.5em;
  }
`;
const StyledDueTitle = styled.h3`
  margin: 5px 0;
  font-size: 1.4em;

  @media screen and (min-width: 500px) {
    font-size: 1.6em;
  }

  @media screen and (min-width: 800px) {
    font-size: 1.8em;
  }
`;

const StyledInfoBox = styled(StyledWrapper)`
  height: 100px;
  display: flex;
  align-items: center;
`;

const StyledInfoLeftBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex: 1;
  height: 100%;
  font-size: 1.4em;
`;

const StyledInfoText = styled.span`
  height: 20%;
  display: flex;
  align-items: center;
`;

const StyledInfoRightBox = styled.div`
  width: 80px;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: 100%;
  }
`;

const StyledChartWrapper = styled(StyledWrapper)`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  gap: 1em;
`;

const StyledChartBox = styled.div`
  width: 250px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #aaa9bc;
`;

const StyledChartTitle = styled.h3`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.6em;
  margin: 0;
`;
const StyledChart = styled.div`
  width: calc(100% - 1em);
  height: calc(100% - 30px - 1.5em);
  margin: 0.5em;
  margin-bottom: 1em;
`;

const StyledChartSpan = styled.span`
  font-size: 1.2em;
`;

const StyledGridWrapper = styled(StyledWrapper)``;
const StyledGridTitle = styled(StyledHeaderTitle)``;
const StyledGrid = styled.div`
  display: grid;
  grid-template-rows: repeat(17, 1fr);
  grid-template-columns: 1fr;
  border-top: 1px solid #ada9bb;
  border-left: 1px solid #ada9bb;
  border-collapse: collapse;
`;

interface GridProps {
  display?: string;
  order?: number;
  header?: boolean;
  isMobileWidth?: boolean;
}

const StyledGridRow = styled.div<GridProps>`
  width: 100%;
  min-height: 3em;
  display: grid;
  justify-content: center;
  align-items: center;
  border-collapse: collapse;

  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1.3fr repeat(4, 1fr);

  @media screen and (min-width: 501px) {
    min-height: 4em;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr repeat(9, 0.5fr);
  }
`;
const StyledGridCell = styled.div<GridProps>`
  height: 100%;
  padding: 0.5em 0;
  border-right: 1px solid #ada9bb;
  border-bottom: 1px solid #ada9bb;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  ${(props) =>
    props.header
      ? css`
          font-size: 1.2em;
          font-weight: 700;
          background: #eeedff;
          @media screen and (min-width: 1024px) {
            font-size: 1.4em;
          }
        `
      : css`
          font-size: 1.1em;
          @media screen and (min-width: 1024px) {
            font-size: 1.2em;
          }
        `}
  ${(props) =>
    !props.isMobileWidth && props.order
      ? css`
          order: ${props.order};
        `
      : css``}
`;

const StyledResultWrapper = styled(StyledWrapper)`
  display: flex;
  flex-direction: column;
  gap: 1em;
`;
const StyledResultTitle = styled(StyledHeaderTitle)``;
const StyledResultRow = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 2em;
  margin-top: 1em;
`;
const StyledResultChartBox = styled.div`
  display: flex;

  padding: 5px;
  min-width: 300px;
  height: 300px;
  border: 2px solid #f0f0f0;
  flex: 1;
`;
const StyledResultTextBox = styled.div`
  flex: 1;
  min-width: 300px;
  padding: 0 0.5em;
`;
const StyledResultTextTitle = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
  font-size: 1.4em;
  font-weight: 700;
  margin-bottom: 0.5em;

  @media screen and (min-width: 700px) {
    font-size: 1.6em;
  }

  @media screen and (min-width: 1024px) {
    font-size: 1.8em;
  }
`;
const StyledResultText = styled.div`
  font-size: 1.3em;
  line-height: 1.5em;

  ul {
    padding-left: 2em;
  }

  @media screen and (min-width: 700px) {
    font-size: 1.5em;
  }

  @media screen and (min-width: 1024px) {
    font-size: 1.7em;
  }
`;

const StyledDashHR = styled.hr`
  margin: 1em 0;
  border: 0;

  border-top: 1px solid #aaa9bc;
`;
