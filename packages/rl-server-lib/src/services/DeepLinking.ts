import { generateUniqueString } from "../util/generateUniqueString";
import jwt from "jsonwebtoken";

class DeepLinking {
  async createDeepLinkingForm(
    idtoken: any,
    contentItems: any,
    options: any
  ): Promise<any> {
    const message = await this.createDeepLinkingMessage(
      idtoken,
      contentItems,
      options
    ); // Creating auto submitting form

    const form =
      '<form id="ltijs_submit" style="display: none;" action="' +
      idtoken.platformContext.deepLinkingSettings.deep_link_return_url +
      '" method="POST">' +
      '<input type="hidden" name="JWT" value="' +
      message +
      '" />' +
      "</form>" +
      "<script>" +
      'document.getElementById("ltijs_submit").submit()' +
      "</script>";
    return form;
  }

  async createDeepLinkingMessage(
    idtoken: any,
    contentItems: any,
    options: any
  ): Promise<any> {
    if (!idtoken) {
      console.log("IdToken object missing.");
      throw new Error("MISSING_ID_TOKEN");
    }

    if (!idtoken.platformContext.deepLinkingSettings) {
      console.log("DeepLinkingSettings object missing.");
      throw new Error("MISSING_DEEP_LINK_SETTINGS");
    }

    if (!contentItems) {
      console.log("No content item passed.");
      throw new Error("MISSING_CONTENT_ITEMS");
    } // If it's not an array, turns it into an array

    if (!Array.isArray(contentItems)) contentItems = [contentItems]; // Gets platform

    //we will replace this with actual data
    const platform = {
      platformClientId: "",
      platformKid: "",
      platformPrivateKey: ""
    };

    if (!platform) {
      console.log("Platform not found");
      throw new Error("PLATFORM_NOT_FOUND");
    }

    console.log("Building basic JWT body"); // Builds basic jwt body

    const jwtBody: any = {
      iss: platform.platformClientId,
      aud: idtoken.iss,
      iat: Date.now() / 1000,
      exp: Date.now() / 1000 + 60,
      nonce: generateUniqueString(25, false),
      "https://purl.imsglobal.org/spec/lti/claim/deployment_id":
        idtoken.deploymentId,
      "https://purl.imsglobal.org/spec/lti/claim/message_type":
        "LtiDeepLinkingResponse",
      "https://purl.imsglobal.org/spec/lti/claim/version": "1.3.0"
    }; // Adding messaging options

    if (options.message)
      jwtBody["https://purl.imsglobal.org/spec/lti-dl/claim/msg"] =
        options.message;
    if (options.errmessage)
      jwtBody["https://purl.imsglobal.org/spec/lti-dl/claim/errormsg "] =
        options.errmessage;
    if (options.log)
      jwtBody["https://purl.imsglobal.org/spec/lti-dl/claim/log"] = options.log;
    if (options.errlog)
      jwtBody["https://purl.imsglobal.org/spec/lti-dl/claim/errorlog"] =
        options.errlog; // Adding Data claim if it exists in initial request

    if (idtoken.platformContext.deepLinkingSettings.data)
      jwtBody["https://purl.imsglobal.org/spec/lti-dl/claim/data"] =
        idtoken.platformContext.deepLinkingSettings.data;
    console.log(
      "Sanitizing content item array based on the platform's requirements:"
    );
    const selectedContentItems = [];
    const acceptedTypes =
      idtoken.platformContext.deepLinkingSettings.accept_types;
    const acceptMultiple = !(
      idtoken.platformContext.deepLinkingSettings.accept_multiple === "false" ||
      idtoken.platformContext.deepLinkingSettings.accept_multiple === false
    );
    console.log("Accepted Types: " + acceptedTypes);
    console.log("Accepts Mutiple: " + acceptMultiple);
    console.log("Received content items: ");
    console.log(contentItems);

    for (const contentItem of contentItems) {
      if (!acceptedTypes.includes(contentItem.type)) continue;
      selectedContentItems.push(contentItem);
      if (!acceptMultiple) break;
    }

    console.log("Content items to be sent: ");
    console.log(selectedContentItems);
    jwtBody[
      "https://purl.imsglobal.org/spec/lti-dl/claim/content_items"
    ] = selectedContentItems;
    const message = jwt.sign(jwtBody, platform.platformPrivateKey, {
      algorithm: "RS256",
      keyid: platform.platformKid
    });
    return message;
  }
}

module.exports = DeepLinking;
