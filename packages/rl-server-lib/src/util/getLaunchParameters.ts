import { getToolConsumer } from "../services/ToolConsumerService";
import { getRedirectToken } from "./externalRedirect";
import { Session } from "../database/entity/Session";
import crypto from "crypto";
import { SESSION_TTL, logger } from "@asu-etx/rl-shared";
const getLaunchParameters = async (req: any, role: any): Promise<LaunchParams> => {
  const platform = req.session.platform;
  const userId = platform.userId;
  const courseId = platform.context_id;
  const assignmentId = req.query.assignmentId;
  const resourceLinkId = platform.resourceLinkId;
  let lineItemId = platform.lineitem;
  if (!lineItemId) {
    if (platform.lineitems) {
      lineItemId = JSON.stringify(platform.lineitems);
    } else {
      lineItemId = "";
    }
  }
  const findConsumer = {
    iss: platform.iss,
    client_id: platform.clientId,
    deployment_id: platform.deploymentId
  };

  if (platform.isInstructor) {
    role = "instructor";
  } else if (platform.isStudent) {
    role = "learner";
  } else {
    role = "unknown";
  }

  let id = userId;
  logger.debug("id with userId: " + JSON.stringify(id));
  id += role;
  logger.debug("id with userId + role: " + JSON.stringify(id));
  id += courseId;
  logger.debug("id with userId + role + courseId: " + JSON.stringify(id));
  id += resourceLinkId;
  logger.debug("id with userId + role + courseId + resourceLinkId: " + JSON.stringify(id));
  id += platform.iss;
  logger.debug("id with userId + role + courseId + resourceLinkId + platform.iss: " + JSON.stringify(id));
  id += platform.clientId;
  logger.debug("id with userId + role + courseId + resourceLinkId + iss + clientId: " + JSON.stringify(id));
  id += platform.deploymentId;
  logger.debug("id with userId + role + courseId + resourceLinkId + iss + clientId + deploymentId: " + JSON.stringify(id));
  id += lineItemId;
  logger.debug("id with userId + role + courseId + resourceLinkId + iss + clientId + deploymentId + lineItemId: " + JSON.stringify(id));
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
    session.modifiedOn = Math.round(Date.now() / 1000);
    session.ttl = session.modifiedOn + Number(SESSION_TTL);
    await Session.writer.put(session);
    await session.save();
    console.log(`session added : ${JSON.stringify(session)}`);
  } catch (err) {
    console.log(`session failed: ${JSON.stringify(err)}`);
    console.log(`session failed value : ${JSON.stringify(session)}`);
  }

  const launchInfo: any = {};

  launchInfo.toolApplicationUrl = toolConsumer.toolApplicationUrl;
  //example const params = `userId=user-id-uncle-bob&courseId=the-course-id-123a&assignmentId=4c43a1b5-e5db-4b3e-ae32-a9405927e472`
  if (assignmentId && assignmentId != "undefined") {
    launchInfo.params = `?role=${role}&userId=${userId}&courseId=${courseId}&assignmentId=${assignmentId}&resourceLinkId=${resourceLinkId}&lineItemId=${lineItemId}&hash=${hash}`
  } else {
    launchInfo.params = `?role=${role}&userId=${userId}&courseId=${courseId}&resourceLinkId=${resourceLinkId}&hash=${hash}`
  }
  return launchInfo;
};

export default getLaunchParameters;