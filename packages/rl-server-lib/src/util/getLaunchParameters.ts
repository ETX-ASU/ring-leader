import { getToolConsumer } from "../services/ToolConsumerService";
import { getRedirectToken } from "./externalRedirect";
import { Session } from "../database/entity/Session";
import crypto from "crypto";
import { logger } from "@asu-etx/rl-shared";
const getLaunchParameters = async (req: any, role: any) => {
  const platform = req.session.platform;
  const userId = platform.userId;
  const courseId = platform.context_id;
  const resourceLinkId = req.query.assignmentId ? req.query.assignmentId : platform.resourceLinkId;
  const lineItemId = platform.lineitem;
  const findConsumer = {
    iss: platform.iss,
    client_id: platform.clientId,
    deployment_id: platform.deploymentId
  };
  if (!role) {
    if (platform.isInstructor) {
      role = "instructor";
    } else {
      role = "learner";
    }
  }
  const id = userId + role + courseId + resourceLinkId + platform.iss + platform.clientId + platform.deploymentId + lineItemId ? lineItemId : "";
  logger.debug("id used for launch hash: " + JSON.stringify(id))
  const sessionId = crypto.createHash('sha256').update(JSON.stringify(id)).digest('base64');
  console.log(`attempting to find consumerTool with following values: ${JSON.stringify(findConsumer)}`);
  const toolConsumer = getToolConsumer(findConsumer);
  let hash = "";
  if (toolConsumer) {
    hash = getRedirectToken(toolConsumer, sessionId);
  } else {
    throw new Error(`unable to find consumer tool: ${toolConsumer}`);
  }
  console.log(`this is hash: ${JSON.stringify(hash)}`);
  let session = {};
  try {
    const session = new Session();
    console.log(`attempting to find consumerTool with following values: ${JSON.stringify(findConsumer)}`);

    session.sessionId = sessionId;
    session.session = JSON.stringify(req.session);
    await Session.writer.put(session);
    await session.save();
    console.log(`session added : ${JSON.stringify(session)}`);
  } catch (err) {
    console.log(`session failed: ${JSON.stringify(err)}`);
    console.log(`session failed value : ${JSON.stringify(session)}`);
  }


  //example const params = `userId=user-id-uncle-bob&courseId=the-course-id-123a&assignmentId=4c43a1b5-e5db-4b3e-ae32-a9405927e472`
  if (resourceLinkId !== courseId)
    return `/assignment?role=${role}&userId=${userId}&courseId=${courseId}&assignmentId=${resourceLinkId}&lineItemId=${lineItemId}&hash=${hash}`
  return `?role=${role}&userId=${userId}&courseId=${courseId}&hash=${hash}`
};

export default getLaunchParameters;