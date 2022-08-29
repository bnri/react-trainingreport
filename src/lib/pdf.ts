import { ReportType } from "./../types.d";
import { imgbase64forPDF } from "./base64";
import pdfMake from "pdfmake/build/pdfmake";
// @ts-ignore
// import pdfFonts from "./vfs_fonts_jejumj_gd_cn";
import { Content, TDocumentDefinitions } from "pdfmake/interfaces";
import React from "react";

// @ts-ignore
const ReactLazyPreload = (importStatement) => {
  // @ts-ignore
  const Component = React.lazy(importStatement);
  // @ts-ignore
  Component.preload = importStatement;
  return Component;
};

export let preloadDone = false;
// @ts-ignore
const pdfFonts = ReactLazyPreload(() => import("./vfs_fonts_jejumj_gd_cn"));
// @ts-ignore
pdfFonts.preload().then((res) => {
  pdfMake.vfs = res.pdfMake.vfs;
  pdfMake.fonts = {
    제주명조: {
      normal: "jejumyungjo.ttf",
      bold: "jejugothic.ttf",
      italics: "cjk.ttf",
    },
  };
  preloadDone = true;
});

// pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.tableLayouts = {
  showblackline: {
    hLineWidth: function (i, node) {
      if (i === 0 || i === node.table.body.length) {
        //맨앞 맨뒤
        return 1;
      }
      return i === node.table.headerRows ? 1 : 1;
    },
    vLineWidth: function (i) {
      return 1;
    },
    hLineColor: function (i) {
      let color = "black";
      // if(i===2) color='red';
      // else if(i===3) color='blue';
      // else if(i===4) color='green';

      return color;
    },
    vLineColor: function (i) {
      let color = "black";
      // if(i===2) color='red';
      // else if(i===3) color='blue';
      // else if(i===4) color='green';

      return color;
    },
  },
  showline: {
    hLineWidth: function (i, node) {
      if (i === 0 || i === node.table.body.length) {
        //맨앞 맨뒤
        return 1;
      }
      return i === node.table.headerRows ? 1 : 1;
    },
    vLineWidth: function (i) {
      return 1;
    },
    hLineColor: function (i) {
      let color = "#1A408E";
      // if(i===2) color='red';
      // else if(i===3) color='blue';
      // else if(i===4) color='green';

      return color;
    },
    vLineColor: function (i) {
      let color = "#1A408E";
      // if(i===2) color='red';
      // else if(i===3) color='blue';
      // else if(i===4) color='green';

      return color;
    },
  },
  hideline: {
    hLineWidth: function (i, node) {
      if (i === 0 || i === node.table.body.length) {
        //맨앞 맨뒤
        return 0;
      }
      return i === node.table.headerRows ? 0 : 0;
    },
    vLineWidth: function (i) {
      return 0;
    },
    hLineColor: function (i) {
      let color = "#1A408E";
      // if(i===2) color='red';
      // else if(i===3) color='blue';
      // else if(i===4) color='green';

      return color;
    },
  },
  headerunderline: {
    hLineWidth: function (i, node) {
      if (i === 0 || i === node.table.body.length) {
        return 0;
      }
      return i === node.table.headerRows ? 2 : 0;
    },
    vLineWidth: function (i) {
      return 0;
    },
    hLineColor: function (i) {
      return "#1A408E";
    },
  },
  titletable: {
    hLineWidth: function (i, node) {
      if (i === 0 || i === node.table.body.length) {
        return 0;
      }
      return i === node.table.headerRows ? 0 : 1;
    },
    vLineWidth: function (i) {
      return 0;
    },
    hLineColor: function (i) {
      return "#1A408E";
    },
  },
};

export default class PDF {
  pdf: pdfMake.TCreatedPdf | null;
  doc: TDocumentDefinitions | null;
  data: ReportType;
  agencyLogo?: string;
  tier: "다이아몬드" | "플래티넘" | "골드" | "실버" | "브론즈";

  constructor(data: ReportType, tier: "다이아몬드" | "플래티넘" | "골드" | "실버" | "브론즈", agencyLogo?: string) {
    this.pdf = null;
    this.doc = null;
    this.data = data;
    this.tier = tier;
    this.agencyLogo = agencyLogo;
  }

  makeFirstPage = () => {
    try {
      this.doc = {
        pageSize: "A4",
        info: {
          title: "리더스아이 트레이닝 수행리포트",
          author: "bnri",
          subject: "리더스아이 트레이닝 수행리포트",
          keywords: "",
        },
        pageMargins: [20, 40, 20, 20],
        background: (currentPage, pageCount) => {
          if (currentPage * 1 === 1) {
            return [
              {
                margin: [20, 26],
                layout: "headerunderline", // optional
                table: {
                  // headers are automatically repeated if the table spans over multiple pages
                  // you can declare how many rows should be treated as headers
                  headerRows: 1,
                  widths: ["*", "*"],
                  body: [
                    [
                      {
                        text: "",
                        margin: [0, 10, 0, 10],
                        border: [false, false, false, false],
                      },
                      {
                        text: " ",
                        margin: [0, 10, 0, 10],
                        border: [false, false, false, false],
                      },
                    ],
                    [
                      {
                        text: "",
                        border: [false, false, false, false],
                      },
                      {
                        text: "",
                        border: [false, false, false, false],
                      },
                    ],
                  ],
                },
              },
              {
                image: "readerseyeLogo",
                //fit: [200, 200],
                fit: [100, 180],
                opacity: 1, //흐림 배경이미지.
                absolutePosition: { x: 470, y: 28 },
                //absolutePosition: { x: 550, y: 800 },
              },
              {
                text: `${this.data.testeeNickname} (${this.data.testeeID}) ${this.data.testeeClass}`,
                bold: true,
                // color: '#7367f0',
                color: "black",
                absolutePosition: { x: 46, y: 50 },
              },
            ];
          } else {
            // console.log("background에서보자");
            // console.log(userData.AgencyLogoBase64);

            return [
              {
                margin: [20, 26],
                layout: "headerunderline", // optional
                table: {
                  // headers are automatically repeated if the table spans over multiple pages
                  // you can declare how many rows should be treated as headers
                  headerRows: 1,
                  widths: ["*", "*"],
                  body: [
                    [
                      {
                        text: "",
                        margin: [0, 10, 0, 10],
                      },
                      { text: " ", margin: [0, 10, 0, 10] },
                    ],
                    ["", ""],
                  ],
                },
              },
              {
                image: "학원로고",
                // image: 'agencyLogo',
                //fit: [200, 200],
                fit: [20, 20],
                opacity: 1, //흐림 배경이미지.
                absolutePosition: { x: 21, y: 37 },
                //absolutePosition: { x: 550, y: 800 },
              },
              {
                text: this.data.agencyName,
                bold: true,
                // color: '#7367f0',
                color: "black",
                absolutePosition: { x: 46, y: 41 },
              },
              {
                image: "readerseyeLogo",
                //fit: [200, 200],
                fit: [100, 180],
                opacity: 1, //흐림 배경이미지.
                absolutePosition: { x: 470, y: 28 },
                //absolutePosition: { x: 550, y: 800 },
              },
            ];
          }
        },
        footer: function (currentPage, pageCount) {
          if (currentPage === 1) {
            return null;
          }

          return {
            table: {
              widths: [600, 100],
              body: [
                [
                  {
                    text: currentPage - 1 + " / " + (pageCount - 1),
                    alignment: "center",
                    fontSize: 10,
                  },
                ],
              ],
            },
            layout: "noBorders",
          };
        },

        compress: true, //압축 저용량
        content: [
          {
            margin: [30, 30, 30, 30],

            table: {
              widths: ["*", "*"],
              headerRows: 1,

              body: [
                [
                  {
                    text: " ",
                  },
                  {
                    text: " ",
                  },
                ],
                [
                  {
                    margin: [10, 220, 10, 10],
                    text: "리더스아이 트레이닝 수행리포트",
                    bold: true,
                    fontSize: 26,
                    alignment: "center",
                    colSpan: 2,
                  },
                ],
                [
                  {
                    margin: [10, 0, 10, 250],
                    text: `${this.data.startdate}~${this.data.enddate}`,
                    bold: true,
                    fontSize: 20,
                    alignment: "center",
                    colSpan: 2,
                  },
                ],
                [
                  {
                    margin: [10, 20, 10, 10],
                    columns: [
                      { width: "*", text: "" },
                      {
                        width: "auto",
                        image: "학원로고",
                        // image: 'agencyLogo',
                        //fit: [200, 200],
                        fit: [60, 60],
                      },
                      {
                        margin: [8, 20, 0, 0],
                        width: "auto",
                        text: this.data.agencyName,
                        fontSize: 20,
                        bold: true,
                      },
                      { width: "*", text: "" },
                    ],
                    colSpan: 2,
                  },
                ],
              ],
            },
            layout: {
              hLineWidth: function (i, node) {
                if (i === 0 || i === node.table.body.length) {
                  return 0;
                }
                return i === node.table.headerRows ? 0 : 0;
              },
              vLineWidth: function (i) {
                return 0;
              },
              hLineColor: function (i) {
                return i === 1 ? "black" : "#aaa";
              },
            },
            pageBreak: "after",
          }, //main page
        ],

        images: {
          readerseyeLogo: imgbase64forPDF["리더스아이로고가로"],
          학원로고: this.agencyLogo ? this.agencyLogo : imgbase64forPDF["기본로고"],
          메달: imgbase64forPDF[this.tier],
        },
        styles: {
          header: {
            fontSize: 14,
            bold: true,
            alignment: "left",
          },
          sectionTitle: {
            fontSize: 13,
            bold: true,
            margin: [0, 10, 0, 10],
          },
          resultTitle: {
            fontSize: 11,
            bold: true,
            margin: [0, 0, 0, 5],
          },
          resultText: {
            fontSize: 10,
            lineHeight: 1.5,
          },
          tableHeader: {
            bold: true,
            fontSize: 9,
            color: "black",
            alignment: "center",
            margin: [0, 2, 0, 0],
          },
          tableItem: {
            fontSize: 9,
            color: "black",
            alignment: "center",
            margin: [0, 2, 0, 0],
          },
          tableParagraph: {
            bold: false,
            fontSize: 9,
            lineHeight: 1.6,
            color: "black",
          },
        },
        pageBreakBefore: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
          return currentNode.headlineLevel === 1;
        },
        //headlineLevel: 1,
        defaultStyle: {
          font: "제주명조",
        },
      };
      return true;
    } catch (err) {
      console.log("err", err);
      return false;
    }
  };

  makeSecondPage = () => {
    if (!this.doc || !this.doc.content) {
      throw new Error("doc or content not found");
    }
    const ratioChart = document.getElementById("RatioChart") as HTMLCanvasElement;
    const avgScoreChart = document.getElementById("AvgScoreChart") as HTMLCanvasElement;
    const avgDurationChart = document.getElementById("AvgDurationChart") as HTMLCanvasElement;
    if (!ratioChart || !avgScoreChart || !avgDurationChart) {
      throw new Error("chart not found");
    }

    try {
      const ratioSrc = ratioChart.toDataURL();
      const avgScoreSrc = avgScoreChart.toDataURL();
      const avgDurationSrc = avgDurationChart.toDataURL();
      const headerList = [
        "할당된 과제",
        "레벨",
        "언어",
        "일 수행횟수",
        "주당 수행일",
        "총 수행횟수",
        "수행률",
        "총 수행시간",
        "평균 점수",
        "총 획득점수",
      ];
      const typenameList = [
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

      this.doc.content = [
        ...(this.doc.content as Content[]),
        {
          stack: [
            {
              text: `${this.data.testeeNickname}(${this.data.testeeID})의 리더스아이 트레이닝 수행리포트`,
              alignment: "center",
              bold: true,
              fontSize: 18,
              margin: [0, 40, 0, 0],
            },
            {
              text: `${this.data.startdate} ~ ${this.data.enddate}`,
              alignment: "center",
              bold: true,
              fontSize: 14,
              margin: [0, 10],
            },
          ],
        },
        {
          table: {
            widths: ["80%", "20%"],
            heights: [20, 20, 20, 20],
            headerRows: 0,
            body: [
              [
                { text: "", border: [false] },
                { text: "", border: [false] },
              ],
              [
                {
                  text: `수행 기관 : ${this.data.agencyName}(${this.data.agencyID})`,

                  fontSize: 12,
                  border: [false],
                },
                { rowSpan: 3, image: "메달", width: 40, height: 60, alignment: "center", border: [false] },
              ],
              [
                {
                  text: `${this.data.season}분기 누적점수 : ${this.data.quarterScore.toLocaleString()}점(${
                    this.tier
                  }, ${this.data.quarterRank}위)`,

                  fontSize: 12,
                  border: [false],
                },
              ],
              [
                {
                  text: `기간 내 총 획득 점수 : ${this.data.dueScore.toLocaleString()}점`,

                  fontSize: 12,
                  border: [false],
                },
              ],
            ],
          },
        },
        {
          margin: [0, 5, 0, 5],
          table: {
            widths: ["1%", "32%", "1%", "32%", "1%", "32%", "1%"],
            heights: [160],
            headerRows: 0,
            body: [
              [
                { text: ``, border: [false] },
                {
                  stack: [
                    { text: "수행률", alignment: "center", fontSize: 12, margin: [0, 5, 0, 5], bold: true },
                    {
                      image: ratioSrc,
                      alignment: "center",
                      fit: [130, 130],
                    },
                  ],
                },
                { text: ``, border: [false] },
                {
                  stack: [
                    { text: "평균 수행 점수", alignment: "center", fontSize: 12, margin: [0, 5, 0, 5], bold: true },
                    {
                      image: avgScoreSrc,
                      alignment: "center",
                      fit: [130, 130],
                    },
                  ],
                },
                { text: ``, border: [false] },
                {
                  stack: [
                    { text: "일 평균 수행 시간", alignment: "center", fontSize: 12, margin: [0, 5, 0, 5], bold: true },
                    {
                      image: avgDurationSrc,
                      alignment: "center",
                      fit: [130, 130],
                    },
                  ],
                },
                { text: ``, border: [false] },
              ],
            ],
          },
          layout: {
            hLineColor: () => "#aaa9bc",
            vLineColor: () => "#aaa9bc",
          },
        },
        { text: `개별 Training 수행 결과`, style: "sectionTitle" },
        {
          table: {
            widths: ["20%", "7%", "8%", "auto", "auto", "auto", "8%", "auto", "auto", "auto"],
            heights: Array(17).fill(15),
            headerRows: 1,
            body: [
              [
                ...headerList.map((h) => ({
                  text: h,
                  style: "tableHeader",
                })),
              ],
              ...typenameList.map((type) => {
                const hasType = this.data.trainingList.find((f) => f.type === type.replace(" ", ""));
                if (hasType) {
                  return [
                    { style: "tableItem", text: type },
                    { style: "tableItem", text: parseFloat(hasType.level.toFixed(2)) },
                    { style: "tableItem", text: hasType.language },
                    { style: "tableItem", text: `${parseFloat(hasType.reculsiveCount.toFixed(2))}회` },
                    { style: "tableItem", text: `${parseFloat(hasType.weeklyPerformedDays.toFixed(2))}일` },
                    { style: "tableItem", text: `${hasType.performedCount} / ${hasType.needPerformedCount}` },
                    { style: "tableItem", text: `${parseFloat((hasType.performedRatio * 100).toFixed(2))}%` },
                    { style: "tableItem", text: `${parseFloat(hasType.totDuration.toFixed(2))}분` },
                    { style: "tableItem", text: `${parseFloat(hasType.avgScore.toFixed(2))}점` },
                    { style: "tableItem", text: `${parseFloat(hasType.totScore.toFixed(2))}점` },
                  ];
                } else {
                  return [
                    {
                      style: "tableItem",
                      text: type,
                    },
                    {
                      style: "tableItem",
                      colSpan: 9,
                      text: "수행 없음",
                      alignment: "center",
                    },
                  ];
                }
              }),
            ],
          },
          layout: {
            hLineColor: () => "#aaa9bc",
            vLineColor: () => "#aaa9bc",
          },
        },
      ];
      return true;
    } catch (err) {
      console.log("err", err);
      return false;
    }
  };

  makeThirdPage = async () => {
    try {
      if (!this.doc || !this.doc.content) {
        throw new Error("doc or content not found");
      }
      const readingChart = document.getElementById("ReadingChart") as HTMLCanvasElement;
      const cognitiveChart = document.getElementById("CognitiveChart") as HTMLCanvasElement;
      const trackingChart = document.getElementById("TrackingChart") as HTMLCanvasElement;
      const exerciseChart = document.getElementById("ExerciseChart") as HTMLCanvasElement;
      if (!readingChart || !cognitiveChart || !trackingChart || !exerciseChart) {
        throw new Error("chart not found");
      }

      const readingChartSrc = readingChart.toDataURL();
      const cognitiveChartSrc = cognitiveChart.toDataURL();
      const trackingChartSrc = trackingChart.toDataURL();
      const exerciseChartSrc = exerciseChart.toDataURL();

      this.doc.content = [
        ...(this.doc.content as Content[]),
        { text: `개별 Training 수행 결과`, style: "sectionTitle", pageBreak: "before", margin: [0, 30, 0, 10] },
        {
          margin: [0, 0, 0, 10],
          table: {
            widths: [240, "auto"],
            heights: [160],
            body: [
              [
                {
                  image: readingChartSrc,
                  alignment: "center",
                  width: 240,
                  height: 160,
                  border: [true, true, true, true],
                  borderColor: ["#aaa9bc", "#aaa9bc", "#aaa9bc", "#aaa9bc"],
                },
                // { text: "", border: [false, false, false, false] },
                {
                  margin: [3, 0, 0, 0],
                  stack: [
                    { text: "Reading Training", style: "resultTitle" },
                    {
                      text: "읽기를 기반으로 속도 제어, 안정성 향상, 문장 완성, 어휘의 탐색 및 판단 능력을 향상시키는 훈련입니다.",
                      style: "resultText",
                      margin: [0, 0, 0, 3],
                    },
                    {
                      ul: [
                        {
                          style: "resultText",
                          text: "Word Ordering : 뒤섞여 있는 어절들을 정상적인 문장이 되도록 순서를 맞춰야 합니다.",
                        },
                        {
                          style: "resultText",
                          text: "Sentence Mask : 일정한 속도로, 순차적으로 보여지는 글을 속도에 맞춰 읽어야 합니다.",
                        },
                        {
                          style: "resultText",
                          text: "Keyword Finding : 글에서 특정 키워드를 빠르게 탐지해야 합니다.",
                        },
                        {
                          style: "resultText",
                          text: "Category Finding : 글에서 특정 카테고리(범주)에 해당하는 단어들을 빠르게 탐지해야 합니다.",
                        },
                      ],
                    },
                  ],
                  border: [false, false, false, false],
                },
              ],
            ],
          },
        },
        {
          margin: [0, 0, 0, 10],
          table: {
            widths: [240, "auto"],
            heights: [160],
            body: [
              [
                {
                  image: cognitiveChartSrc,
                  alignment: "center",
                  width: 240,
                  height: 160,
                  border: [true, true, true, true],
                  borderColor: ["#aaa9bc", "#aaa9bc", "#aaa9bc", "#aaa9bc"],
                },
                // { text: "", border: [false, false, false, false] },
                {
                  margin: [3, 0, 0, 0],
                  stack: [
                    { text: "Cognitive Training", style: "resultTitle" },
                    {
                      text: "학습의 기초가 되는 시지각, 인지능력, 판단력 및 행동 제어 능력을 향상시키는 훈련입니다.",
                      style: "resultText",
                      margin: [0, 0, 0, 3],
                    },
                    {
                      ul: [
                        {
                          style: "resultText",
                          text: "Visual Span : 순간적으로 제시되는 무의미한 글자들을 한 눈에 최대한 많이 기억해야 합니다.",
                        },
                        {
                          style: "resultText",
                          text: "Visual Counting : 순간적으로 제시되는 점의 개수를 패턴화하여 세야 합니다.",
                        },
                        {
                          style: "resultText",
                          text: "Trail Making Text(TMT) : 어지럽게 배치된 숫자와 문자들을 순서대로 빠르게 연결해야 합니다.",
                        },
                        {
                          style: "resultText",
                          text: "Stroop Test : 제시되는 문장의 내용과 색깔을 비교하여 빠르게 판단해야 합니다.",
                        },
                      ],
                    },
                  ],
                  border: [false, false, false, false],
                },
              ],
            ],
          },
        },
        {
          margin: [0, 0, 0, 10],
          table: {
            widths: [240, "auto"],
            heights: [160],
            body: [
              [
                {
                  image: trackingChartSrc,
                  alignment: "center",
                  width: 240,
                  height: 160,
                  border: [true, true, true, true],
                  borderColor: ["#aaa9bc", "#aaa9bc", "#aaa9bc", "#aaa9bc"],
                },
                // { text: "", border: [false, false, false, false] },
                {
                  margin: [3, 0, 0, 0],
                  stack: [
                    { text: "Tracking Training", style: "resultTitle" },
                    {
                      text: "읽기와 시지각의 기본이 되는 안구운동의 제어와 통제, 지각 집중력을 향상시킵니다. 시선추적장치를 활용하며, 게임 형식으로 진행합니다.",
                      style: "resultText",
                      margin: [0, 0, 0, 3],
                    },
                    {
                      ul: [
                        {
                          style: "resultText",
                          text: "Saccade Tracking : 상하좌우에 나타나는 점을 빠르고 정확하게 움직여 시선을 고정시켜야 합니다.",
                        },
                        {
                          style: "resultText",
                          text: "Pursuit Tracking : 직선 또는 원운동 하는 점을 부드럽고 안정적으로 추적하며 보아야 합니다.",
                        },
                        {
                          style: "resultText",
                          text: "Anti Saccade Tracking : 나타난 자극물을 빠르게 판단하여 시선을 보내거나 멈추어야 합니다.",
                        },
                        {
                          style: "resultText",
                          text: "Sentence Tracking : 글을 순서대로 빠짐없이 읽어야만 시선에 따라 다음 부분이 보여집니다.",
                        },
                      ],
                    },
                  ],
                  border: [false, false, false, false],
                },
              ],
            ],
          },
        },
        {
          margin: [0, 0, 0, 10],
          table: {
            widths: [240, "auto"],
            heights: [160],
            body: [
              [
                {
                  image: exerciseChartSrc,
                  alignment: "center",
                  width: 240,
                  height: 160,
                  border: [true, true, true, true],
                  borderColor: ["#aaa9bc", "#aaa9bc", "#aaa9bc", "#aaa9bc"],
                },
                // { text: "", border: [false, false, false, false] },
                {
                  margin: [3, 0, 0, 0],
                  stack: [
                    { text: "Exercise Training", style: "resultTitle" },
                    {
                      text: "읽기 과정의 핵심 시선이동인 도약안구운동(saccade)을 빠르고 정확하게 훈련합니다. 시선추적장치를 활용합니다.",
                      style: "resultText",
                      margin: [0, 0, 0, 3],
                    },
                    {
                      ul: [
                        {
                          style: "resultText",
                          text: "Horizontal Sweep : 수평방향으로 최대 폭의 시선이동을 훈련합니다.",
                        },
                        {
                          style: "resultText",
                          text: "Vertical Sweep : 수직방향으로 최대 폭의 시선이동을 훈련합니다.",
                        },
                        {
                          style: "resultText",
                          text: "Horizontal Jump : 읽기에 필요한 너비의 수평방향 시선이동을 훈련합니다.",
                        },
                        {
                          style: "resultText",
                          text: "Vertical Jump : 읽기에 필요한 너비의 수직방향 시선이동을 훈련합니다.",
                        },
                      ],
                    },
                  ],
                  border: [false, false, false, false],
                },
              ],
            ],
          },
        },
      ];

      return true;
    } catch (err) {
      console.log("err", err);
      return false;
    }
  };

  start: () => Promise<boolean> = () => {
    return new Promise((resolve) => {
      if (!preloadDone) {
        console.log("preloadDone is false");
        resolve(false);
      }
      const a = this.makeFirstPage();
      const b = this.makeSecondPage();
      const c = this.makeThirdPage();

      if (!a || !b || !c) {
        console.log(a, b, c);
        resolve(false);
        return;
      }

      if (!this.doc) {
        console.log("doc type is falsy.");
        resolve(false);
        return;
      }
      this.pdf = pdfMake.createPdf(this.doc);
      resolve(true);
    });
  };

  download: () => Promise<boolean> = () => {
    return new Promise((resolve, reject) => {
      if (!this.pdf) {
        resolve(false);
        return;
      }

      const filename = `트레이닝 수행 리포트_${this.data.agencyName}_${this.data.startdate}-${this.data.enddate}_${this.data.testeeNickname}.pdf`;
      this.pdf.download(filename);
      resolve(true);
    });
  };
}
