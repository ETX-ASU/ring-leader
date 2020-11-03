import { Express } from "express";
import { requestLogger, Grade } from "@asu-etx/rl-server-lib";
import { createAssignment } from "../../../rl-tool-example-server/src/services/AssignmentService";
import Assignment from "@asu-etx/rl-shared/src/model/Assignment";
import getDeepLinkItems from "../util/getDeepLinkItems"
import {
  APPLICATION_URL,
  CREATE_ASSIGNMENT_ENDPOINT,
  GET_ASSIGNMENT_ENDPOINT,
  LTI_ASSIGNMENT_REDIRECT,
  DEEP_LINK_RESOURCELINKS_ENDPOINT,
  logger
} from "@asu-etx/rl-shared";

const rlLtiServiceExpressEndpoints = (app: Express): void => {
  app.get(DEEP_LINK_RESOURCELINKS_ENDPOINT, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error(
       `${DEEP_LINK_RESOURCELINKS_ENDPOINT}: no session detected, something is wrong`
     );
    }
    const platform: any = req.session.platform;
    const items = await getDeepLinkItems(
      DEEP_LINK_RESOURCELINKS_ENDPOINT,
      platform
    );
    logger.debug("deeplink - resource-link-items - " + JSON.stringify(items));

    return res.send(items);
  });

  app.post(CREATE_ASSIGNMENT_ENDPOINT, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    logger.debug(
      "CREATE_ASSIGNMENT_ENDPOINT" + JSON.stringify(CREATE_ASSIGNMENT_ENDPOINT)
    );

    logger.debug(
      `CREATE_ASSIGNMENT_ENDPOINT session: ${JSON.stringify(req.session)}`
    );
    const platform: any = req.session.platform;
    const reqQueryString = req.body.params;

    //external_tool_url - Tool needs to pass this URL that will be launched when student
    //clicks on the assignment.
    //resourceId - this id is passed from platform to the tool so that the tool can
    //identify the correct content that needs to be displayed

    if (reqQueryString) {
      logger.debug(
        "Create Assignment - reqQueryString" + JSON.stringify(reqQueryString)
      );

      const assignment: Assignment = new Assignment();
      assignment.url = `${APPLICATION_URL}${LTI_ASSIGNMENT_REDIRECT.substring(
        1
      )}?resourceId=${reqQueryString.resourceId}`;
      assignment.title = reqQueryString.label;
      assignment.resource_id = reqQueryString.resourceId;
      assignment.lineitem_label = reqQueryString.label;
      assignment.lineitem_resource_id = reqQueryString.resourceId;
      assignment.lineitem_tag = reqQueryString.tag;
      assignment.lineitem_score_maximum = reqQueryString.scoreMaximum;
      assignment.type = "ltiResourceLink";
      assignment.lineitems = platform.lineitems;
      assignment.context_id = platform.context_id;
      const results = createAssignment(assignment);
      logger.debug(
        "Create Assignment - send results-" + JSON.stringify(results)
      );
      res.send(results);
    }
  });

  app.get(GET_ASSIGNMENT_ENDPOINT, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const platform: any = req.session.platform;
    logger.debug(`get assignments - platform - ${JSON.stringify(platform)}`);

    const results = await new Grade().getLineItems(platform);
    logger.debug(`Get assignments - send results - ${JSON.stringify(results)}`);
    res.send(results);
  });
};

export default rlLtiServiceExpressEndpoints;
