class ResultScore {
  id: string;
  studentId: string;
  studentName: string;
  resultScore: number;
  resultMaximum: number;
  comment: string | undefined;

  constructor(data: Partial<ResultScore> | undefined | null) {
    if (data) {
      Object.assign(this, data);
    } else {
      this.resultScore = 81;
      this.comment = "Instructor comment on the student performance";
      this.studentName = "Completed";
      this.id = "FullyGraded";
      this.studentId = "etaffins";
      this.resultMaximum = 100;
    }
  }
}

export default ResultScore;