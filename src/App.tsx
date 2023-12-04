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
          // todo : api에서도 날짜 확인해서 쿼리 해야함(tr 날짜 범위때문에)
          start_date: "2023-01-01",
          end_date: "2023-01-31",
          mode: "1202341",
          agency_logo: "",
          org_logo:
            "data:image/png;base64,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",
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
