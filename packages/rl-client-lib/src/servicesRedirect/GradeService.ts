
import axios from "axios";
import {
  PUT_STUDENT_GRADE,
  GET_GRADES,
  logger,
  SubmitGradeParams,
  InstructorSubmitGradeParams
} from "@asu-etx/rl-shared";

import {getHash} from '../utils/hashUtils';

const submitGrade = async (params: SubmitGradeParams): Promise<any> => {
  const results = await axios
    .post(PUT_STUDENT_GRADE, {
      params: params,
      hash: getHash()
    })
    .then((results) => {
      logger.debug(
        `PUT_STUDENT_GRADE: ${PUT_STUDENT_GRADE}, results: ${JSON.stringify(
          results.data
        )}`
      );
      return results.data;
    });
  return results;
};

const submitInstructorGrade = async (params: InstructorSubmitGradeParams): Promise<any> => {
  const results = await axios
    .post(PUT_STUDENT_GRADE, {
      params: params,
      hash: getHash()
    })
    .then((results) => {
      logger.debug(
        `PUT_STUDENT_GRADE: ${PUT_STUDENT_GRADE}, results: ${JSON.stringify(
          results.data
        )}`
      );
      return results.data;
    });
  return results;
};

const getGrades = (assignmentId: string): Promise<any> => {
  const grades = axios
    .get(GET_GRADES, {
      params: {
        lineItemId: assignmentId,
        hash: getHash()
      }
    })
    .then((results) => {
      logger.debug(JSON.stringify(results.data));
      return results.data;
    });
  return grades;
};


const getGrade = (assignmentId: string, userId: string): Promise<any> => {
  const grades = axios
    .get(GET_GRADES, {
      params: {
        lineItemId: assignmentId,
        userId: userId,
        hash: getHash()
      }
    })
    .then((results) => {
      logger.debug(JSON.stringify(results.data));
      return results.data;
    });
  return grades;
};

export { submitGrade, getGrades, submitInstructorGrade, getGrade };
