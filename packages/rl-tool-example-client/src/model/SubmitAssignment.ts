class SubmitAssignment {
  scoreMaximum = 100;
  label = "title";
  tag = "tag";
  resourceId = "resourceId";

  constructor(data: Partial<SubmitAssignment>) {
    Object.assign(this, data);
  }
}

export default SubmitAssignment;