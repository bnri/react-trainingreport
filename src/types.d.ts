export type typenames =
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

export type taskNames =
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

export type taskTypes = "Reading" | "Cognitive" | "Tracking" | "Exercise";

export interface TrainingType {
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

export interface ReportType {
  agencyID: string;
  agencyName: string;
  agencyLogo?: string;

  testeeIdx: number;
  testeeID: string;
  testeeNickname: string;
  testeeClass: string;

  startdate: string; // 기준 시작일
  enddate: string; // 기준 종료일

  totScore: number; // 총점
  firstScore: number; // 기록1
  firstScoreRank: number;
  firstScoreDate: string;
  secondScore: number; // 기록2
  secondScoreDate: string;

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

export interface UserInfoType {
  agency_ID: string;
  agency_name: string;
  testee_nickname: string;
  testee_idx: number;
  testee_class: string;
  user_ID: string;
  start_date: string;
  end_date: string;
  language: "한국어" | "영어";
  agency_logo?: string;
}

export interface TaskListType {
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

export interface ResultListType {
  testee_idx: number;
  tr_accuracyrate: number;
  tr_duration: number;
  tr_startdate: string;
  trainingresult_idx: number;
  trainingtask_idx: number;
}

export interface RankType {
  testee_idx: number;
  testee_newtraingscore_idx: number | null;
  tts_totalscore: number | null;
  tts_firstscore: number | null;
  tts_firstscore_resetdate: string;
  tts_firstscore_rank: number | null;
  tts_secondscore: number | null;
  tts_secondscore_resetdate: string;
}

export interface TrainingListType {
  userInfo: UserInfoType;
  taskList: TaskListType[];
  resultList: ResultListType[];
  rank: RankType[];
}

export interface testeeList {
  testeeIdx: number;
  trainingList: TrainingType[];
}

export interface TrainingReportProps {
  trainingData: TrainingListType;
}

export interface TrainingResultType {
  [x: string]: number;
  testee_task_idx: number;
  tr_accuracyrate: number;
  tr_duration: number;
  tr_feeling?: string;
  tr_score: number;
  tr_starttime: string;
  tr_level: number;
  trainingresult_idx: number;
  trainingtext_idx?: number;
}

export interface TaskType {
  dayofweek: string;
  isactive: number;
  language: "한국어" | "영어";
  level: number;
  reculsivecount: number;
  task_name: taskNames;
  task_type: taskTypes;
  testee_task_idx: number;
  trainingResult: { [key: string]: TrainingResultType[] };
}

export interface TesteeType {
  ItsMe: boolean;
  agency_ID: string;
  agency_name: string;
  rank: number;
  taskList: TaskType[];
  testeeTaskIdxList: { idx: number; listIdx: number }[];
  testee_idx: number;
  testee_nickname: string;
  testee_class?: string;
  tier: "다이아몬드" | "플래티넘" | "골드" | "실버" | "브론즈";
  tts_firstscore?: number;
  tts_firstscore_resetdate: string;
  tts_secondscore?: number;
  tts_secondscore_resetdate: string;
  tts_monthscore?: number;
  tts_totalscore?: number;
  user_ID: string;
}

export interface ReportProps {
  data: TesteeType[];
  meIndex: number;
  info: {
    start_date: string;
    end_date: string;
    agency_logo?: string;
    language: "한국어" | "영어";
  };
}
