import { useMemo } from "react";
import styled, { css } from "styled-components";
import { Doughnut } from "react-chartjs-2";
import "chartjs-plugin-doughnutlabel";

import "./App.css";

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

      trainingList: [
        {
          type: "SentenceMask",
          level: 6,
          language: "한국어",
          reculsiveCount: 3,
          weeklyPerformedDays: 5,
          totPerformedCount: 23,
          performedRatio: 23 / 45,
          totDuration: 5341,
          avgScore: 86.5832,
          totScore: 851,
        },
        {
          type: "KeywordFinding",
          level: 7,
          language: "한국어",
          reculsiveCount: 2,
          weeklyPerformedDays: 4,
          totPerformedCount: 10,
          performedRatio: 10 / 32,
          totDuration: 3323,
          avgScore: 93.1423,
          totScore: 851.818,
        },
        {
          type: "TMT",
          level: 6,
          language: "한국어",
          reculsiveCount: 3,
          weeklyPerformedDays: 5,
          totPerformedCount: 15,
          performedRatio: 15 / 45,
          totDuration: 3000,
          avgScore: 85.1582,
          totScore: 951.341,
        },
        {
          type: "SaccadeTracking",
          level: 8,
          language: "한국어",
          reculsiveCount: 2,
          weeklyPerformedDays: 2,
          totPerformedCount: 9,
          performedRatio: 9 / 16,
          totDuration: 550,
          avgScore: 75.412,
          totScore: 845.964,
        },
        {
          type: "SentenceTracking",
          level: 3,
          language: "한국어",
          reculsiveCount: 2,
          weeklyPerformedDays: 2,
          totPerformedCount: 7,
          performedRatio: 7 / 16,
          totDuration: 417,
          avgScore: 90,
          totScore: 420,
        },
        {
          type: "ExerciseHorizontal",
          level: 6,
          language: "한국어",
          reculsiveCount: 2,
          weeklyPerformedDays: 2,
          totPerformedCount: 8,
          performedRatio: 8 / 16,
          totDuration: 300,
          avgScore: 93,
          totScore: 93 * 8,
        },
      ],

      groupScoreList: {
        performedRatio: 89,
        avgScore: 75,
        avgDuration: 20,

        SentenceMask: 60,
        CategoryFinding: 86,
        KeywordFinding: 83,
        WordOrdering: 90,
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
      },
    };
  }, []);

  const MEDAL_IMG = useMemo(() => {
    return "https://readerseye-lite-neutral.s3.ap-northeast-2.amazonaws.com/img/public/training/bronze_1.png";
  }, []);

  const TIER = useMemo(() => {
    return "브론즈";
  }, []);
  const dummyD = useMemo(() => {
    return {
      labels: [],
      type: "doughnut",
      datasets: [
        { data: [34, 66], backgroundColor: ["blue", "transparent"] },
        { data: [66, 34], backgroundColor: ["red", "transparent"] },
      ],
    };
  }, []);

  const dummyOptions = useMemo(() => {
    return {
      title: {
        display: true,
        text: "Reading 진단현황 (2개월)",
        fontSize: 14,
        fontFamily: "'FontAwesome','Helvetica Neue', 'Helvetica', 'Arial', sans-serif", //
      },
      cutoutPercentage: 75,
      responsive: true,
      responsiveAnimationDuration: 1200,
      animation: {
        duration: 1200,
      },
      maintainAspectRatio: false,
      plugins: {
        doughnutlabel: {
          labels: [
            {
              text: `50점`,
              font: {
                size: "24",
              },
              color: "black",
            },
            {
              text: `그룹평균`,
              font: {
                size: "16",
              },
              color: "#333",
            },
            {
              text: `20점`,
              font: {
                size: "18",
              },
              color: "red",
            },
          ],
        },
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

  return (
    <div className="App">
      <StyledReport>
        <StyledTitleBox>
          <StyledMainTitle>
            {dummyReportData.testeeNickname}({dummyReportData.testeeID})의 리더스아이 트레이닝 수행리포트
          </StyledMainTitle>
          <StyledDueTitle>
            {dummyReportData.startdate} ~ {dummyReportData.enddate}
          </StyledDueTitle>
        </StyledTitleBox>
        <StyledInfoBox>
          <StyledInfoLeftBox>
            <StyledInfoText>
              수행 기관 : {dummyReportData.agencyName}({dummyReportData.agencyID})
            </StyledInfoText>
            <StyledInfoText>
              {dummyReportData.season}분기 누적점수 : {dummyReportData.quarterScore.toLocaleString()}({TIER},{" "}
              {dummyReportData.quarterRank}위)
            </StyledInfoText>
            <StyledInfoText>기간 내 총 획득 점수 : {dummyReportData.dueScore}</StyledInfoText>
          </StyledInfoLeftBox>
          <StyledInfoRightBox>
            <img src={MEDAL_IMG} alt="Medal" />
          </StyledInfoRightBox>
        </StyledInfoBox>
      </StyledReport>
    </div>
  );
};

export default App;

const StyledWrapper = styled.div`
  margin-bottom: 2em;
`;

const StyledReport = styled.div`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 1em;
  box-sizing: border-box;
  font-size: 16px;
  position: relative;
`;

const StyledTitleBox = styled(StyledWrapper)`
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledMainTitle = styled.h2`
  /* font-size: 1.2em;
  font-weight: 700; */
  letter-spacing: 1px;
  margin: 0;
`;

const StyledDueTitle = styled.span`
  letter-spacing: 1px;
`;

const StyledInfoBox = styled(StyledWrapper)`
  height: 80px;
  display: flex;
  align-items: center;
`;

const StyledInfoLeftBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex: 1;
  height: 100%;
`;

const StyledInfoText = styled.span`
  height: ${() => (100 / 3).toFixed(2)}px;
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
