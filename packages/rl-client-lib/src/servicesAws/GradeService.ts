import API from "@aws-amplify/api";
import {
  PUT_STUDENT_GRADE,
  GET_GRADES,
  logger,
  LTI_API_NAME,
  SubmitGradeParams
} from "@asu-etx/rl-shared";
import { getHash } from '../utils/hashUtils';

const buildScore = (params: any): SubmitGradeParams => {
  const score: any = {};
  logger.debug(`params used to build score: ${params}`)
  score.scoreGiven = params.scoreGiven || params.scoreGiven == 0 ? params.scoreGiven :
    params.grade || params.grade == 0 ? params.grade : params.resultScore;
  if (params.timestamp) score.timestamp = params.timestamp;
  score.comment = params.comment;
  if (params.activityProgress) score.activityProgress = params.activiyProgress;
  score.gradingProgress = params.progress ? params.progress : params.gradingProgress;
  if (params.studentId || params.userId) score.userId = params.studentId ? params.studentId : params.userId;
  if (params.scoreMaximum || params.resultMaximum) score.scoreMaximum = params.scoreMaximum ? params.scoreMaximum : params.resultMaximum;

  score.activityProgress = params.activityProgress ? params.activityProgress : determineProgress(score.gradingProgress);
  logger.debug(`final score: ${score}`);
  return new SubmitGradeParams(score);
}

const determineProgress = (gradingProgress: string): any => {
  let activityProgress = gradingProgress == "NotReady" ? "InProgress" : "Completed";
  return activityProgress;
}

const submitGrade = async (aws_exports: any, params: any) => {
  const grades: SubmitGradeParams = buildScore(params);
  API.configure(aws_exports);
  const data = {
    headers: {
      'Content-Type': 'application/json'
    }, body: {
      params: grades,
      hash: getHash()
    }
  };
  logger.debug(`submitGrade results: ${data}`);
  const results = await API.post(LTI_API_NAME, PUT_STUDENT_GRADE, data);
  logger.debug(`submitGrade results: ${results}`);
  return results;
};

const submitInstructorGrade = async (
  aws_exports: any,
  params: any
) => {
  return submitGrade(aws_exports, params);
};

const getGrades = async (aws_exports: any, assignmentId: string) => {
  API.configure(aws_exports);
  const grades = await API.get(LTI_API_NAME,
    GET_GRADES, {
    queryStringParameters:
    {
      resourceId: assignmentId,
      hash: getHash()
    }
  });
  return grades;
};

const getGrade = async (aws_exports: any, assignmentId: string, userId: string) => {
  API.configure(aws_exports);
  const grades = await API.get(LTI_API_NAME,
    GET_GRADES, {
    queryStringParameters:
    {
      resourceId: assignmentId,
      userId: userId,
      hash: getHash()
    }
  });
  return grades;
};

export { submitGrade, getGrades, submitInstructorGrade, getGrade };
