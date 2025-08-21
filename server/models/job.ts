export const JobStatus = {
  pending: "pending",
  completed: "completed",
} as const;

export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];

export type Job = {
  id: string;
  session_id: string;
  status: JobStatus;
  result?: string;
};
