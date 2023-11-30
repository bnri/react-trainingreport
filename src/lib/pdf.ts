import { ReportType, SummaryType } from "./../types.d";
import { imgbase64forPDF } from "./base64";
import pdfMake from "pdfmake/build/pdfmake";
import { Content, TDocumentDefinitions } from "pdfmake/interfaces";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { lazy } from "react";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

const ReactLazyPreload = (importStatement: any) => {
  const Component = lazy(importStatement) as any;
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
  orgLogo?: string;
  dayDueDate: { startDate: string; endDate: string };
  weekDueDate: { startDate: string; endDate: string };
  tier: "다이아몬드" | "플래티넘" | "골드" | "실버" | "브론즈";

  constructor(
    data: ReportType,
    tier: "다이아몬드" | "플래티넘" | "골드" | "실버" | "브론즈",
    dayDueDate: { startDate: string; endDate: string },
    weekDueDate: { startDate: string; endDate: string },
    agencyLogo?: string,
    orgLogo?: string
  ) {
    this.pdf = null;
    this.doc = null;
    this.data = data;
    this.tier = tier;
    this.dayDueDate = dayDueDate;
    this.weekDueDate = weekDueDate;
    this.agencyLogo = agencyLogo;
    this.orgLogo = orgLogo;
  }

  makeFirstPage = () => {
    try {
      this.doc = {
        pageSize: "A4",
        info: {
          title: "트레이닝 수행리포트",
          author: "bnri",
          subject: "트레이닝 수행리포트",
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
                    text: "트레이닝 수행리포트",
                    bold: true,
                    fontSize: 26,
                    alignment: "center",
                    colSpan: 2,
                  },
                ],
                [
                  {
                    margin: [10, 0, 10, 250],
                    text: `${this.data.dateMsg}`,
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
          readerseyeLogo: this.orgLogo ? this.orgLogo : imgbase64forPDF["리더스아이로고가로"],
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
          levelScoreTitle: {
            fontSize: 10,
            bold: true,
            margin: [0, 3, 0, 3],
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
            fillColor: "#eeedff",
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
    const levelScoreDayChart = document.getElementById("levelScoreDayChart") as HTMLCanvasElement;
    const levelScoreWeekChart = document.getElementById("levelScoreWeekChart") as HTMLCanvasElement;

    if (!ratioChart || !avgScoreChart || !avgDurationChart || !levelScoreDayChart || !levelScoreWeekChart) {
      throw new Error("chart not found");
    }

    try {
      const ratioSrc = ratioChart.toDataURL();
      const avgScoreSrc = avgScoreChart.toDataURL();
      const avgDurationSrc = avgDurationChart.toDataURL();
      const levelScoreDaySrc = levelScoreDayChart.toDataURL();
      const levelScoreWeekSrc = levelScoreWeekChart.toDataURL();

      const firstScoreText = `${this.data.firstScore.toLocaleString()}점(${this.data.firstScoreDate} 이후, ${this.tier}, ${
        this.data.firstScoreRank
      }위)`;
      const monthScoreText = `${this.data.monthScore.toLocaleString()}점(${dayjs().format("YY년 MM월,")} ${this.data.monthScoreRank}위)`;

      this.doc.content = [
        ...(this.doc.content as Content[]),
        {
          stack: [
            {
              text: `${this.data.testeeNickname}(${this.data.testeeID})의 트레이닝 수행 리포트`,
              alignment: "center",
              bold: true,
              fontSize: 18,
              margin: [0, 40, 0, 0],
            },
            {
              text: `${this.data.dateMsg}`,
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
            heights: [10, 10, 10, 10, 10, 10],
            headerRows: 0,
            body: [
              [
                {
                  text: `수행 기관 : ${this.data.agencyName}(${this.data.agencyID})`,

                  fontSize: 10,
                  border: [false],
                },
                { rowSpan: 6, image: "메달", width: 47.25, height: 75, alignment: "center", border: [false] },
              ],
              [
                {
                  text: `총 누적점수 : ${this.data.totScore.toLocaleString()}점`,
                  fontSize: 10,
                  border: [false],
                },
              ],
              [
                {
                  text: `월간점수 : ${monthScoreText}`,
                  fontSize: 10,
                  border: [false],
                },
              ],
              [
                {
                  text: `기록 1 : ${firstScoreText}`,
                  fontSize: 10,
                  border: [false],
                },
              ],
              [
                {
                  text: `기록 2 : ${this.data.secondScore.toLocaleString()}점(${this.data.secondScoreDate} 이후)`,
                  fontSize: 10,
                  border: [false],
                },
              ],
              [
                {
                  text: `기간 내 총 획득 점수 : ${this.data.dueScore.toLocaleString()}점`,
                  fontSize: 10,
                  border: [false],
                },
              ],
            ],
          },
        },
        { text: `트레이닝 수행 현황`, style: "sectionTitle" },
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
        {
          text: `* 기관 평균 : 학생이 속한 기관(${this.data.agencyName})의 전체 학생들의 평균 점수`,
          fontSize: 10,
          margin: [0, 10, 0, 5],
        },
        { text: `트레이닝 레벨스코어 추세`, style: "sectionTitle" },
        { text: `일별 (${this.dayDueDate.startDate} ~ ${this.dayDueDate.endDate})`, style: "levelScoreTitle" },
        {
          image: levelScoreDaySrc,
          alignment: "center",
          width: 570,
          height: 135,
          // fit: [130, 130],
        },
        { text: `주별 (${this.weekDueDate.startDate} ~ ${this.weekDueDate.endDate})`, style: "levelScoreTitle" },
        {
          image: levelScoreWeekSrc,
          alignment: "center",
          width: 570,
          height: 135,
        },
        {
          text: `* 레벨과 수행점수가 반영된 점수입니다. 1레벨당 20점이 가산됩니다. (레벨스코어 = 점수 + 레벨 x 20)`,
          fontSize: 10,
          margin: [0, 10, 0, 0],
        },
      ];
      return true;
    } catch (err) {
      console.log("err", err);
      return false;
    }
  };

  makeThirdPage = () => {
    try {
      if (!this.doc || !this.doc.content) {
        throw new Error("doc or content not found");
      }

      const domainChart = document.getElementById("SentencemaskDomainChart") as HTMLCanvasElement;

      if (!domainChart) {
        throw new Error("chart not found");
      }

      const domainChartSrc = domainChart.toDataURL();

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
      const trainingTypes = [
        {
          type: "Reading",
          names: ["Sentence Mask", "Word Ordering", "Keyword Finding", "Category Finding", "RSVP"],
        },
        {
          type: "Cognitive",
          names: ["Visual Span", "Visual Counting", "TMT", "Stroop"],
        },
        {
          type: "Tracking",
          names: ["Saccade Tracking", "Pursuit Tracking", "Anti Tracking", "Sentence Tracking"],
        },
        {
          type: "Exercise",
          names: ["Horizontal Jump", "Vertical Jump", "Horizontal Saccade", "Vertical Saccade"],
        },
      ];

      const MakeTableRow = (task: string, data: SummaryType | undefined, hideLanguage: boolean, isHeader?: boolean) => {
        const style = isHeader ? "tableHeader" : "tableItem";
        if (!data) {
          return [
            {
              style,
              text: task,
            },
            {
              style,
              colSpan: 9,
              text: "수행 없음",
              alignment: "center",
            },
          ];
        }

        return [
          { style, text: task },
          { style, text: parseFloat(data.level.toFixed(1)) },
          { style, text: hideLanguage ? "" : data.language },
          { style, text: `${parseFloat(data.reculsiveCount.toFixed(1))}회` },
          { style, text: `${parseFloat(data.weeklyPerformedDays.toFixed(1))}일` },
          { style, text: `${data.performedCount} / ${data.needPerformedCount}` },
          { style, text: `${parseFloat((data.performedRatio * 100).toFixed(1))}%` },
          { style, text: `${parseFloat((data.totDuration / 60).toFixed(1))}분` },
          { style, text: `${parseFloat(data.avgScore.toFixed(1))}점` },
          { style, text: `${parseFloat(data.totScore.toFixed(1))}점` },
        ];
      };

      this.doc.content = [
        ...(this.doc.content as Content[]),

        { text: `개별 트레이닝 수행 결과`, style: "sectionTitle", pageBreak: "before", margin: [0, 40, 0, 10] },
        {
          table: {
            widths: ["20%", "7%", "8%", "auto", "auto", "auto", "8%", "auto", "auto", "auto"],
            heights: Array(22).fill(15),
            headerRows: 1,
            body: [
              [
                ...headerList.map((h) => ({
                  text: h,
                  style: "tableHeader",
                })),
              ],
              ...trainingTypes
                .map((type) => {
                  const returnComponents = [];
                  returnComponents.push(
                    ...type.names.map((task) => {
                      const find = this.data.trainingList.find((f) => f.taskName === task.split(" ").join(""));
                      const hideLanguage = find?.taskType === "Reading" || find?.taskName === "SentenceTracking" ? false : true;
                      return MakeTableRow(task, find, hideLanguage);
                    })
                  );

                  returnComponents.push(MakeTableRow(`${type.type} 평균`, this.data.typeSummary[type.type], false, true));
                  return returnComponents;
                })
                .flat(),
              MakeTableRow(`전체 평균`, this.data.typeSummary.All, false, true),
            ],
          },
          layout: {
            hLineColor: () => "#aaa9bc",
            vLineColor: () => "#aaa9bc",
          },
        },
        { text: `글 읽기 트레이닝 분석`, style: "sectionTitle" },
        {
          margin: [0, 5, 0, 5],
          table: {
            widths: ["1%", "18%", "1%", "50%", "1%", "28%", "1%"],
            heights: [160],
            headerRows: 0,
            body: [
              [
                { text: ``, border: [false] },
                {
                  stack: [
                    { text: "읽은 글", alignment: "center", fontSize: 11, margin: [0, 15, 0, 15], bold: true },
                    { text: `${this.data.sentencemaskAnalysis.readingCount}편`, fontSize: 14, bold: true, margin: [0, 5, 0, 5] },
                    { text: "기관 평균", alignment: "center", fontSize: 11, margin: [0, 20, 0, 15], bold: true },
                    { text: `${this.data.sentencemaskAnalysis.agencyAvgReadingCount}편`, fontSize: 12, bold: true, margin: [0, 5, 0, 5] },
                  ],
                  alignment: "center",
                },
                { text: ``, border: [false] },
                {
                  stack: [
                    {
                      image: domainChartSrc,
                      alignment: "center",
                      width: 210,
                      height: 160,
                    },
                  ],
                },
                { text: ``, border: [false] },
                {
                  stack: [
                    { text: "읽은 글 정보", alignment: "center", fontSize: 11, margin: [0, 15, 0, 15], bold: true },
                    { text: "최근 시선읽기진단 평균 속도", alignment: "center", fontSize: 10, margin: [0, 5, 0, 5] },
                    {
                      text: `${this.data.sentencemaskAnalysis.recentReadingSpeed.reading_speed}어절/분`,
                      alignment: "center",
                      fontSize: 14,
                      margin: [0, 5, 0, 5],
                      bold: true,
                    },
                    { text: "현재 트레이닝 평균 속도", alignment: "center", fontSize: 10, margin: [0, 20, 0, 5] },
                    {
                      text: `${this.data.sentencemaskAnalysis.recentSMReadingSpeed}어절/분`,
                      alignment: "center",
                      fontSize: 12,
                      margin: [0, 5, 0, 5],
                      bold: true,
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
        {
          text: `* Sentence Mask를 통해 제공된 읽기 자료입니다.`,
          fontSize: 10,
          margin: [0, 10, 0, 0],
        },
      ];

      return true;
    } catch (err) {
      console.log("err", err);
      return false;
    }
  };

  makeFourthPage = () => {
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
        { text: `개별 트레이닝 수행 결과`, style: "sectionTitle", pageBreak: "before", margin: [0, 30, 0, 10] },
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
                          text: "Word Ordering : 뒤섞인 어절들의 순서를 맞춥니다.",
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
                        {
                          style: "resultText",
                          text: "RSVP : 순차적으로 제시되는 문장을 읽습니다.",
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
                          text: "Horizontal Jump : 수평방향으로 최대 폭의 시선이동을 훈련합니다.",
                        },
                        {
                          style: "resultText",
                          text: "Vertical Jump : 수직방향으로 최대 폭의 시선이동을 훈련합니다.",
                        },
                        {
                          style: "resultText",
                          text: "Horizontal Saccade : 읽기에 필요한 너비의 수평방향 시선이동을 훈련합니다.",
                        },
                        {
                          style: "resultText",
                          text: "Vertical Saccade : 읽기에 필요한 너비의 수직방향 시선이동을 훈련합니다.",
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
    return new Promise(async (resolve) => {
      if (!preloadDone) {
        console.log("preloadDone is false");
        return resolve(false);
      }

      const $report = document?.querySelector("#trainingReport") as HTMLDivElement;
      if (!$report) {
        return resolve(false);
      }

      const delay = (d: number) => new Promise((resolve) => setTimeout(() => resolve(true), d));

      const prevWidth = $report.style.width;
      $report.style.width = "1024px";
      document.body.style.overflow = "hidden";
      await delay(1000);

      const a = this.makeFirstPage();
      const b = this.makeSecondPage();
      const c = this.makeThirdPage();
      const d = this.makeFourthPage();

      if (!a || !b || !c || !d) {
        console.log(a, b, c, d);
        resolve(false);
        return;
      }

      if (!this.doc) {
        console.log("doc type is falsy.");
        resolve(false);
        return;
      }

      this.pdf = pdfMake.createPdf(this.doc);
      $report.style.width = prevWidth;
      document.body.style.overflow = "unset";

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
