import { RlPlatform } from "./rlPlatform";
import { getAssignmentsByGroup } from "../services/AssignmentService";
import Assignment from "../database/entities/Assignment";
import { DEEP_LINK_RESOURCELINKS_ENDPOINT } from "../util/environment";
const getDeepLinkItems = async (
  endpoint: String,
  platform: any | undefined
) => {
  if (endpoint == DEEP_LINK_RESOURCELINKS_ENDPOINT) {
    return getDeepLinkAssignments(platform);
  }
  return [];
};

const getDeepLinkAssignments = async (platform: any | undefined) => {
  console.log(`getDeepLintAssnments: platform:${JSON.stringify(platform)}`);
  const assignments: Assignment[] = await getAssignmentsByGroup(
    platform.lineitems
  );
  const items = [];

  for (const assignment of assignments) {
    items.push({
      type: assignment.type,
      title: assignment.title,
      url: assignment.url,
      resourceId: assignment.resource_id,
      lineItem: {
        scoreMaximum: assignment.lineitem_score_maximum,
        label: assignment.lineitem_label,
        resourceId: assignment.lineitem_resource_id,
        tag: assignment.lineitem_tag
      }
    });
  }
};

export default getDeepLinkItems;
