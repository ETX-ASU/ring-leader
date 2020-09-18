import { URLSearchParams } from "url";
import { parseLink } from "parse-link";
// eslint-disable-next-line node/no-extraneous-import
import axios from "axios";
class NamesAndRoles {
  async getMembers(token: any, options: any): Promise<any> {
    if (!token) {
      console.log("Token object missing.");
      throw new Error("MISSING_TOKEN");
    }

    let query: any = [];
    let isQuery = true;
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
    else isQuery = false;
    let next = token.memberships_url;

    if (options && options.url) {
      next = options.url;
      isQuery = false;
    }

    let differences;
    let result: any;
    let curPage = 1;

    do {
      if (options && options.pages && curPage > options.pages) {
        if (next) result.next = next;
        break;
      }

      console.log("Member pages found: ", curPage);
      console.log("Current member page: ", next);
      if (isQuery && curPage === 1)
        await axios
          .get(next, {
            params: query,
            headers: {
              Authorization: token.token_type + " " + token.access_token,
              Accept: "application/vnd.ims.lti-nrps.v2.membershipcontainer+json"
            }
          })
          .then((response) => {
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
          })
          .catch((err) => {
            console.log("error" + err);
          });
      else
        await axios
          .get(next, {
            headers: {
              Authorization: "Bearer  " + token,
              Accept: "application/vnd.ims.lti-nrps.v2.membershipcontainer+json"
            }
          })
          .then((response) => {
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
          })
          .catch((err) => {
            console.log("error" + err);
          });
      curPage++;
    } while (next);

    if (differences) result.differences = differences;
    console.log("Memberships retrieved");
    return result;
  }
}
export { NamesAndRoles };
