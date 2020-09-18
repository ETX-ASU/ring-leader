// eslint-disable-next-line node/no-extraneous-import
import axios from "axios";
import { URLSearchParams } from "url";
class Grade {
  async getLineItems(
    idtoken: any,
    options?: any,
    accessToken?: any
  ): Promise<any> {
    if (!idtoken) {
      throw new Error("MISSING_ID_TOKEN");
    }

    if (!accessToken) {
      const platform = {};

      if (!platform) {
        throw new Error("PLATFORM_NOT_FOUND");
      }

      let lineitemsEndpoint = idtoken.endpoint.lineitems;
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
          queryParams.push([
            "resource_link_id",
            idtoken.platformContext.resource.id
          ]);
        if (options.limit && !options.id && !options.label)
          queryParams.push(["limit", options.limit]);
        if (options.tag) queryParams.push(["tag", options.tag]);
        if (options.resourceId)
          queryParams.push(["resource_id", options.resourceId]);
      }

      queryParams = new URLSearchParams(queryParams);
      let lineItems: any = await axios
        .get(lineitemsEndpoint, {
          params: queryParams,
          headers: {
            Authorization:
              accessToken.token_type + " " + accessToken.access_token,
            Accept: "application/vnd.ims.lis.v2.lineitemcontainer+json"
          }
        })
        .then((res) => {
          return res.data.json();
        })
        .catch(() => {
          console.log("");
        });
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

  async createLineItem(
    idtoken: any,
    lineItem: any,
    options: any,
    accessToken: any
  ): Promise<any> {
    // Validating lineItem
    if (!idtoken) {
      throw new Error("MISSING_ID_TOKEN");
    }

    if (!lineItem) {
      throw new Error("MISSING_LINE_ITEM");
    }

    if (options && options.resourceLinkId)
      lineItem.resourceLinkId = idtoken.platformContext.resource.id;

    const lineitemsEndpoint = idtoken.platformContext.endpoint.lineitems;

    const newLineItem: any = await axios
      .post(lineitemsEndpoint, {
        headers: {
          Authorization:
            accessToken.token_type + " " + accessToken.access_token,
          "Content-Type": "application/vnd.ims.lis.v2.lineitem+json"
        },
        json: lineItem
      })
      .then((res) => {
        return res.data.json();
      })
      .catch(() => {
        console.log("");
      });
    return newLineItem;
  }

  async scorePublish(idtoken: any, score: any, options: any): Promise<any> {
    if (!idtoken) {
      throw new Error("MISSING_ID_TOKEN");
    }

    if (!score) {
      throw new Error("MISSING_SCORE");
    }

    const platform = {};
    const accessToken = {
      token_type: "",
      access_token: ""
    };
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

    const lineItems: any = this.getLineItems(idtoken, options, accessToken);
    const result: any = {
      success: [],
      failure: []
    };

    if (lineItems.length === 0) {
      if (options && options.autoCreate) {
        lineItems.push(
          this.createLineItem(
            idtoken,
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
        else score.userId = idtoken.user;
        score.timestamp = new Date(Date.now()).toISOString();
        score.scoreMaximum = lineitem.scoreMaximum;
        await axios.post(scoreUrl, {
          headers: {
            Authorization:
              accessToken.token_type + " " + accessToken.access_token,
            "Content-Type": "application/vnd.ims.lis.v1.score+json"
          },
          json: score
        });
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
  async result(idtoken: any, options: any): Promise<any> {
    if (!idtoken) {
      throw new Error("MISSING_ID_TOKEN");
    }

    const platform = {};

    if (!platform) {
      throw new Error("PLATFORM_NOT_FOUND");
    }
    //we will change this when go for actual implementation
    const accessToken = {
      token_type: "",
      access_token: ""
    };
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

    const lineItems = await this.getLineItems(idtoken, options, accessToken);
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
        const results = await axios
          .get(resultsUrl, {
            params: searchParams,
            headers: {
              Authorization:
                accessToken.token_type + " " + accessToken.access_token,
              Accept: "application/vnd.ims.lis.v2.resultcontainer+json"
            }
          })
          .then((res) => {
            return res.data.json();
          })
          .catch(() => {
            console.log("");
          });
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
