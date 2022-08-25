import pdfMake from "pdfmake/build/pdfmake";
// @ts-ignore
import pdfFonts from "./vfs_fonts_jejumj_gd_cn";

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

export default class PDF {
  pdf: pdfMake.TCreatedPdf | null;
  data: ReportType;

  constructor(data: ReportType) {
    this.pdf = null;
    this.data = data;
  }

  start: () => Promise<void> = () => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  };

  a = () => {
    console.log("this.pdf", this.pdf);
    console.log("pdfFOnts", pdfFonts);
  };
}
