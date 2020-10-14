import { URLSearchParams } from "url";
import parseLink from "parse-link";
import jwt from "jsonwebtoken";
import { getAccessToken } from "../util/auth";
import got from "got";
import { Platform } from "../util/interface/Platform";
class NamesAndRoles {
  /**
   * @description Retrieves members from platform.
   * @param {Object} platform - contains all the parameters required for calling LTI Advantage Calls.
   * @param {Object} options - Request options.
   * @param {String} [options.role] - Specific role to be returned.
   * @param {Number} [options.limit] - Specifies maximum number of members per page.
   * @param {Number} [options.pages] - Specifies maximum number of pages returned.
   * @param {String} [options.url] - Specifies the initial members endpoint, usually retrieved from a previous incomplete request.
   */

  async getMembers(platform: Platform, options?: any): Promise<any> {
    if (!platform) {
      console.log("Token object missing.");
      throw new Error("MISSING_TOKEN");
    }
    const token: any = await jwt.decode(platform.idToken);
    console.log(JSON.stringify("getMembers token- " + token));
    console.log(
      JSON.stringify("getMembers tokenObject- " + JSON.stringify(platform))
    );
    console.log(
      "Attempting to retrieve platform access_token for [" + platform.iss + "]"
    );
    const tokenRes = await getAccessToken(
      platform,
      "https://purl.imsglobal.org/spec/lti-nrps/scope/contextmembership.readonly"
    );
    console.log("Access_token retrieved for [" + platform.iss + "]");
    console.log("Access token received -" + tokenRes);

    console.log("tokenRes.access_token: " + tokenRes.access_token);
    console.log("tokenRes.token_type: " + tokenRes.token_type);
    console.log("options: " + options);
    let query: any = [];
    if (options && options.role) {
      console.log("Adding role parameter with value: " + options.role);
      const platformRole = platform.roles.find(
        (e: any) => e.role === options.role
      );
      console.log("platformRole - " + JSON.stringify(platformRole));

      if (platformRole) query.push(["role", platformRole.claim]);
    }

    if (options && options.limit) {
      console.log("Adding limit parameter with value: " + options.limit);
      query.push(["limit", options.limit]);
    }

    if (options && options.pages)
      console.log("Maximum number of pages retrieved: " + options.pages);
    if (query.length > 0) query = new URLSearchParams(query);
    else query = false;
    let next =
      token["https://purl.imsglobal.org/spec/lti-nrps/claim/namesroleservice"]
        .context_memberships_url;
    console.log("next");
    console.log(next);
    if (options && options.url) {
      next = options.url;
      query = false;
    }

    let differences;
    let result: any;
    let curPage = 1;
    console.log("query value");
    console.log(query);
    do {
      if (options && options.pages && curPage > options.pages) {
        if (next) result.next = next;
        break;
      }
      console.log("query-" + query + "curPage-" + curPage);
      let response: any;
      if (query && curPage === 1) {
        console.log("starting get call inside if loop");
        response = await got.get(next, {
          searchParams: query,
          headers: {
            Authorization: tokenRes.token_type + " " + tokenRes.access_token,
            // Accept: "application/vnd.ims.lti-nrps.v2.membershipcontainer+json",
            Accept: "application/vnd.ims.lis.v2.membershipcontainer+json",
            ContentType: "application/vnd.ims.lis.v2.membershipcontainer+json"
          }
        });
      } else {
        console.log("starting get call inside else loop");
        response = await got.get(next, {
          headers: {
            Authorization: tokenRes.token_type + " " + tokenRes.access_token,
            //Accept: "application/vnd.ims.lti-nrps.v2.membershipcontainer+json"
            Accept: "application/vnd.ims.lis.v2.membershipcontainer+json",
            ContentType: "application/vnd.ims.lis.v2.membershipcontainer+json"
          }
        });
      }
      console.log("LTI advantage call successfull");
      const headers = response.headers;
      const body = JSON.parse(response.body);
      console.log("JSON.stringify(body)-" + JSON.stringify(body));
      if (!result) result = JSON.parse(JSON.stringify(body));
      else {
        result.members = [...result.members, ...body.members];
      }
      console.log("headers.link" + headers.link);
      const parsedLinks = parseLink(headers.link); // Trying to find "rel=differences" header
      next = false;
      if (parsedLinks && parsedLinks.differences)
        differences = parsedLinks.differences.url; // Trying to find "rel=next" header, indicating additional pages

      if (parsedLinks && parsedLinks.next) next = parsedLinks.next.url;
      else next = false;
      curPage++;
    } while (next);

    if (differences) result.differences = differences;
    console.log("Memberships retrieved");
    return result;
  }
}
export { NamesAndRoles };
