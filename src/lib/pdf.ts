import { ReportType } from "./../types.d";
import { imgbase64forPDF } from "./base64";
import pdfMake from "pdfmake/build/pdfmake";
// @ts-ignore
import pdfFonts from "./vfs_fonts_jejumj_gd_cn";
import { Content, TDocumentDefinitions } from "pdfmake/interfaces";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  제주명조: {
    normal: "jejumyungjo.ttf",
    bold: "jejugothic.ttf",
    italics: "cjk.ttf",
  },
};
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
      // return '#7367f0';
      // return i === 1 ? 'black' : 'black';
    },
    //   paddingTop: function (i) {
    //     return 40;
    //   },
    //   paddingLeft: function (i) {
    //      return i === 0 ? 0 : 8;
    //    },
    //   paddingRight: function (i, node) {
    //     return (i === node.table.widths.length - 1) ? 0 : 8;
    //   }
  },
};

// @ts-ignore
function findInlineHeight(cell, maxWidth, usedWidth = 0) {
  function mapTableBodies(innerTableCell: any) {
    // @ts-ignore
    const findInlineHeight = this.findInlineHeight(innerTableCell, maxWidth, usedWidth);

    usedWidth = findInlineHeight.width;
    return findInlineHeight.height;
  }
  // @ts-ignore
  let calcLines = (inlines) => {
    if (!inlines)
      return {
        height: 0,
        width: 0,
      };
    let currentMaxHeight = 0;
    let lastHadLineEnd = false;
    for (const currentNode of inlines) {
      usedWidth += currentNode.width;
      if (usedWidth > maxWidth || lastHadLineEnd) {
        currentMaxHeight += currentNode.height;
        usedWidth = currentNode.width;
      } else {
        currentMaxHeight = Math.max(currentNode.height, currentMaxHeight);
      }
      lastHadLineEnd = !!currentNode.lineEnd;
    }
    return {
      height: currentMaxHeight,
      width: usedWidth,
    };
  };
  if (cell._offsets) {
    usedWidth += cell._offsets.total;
  }
  if (cell._inlines && cell._inlines.length) {
    return calcLines(cell._inlines);
  } else if (cell.stack && cell.stack[0]) {
    return (
      cell.stack
        // @ts-ignore
        .map((item) => {
          return findInlineHeight(item, maxWidth);
        })
        // @ts-ignore
        .reduce((prev, next) => {
          return {
            height: prev.height + next.height,
            width: Math.max(prev.width + next.width),
          };
        })
    );
  } else if (cell.table) {
    let currentMaxHeight = 0;
    for (const currentTableBodies of cell.table.body) {
      const innerTableHeights = currentTableBodies.map(mapTableBodies);
      currentMaxHeight = Math.max(...innerTableHeights, currentMaxHeight);
    }
    return {
      height: currentMaxHeight,
      width: usedWidth,
    };
  } else if (cell._height) {
    usedWidth += cell._width;
    return {
      height: cell._height,
      width: usedWidth,
    };
  }

  return {
    height: null,
    width: usedWidth,
  };
}
// @ts-ignore
function applyVerticalAlignment(node, rowIndex, align, manualHeight = 0) {
  // New default argument
  const allCellHeights = node.table.body[rowIndex].map(
    // @ts-ignore
    (innerNode, columnIndex) => {
      const mFindInlineHeight = findInlineHeight(innerNode, node.table.widths[columnIndex]._calcWidth);
      return mFindInlineHeight.height;
    }
  );
  // @ts-ignore
  const maxRowHeight = manualHeight ? manualHeight[rowIndex] : Math.max(...allCellHeights); // handle manual height
  // @ts-ignore
  node.table.body[rowIndex].forEach((cell, ci) => {
    if (allCellHeights[ci] && maxRowHeight > allCellHeights[ci]) {
      let topMargin;

      let cellAlign = align;
      if (Array.isArray(align)) {
        cellAlign = align[ci];
      }

      if (cellAlign === "bottom") {
        topMargin = maxRowHeight - allCellHeights[ci];
      } else if (cellAlign === "center") {
        topMargin = (maxRowHeight - allCellHeights[ci]) / 2;
      }

      if (topMargin) {
        if (cell._margin) {
          cell._margin[1] = topMargin;
        } else {
          cell._margin = [0, topMargin, 0, 0];
        }
      }
    }
  });
}

export default class PDF {
  pdf: pdfMake.TCreatedPdf | null;
  doc: TDocumentDefinitions | null;
  data: ReportType;
  agencyLogo: string | null;
  tier: "다이아몬드" | "플래티넘" | "골드" | "실버" | "브론즈";

  constructor(
    data: ReportType,
    agencyLogo: string | null,
    tier: "다이아몬드" | "플래티넘" | "골드" | "실버" | "브론즈"
  ) {
    this.pdf = null;
    this.doc = null;
    this.data = data;
    this.agencyLogo = agencyLogo;
    this.tier = tier;
  }

  makeFirstPage = () => {
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
        tableExample: {
          margin: [0, 20, 0, 10],
        },
        tableHeader: {
          bold: true,
          fontSize: 9,
          color: "black",
          alignment: "center",
        },
        tableItem: {
          fontSize: 9,
          color: "black",
          alignment: "center",
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
  };

  makeSecondPage = () => {
    // @ts-ignore
    if (!this.doc || !this.doc.content) {
      return false;
    }
    const ratioChart = document.getElementById("RatioChart") as HTMLCanvasElement;
    const avgScoreChart = document.getElementById("AvgScoreChart") as HTMLCanvasElement;
    const avgDurationChart = document.getElementById("AvgDurationChart") as HTMLCanvasElement;
    if (!ratioChart || !avgScoreChart || !avgDurationChart) {
      return false;
    }

    const ratioSrc = ratioChart.toDataURL();
    const avgScoreSrc = avgScoreChart.toDataURL();
    const avgDurationSrc = avgDurationChart.toDataURL();

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
              { rowSpan: 4, image: "메달", width: 50, height: 100, alignment: "center", border: [false] },
            ],
            [
              {
                text: `수행 기관 : ${this.data.agencyName}(${this.data.agencyID})`,

                fontSize: 12,
                border: [false],
              },
            ],
            [
              {
                text: `${this.data.season}분기 누적점수 : ${this.data.quarterScore.toLocaleString()}점(${this.tier}, ${
                  this.data.quarterRank
                }위)`,

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
          hLineColor: (i, node) => "#aaa9bc",
          vLineColor: (i, node) => "#aaa9bc",
        },
      },
      { text: `개별 Training 수행 결과`, fontSize: 13, bold: true, margin: [0, 10, 0, 10] },
      {
        table: {
          widths: ["20%", "7%", "8%", "auto", "auto", "auto", "8%", "auto", "auto", "auto"],
          heights: Array(17).fill(15),
          headerRows: 1,
          body: [
            [
              { text: "할당된 과제", style: "tableHeader" },
              { text: "레벨", style: "tableHeader" },
              { text: "언어", style: "tableHeader" },
              { text: "일 수행횟수", style: "tableHeader" },
              { text: "주당 수행일", style: "tableHeader" },
              { text: "총 수행횟수", style: "tableHeader" },
              { text: "수행률", style: "tableHeader" },
              { text: "총 수행시간", style: "tableHeader" },
              { text: "평균 점수", style: "tableHeader" },
              { text: "총 획득점수", style: "tableHeader" },
            ],
            [{ style: "tableItem", text: "Sentence Mask" }, ...Array(9).fill({ style: "tableItem", text: "a" })],
            [{ style: "tableItem", text: "Word Ordering" }, ...Array(9).fill({ style: "tableItem", text: "a" })],
            [{ style: "tableItem", text: "Keyword Finding" }, ...Array(9).fill({ style: "tableItem", text: "a" })],
            [{ style: "tableItem", text: "Category Finding" }, ...Array(9).fill({ style: "tableItem", text: "a" })],
            [{ style: "tableItem", text: "Visual Span" }, ...Array(9).fill({ style: "tableItem", text: "a" })],
            [{ style: "tableItem", text: "Visual Counting" }, ...Array(9).fill({ style: "tableItem", text: "a" })],
            [{ style: "tableItem", text: "TMT" }, ...Array(9).fill({ style: "tableItem", text: "a" })],
            [{ style: "tableItem", text: "Stroop" }, ...Array(9).fill({ style: "tableItem", text: "a" })],
            [{ style: "tableItem", text: "Saccade Tracking" }, ...Array(9).fill({ style: "tableItem", text: "a" })],
            [{ style: "tableItem", text: "Pursuit Tracking" }, ...Array(9).fill({ style: "tableItem", text: "a" })],
            [{ style: "tableItem", text: "Anti Tracking" }, ...Array(9).fill({ style: "tableItem", text: "a" })],
            [{ style: "tableItem", text: "Sentence Tracking" }, ...Array(9).fill({ style: "tableItem", text: "a" })],
            [{ style: "tableItem", text: "Exercise Horizontal" }, ...Array(9).fill({ style: "tableItem", text: "a" })],
            [{ style: "tableItem", text: "Exercise Vertical" }, ...Array(9).fill({ style: "tableItem", text: "a" })],
            [{ style: "tableItem", text: "Exercise HJump" }, ...Array(9).fill({ style: "tableItem", text: "a" })],
            [{ style: "tableItem", text: "Exercise VJump" }, ...Array(9).fill({ style: "tableItem", text: "a" })],
          ],
        },
        layout: {
          hLineColor: (i, node) => "#aaa9bc",
          vLineColor: (i, node) => "#aaa9bc",
        },
      },
    ];
    return true;
  };

  makeThirdPage = () => {
    return true;
  };

  start: () => Promise<boolean> = () => {
    return new Promise((resolve, reject) => {
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
