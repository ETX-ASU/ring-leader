import { URLSearchParams } from "url";
import { parseLink } from "parse-link";
import jwt from "jsonwebtoken";
import { getAccessToken } from "../util/auth";
// eslint-disable-next-line node/no-extraneous-import
import axios from "axios";
class NamesAndRoles {
  async getMembers(tokenObject: any, options: any): Promise<any> {
    if (!tokenObject) {
      console.log("Token object missing.");
      throw new Error("MISSING_TOKEN");
    }
    const token: any = await jwt.decode(tokenObject.token);
    console.log(JSON.stringify("getMembers token- " + token));
    console.log(
      JSON.stringify("getMembers tokenObject- " + JSON.stringify(tokenObject))
    );
    console.log(
      "Attempting to retrieve platform access_token for [" +
        tokenObject.iss +
        "]"
    );
    const tokenRes = await getAccessToken(
      tokenObject,
      "https://purl.imsglobal.org/spec/lti-nrps/scope/contextmembership.readonly"
    );
    console.log("Access_token retrieved for [" + tokenObject.iss + "]");

    let query: any = [];
    if (options && options.role) {
      console.log("Adding role parameter with value: " + options.role);
      query.push(["role", options.role]);
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

    do {
      if (options && options.pages && curPage > options.pages) {
        if (next) result.next = next;
        break;
      }

      let response;
      if (query && curPage === 1)
        response = await axios.get(next, {
          params: query,
          headers: {
            Authorization: tokenRes.token_type + " " + tokenRes.access_token,
            Accept: "application/vnd.ims.lti-nrps.v2.membershipcontainer+json"
          }
        });
      else
        response = await axios.get(next, {
          headers: {
            Authorization: tokenRes.token_type + " " + tokenRes.access_token,
            Accept: "application/vnd.ims.lti-nrps.v2.membershipcontainer+json"
          }
        });
      const headers = response.headers;
      const body = JSON.parse(response.data);
      if (!result) result = JSON.parse(JSON.stringify(body));
      else {
        result.members = [...result.members, ...body.members];
      }
      const parsedLinks = parseLink(headers.link); // Trying to find "rel=differences" header

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
