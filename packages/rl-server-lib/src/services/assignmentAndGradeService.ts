// eslint-disable-next-line node/no-extraneous-import
import axios from "axios";
import got from "got";
import { Score } from "../util/Score";
import { Platform } from "../util/Platform";
import { getAccessToken } from "../util/auth";
import { Options } from "../util/Options";
import {
  logger,
  SCORE_CLAIM,
  LINE_ITEM_CLAIM,
  LINE_ITEM_READ_ONLY_CLAIM,
  RESULT_CLAIM
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
        query = Array.from(
          new URLSearchParams(lineitemsEndpoint.split("?")[1])
        );
        lineitemsEndpoint = lineitemsEndpoint.split("?")[0];
      }

      const queryParams : any = {};
      if (options) {
        if (options.resourceLinkId)
          queryParams.resource_link_id =platform.resourceLinkId;
        if (options.limit && !options.id && !options.label)
          queryParams.limit =options.limit;
        if (options.tag) 
          queryParams.tag = options.tag;
        if (options.resourceId)
          queryParams.resource_id = options.resourceId;
      }
      logger.debug("getlines - queryParams-" + JSON.stringify(queryParams));
      logger.debug("lineitemsEndpoint - " + lineitemsEndpoint);

      let results: any = await axios
        .get(lineitemsEndpoint, {
          params: queryParams,
          headers: {
            Authorization:
              accessToken.token_type + " " + accessToken.access_token,
            Accept: "application/vnd.ims.lis.v2.lineitemcontainer+json"
          }
        })
      let lineItems: any =  results.data;
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
    score: Score,
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
    const accessToken: any = await getAccessToken(
      platform,
      `${LINE_ITEM_CLAIM} ${SCORE_CLAIM}`
    );
    const lineItems: any = await this.getLineItems(platform, options);

    logger.debug("Inside PutGrades - lineItems - " + JSON.stringify(lineItems));
    const result: any = {
      success: [],
      failure: []
    };

    if (lineItems.length === 0) {
      if (options && options.autoCreate) {
        lineItems.push(
          await this.createLineItem(
            platform,
            options.autoCreate,
            {
              resourceLinkId: options.resourceLinkId
            },
            accessToken
          )
        );
      }
    }

    for (const lineitem of lineItems) {
      try {
        logger.debug("Inside putGrade lineitem found - " + JSON.stringify(lineitem));

        const lineitemUrl = lineitem.id;
        let scoreUrl = lineitemUrl + "/scores";

        if (lineitemUrl.indexOf("?") !== -1) {
          const query = lineitemUrl.split("?")[1];
          const url = lineitemUrl.split("?")[0];
          scoreUrl = url + "/scores?" + query;
        }

        if (options && options.userId) score.userId = options.userId;
        else score.userId = platform.userId;

        logger.debug("score.userId - " + score.userId);

        score.timestamp = new Date(Date.now()).toISOString();
        score.scoreMaximum = lineitem.scoreMaximum;
        logger.debug(
          "Inside PutGrades - scoreUrl - " + JSON.stringify(scoreUrl)
        );
        logger.debug("score - " + JSON.stringify(score));

        const res = await axios.post(scoreUrl, {
          headers: {
            Authorization:
              accessToken.token_type + " " + accessToken.access_token,
            "Content-Type": "application/vnd.ims.lis.v1.score+json"
          },
          params: score
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
    const accessToken = await getAccessToken(
      platform,
      `${LINE_ITEM_READ_ONLY_CLAIM} ${RESULT_CLAIM}`
    );

    let limit: any = false;

    if (options) {
      if (options.resourceLinkId === false) options.resourceLinkId = false;
      else options.resourceLinkId = true;

      if (options.limit) {
        limit = options.limit;
        options.limit = false;
      }
    }
    let lineItems = []
    if(platform.lineitem) {
      lineItems = [platform.lineitem];
    } else {
      lineItems = await this.getLineItems(platform, options);
    }
    logger.debug("Inside GetGrades - lineItems - " + JSON.stringify(lineItems));
    const queryParams:any = {};

    if (options) {
      if (options.userId) queryParams.user_id = options.userId;
      if (limit) queryParams.limit = limit;
    }

    const resultsArray = [];

    for (const lineitem of lineItems) {
      try {
        let lineitemUrl = "";
        if(lineitem.id)
          lineitemUrl = lineitem.id + "/results";
        else
          lineitemUrl = lineitem;
        logger.debug("Inside GetGrades - queryparam - " + JSON.stringify(queryParams));
        logger.debug("Inside GetGrades - lineitemUrl - " + JSON.stringify(lineitemUrl));
        const results : Response = await axios
          .get(lineitemUrl, {
            params: queryParams,
            headers: {
              Authorization:
                accessToken.token_type + " " + accessToken.access_token,
              Accept: "application/vnd.ims.lis.v2.resultcontainer+json",
            }
          });
         
        logger.debug("Inside GetGrades - results - " + JSON.stringify(results.body));
        
        resultsArray.push({
          lineitem: lineitem.id,
          results: results.body
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
