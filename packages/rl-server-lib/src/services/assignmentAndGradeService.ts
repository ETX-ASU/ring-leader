// eslint-disable-next-line node/no-extraneous-import
import got from "got";
import axios from "axios";
import parseLink = require("parse-link-header")
import { Platform } from "../util/Platform";
import { getAccessToken } from "../util/auth";
import { Options } from "../util/Options";
import {
  logger,
  SCORE_CLAIM,
  LINE_ITEM_CLAIM,
  LINE_ITEM_READ_ONLY_CLAIM,
  RESULT_CLAIM,
  SubmitGradeParams,
  ResultScore
} from "@asu-etx/rl-shared";

class Grade {
  /**
   * @description Gets lineitems from a given platform
   * @param {Object} platform - contains all the parameters required for calling LTI Advantage Calls.
   * @param {Object} [options] - Options object
   * @param {Boolean} [options.resourceLinkId = false] - Filters line items based on the resourceLinkId of the resource that originated the request
   * @param {String} [options.resourceId = false] - Filters line items based on the resourceId
   * @param {String} [options.tag = false] - Filters line items based on the tag
   * @param {Number} [options.limit = false] - Sets a maximum number of line items to be returned
   * @param {String} [options.id = false] - Filters line items based on the id
   * @param {String} [options.label = false] - Filters line items based on the label
   */
  //TODO fix logic allow for both lineItemId and resouceLinkId
  async getLineItems(
    platform: Platform,
    options?: Options,
    accessToken?: any
  ): Promise<any> {
    if (!platform) {
      throw new Error("MISSING_ID_TOKEN");
    }
    logger.debug(`platform for get line items: ${JSON.stringify(platform)}`);
    if (!accessToken) {
      logger.debug("Access token blank - get new token");
      accessToken = await getAccessToken(platform, LINE_ITEM_READ_ONLY_CLAIM);
    }
    if (accessToken) {
      let lineitemsEndpoint = platform.lineitems;
      let query: any = [];

      if (lineitemsEndpoint.indexOf("?") !== -1) {
        lineitemsEndpoint = lineitemsEndpoint.split("?")[0];
        let params = lineitemsEndpoint.split("?")[1].split("&");
        if (params.length > 1) {
          if (!query) {
            query = []
          }
          lineitemsEndpoint = params[0];
          params = params[1].split("=");
          for (let i = 0; i < params.length; i++) {
            query.push([params[i], params[++i]]);
          }
        }
      }


      if (options) {
        if (options.resourceLinkId)
          query.push("resource_link_id", platform.resourceLinkId);
        if (options.limit && !options.id && !options.label)
          query.push("limit", options.limit);
        if (options.tag)
          query.push("tag", options.tag);
        if (options.resourceId)
          query.push("resource_id", options.resourceId);
      }
      if (query) {
        logger.debug(`namesandrolesqueryparams: ${JSON.stringify(query)}`);
        query = new URLSearchParams(query);
      }
      logger.debug("getlines - queryParams-" + JSON.stringify(query));
      logger.debug("lineitemsEndpoint - " + lineitemsEndpoint);
      let lineItems: any;
      let curPage = 1;
      let next: any = lineitemsEndpoint;
      do {
        let response: any;
        if (query && curPage === 1) {
          response = await got
            .get(lineitemsEndpoint, {
              searchParams: query,
              headers: {
                Authorization:
                  accessToken.token_type + " " + accessToken.access_token,
                Accept: "application/vnd.ims.lis.v2.lineitemcontainer+json"
              }
            })
        } else {
          logger.debug("more loops get call inside else loop");
          response = await got.get(next, {
            headers: {
              Authorization:
                accessToken.token_type + " " + accessToken.access_token,
              Accept: "application/vnd.ims.lis.v2.lineitemcontainer+json"
            }
          });
        }
        logger.debug("LTI advantage call successfull");
        const headers = response.headers;
        const body = JSON.parse(response.body);
        logger.debug("GET lineitems response" + JSON.stringify(body));
        if (!lineItems) {
          lineItems = body;
        } else {
          lineItems = lineItems.concat(body);
        }
        logger.debug("headers.link: " + JSON.stringify(headers.link));
        const parsedLinks = headers.link ? parseLink(headers.link) : {}; // Trying to find "rel=differences" header
        logger.debug("parsedLinks " + JSON.stringify(parsedLinks));
        next = false;
        if (parsedLinks && parsedLinks.next) {
          next = parsedLinks.next.url;
        } else {
          next = false;
        }
        curPage++;
      } while (next);

      logger.debug("lineItems retreived - " + JSON.stringify(lineItems));

      if (options && options.id)
        lineItems = lineItems.filter((lineitem: any) => {
          return lineitem.id === options.id;
        });
      if (options && !options.id && options.title)
        lineItems = lineItems.filter((lineitem: any) => {
          return lineitem.label === options.title;
        });
      if (options && options.label)
        lineItems = lineItems.filter((lineitem: any) => {
          return lineitem.label === options.label;
        });
      if (
        options &&
        options.limit &&
        (options.id || options.label) &&
        options.limit < lineItems.length
      )
        lineItems = lineItems.slice(0, options.limit);
      return lineItems;
    }
  }
  /**
   * @description Creates a new lineItem for the given context
   * @param {Object} platform - contains all the parameters required for calling LTI Advantage Calls.
   * @param {Object} lineItem - LineItem Object, following the application/vnd.ims.lis.v2.lineitem+json specification
   * @param {Object} [options] - Aditional configuration for the lineItem
   * @param {Boolean} [options.resourceLinkId = false] - If set to true, binds the created lineItem to the resource that originated the request
   */

  async createLineItem(
    platform: Platform,
    lineItem: any,
    options?: any,
    accessToken?: any
  ): Promise<any> {
    logger.debug("Inside createLineItem");

    // Validating lineItem
    if (!platform) {
      throw new Error("MISSING_ID_TOKEN");
    }

    if (!lineItem) {
      throw new Error("MISSING_LINE_ITEM");
    }
    if (!accessToken) {
      accessToken = await getAccessToken(platform, LINE_ITEM_CLAIM);
    }
    logger.debug("access token retrived inside createLineItem");
    logger.debug(JSON.stringify(options));

    if (options && options.resourceLinkId)
      lineItem.resourceLinkId = platform.resourceLinkId;

    const lineitemsEndpoint = platform.lineitems;

    logger.debug("lineitemsEndpoint - " + lineitemsEndpoint);
    logger.debug("lineItem - " + JSON.stringify(lineItem));
    try {
      const newLineItem = await got
        .post(lineitemsEndpoint, {
          headers: {
            Authorization:
              accessToken.token_type + " " + accessToken.access_token,
            "Content-Type": "application/vnd.ims.lis.v2.lineitem+json",
            Accept: "application/vnd.ims.lis.v2.lineitem+json"
          },
          json: lineItem
        })
        .json();
      logger.debug(`Line item successfully created: ${lineItem}`);
      return newLineItem;
    } catch (err) {
      logger.debug(err);
    }
    logger.debug("Line item creation was unsuccessful");
    return null;
  }
  /**
   * @description Publishes a score or grade to a platform. Represents the Score Publish service described in the lti 1.3 specification
   * @param {Object} platform - contains all the parameters required for calling LTI Advantage Calls.
   * @param {Object} score - Score/Grade following the Lti Standard application/vnd.ims.lis.v1.score+json
   * @param {Object} [options] - Options object
   * @param {Object} [options.autoCreate] - Line item that will be created automatically if it does not exist
   * @param {String} [options.userId = false] - Send score to a specific user. If no userId is provided, the score is sent to the user that initiated the request
   * @param {Boolean} [options.resourceLinkId = true] - Filters line items based on the resourceLinkId of the resource that originated the request. Defaults to true
   * @param {String} [options.resourceId = false] - Filters line items based on the resourceId
   * @param {String} [options.tag = false] - Filters line items based on the tag
   * @param {Number} [options.limit = false] - Sets a maximum number of line items to be reached
   * @param {String} [options.id = false] - Filters line items based on the id
   * @param {String} [options.label = false] - Filters line items based on the label
   */

  async putGrade(
    platform: Platform,
    score: SubmitGradeParams,
    options?: Options
  ): Promise<any> {
    if (!platform) {
      throw new Error("MISSING_ID_TOKEN");
    }

    if (!score) {
      throw new Error("MISSING_SCORE");
    }

    if (!platform) {
      throw new Error("PLATFORM_NOT_FOUND");
    }
    logger.debug("put grades - options - " + JSON.stringify(options));

    if (options) {
      if (options.resourceLinkId === false) options.resourceLinkId = false;
    }

    const lineItems: any = await this.getLineItems(platform, options);

    logger.debug("Inside PutGrades - lineItems - " + JSON.stringify(lineItems));
    const result: any = {
      success: [],
      failure: []
    };
    let currentLineItem = platform.lineitem;

    if (lineItems.length === 0) {
      if (options && options.autoCreate) {
        currentLineItem = await this.createLineItem(
          platform,
          options.autoCreate,
          {
            resourceLinkId: options.resourceLinkId
          }
        )
        lineItems.push(
          currentLineItem
        );
      }
    }

    const accessToken: any = await getAccessToken(
      platform,
      `${LINE_ITEM_CLAIM} ${SCORE_CLAIM}`
    );

    for (const lineitem of lineItems) {
      try {
        logger.debug("Inside putGrade lineitem found - " + JSON.stringify(lineitem));
        if (!currentLineItem || currentLineItem != lineitem.id)
          continue;
        const lineitemUrl = lineitem.id;
        let scoreUrl = lineitemUrl + "/scores";

        if (lineitemUrl.indexOf("?") !== -1) {
          const query = lineitemUrl.split("?")[1];
          const url = lineitemUrl.split("?")[0];
          scoreUrl = url + "/scores?" + query;
        }

        if (options && options.userId) score.userId = options.userId;
        else if (!score.userId) score.userId = platform.userId;

        logger.debug("score.userId - " + score.userId);

        score.timestamp = score.timestamp ? score.timestamp : new Date(Date.now()).toISOString();
        score.scoreMaximum = score.scoreMaximum ? score.scoreMaximum : lineitem.scoreMaximum;
        logger.debug(
          "Inside PutGrades - scoreUrl - " + JSON.stringify(scoreUrl)
        );
        logger.debug("score - " + JSON.stringify(score));

        const res = await axios.post(scoreUrl, score, {
          headers: {
            Authorization:
              accessToken.token_type + " " + accessToken.access_token,
            "Content-Type": "application/vnd.ims.lis.v1.score+json",
            "Accept": "application/vnd.ims.lis.v1.score+json"
          },
        });

        logger.debug("Score successfully sent");
        result.success.push({
          lineitem: lineitemUrl
        });
        logger.debug("Inside PutGrades - scoreUrl - " + JSON.stringify(result));
      } catch (err) {
        logger.debug(
          "Inside PutGrades - err.message - " + JSON.stringify(err.message)
        );

        logger.debug("Inside PutGrades - err - " + JSON.stringify(err));
        result.failure.push({
          lineitem: lineitem.id,
          error: err.message
        });
        continue;
      }
    }

    return result;
  }
  /**
   * @description Retrieves a certain lineitem's results. Represents the Result service described in the lti 1.3 specification
   * @param {Object} platform - contains all the parameters required for calling LTI Advantage Calls.
   * @param {Object} [options] - Options object
   * @param {String} [options.userId = false] - Filters based on the userId
   * @param {Boolean} [options.resourceLinkId = true] - Filters line items based on the resourceLinkId of the resource that originated the request. Defaults to true
   * @param {String} [options.resourceId = false] - Filters line items based on the resourceId
   * @param {String} [options.tag = false] - Filters line items based on the tag
   * @param {Number} [options.limit = false] - Sets a maximum number of results to be returned per line item
   * @param {String} [options.id = false] - Filters line items based on the id
   * @param {String} [options.label = false] - Filters line items based on the label
   */

  async getGrades(platform: Platform, options?: Options): Promise<any> {
    if (!platform) {
      throw new Error("PLATFORM_NOT_FOUND");
    }
    //we will change this when go for actual implementation


    let limit: any = false;

    if (options) {
      if (options.resourceLinkId === false) options.resourceLinkId = false;
      else options.resourceLinkId = true;
      if (options.resourceId) options.resourceId = undefined;
      if (options.limit) {
        limit = options.limit;
        options.limit = false;
      }
    }
    let lineItems = []
    lineItems = await this.getLineItems(platform, options);
    const currentLineItem = platform.lineitem;
    logger.debug(`Inside GetGrades - line item in platform: ${platform.lineitem}`);
    logger.debug(`Inside GetGrades - platform: ${JSON.stringify(platform)}`);

    if (lineItems && lineItems.length <= 0) {
      lineItems = [platform.lineitem];
    }
    const query: any = {};

    if (options) {
      if (limit) query.limit = limit;
    }

    const resultsArray = [];
    const accessToken = await getAccessToken(
      platform,
      `${LINE_ITEM_READ_ONLY_CLAIM} ${RESULT_CLAIM}`
    );

    for (const lineitem of lineItems) {
      try {
        let lineitemUrl = "";
        logger.debug(`currentLineItem: ${currentLineItem} lineitem.id: ${lineitem.id}`);
        if (currentLineItem && currentLineItem != lineitem.id)
          continue;
        if (lineitem.id)
          lineitemUrl = lineitem.id
        lineitemUrl = lineitemUrl + "/results";
        if (options) {
          if (options.userId) query.user_id = options.userId;
        }
        logger.debug("Inside GetGrades - queryparam - " + JSON.stringify(query));
        logger.debug("Inside GetGrades - lineitemUrl - " + JSON.stringify(lineitemUrl));
        const response = await axios
          .get(lineitemUrl, {
            headers: {
              Authorization:
                accessToken.token_type + " " + accessToken.access_token,
              Accept: "application/vnd.ims.lis.v2.resultcontainer+json",
              ContentType: "application/vnd.ims.lis.v2.resultcontainer+json"
            }
          });

        const body = response.data;
        logger.debug("Inside GetGrades - status - " + JSON.stringify(response.status));
        logger.debug("Inside GetGrades - body - " + JSON.stringify(body));

        resultsArray.push({
          lineitem: lineitem.id,
          results: body
        });
      } catch (err) {
        resultsArray.push({
          lineitem: lineitem.id,
          error: err.message
        });
        continue;
      }
    }

    return resultsArray;
  }
  /**
   * @description Deletes lineitems from a given platform
   * @param {Object} idtoken - Idtoken for the user
   * @param {Object} [options] - Options object
   * @param {Boolean} [options.resourceLinkId = false] - Filters line items based on the resourceLinkId of the resource that originated the request
   * @param {String} [options.id = false] - Filters line items based on the id
   */

  async deleteLineItems(platform: Platform, options?: Options): Promise<any> {
    if (!platform) {
      throw new Error("MISSING_ID_TOKEN");
    }
    if (!platform) {
      throw new Error("PLATFORM_NOT_FOUND");
    }

    const accessToken = await getAccessToken(platform, LINE_ITEM_CLAIM);
    const lineItems = await this.getLineItems(platform, options, accessToken);
    logger.debug("delete line item - lineItems" + JSON.stringify(lineItems));

    const result: any = {
      success: [],
      failure: []
    };

    for (const lineitem of lineItems) {
      try {
        const lineitemUrl = lineitem.id;
        await axios.delete(lineitemUrl, {
          headers: {
            Authorization:
              accessToken.token_type + " " + accessToken.access_token
          }
        });
        result.success.push({
          lineitem: lineitemUrl
        });
      } catch (err) {
        logger.debug(err);
        result.failure.push({
          lineitem: lineitem.id,
          error: err.message
        });
        continue;
      }
    }

    return result;
  }
}
export { Grade };
