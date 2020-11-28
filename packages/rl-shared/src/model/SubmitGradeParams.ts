
// Used to submit a grade for a single student all students
class SubmitGradeParams {
  lineItemId: string | undefined; //Not required for the current implementation, when we work with more than 1 lineitem, it will be required.
  scoreGiven: number | undefined; //required only if giving an actual score
  userId: string | undefined;//id of the student. nominally not required if autoscored but does get added so if you have it send it
  comment: string | undefined;//not rquired.
  activityProgress: string | undefined; //Initialized,Started,InProgress,SubmittedCompleted
  gradingProgress: string | undefined;//FullyGraded,Pending,PendingManualFailed,NotReady
  scoreMaximum: number | undefined; // REQUIRED if a score is given.
  timestamp: string | undefined;//added by the backend.

  constructor(data: Partial<SubmitGradeParams> | undefined) {
    if (data) {
      Object.assign(this, data);
    } else {
      this.lineItemId = "assignmentId";
      this.scoreGiven = 100;
      this.userId = "selectValue";
      this.comment = "Instructor comment on the student performance";
      this.activityProgress = "Completed";
      this.gradingProgress = "FullyGraded";
      this.scoreMaximum = 100;
      this.timestamp = new Date(Date.now()).toISOString();
    }
  }


}

export default SubmitGradeParams;