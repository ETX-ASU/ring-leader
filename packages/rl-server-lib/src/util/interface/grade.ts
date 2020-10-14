export interface Score {
  scoreGiven: number;
  timestamp: string;
  comment: string;
  activityProgress: string;
  gradingProgress: string;
  userId?: string;
  scoreMaximum?: number;
}

export interface ScoreOptions {
  id: string;
  userId?: string;
  scoreMaximum?: number;
  resourceLinkId?: boolean;
  autoCreate?: boolean;
  limit?: number | boolean;
  title?: string;
}
