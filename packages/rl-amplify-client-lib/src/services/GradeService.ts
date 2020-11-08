import API from "@aws-amplify/api";
API.configure();
import {
  PUT_STUDENT_GRADE,
  GET_GRADES,
  logger,
  SubmitGradeParams,
  InstructorSubmitGradeParams,
  LTI_API_NAME
} from "@asu-etx/rl-shared";

const submitGrade = async (params: SubmitGradeParams): Promise<any> => {
  const data = {
    params: params
  };
  const results = await API.post(LTI_API_NAME, PUT_STUDENT_GRADE, data);
  logger.debug(`submitGrade: ${results}`);
  return results;
};

const submitInstructorGrade = async (
  params: InstructorSubmitGradeParams
): Promise<any> => {
  const data = {
    params: params
  };
  const results = await API.post(LTI_API_NAME, PUT_STUDENT_GRADE, data);
  return results;
};

const getGrades = async (assignmentId: string): Promise<any> => {
  const grades = await API.get(LTI_API_NAME, GET_GRADES, {
    lineItemId: assignmentId
  });
  return grades;
};

export { submitGrade, getGrades, submitInstructorGrade };
