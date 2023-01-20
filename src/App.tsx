import { useRef } from "react";

import "./App.css";
import TrainingReport, { ImperativeType } from "./components/TrainingReport";
import { NewDummy } from "./dummy";

const App: React.FC = () => {
  const ref = useRef<ImperativeType>(null);

  return (
    <div className="App">
      <button
        onClick={() => {
          if (!ref || !ref.current) {
            return;
          }
          const isPossible = ref.current.isPossibleMakePDF();

          if (isPossible) {
            ref.current.generatePDF().then((res) => {
              console.log("generate done", res);

              if (!ref || !ref.current) {
                return;
              }
              ref.current.downloadPDF().then((res) => {
                console.log("download done", res);
              });
            });
          } else {
            console.log("잠시 후 다시 시도해주세요.");
          }
        }}
      >
        go
      </button>
      <TrainingReport
        ref={ref}
        data={NewDummy}
        meIndex={55}
        info={{
          start_date: "2023-01-13",
          end_date: "2023-01-20",
          agency_logo: "",
          language: "한국어",
        }}
      />
    </div>
  );
};

export default App;
