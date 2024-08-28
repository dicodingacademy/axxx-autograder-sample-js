export type Checklist = {
  key: string;
  completed: boolean;
  reason: string;
};

export type SubmissionInfo = {
  id: number;
  submitterName: string;
  submitterUsername: string;
  submitterBirthday: string;
  quizId: number;
  courseId: number;
  rejectedCount: number;
}

export type Report = {
  submissionId: number;
  message: string;
  checklistKeys: string[];
  isPassed: boolean;
  rating: number;
}