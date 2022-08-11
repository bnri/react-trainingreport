type typenames =
  | "SentenceMask"
  | "CategoryFinding"
  | "KeywordFinding"
  | "WordOrdering"
  | "VisualSpan"
  | "VisualCounting"
  | "TMT"
  | "Stroop"
  | "SaccadeTracking"
  | "PursuitTracking"
  | "AntiTracking"
  | "SentenceTracking"
  | "ExerciseHorizontal"
  | "ExerciseVertical"
  | "ExerciseHJump"
  | "ExerciseVJump";

interface TrainingType {
  type: typenames;
  level: number;
  language?: "한국어" | "영어";
  reculsiveCount: number; // 일 수행횟수(recul)
  weeklyPerformedDays: number; // 주당 수행일(dayofweek 개수)
  performedCount: number; // 수행횟수
  needPerformedCount: number; // 수행해야하는 횟수
  performedRatio: number; // 수행률
  totDuration: number; // 총 수행시간
  avgScore: number; // 평균점수
  totScore: number; // 총 획득 점수
}

interface ReportType {
  agencyID: string;
  agencyName: string;
  testeeID: string;
  testeeNickname: string;
  startdate: string; // 기준 시작일
  enddate: string; // 기준 종료일
  season: 1 | 2 | 3 | 4;
  quarterScore: number; // 분기 누적점수(리포트 버튼을 누르는 그 순간의 점수)
  quarterRank: number; // 분기 누적순위(학원내에서)
  dueScore: number; // 기간 내의 점수

  performedRatio: number; // 전체 수행률
  avgScore: number; // 평균 수행 점수
  avgDuration: number; // 일 평균 수행 시간

  trainingList: TrainingType[];
  groupScoreList: {
    performedRatio: number;
    avgScore: number;
    avgDuration: number;
    SentenceMask: number;
    CategoryFinding: number;
    KeywordFinding: number;
    WordOrdering: number;
    VisualSpan: number;
    VisualCounting: number;
    TMT: number;
    Stroop: number;
    SaccadeTracking: number;
    PursuitTracking: number;
    AntiTracking: number;
    SentenceTracking: number;
    ExerciseHorizontal: number;
    ExerciseVertical: number;
    ExerciseHJump: number;
    ExerciseVJump: number;
  };
}
