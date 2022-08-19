import { useCallback, useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { Doughnut, Radar } from "react-chartjs-2";
import "chartjs-plugin-doughnutlabel";

const TrainingReport: React.FC<TrainingReportProps> = ({ medal, tier, data }) => {
  const [isMobileWidth, setIsMobileWidth] = useState<boolean>(false);

  useEffect(() => {
    const resize = () => {
      const width = window.innerWidth;
      setIsMobileWidth(() => width <= 500);
    };

    window.addEventListener("resize", resize);
    resize();

    return () => window.removeEventListener("resize", resize);
  }, []);

  const trainingTypes = useMemo(() => {
    return [
      "Sentence Mask",
      "Word Ordering",
      "Keyword Finding",
      "Category Finding",
      "Visual Span",
      "Visual Counting",
      "TMT",
      "Stroop",
      "Saccade Tracking",
      "Pursuit Tracking",
      "Anti Tracking",
      "Sentence Tracking",
      "Exercise Horizontal",
      "Exercise Vertical",
      "Exercise HJump",
      "Exercise VJump",
    ];
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
        angleLines: {
          display: false,
        },
        ticks: {
          suggestedMin: 0,
          suggestedMax: 100,
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
          // backgroundColor: ["#1EACFF", "transparent"],
          backgroundColor: ["#009bde", "transparent"],
        },
        {
          data: [data.groupScoreList.performedRatio, 100 - data.groupScoreList.performedRatio],
          // backgroundColor: ["#06D5AC", "transparent"],
          backgroundColor: ["#ada9bb", "transparent"],
        },
      ],
    };
  }, [data]);

  const ratioChartOptions = useMemo(() => {
    if (!ratioChartData || !commonChartOption) {
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
              text: `${data.performedRatio}%`,
              font: {
                size: "24",
              },
              color: ratioChartData.datasets[0].backgroundColor[0],
            },
            {
              text: `그룹평균`,
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
        },
        {
          data: [data.groupScoreList.avgScore, 100 - data.groupScoreList.avgScore],
          backgroundColor: ["#ada9bb", "transparent"],
        },
      ],
    };
  }, [data]);

  const avgScoreChartOptions = useMemo(() => {
    if (!avgScoreChartData || !commonChartOption) {
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
              text: `그룹평균`,
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
        },
        {
          data: [data.groupScoreList.avgDuration, 100 - data.groupScoreList.avgDuration],
          backgroundColor: ["#ada9bb", "transparent"],
        },
      ],
    };
  }, [data]);

  const avgDurationChartOptions = useMemo(() => {
    if (!avgDurationChartData || !commonChartOption) {
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
              text: `그룹평균`,
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
          data: [
            (sm && sm.avgScore) || 0,
            (wo && wo.avgScore) || 0,
            (kf && kf.avgScore) || 0,
            (cf && cf.avgScore) || 0,
          ],
          borderColor: "#009bde",
          backgroundColor: "#009bde",
          fill: false,
        },
        {
          label: "Group",
          data: [
            data.groupScoreList.SentenceMask || 0,
            data.groupScoreList.WordOrdering || 0,
            data.groupScoreList.KeywordFinding || 0,
            data.groupScoreList.CategoryFinding || 0,
          ],
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
          data: [
            (vs && vs.avgScore) || 0,
            (vc && vc.avgScore) || 0,
            (tmt && tmt.avgScore) || 0,
            (st && st.avgScore) || 0,
          ],
          borderColor: "#009bde",
          backgroundColor: "#009bde",
          fill: false,
        },
        {
          label: "Group",
          data: [
            data.groupScoreList.VisualSpan || 0,
            data.groupScoreList.VisualCounting || 0,
            data.groupScoreList.TMT || 0,
            data.groupScoreList.Stroop || 0,
          ],
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
          data: [
            (st && st.avgScore) || 0,
            (pt && pt.avgScore) || 0,
            (at && at.avgScore) || 0,
            (set && set.avgScore) || 0,
          ],
          borderColor: "#009bde",
          backgroundColor: "#009bde",
          fill: false,
        },
        {
          label: "Group",
          data: [
            data.groupScoreList.SaccadeTracking || 0,
            data.groupScoreList.PursuitTracking || 0,
            data.groupScoreList.AntiTracking || 0,
            data.groupScoreList.SentenceTracking || 0,
          ],
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
          data: [
            (eh && eh.avgScore) || 0,
            (ev && ev.avgScore) || 0,
            (ehj && ehj.avgScore) || 0,
            (evj && evj.avgScore) || 0,
          ],
          borderColor: "#009bde",
          backgroundColor: "#009bde",
          fill: false,
        },
        {
          label: "Group",
          data: [
            data.groupScoreList.ExerciseHorizontal || 0,
            data.groupScoreList.ExerciseVertical || 0,
            data.groupScoreList.ExerciseHJump || 0,
            data.groupScoreList.ExerciseVJump || 0,
          ],
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

  return (
    <StyledReport>
      <StyledTitleBox>
        <StyledMainTitle>
          {data.testeeNickname}({data.testeeID})의 리더스아이 트레이닝 수행리포트
        </StyledMainTitle>
        <StyledDueTitle>
          {data.startdate} ~ {data.enddate}
        </StyledDueTitle>
      </StyledTitleBox>
      <StyledInfoBox>
        <StyledInfoLeftBox>
          <StyledInfoText>
            수행 기관 : {data.agencyName}({data.agencyID})
          </StyledInfoText>
          <StyledInfoText>
            {data.season}분기 누적점수 : {data.quarterScore.toLocaleString()}점({tier}, {data.quarterRank}위)
          </StyledInfoText>
          <StyledInfoText>기간 내 총 획득 점수 : {data.dueScore.toLocaleString()}점</StyledInfoText>
        </StyledInfoLeftBox>
        <StyledInfoRightBox>
          <img src={medal} alt="Medal" />
        </StyledInfoRightBox>
      </StyledInfoBox>
      <StyledChartWrapper>
        <StyledChartBox>
          <StyledChartTitle>수행률</StyledChartTitle>
          <StyledChart>
            <Doughnut data={ratioChartData} options={ratioChartOptions} datasetKeyProvider={datasetKeyProvider} />
          </StyledChart>
        </StyledChartBox>
        <StyledChartBox>
          <StyledChartTitle>평균 수행 점수</StyledChartTitle>
          <StyledChart>
            <Doughnut data={avgScoreChartData} options={avgScoreChartOptions} datasetKeyProvider={datasetKeyProvider} />
          </StyledChart>
        </StyledChartBox>
        <StyledChartBox>
          <StyledChartTitle>일 평균 수행 시간</StyledChartTitle>
          <StyledChart>
            <Doughnut
              data={avgDurationChartData}
              options={avgDurationChartOptions}
              datasetKeyProvider={datasetKeyProvider}
            />
          </StyledChart>
        </StyledChartBox>
      </StyledChartWrapper>
      <StyledGridWrapper>
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
            <StyledGridCell
              order={4}
              header
              isMobileWidth={isMobileWidth}
              style={{ display: isMobileWidth ? "none" : "flex" }}
            >
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
                  {find.level}
                </StyledGridCell>
                <StyledGridCell order={3} isMobileWidth={isMobileWidth}>
                  {find.reculsiveCount}회
                </StyledGridCell>
                <StyledGridCell
                  order={4}
                  isMobileWidth={isMobileWidth}
                  style={{ display: isMobileWidth ? "none" : "flex" }}
                >
                  {find.weeklyPerformedDays}일
                </StyledGridCell>
                <StyledGridCell order={6} isMobileWidth={isMobileWidth}>
                  {parseFloat((find.performedRatio * 100).toFixed(2))}%
                </StyledGridCell>
                <StyledGridCell order={8} isMobileWidth={isMobileWidth}>
                  {parseFloat(find.avgScore.toFixed(2))}점
                </StyledGridCell>
                <StyledGridCell
                  order={2}
                  isMobileWidth={isMobileWidth}
                  style={{ background: isMobileWidth ? "#eeedff" : "transparent" }}
                >
                  {find.language}
                </StyledGridCell>
                <StyledGridCell
                  order={5}
                  isMobileWidth={isMobileWidth}
                  style={{ background: isMobileWidth ? "#eeedff" : "transparent" }}
                >
                  {isMobileWidth ? `${find.performedCount}회` : `${find.performedCount} / ${find.needPerformedCount}`}
                </StyledGridCell>
                <StyledGridCell
                  order={7}
                  isMobileWidth={isMobileWidth}
                  style={{ background: isMobileWidth ? "#eeedff" : "transparent" }}
                >
                  {parseFloat(find.totDuration.toFixed(2))}분
                </StyledGridCell>
                <StyledGridCell
                  order={9}
                  isMobileWidth={isMobileWidth}
                  style={{ background: isMobileWidth ? "#eeedff" : "transparent" }}
                >
                  {parseFloat(find.totScore.toFixed(2))}점
                </StyledGridCell>
              </StyledGridRow>
            );
          })}
        </StyledGrid>
      </StyledGridWrapper>
      <StyledResultWrapper>
        <StyledResultTitle>개별 Training 수행 결과</StyledResultTitle>
        <StyledResultRow>
          <StyledResultChartBox>
            <Radar data={readingChartData} options={readingChartOptions} datasetKeyProvider={datasetKeyProvider} />
          </StyledResultChartBox>
          <StyledResultTextBox>
            <StyledResultTextTitle>Reading Training</StyledResultTextTitle>
            <StyledResultText>
              <span>
                &nbsp;읽기를 기반으로 속도 제어, 안정성 향상, 문장 완성, 어휘의 탐색 및 판단 능력을 향상시키는
                훈련입니다.
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
        <StyledDashHR />
        <StyledResultRow>
          <StyledResultChartBox>
            <Radar data={cognitiveChartData} options={cognitiveChartOption} datasetKeyProvider={datasetKeyProvider} />
          </StyledResultChartBox>
          <StyledResultTextBox>
            <StyledResultTextTitle>Cognitive Training</StyledResultTextTitle>
            <StyledResultText>
              <span>&nbsp;학습의 기초가 되는 시지각, 인지능력, 판단력 및 행동 제어 능력을 향상시키는 훈련입니다.</span>
              <ul>
                <li>Visual Span : 순간적으로 제시되는 무의미한 글자들을 한 눈에 최대한 많이 기억해야 합니다.</li>
                <li>Visual Counting : 순간적으로 제시되는 점의 개수를 패턴화하여 세야 합니다.</li>
                <li>Trail Making Test(TMT) : 어지럽게 배치된 숫자와 문자들을 순서대로 빠르게 연결해야 합니다.</li>
                <li>Stroop Teste : 제시되는 문장의 내용과 색깔을 비교하여 빠르게 판단해야 합니다.</li>
              </ul>
            </StyledResultText>
          </StyledResultTextBox>
        </StyledResultRow>
        <StyledDashHR />
        <StyledResultRow>
          <StyledResultChartBox>
            <Radar data={trackingChartData} options={trackingChartOption} datasetKeyProvider={datasetKeyProvider} />
          </StyledResultChartBox>
          <StyledResultTextBox>
            <StyledResultTextTitle>Tracking Training</StyledResultTextTitle>
            <StyledResultText>
              <span>
                &nbsp;읽기와 시지각의 기본이 되는 안구운동의 제어와 통제, 지각 집중력을 향상시킵니다. 시선추적장치를
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
        <StyledDashHR />
        <StyledResultRow>
          <StyledResultChartBox>
            <Radar data={exerciseChartData} options={exerciseChartOption} datasetKeyProvider={datasetKeyProvider} />
          </StyledResultChartBox>
          <StyledResultTextBox>
            <StyledResultTextTitle>Exercise Training</StyledResultTextTitle>
            <StyledResultText>
              <span>
                &nbsp;읽기 과정의 핵심 시선이동인 도약안구운동(saccade)을 빠르고 정확하게 훈련합니다. 시선추적장치를
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
  );
};

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
