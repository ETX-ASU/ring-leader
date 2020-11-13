import API from "@aws-amplify/api";
import {
  PUT_STUDENT_GRADE,
  GET_GRADES,
  logger,
  LTI_API_NAME
} from "@asu-etx/rl-shared";
import {getHash, startParamsWithHash} from '../utils/hashUtils';

const submitGrade = async (params: any) => {
  const data = {
    params: params,
    hash: getHash()
  };
  const results = await API.post(LTI_API_NAME, PUT_STUDENT_GRADE, data);
  logger.debug(`submitGrade: ${results}`);
  return results;
};

const submitInstructorGrade = async (
  params: any
) => {
  const data = {
    params: params,
    hash: getHash()
  };
  const results = await API.post(LTI_API_NAME, PUT_STUDENT_GRADE, data);
  return results;
};

const getGrades = async (assignmentId: string) => {
  const grades = await API.get(LTI_API_NAME, 
    `${GET_GRADES}`, null);
  return grades;
  };

export { submitGrade, getGrades, submitInstructorGrade };
