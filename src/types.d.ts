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
  avgDuration: number; // 일 평균 수행 시간
  avgScore: number; // 평균점수
  totScore: number; // 총 획득 점수
  equalTypeCount: number; // 이 type이 지금 몇 개 나왔는지
}

interface ReportType {
  agencyID: string;
  agencyName: string;

  testeeIdx: number;
  testeeID: string;
  testeeNickname: string;

  startdate: string; // 기준 시작일
  enddate: string; // 기준 종료일

  season: 0 | 1 | 2 | 3 | 4;
  quarterScore: number; // 분기 누적점수(리포트 버튼을 누르는 그 순간의 점수)
  quarterRank: number; // 분기 누적순위(학원내에서)
  dueScore: number; // 기간 내의 점수

  performedRatio: number; // 전체 수행률
  ratioTitle: string;

  avgScore: number; // 평균 수행 점수
  scoreTitle: string;

  avgDuration: number; // 일 평균 수행 시간
  durationTitle: string;

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

interface UserInfoType {
  agency_ID: string;
  agency_name: string;
  testee_nickname: string;
  testee_idx: number;
  user_ID: string;
  start_date: string;
  end_date: string;
  language: "한국어" | "영어";
}

interface TaskListType {
  task_dayofweek: string | null;
  task_enddate: string | null;
  task_generatedate: string | null;
  task_language: string | null;
  task_level: number | null;
  task_reculsivecount: number | null;
  task_startdate: string | null;
  task_type: typenames | null;
  testee_idx: number;
  trainingtask_idx: number | null; // 얘가 null이면 idx 제외하고 다 null임
}

interface ResultListType {
  testee_idx: number;
  tr_accuracyrate: number;
  tr_duration: number;
  tr_startdate: string;
  trainingresult_idx: number;
  trainingtask_idx: number;
}

interface RankType {
  score_rank: number;
  testee_idx: number;
  testee_traingscore_idx: number | null;
  tts_count: number | null;
  tts_score: number | null;
  tts_season: 0 | 1 | 2 | 3 | 4 | null;
  tts_year: number | null;
}

interface TrainingListType {
  userInfo: UserInfoType;
  taskList: TaskListType[];
  resultList: ResultListType[];
  rank: RankType[];
}

interface testeeList {
  testeeIdx: number;
  trainingList: TrainingType[];
}

interface TrainingReportProps {
  medal: string;
  tier: string;
  trainingData: TrainingListType;
}
