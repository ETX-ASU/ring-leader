import { URLSearchParams } from "url";
import parseLink from "parse-link";
import jwt from "jsonwebtoken";
import { getAccessToken } from "../util/auth";
import got from "got";
import { Platform } from "../util/Platform";
import { logger, CONTEXT_MEMBERSHIP_READ_CLAIM, NAMES_ROLES_CLAIM, LTI_MEMBERSHIP_MEDIA_TYPE_NRPS } from "@asu-etx/rl-shared";

class NamesAndRoles {
  /**
   * @description Retrieves members from platform.
   * @param {Object} platform - contains all the parameters required for calling LTI Advantage Calls.
   * @param {Object} options - Request options.
   * @param {String} [options.role] - Specific role to be returned.
   * @param {Number} [options.limit] - Specifies maximum number of members per page.
   * @param {Number} [options.pages] - Specifies maximum number of pages returned.
   * @param {String} [options.url] - Specifies the initial members endpoint, usually retrieved from a previous incomplete request.
   * @param {String} [options.resourceLinkId] - If set to true, retrieves resource Link level memberships.
   */

  async getMembers(platform: Platform, options?: any): Promise<any> {
    if (!platform) {
      logger.debug("Token object missing.");
      throw new Error("MISSING_TOKEN");
    }
    const token: any = await jwt.decode(platform.idToken);
    logger.debug("getMembers token- " + JSON.stringify(token));

    logger.debug(
      JSON.stringify("getMembers tokenObject- " + JSON.stringify(platform))
    );
    logger.debug(
      "Attempting to retrieve platform access_token for [" + platform.iss + "]"
    );
    const tokenRes = await getAccessToken(platform, CONTEXT_MEMBERSHIP_READ_CLAIM);
    logger.debug("getMembers Access_token retrieved for [" + platform.iss + "]");
    logger.debug("getMembers Access token received -" + JSON.stringify(tokenRes));

    logger.debug("getMembers tokenRes.access_token: " + tokenRes.access_token);
    logger.debug("getMembers tokenRes.token_type: " + tokenRes.token_type);
    logger.debug("getMembers options: " + JSON.stringify(options));
    let query: any = [];
    if (options && options.role) {
      logger.debug("Adding role parameter with value: " + options.role);
      const platformRole = platform.roles.find(
        (e: any) => e.role === options.role
      );
      logger.debug("platformRole - " + JSON.stringify(platformRole));

      if (platformRole) query.push(["role", platformRole.claim]);
    }
    if (options && options.resourceLinkId) {
      query.push(["rlid", options.resourceLinkId]);
    }
    if (options && options.limit) {
      logger.debug("Adding limit parameter with value: " + options.limit);
      query.push(["limit", options.limit]);
    }

    query.push(["groups", "true"]);

    if (options && options.pages) {
      logger.debug("Maximum number of pages retrieved: " + options.pages);
      query.push(["pages", options.pages]);
    }
    if (query.length <= 0) {
      query = false;
    }
    let next = token[NAMES_ROLES_CLAIM].context_memberships_url;

    if (options && options.url) {
      logger.debug("next will be replaced by options url: next - " + JSON.stringify(next) + " options.url: " + options.url);
      next = options.url;
    }

    let params = next.split("?");
    if (params.length > 1) {
      if (!query) {
        query = []
      }
      next = params[0];
      params = params[1].split("=");
      for (let i = 0; i < params.length; i++) {
        query.push([params[i], params[++i]]);
      }
    }

    if (query) {
      logger.debug(`namesandrolesqueryparams: ${JSON.stringify(query)}`);
      query = new URLSearchParams(query);
    }

    let differences;
    let result: any;
    let curPage = 1;
    do {
      if (options && options.pages && curPage > options.pages) {
        if (next) result.next = next;
        break;
      }

      let response: any;
      if (query && curPage === 1) {
        logger.debug("starting get call inside if loop with query url: " + next + " query: " + query + " curPage: " + curPage);
        logger.debug(`Authorization: ${tokenRes.token_type + " " + tokenRes.access_token}`);

        response = await got.get(next, {
          searchParams: query,
          headers: {
            Authorization: tokenRes.token_type + " " + tokenRes.access_token,
            Accept: LTI_MEMBERSHIP_MEDIA_TYPE_NRPS
          }
        });
        logger.debug("Response headers for names and role service: " + JSON.stringify(response.headers));
      } else {
        logger.debug("more loops get call inside else loop");
        response = await got.get(next, {
          headers: {
            Authorization: tokenRes.token_type + " " + tokenRes.access_token,
            Accept: LTI_MEMBERSHIP_MEDIA_TYPE_NRPS,
          }
        });
      }
      logger.debug("LTI advantage call successfull");
      const headers = response.headers;
      const body = JSON.parse(response.body);
      logger.debug("JSON.stringify(body)-" + JSON.stringify(body));
      if (!result) result = JSON.parse(JSON.stringify(body));
      else {
        result.members = [...result.members, ...body.members];
      }
      logger.debug("headers.link: " + headers.link);
      const parsedLinks = headers.link ? parseLink(headers.link) : {}; // Trying to find "rel=differences" header
      next = false;
      if (parsedLinks && parsedLinks.differences)
        differences = parsedLinks.differences.url; // Trying to find "rel=next" header, indicating additional pages

      if (parsedLinks && parsedLinks.next) next = parsedLinks.next.url;
      else next = false;
      curPage++;
    } while (next);

    if (differences) result.differences = differences;
    logger.debug("Memberships retrieved");
    return result;
  }
}


export { NamesAndRoles };
