import API from "@aws-amplify/api";
import {
  PUT_STUDENT_GRADE,
  GET_GRADES,
  logger,
  LTI_API_NAME
} from "@asu-etx/rl-shared";
import {getHash, startParamsWithHash} from '../utils/hashUtils';
//import aws_exports from '../aws-exports'

const submitGrade = async (aws_exports:any, params: any) => {
  API.configure(aws_exports);
  const data = {
    params: params
  };
  const results = await API.post(LTI_API_NAME, PUT_STUDENT_GRADE, data);
  logger.debug(`submitGrade: ${results}`);
  return results;
};

const submitInstructorGrade = async (
  aws_exports:any,
  params: any
) => {
  API.configure(aws_exports);
  const data = {
    params: params
  };
  const results = await API.post(LTI_API_NAME, PUT_STUDENT_GRADE, data);
  return results;
};

const getGrades = async (aws_exports:any, assignmentId: string) => {
  API.configure(aws_exports);
  const grades = await API.get(LTI_API_NAME, 
    `${GET_GRADES}`, null);
  return grades;
  };

export { submitGrade, getGrades, submitInstructorGrade };
