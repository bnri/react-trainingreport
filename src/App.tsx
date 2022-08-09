import { useMemo } from "react";
import styled, { css } from "styled-components";
import { Doughnut, Radar } from "react-chartjs-2";
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
          totPerformedCount: 23,
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
          totPerformedCount: 10,
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
          totPerformedCount: 10,
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
          totPerformedCount: 15,
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
          totPerformedCount: 9,
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
          totPerformedCount: 7,
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
          totPerformedCount: 8,
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
      },
    };
  }, []);

  const MEDAL_IMG = useMemo(() => {
    return "https://readerseye-lite-neutral.s3.ap-northeast-2.amazonaws.com/img/public/training/bronze_1.png";
  }, []);

  const TIER = useMemo(() => {
    return "브론즈";
  }, []);

  const commonChartOption = useMemo(() => {
    return {
      cutoutPercentage: 75,
      responsive: true,
      responsiveAnimationDuration: 1200,
      animation: {
        duration: 1200,
      },
      maintainAspectRatio: false,
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

  const ratioChartTitle = useMemo(() => {
    if (!dummyReportData) {
      return;
    }

    return "수행량이 부족해요";
  }, [dummyReportData]);

  const ratioChartData = useMemo(() => {
    if (!dummyReportData) {
      return;
    }

    return {
      labels: [],
      type: "doughnut",
      datasets: [
        {
          data: [dummyReportData.performedRatio, 100 - dummyReportData.performedRatio],
          backgroundColor: ["#1EACFF", "transparent"],
        },
        {
          data: [dummyReportData.groupScoreList.performedRatio, 100 - dummyReportData.groupScoreList.performedRatio],
          backgroundColor: ["#06D5AC", "transparent"],
        },
      ],
    };
  }, [dummyReportData]);

  const ratioChartOptions = useMemo(() => {
    if (!commonChartOption) {
      return;
    }

    return {
      ...commonChartOption,
      title: {
        display: true,
        text: ratioChartTitle,
        color: "#333",
        fontSize: 14,
        fontFamily: "'FontAwesome','Helvetica Neue', 'Helvetica', 'Arial', sans-serif", //
      },
      plugins: {
        ...commonChartOption.plugins,
        doughnutlabel: {
          labels: [
            {
              text: `${dummyReportData.performedRatio}%`,
              font: {
                size: "24",
              },
              color: "#1EACFF",
            },
            {
              text: `그룹평균`,
              font: {
                size: "16",
              },
              color: "#333",
            },
            {
              text: `${dummyReportData.groupScoreList.performedRatio}%`,
              font: {
                size: "20",
              },
              color: "#06D5AC",
            },
          ],
        },
      },
    };
  }, [dummyReportData, ratioChartTitle, commonChartOption]);

  const avgScoreChartTitle = useMemo(() => {
    if (!dummyReportData) {
      return;
    }

    return "조금 어려워요";
  }, [dummyReportData]);

  const avgScoreChartData = useMemo(() => {
    if (!dummyReportData) {
      return;
    }

    return {
      labels: [],
      type: "doughnut",
      datasets: [
        {
          data: [dummyReportData.avgScore, 100 - dummyReportData.avgScore],
          backgroundColor: ["#1EACFF", "transparent"],
        },
        {
          data: [dummyReportData.groupScoreList.avgScore, 100 - dummyReportData.groupScoreList.avgScore],
          backgroundColor: ["#06D5AC", "transparent"],
        },
      ],
    };
  }, [dummyReportData]);

  const avgScoreChartOptions = useMemo(() => {
    if (!commonChartOption) {
      return;
    }

    return {
      ...commonChartOption,
      title: {
        display: true,
        text: avgScoreChartTitle,
        color: "#333",
        fontSize: 14,
        fontFamily: "'FontAwesome','Helvetica Neue', 'Helvetica', 'Arial', sans-serif", //
      },
      plugins: {
        ...commonChartOption.plugins,
        doughnutlabel: {
          labels: [
            {
              text: `${dummyReportData.avgScore}점`,
              font: {
                size: "24",
              },
              color: "#1EACFF",
            },
            {
              text: `그룹평균`,
              font: {
                size: "16",
              },
              color: "#333",
            },
            {
              text: `${dummyReportData.groupScoreList.avgScore}점`,
              font: {
                size: "20",
              },
              color: "#06D5AC",
            },
          ],
        },
      },
    };
  }, [dummyReportData, avgScoreChartTitle, commonChartOption]);

  const avgDurationChartTitle = useMemo(() => {
    if (!dummyReportData) {
      return;
    }

    return "너무 많아요";
  }, [dummyReportData]);

  const avgDurationChartData = useMemo(() => {
    if (!dummyReportData) {
      return;
    }

    return {
      labels: [],
      type: "doughnut",
      datasets: [
        {
          data: [dummyReportData.avgDuration, 100 - dummyReportData.avgDuration],
          backgroundColor: ["#1EACFF", "transparent"],
        },
        {
          data: [dummyReportData.groupScoreList.avgDuration, 100 - dummyReportData.groupScoreList.avgDuration],
          backgroundColor: ["#06D5AC", "transparent"],
        },
      ],
    };
  }, [dummyReportData]);

  const avgDurationChartOptions = useMemo(() => {
    if (!commonChartOption) {
      return;
    }

    return {
      ...commonChartOption,
      title: {
        display: true,
        text: avgDurationChartTitle,
        color: "#333",
        fontSize: 14,
        fontFamily: "'FontAwesome','Helvetica Neue', 'Helvetica', 'Arial', sans-serif", //
      },
      plugins: {
        ...commonChartOption.plugins,
        doughnutlabel: {
          labels: [
            {
              text: `${dummyReportData.avgDuration}분`,
              font: {
                size: "24",
              },
              color: "#1EACFF",
            },
            {
              text: `그룹평균`,
              font: {
                size: "16",
              },
              color: "#333",
            },
            {
              text: `${dummyReportData.groupScoreList.avgDuration}분`,
              font: {
                size: "20",
              },
              color: "#06D5AC",
            },
          ],
        },
      },
    };
  }, [dummyReportData, avgDurationChartTitle, commonChartOption]);

  const readingChartTitle = useMemo(() => {
    if (!dummyReportData) {
      return;
    }

    return "Reading Training";
  }, [dummyReportData]);

  const readingChartData = useMemo(() => {
    if (!dummyReportData) {
      return;
    }
    const sm = dummyReportData.trainingList.find((f) => f.type === "SentenceMask");
    const wo = dummyReportData.trainingList.find((f) => f.type === "WordOrdering");
    const kf = dummyReportData.trainingList.find((f) => f.type === "KeywordFinding");
    const cf = dummyReportData.trainingList.find((f) => f.type === "CategoryFinding");

    return {
      labels: ["SentenceMask", "WordOrdering", "KeywordFinding", "CategoryFinding"],
      type: "radar",
      datasets: [
        {
          data: [
            (sm && sm.avgScore) || 0,
            (wo && wo.avgScore) || 0,
            (kf && kf.avgScore) || 0,
            (cf && cf.avgScore) || 0,
          ],
          borderColor: "#1EACFF",
          backgroundColor: "#1EACFF",
          fill: false,
        },
        {
          data: [
            dummyReportData.groupScoreList.SentenceMask || 0,
            dummyReportData.groupScoreList.WordOrdering || 0,
            dummyReportData.groupScoreList.KeywordFinding || 0,
            dummyReportData.groupScoreList.CategoryFinding || 0,
          ],
          borderColor: "#B1ADAD",
          backgroundColor: "#B1ADAD",
          fill: false,
        },
      ],
    };
  }, [dummyReportData]);

  const readingChartOptions = useMemo(() => {
    if (!commonChartOption) {
      return;
    }

    return {
      ...commonChartOption,
      title: {
        display: true,
        text: readingChartTitle,
        color: "#333",
        fontSize: 14,
        fontFamily: "'FontAwesome','Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      },
      legend: {
        display: true,
        position: "bottom",
        align: "start",
      },
      plugins: {
        ...commonChartOption.plugins,
      },
      scale: {
        angleLines: {
          display: false,
        },
        ticks: {
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    };
  }, [dummyReportData, readingChartTitle, commonChartOption]);

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
              {dummyReportData.season}분기 누적점수 : {dummyReportData.quarterScore.toLocaleString()}점({TIER},{" "}
              {dummyReportData.quarterRank}위)
            </StyledInfoText>
            <StyledInfoText>기간 내 총 획득 점수 : {dummyReportData.dueScore}점</StyledInfoText>
          </StyledInfoLeftBox>
          <StyledInfoRightBox>
            <img src={MEDAL_IMG} alt="Medal" />
          </StyledInfoRightBox>
        </StyledInfoBox>
        <StyledChartWrapper>
          <StyledChartBox>
            <StyledChartTitle>수행률</StyledChartTitle>
            <StyledChart>
              <Doughnut data={ratioChartData} options={ratioChartOptions} />
            </StyledChart>
          </StyledChartBox>
          <StyledChartBox>
            <StyledChartTitle>평균 수행 점수</StyledChartTitle>
            <StyledChart>
              <Doughnut data={avgScoreChartData} options={avgScoreChartOptions} />
            </StyledChart>
          </StyledChartBox>
          <StyledChartBox>
            <StyledChartTitle>일 평균 수행 시간</StyledChartTitle>
            <StyledChart>
              <Doughnut data={avgDurationChartData} options={avgDurationChartOptions} />
            </StyledChart>
          </StyledChartBox>
        </StyledChartWrapper>
        <StyledTableWrapper>
          <StyledTableTitle>개별 Training 수행 결과</StyledTableTitle>
          <StyledTable>
            <StyledTableRow>
              <StyledTableCell>
                <StyledTableHeaderTypeData>할당된 과제</StyledTableHeaderTypeData>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableHeader>레벨</StyledTableHeader>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableHeader>언어</StyledTableHeader>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableHeader>일 수행횟수</StyledTableHeader>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableHeader>주당 수행일</StyledTableHeader>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableHeader>총 수행횟수</StyledTableHeader>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableHeader>수행률</StyledTableHeader>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableHeader>총 수행시간</StyledTableHeader>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableHeader>평균 점수</StyledTableHeader>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableHeader>총 획득 점수</StyledTableHeader>
              </StyledTableCell>
            </StyledTableRow>
          </StyledTable>
        </StyledTableWrapper>
        <StyledResultWrapper>
          <StyledResultTitle>개별 Training 수행 결과</StyledResultTitle>
          <StyledResultRow>
            <StyledResultChartBox>
              <Radar data={readingChartData} options={readingChartOptions} />
            </StyledResultChartBox>
            <StyledResultTextBox>
              <StyledResultTextTitle>Reading Training</StyledResultTextTitle>
              <StyledResultText>
                <span>
                  읽기를 기반으로 속도 제어, 안정성 향상, 문장 완성, 어휘의 탐색 및 판단 능력을 향상시키는 훈련입니다.
                </span>
                <ul>
                  <li>Word Ordering : 뒤섞여 있는 어절들을 정상적인 문장이 되도록 순서를 맞춰야 합니다.</li>
                  <li>Sentence Mask : 일정한 속도로, 순차적으로 보여지는 글을 속도에 맞춰 읽어야 합니다.</li>
                  <li>Keyword Finding : 글에서 특정 키워드를 빠르게 탐지해야 합니다.</li>
                  <li>Category Finding : 글에서 특정 카테고리(범주)에 해당하는 단어들을 빠르게 탐지해야 합니다.</li>
                </ul>
              </StyledResultText>
            </StyledResultTextBox>
          </StyledResultRow>
          <StyledResultRow>
            <StyledResultChartBox>
              <Radar data={readingChartData} options={readingChartOptions} />
            </StyledResultChartBox>
            <StyledResultTextBox>
              <StyledResultTextTitle>Cognitive Training</StyledResultTextTitle>
              <StyledResultText>
                <span>학습의 기초가 되는 시지각, 인지능력, 판단력 및 행동 제어 능력을 향상시키는 훈련입니다.</span>
                <ul>
                  <li>Visual Span : 순간적으로 제시되는 무의미한 글자들을 한 눈에 최대한 많이 기억해야 합니다.</li>
                  <li>Visual Counting : 순간적으로 제시되는 점의 개수를 패턴화하여 세야 합니다.</li>
                  <li>Trail Making Test(TMT) : 어지럽게 배치된 숫자와 문자들을 순서대로 빠르게 연결해야 합니다.</li>
                  <li>Stroop Teste : 제시되는 문장의 내용과 색깔을 비교하여 빠르게 판단해야 합니다.</li>
                </ul>
              </StyledResultText>
            </StyledResultTextBox>
          </StyledResultRow>
          <StyledResultRow>
            <StyledResultChartBox>
              <Radar data={readingChartData} options={readingChartOptions} />
            </StyledResultChartBox>
            <StyledResultTextBox>
              <StyledResultTextTitle>Tracking Training</StyledResultTextTitle>
              <StyledResultText>
                <span>
                  읽기와 시지각의 기본이 되는 안구운동의 제어와 통제, 지각 집중력을 향상시킵니다. 시선추적장치를
                  활용하며, 게임 형식으로 진행합니다.
                </span>
                <ul>
                  <li>Saccade Tracking : 상하좌우에 나타나는 점을 빠르고 정확하게 움직여 시선을 고정시켜야 합니다.</li>
                  <li>Pursuit Tracking : 직선 또는 원운동 하는 점을 부드럽고 안정적으로 추적하며 보아야 합니다.</li>
                  <li>Anti Saccade Tracking : 나타난 자극물을 빠르게 판단하여 시선을 보내거나 멈추어야 합니다.</li>
                  <li>Sentence Tracking : 글을 순서대로 빠짐없이 읽어야만 시선에 따라 다음 부분이 보여집니다.</li>
                </ul>
              </StyledResultText>
            </StyledResultTextBox>
          </StyledResultRow>
          <StyledResultRow>
            <StyledResultChartBox>
              <Radar data={readingChartData} options={readingChartOptions} />
            </StyledResultChartBox>
            <StyledResultTextBox>
              <StyledResultTextTitle>Exercise Training</StyledResultTextTitle>
              <StyledResultText>
                <span>
                  읽기 과정의 핵심 시선이동인 도약안구운동(saccade)을 빠르고 정확하게 훈련합니다. 시선추적장치를
                  활용합니다.
                </span>
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
    </div>
  );
};

export default App;

const StyledWrapper = styled.div`
  margin-bottom: 2em;
`;

const StyledReport = styled.div`
  width: 100%;
  margin: 0;
  padding: 1em;
  font-size: 62.5%;
  position: relative;
  color: #333;

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
`;

const StyledDueTitle = styled.h3`
  margin: 5px 0;
  font-size: 1.4em;
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
  font-size: 1.4em;
`;

const StyledInfoText = styled.span`
  height: 33.33333%;
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
  border: 2px solid #333;
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
  width: 100%;
  height: calc(100% - 30px);
`;

const StyledTableWrapper = styled(StyledWrapper)``;
const StyledTableTitle = styled.h2``;
const StyledTable = styled.div``;
const StyledTableRow = styled.div``;
const StyledTableCell = styled.div``;
const StyledTableHeaderTypeData = styled.div``;
const StyledTableHeader = styled.div``;
const StyledTableData = styled.div``;

const StyledResultWrapper = styled(StyledWrapper)``;
const StyledResultTitle = styled.h2``;
const StyledResultRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1em;
`;
const StyledResultChartBox = styled.div`
  display: flex;

  padding: 5px;
  width: 300px;
  height: 300px;
  border: 2px solid #f7f7f7;
`;
const StyledResultTextBox = styled.div`
  flex: 1;
  max-height: 300px;
`;
const StyledResultTextTitle = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
  font-size: 1.4em;
  font-weight: 700;
`;
const StyledResultText = styled.div`
  height: 270px;
  font-size: 1.3em;
  line-height: 1.5em;
`;
