import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import "chartjs-plugin-doughnutlabel";

import "./App.css";

const App: React.FC = () => {
  const dummyData = useMemo(() => {
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
      <div
        style={{
          width: "50%",
          height: "50%",
        }}
      >
        <Doughnut data={dummyData} options={dummyOptions} />
      </div>
    </div>
  );
};

export default App;
