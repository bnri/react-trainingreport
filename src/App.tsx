import { useCallback, useEffect, useRef, useState } from "react";

import "./App.css";
import TrainingReport, { ImperativeType } from "./components/TrainingReport";
import { NewDummyData, NewDummyChartData } from "./dummy";

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const ref = useRef<ImperativeType>(null);

  const handle = useCallback(async () => {
    if (!ref || !ref.current) {
      return;
    }
    const isPossible = ref.current.isPossibleMakePDF();
    try {
      if (isPossible) {
        setLoading(true);
        await ref.current.generatePDF();
        console.log("generate done");
        await ref.current.downloadPDF();
        console.log("download done");
      } else {
        console.log("잠시 후 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("loading", loading);
  }, [loading]);

  return (
    <div className="App">
      <button
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          padding: 20,
          zIndex: 9999,
          background: "blue",
          color: "#fff",
        }}
        onClick={handle}
      >
        pdf
      </button>
      <TrainingReport
        ref={ref}
        data={NewDummyData}
        chartData={NewDummyChartData}
        meIndex={61}
        info={{
          start_date: "2023-01-01",
          end_date: "2023-01-31",
          agency_logo: "",
          language: "한국어",
        }}
      />
      {loading && (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            background: "rgb(0,0,0)",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Loading!!!!
        </div>
      )}
    </div>
  );
};

export default App;
