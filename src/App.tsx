import { useMemo } from "react";

import "./App.css";
import TrainingReport from "./components/TrainingReport";

const App: React.FC = () => {
  const dummyReportData: ReportType = useMemo(() => {
    return {
      agencyID: "jeong",
      agencyName: "연광컴퓨터학원",
      testeeID: "p002",
      testeeNickname: "홍길동",
      startdate: "2022-07-01", // 기준 시작일
      enddate: "2022-07-31", // 기준 종료일

      season: 3,
      quarterScore: 44322, // 분기 누적점수(리포트 버튼을 누르는 그 순간의 점수)
      quarterRank: 2, // 분기 누적순위(학원내에서)
      dueScore: 2405, // 기간 내의 점수

      performedRatio: 67, // 전체 수행률
      avgScore: 59, // 평균 수행 점수
      avgDuration: 31, // 일 평균 수행 시간

      ratioTitle: "수행이 많이 미흡해요",
      scoreTitle: "어려워요",
      durationTitle: "수행량이 너무 많아요",

      trainingList: [
        {
          type: "SentenceMask",
          level: 6,
          language: "한국어",
          reculsiveCount: 3,
          weeklyPerformedDays: 5,
          performedCount: 23,
          needPerformedCount: 45,
          performedRatio: 23 / 45,
          totDuration: 5341 / 60,
          avgScore: 75.5832,
          totScore: 851,
        },
        {
          type: "WordOrdering",
          level: 6,
          language: "한국어",
          reculsiveCount: 3,
          weeklyPerformedDays: 5,
          performedCount: 23,
          needPerformedCount: 45,
          performedRatio: 23 / 45,
          totDuration: 5341 / 60,
          avgScore: 92.5832,
          totScore: 851,
        },
        {
          type: "KeywordFinding",
          level: 7,
          language: "한국어",
          reculsiveCount: 2,
          weeklyPerformedDays: 4,
          performedCount: 10,
          needPerformedCount: 32,
          performedRatio: 10 / 32,
          totDuration: 3323 / 60,
          avgScore: 88.1423,
          totScore: 851.818,
        },
        {
          type: "CategoryFinding",
          level: 7,
          language: "한국어",
          reculsiveCount: 2,
          weeklyPerformedDays: 4,
          performedCount: 10,
          needPerformedCount: 32,
          performedRatio: 10 / 32,
          totDuration: 3323 / 60,
          avgScore: 86.1423,
          totScore: 851.818,
        },
        {
          type: "TMT",
          level: 6,
          language: "한국어",
          reculsiveCount: 3,
          weeklyPerformedDays: 5,
          performedCount: 15,
          needPerformedCount: 45,
          performedRatio: 15 / 45,
          totDuration: 3000 / 60,
          avgScore: 85.1582,
          totScore: 951.341,
        },
        {
          type: "SaccadeTracking",
          level: 8,
          language: "한국어",
          reculsiveCount: 2,
          weeklyPerformedDays: 2,
          performedCount: 9,
          needPerformedCount: 16,
          performedRatio: 9 / 16,
          totDuration: 550 / 60,
          avgScore: 75.412,
          totScore: 845.964,
        },
        {
          type: "SentenceTracking",
          level: 3,
          language: "한국어",
          reculsiveCount: 2,
          weeklyPerformedDays: 2,
          performedCount: 7,
          needPerformedCount: 16,
          performedRatio: 7 / 16,
          totDuration: 417 / 60,
          avgScore: 90,
          totScore: 420,
        },
        {
          type: "ExerciseHorizontal",
          level: 6,
          language: "한국어",
          reculsiveCount: 2,
          weeklyPerformedDays: 2,
          performedCount: 8,
          needPerformedCount: 16,
          performedRatio: 8 / 16,
          totDuration: 300 / 60,
          avgScore: 93,
          totScore: 93 * 8,
        },
      ],

      groupScoreList: {
        performedRatio: 89,
        avgScore: 75,
        avgDuration: 20,

        SentenceMask: 60,
        CategoryFinding: 80,
        KeywordFinding: 71,
        WordOrdering: 83,
        VisualSpan: 64,
        VisualCounting: 57,
        TMT: 51,
        Stroop: 85,
        SaccadeTracking: 91,
        PursuitTracking: 86,
        AntiTracking: 74,
        SentenceTracking: 66,
        ExerciseHorizontal: 57,
        ExerciseVertical: 75,
        ExerciseHJump: 81,
        ExerciseVJump: 71,
      },
    };
  }, []);

  const MEDAL_IMG = useMemo(() => {
    return "https://readerseye-lite-neutral.s3.ap-northeast-2.amazonaws.com/img/public/training/bronze_1.png";
  }, []);

  const TIER = useMemo(() => {
    return "브론즈";
  }, []);

  return (
    <div className="App">
      <TrainingReport medal={MEDAL_IMG} tier={TIER} data={dummyReportData} />
    </div>
  );
};

export default App;
