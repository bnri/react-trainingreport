import { useEffect, useMemo, useRef } from "react";

import "./App.css";
import TrainingReport, { ImperativeType } from "./components/TrainingReport";
import { TrainingListType } from "./types";

const App: React.FC = () => {
  const ref = useRef<ImperativeType>(null);
  const dummyTrainingData = useMemo<TrainingListType>(() => {
    return {
      userInfo: {
        agency_ID: "jeong",
        agency_name: "jeong.",
        testee_nickname: "홍길동",
        testee_idx: 1699,
        testee_class: "개나리반",
        user_ID: "p002",
        start_date: "2022-08-01",
        end_date: "2022-08-24",
        language: "한국어",
      },
      taskList: [
        {
          task_dayofweek: "월,화,수,목,금",
          task_enddate: "2022-08-19",
          task_generatedate: "2022-08-05",
          task_language: "한국어",
          task_level: 6,
          task_reculsivecount: 2,
          task_startdate: "2022-08-05",
          task_type: "SentenceTracking",
          testee_idx: 1699,
          trainingtask_idx: 19566,
        },
        {
          task_dayofweek: "월,화,수,목,금",
          task_enddate: "2022-08-18",
          task_generatedate: "2022-08-05",
          task_language: "한국어",
          task_level: 6,
          task_reculsivecount: 3,
          task_startdate: "2022-08-04",
          task_type: "VisualCounting",
          testee_idx: 1699,
          trainingtask_idx: 19565,
        },
        {
          task_dayofweek: null,
          task_enddate: null,
          task_generatedate: null,
          task_language: null,
          task_level: null,
          task_reculsivecount: null,
          task_startdate: null,
          task_type: null,
          testee_idx: 2089,
          trainingtask_idx: null,
        },
        {
          task_dayofweek: null,
          task_enddate: null,
          task_generatedate: null,
          task_language: null,
          task_level: null,
          task_reculsivecount: null,
          task_startdate: null,
          task_type: null,
          testee_idx: 3563,
          trainingtask_idx: null,
        },
      ],
      resultList: [
        {
          testee_idx: 1699,
          tr_accuracyrate: 0.67,
          tr_duration: 99.424,
          tr_startdate: "2022-08-18 10:37:28",
          trainingresult_idx: 367762,
          trainingtask_idx: 19566,
        },
      ],
      rank: [
        {
          score_rank: 1,
          testee_idx: 1699,
          testee_traingscore_idx: 1590,
          tts_count: 20,
          tts_score: 80670,
          tts_season: 3,
          tts_year: 2022,
        },
        {
          score_rank: 4,
          testee_idx: 2089,
          testee_traingscore_idx: null,
          tts_count: null,
          tts_score: null,
          tts_season: null,
          tts_year: null,
        },
        {
          score_rank: 4,
          testee_idx: 3563,
          testee_traingscore_idx: null,
          tts_count: null,
          tts_score: null,
          tts_season: null,
          tts_year: null,
        },
      ],
    };
  }, []);

  useEffect(() => {
    console.log("isPossibleMakePDF");
    const t = setTimeout(() => console.log("isPossibleMakePDF12412", ref?.current?.isPossibleMakePDF()), 500);

    return () => clearTimeout(t);
  }, []);

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
          }
        }}
      >
        go
      </button>
      <TrainingReport ref={ref} trainingData={dummyTrainingData} />
    </div>
  );
};

export default App;
