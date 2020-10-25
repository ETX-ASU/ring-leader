import SubmitAssignment from "../model/SubmitAssignment"
import axios from "axios";
import { ROSTER_ENDPOINT, GET_ASSIGNMENT_ENDPOINT, CREATE_ASSIGNMENT_ENDPOINT, logger } from "@asu-etx/rl-shared";

const createAssignment = async (submission: SubmitAssignment): Promise<any> => {
  logger.debug(`hitting endpoint POST:${CREATE_ASSIGNMENT_ENDPOINT}`);

  const results = await axios
    .post(CREATE_ASSIGNMENT_ENDPOINT, {
      params: submission
    })
    .then((results) => {
      logger.debug(JSON.stringify(results.data));
      return results.data;
    });

  return results;
};

export { createAssignment };