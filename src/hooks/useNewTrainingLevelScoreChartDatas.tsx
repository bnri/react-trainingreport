import { useMemo } from "react";
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

const divideDateRange = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
  const dateArray = [];

  const duration = endDate.diff(startDate);
  const interval = duration / 9;

  for (let i = 0; i < 10; i++) {
    const newDate = startDate.add(interval * i);
    dateArray.push({ dayFormat: newDate.format("YYYY-MM-DD"), dayjs: dayjs(newDate) });
  }

  return dateArray;
};

interface LevelScoreChartProps {
  data: any;
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

    const trainingTypesColor =
      type === "Reading"
        ? {
            SentenceMask: "#FA8128",
            CategoryFinding: "#800080",
            KeywordFinding: "#344f66",
            WordOrdering: "#00f",
            RSVP: "#888888",
          }
        : {
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

    const { startDate, endDate } = dueDate;
    const dividedDates = divideDateRange(startDate, endDate); // 10등분한 date

    let ptr = dayjs(startDate);

    return {};
  }, [type, data, dueDate, language]);

  const chartOption = useMemo(() => {
    if (!chartData) {
      return;
    }

    return {
      ...CommonChartOption,
    };
  }, [chartData]);

  return { chartData, chartOption, dueDate };
};

export default useNewTrainingLevelScoreChartDatas;
