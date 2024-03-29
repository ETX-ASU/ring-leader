import jwt from "jsonwebtoken";
import { Platform } from "../util/Platform";
import { Response } from "express";
import axios from "axios";
import { AxiosResponse } from "axios";
import {
  logger,
  MSG_CLAIM,
  CONTENT_ITEMS_CLAIM,
  ERROR_MSG_CLAIM,
  LOG_CLAIM,
  ERROR_LOG_CLAIM,
  DATA_CLAIM,
  DEEP_LINK_DISPLAY_BASE_URL,
  LTI_ASSIGNMENT_REDIRECT,
  APPLICATION_URL,
  DEEP_LINK_FORM_SUBMIT_SCRIPT
} from "@asu-etx/rl-shared";
import { isExpressionStatement } from "typescript";

const URL_ROOT = process.env.URL_ROOT ? process.env.URL_ROOT : "";

class DeepLinking {
  /**
   * @description Creates an auto submitting form containing the DeepLinking Message.
   * @param {Object} platform - contains all the parameters required for calling LTI Advantage Calls.
   * @param {Array} contentItems - Array of contentItems to be linked.
   * @param {Object} options - Object containing extra options that mus be sent along the content items.
   * @param {String} options.message - Message the platform may show to the end user upon return to the platform.
   * @param {String} options.errmessage - Message the platform may show to the end user upon return to the platform if some error has occurred.
   * @param {String} options.log - Message the platform may log in it's system upon return to the platform.
   * @param {String} options.errlog - Message the platform may log in it's system upon return to the platform if some error has occurred.
   */

  async createDeepLinkingForm(
    platform: Platform,
    contentItems: any,
    options: any
  ): Promise<any> {
    const message = await this.createDeepLinkingMessage(
      platform,
      contentItems,
      options
    ); // Creating auto submitting form
    logger.debug("message - " + message);
    logger.debug(
      " platform.deepLinkingSettings.deep_link_return_url - " +
      platform.deepLinkingSettings.deep_link_return_url
    );
    const form =
      '<form id="ltijs_submit" style="display: none;" action="' +
      platform.deepLinkingSettings.deep_link_return_url +
      '" method="POST">' +
      '<input type="hidden" name="JWT" value="' +
      message +
      '" />' +
      "</form>" + this.simpleSubmitScript();
    return form;
  }

  async postDeepLink(
    response: Response,
    platform: Platform,
    contentItems: any,
    options: any
  ): Promise<void> {
    const message = await this.createDeepLinkingMessage(
      platform,
      contentItems,
      options,
    ); // Creating auto submitting form
    const params = "JWT=" + message; //&${params}
    try {
      const axiosResponse: AxiosResponse = await axios.post(platform.deepLinkingSettings.deep_link_return_url, params);
      logger.debug("deep link post response data from consumer:" + JSON.stringify(axiosResponse.data));
      response.json(axiosResponse.data);
      logger.debug("deep link post response status from consumer:" + JSON.stringify(axiosResponse.status));

      response.status(axiosResponse.status);
    } catch (err) {
      logger.error("Unable to forward, returned error:" + JSON.stringify(err));
      throw Error("Unable to forward, returned error:" + JSON.stringify(err));
    }

  }

  simpleSubmitScript(): string {
    let script = "";
    switch (DEEP_LINK_FORM_SUBMIT_SCRIPT) {
      case "simple":
        script = '<script>document.getElementById("ltijs_submit").submit()</script>';
        break;
    }
    return script;
  }
  /**
   * @description Creates a DeepLinking signed message.
   * @param {Object} platform - contains all the parameters required for calling LTI Advantage Calls.
   * @param {Array} contentItems - Array of contentItems to be linked.
   * @param {Object} options - Object containing extra options that mus be sent along the content items.
   * @param {String} options.message - Message the platform may show to the end user upon return to the platform.
   * @param {String} options.errmessage - Message the platform may show to the end user upon return to the platform if some error has occurred.
   * @param {String} options.log - Message the platform may log in it's system upon return to the platform.
   * @param {String} options.errlog - Message the platform may log in it's system upon return to the platform if some error has occurred.
   */
  async createDeepLinkingMessage(
    platform: Platform,
    contentItems: any,
    options: any
  ): Promise<any> {
    if (!platform) {
      logger.debug("IdToken object missing.");
      throw new Error("MISSING_ID_TOKEN");
    }

    if (!platform.deepLinkingSettings) {
      logger.debug("DeepLinkingSettings object missing.");
      throw new Error("MISSING_DEEP_LINK_SETTINGS");
    }

    if (!contentItems) {
      logger.debug("No content item passed.");
      throw new Error("MISSING_CONTENT_ITEMS");
    } // If it's not an array, turns it into an array

    if (!Array.isArray(contentItems)) contentItems = [contentItems]; // Gets platform

    if (!platform) {
      logger.debug("Platform not found");
      throw new Error("PLATFORM_NOT_FOUND");
    }

    logger.debug("Building basic JWT body"); // Builds basic jwt body
    let now = Math.trunc(new Date().getTime() / 1000);

    const jwtBody: any = {
      iss: platform.aud,
      sub: platform.aud,
      aud: platform.iss,
      nonce: platform.nonce,
      locale: "en_US",
      "https://purl.imsglobal.org/spec/lti/claim/deployment_id": platform.deploymentId,
      "https://purl.imsglobal.org/spec/lti/claim/message_type": "LtiDeepLinkingResponse",
      "https://purl.imsglobal.org/spec/lti/claim/version": "1.3.0"
    }; // Adding messaging options

    if (options.message) jwtBody[MSG_CLAIM] = options.message;
    if (options.errmessage) jwtBody[ERROR_MSG_CLAIM] = options.errmessage;
    if (options.log) jwtBody[LOG_CLAIM] = options.log;
    if (options.errlog) jwtBody[ERROR_LOG_CLAIM] = options.errlog; // Adding Data claim if it exists in initial request

    if (platform.deepLinkingSettings.data)
      jwtBody[DATA_CLAIM] = platform.deepLinkingSettings.data;
    logger.debug(
      "Sanitizing content item array based on the platform's requirements:"
    );
    logger.debug("jwtBody-" + JSON.stringify(jwtBody));

    const selectedContentItems = [];
    const acceptedTypes = platform.deepLinkingSettings.accept_types;
    const acceptMultiple = !(
      platform.deepLinkingSettings.accept_multiple === "false" ||
      platform.deepLinkingSettings.accept_multiple === false
    );
    logger.debug("Accepted Types: " + acceptedTypes);
    logger.debug("Accepts Mutiple: " + acceptMultiple);
    logger.debug("Received content items: ");
    logger.debug(contentItems);
    //
    for (const contentItem of contentItems) {
      if (!acceptedTypes.includes(contentItem.type)) continue;
      if (!contentItem.url || !contentItem.url.trim().length) {
        //contentItem.url = `${DEEP_LINK_DISPLAY_BASE_URL ? DEEP_LINK_DISPLAY_BASE_URL : APPLICATION_URL}${URL_ROOT}${LTI_ASSIGNMENT_REDIRECT}?assignmentId=${contentItem.resourceId}`;
        contentItem.url = `${DEEP_LINK_DISPLAY_BASE_URL ? DEEP_LINK_DISPLAY_BASE_URL : APPLICATION_URL}${URL_ROOT}${LTI_ASSIGNMENT_REDIRECT}`;
        contentItem.custom = {};
        contentItem.custom.assignmentId = contentItem.resourceId;
        contentItem.custom.launchUri = platform.launchUri;
        contentItem.title = contentItem.label;

      }
      selectedContentItems.push(contentItem);
      if (!acceptMultiple) break;
    }

    logger.debug("Content items to be sent: ");
    logger.debug(JSON.stringify(selectedContentItems));
    jwtBody[CONTENT_ITEMS_CLAIM] = selectedContentItems;
    const message = await jwt.sign(jwtBody, platform.platformPrivateKey, {
      expiresIn: 60,
      algorithm: platform.alg,
      keyid: platform.kid
    });
    return message;
  }
}

export { DeepLinking };
