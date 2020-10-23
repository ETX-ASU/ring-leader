import SubmitLineItem from "./SubmitLineItem"

class SubmitContentItem {
  type = "ltiResourceLink";
  title = "Title";
  url = "/assignment?resourceId=tool-assignment-xyz";
  resourceId = "tool-assignment-xyz";
  lineItem = new SubmitLineItem();
}

export default SubmitContentItem;