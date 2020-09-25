// eslint-disable-next-line node/no-extraneous-import
import got from "got";
import { URLSearchParams } from "url";
import { getAccessToken } from "../util/auth";
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

  async getLineItems(
    platform: any,
    options?: any,
    accessToken?: any
  ): Promise<any> {
    if (!platform) {
      throw new Error("MISSING_ID_TOKEN");
    }
    if (!accessToken)
      accessToken = await getAccessToken(
        platform,
        "https://purl.imsglobal.org/spec/lti-ags/scope/lineitem.readonly"
      );
    if (accessToken) {
      let lineitemsEndpoint = platform.lineitems;
      let query: any = [];

      if (lineitemsEndpoint.indexOf("?") !== -1) {
        query = Array.from(
          new URLSearchParams(lineitemsEndpoint.split("?")[1])
        );
        lineitemsEndpoint = lineitemsEndpoint.split("?")[0];
      }

      let queryParams: any = [...query];

      if (options) {
        if (options.resourceLinkId)
          queryParams.push(["resource_link_id", platform.resourceLinkId]);
        if (options.limit && !options.id && !options.label)
          queryParams.push(["limit", options.limit]);
        if (options.tag) queryParams.push(["tag", options.tag]);
        if (options.resourceId)
          queryParams.push(["resource_id", options.resourceId]);
      }

      queryParams = new URLSearchParams(queryParams);
      let lineItems: any = await got
        .get(lineitemsEndpoint, {
          searchParams: queryParams,
          headers: {
            Authorization:
              accessToken.token_type + " " + accessToken.access_token,
            Accept: "application/vnd.ims.lis.v2.lineitemcontainer+json"
          }
        })
        .json(); // Applying special filters

      if (options && options.id)
        lineItems = lineItems.filter((lineitem: any) => {
          return lineitem.id === options.id;
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
    platform: any,
    lineItem: any,
    options: any,
    accessToken?: any
  ): Promise<any> {
    console.log("Inside createLineItem");

    // Validating lineItem
    if (!platform) {
      throw new Error("MISSING_ID_TOKEN");
    }

    if (!lineItem) {
      throw new Error("MISSING_LINE_ITEM");
    }
    if (!accessToken) {
      accessToken = await getAccessToken(
        platform,
        "https://purl.imsglobal.org/spec/lti-ags/scope/lineitem"
      );
    }
    console.log("access token retrived inside createLineItem");

    if (options && options.resourceLinkId)
      lineItem.resourceLinkId = platform.resourceLinkId;

    const lineitemsEndpoint = platform.lineitems;

    const newLineItem = await got
      .post(lineitemsEndpoint, {
        headers: {
          Authorization:
            accessToken.token_type + " " + accessToken.access_token,
          "Content-Type": "application/vnd.ims.lis.v2.lineitem+json"
        },
        json: lineItem
      })
      .json();
    console.log("Line item successfully created");
    return newLineItem;
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

  async putGrade(platform: any, score: any, options: any): Promise<any> {
    if (!platform) {
      throw new Error("MISSING_ID_TOKEN");
    }

    if (!score) {
      throw new Error("MISSING_SCORE");
    }
    const accessToken: any = getAccessToken(
      platform,
      "https://purl.imsglobal.org/spec/lti-ags/scope/lineitem https://purl.imsglobal.org/spec/lti-ags/scope/score"
    );

    if (!platform) {
      throw new Error("PLATFORM_NOT_FOUND");
    }

    if (options) {
      if (options.resourceLinkId === false) options.resourceLinkId = false;
      else options.resourceLinkId = true;
    } else
      options = {
        resourceLinkId: true
      };

    const lineItems: any = this.getLineItems(platform, options, accessToken);
    const result: any = {
      success: [],
      failure: []
    };

    if (lineItems.length === 0) {
      if (options && options.autoCreate) {
        lineItems.push(
          this.createLineItem(
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
        const lineitemUrl = lineitem.id;
        let scoreUrl = lineitemUrl + "/scores";

        if (lineitemUrl.indexOf("?") !== -1) {
          const query = lineitemUrl.split("?")[1];
          const url = lineitemUrl.split("?")[0];
          scoreUrl = url + "/scores?" + query;
        }

        if (options && options.userId) score.userId = options.userId;
        else score.userId = platform.user; //Need to work on this property
        score.timestamp = new Date(Date.now()).toISOString();
        score.scoreMaximum = lineitem.scoreMaximum;
        await got.post(scoreUrl, {
          headers: {
            Authorization:
              accessToken.token_type + " " + accessToken.access_token,
            "Content-Type": "application/vnd.ims.lis.v1.score+json"
          },
          json: score
        });
        console.log("Score successfully sent");
        result.success.push({
          lineitem: lineitemUrl
        });
      } catch (err) {
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

  async getGrades(platform: any, options: any): Promise<any> {
    if (!platform) {
      throw new Error("PLATFORM_NOT_FOUND");
    }
    //we will change this when go for actual implementation
    const accessToken = await getAccessToken(
      platform,
      "https://purl.imsglobal.org/spec/lti-ags/scope/lineitem.readonly https://purl.imsglobal.org/spec/lti-ags/scope/result.readonly"
    );

    let limit = false;

    if (options) {
      if (options.resourceLinkId === false) options.resourceLinkId = false;
      else options.resourceLinkId = true;

      if (options.limit) {
        limit = options.limit;
        options.limit = false;
      }
    } else
      options = {
        resourceLinkId: true
      };

    const lineItems = await this.getLineItems(platform, options, accessToken);
    const queryParams = [];

    if (options) {
      if (options.userId) queryParams.push(["user_id", options.userId]);
      if (limit) queryParams.push(["limit", limit]);
    }

    const resultsArray = [];

    for (const lineitem of lineItems) {
      try {
        const lineitemUrl = lineitem.id;
        let query: any = [];
        let resultsUrl = lineitemUrl + "/results";

        if (lineitemUrl.indexOf("?") !== -1) {
          query = Array.from(new URLSearchParams(lineitemUrl.split("?")[1]));
          const url = lineitemUrl.split("?")[0];
          resultsUrl = url + "/results";
        }

        let searchParams: any = [...queryParams, ...query];
        searchParams = new URLSearchParams(searchParams);
        const results = await got
          .get(resultsUrl, {
            searchParams: searchParams,
            headers: {
              Authorization:
                accessToken.token_type + " " + accessToken.access_token,
              Accept: "application/vnd.ims.lis.v2.resultcontainer+json"
            }
          })
          .json();

        resultsArray.push({
          lineitem: lineitem.id,
          results: results
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
}
export { Grade };
