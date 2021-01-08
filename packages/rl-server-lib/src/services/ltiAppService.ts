// eslint-disable-next-line node/no-extraneous-import
import { NamesAndRoles } from "../services/namesAndRolesService";
import { Grade } from "../services/assignmentAndGradeService";
import { DeepLinking } from "../services/DeepLinking";

import {
  logger,
  SubmitGradeParams,
  User
} from "@asu-etx/rl-shared";
import ToolConsumer from "../models/ToolConsumer";
import { getToolConsumerByName, getJwks as getJwksForTools } from "./ToolConsumerService";

// NOTE: If we make calls from the client directly to Canvas with the token
// then this service may not be needed. It could be used to show how the calls
// can be made server side if they don't want put the Canvas idToken into a
// cookie and send it to the client



const returnUsers = (ltiResult: any): User[] => {
  const members = ltiResult.members;
  const users: User[] = [];
  for (const key in members) {
    const courseMember = members[key];
    const roles: string[] = [];
    for (const key in courseMember.roles) {
      const role: string = courseMember.roles[key];
      role.split("#")
      roles.push(role.split("#")[1].toLowerCase());
    }
    users.push(new User({
      id: courseMember.user_id,
      name: courseMember.name,
      status: courseMember.status,
      picture: courseMember.picture,
      givenName: courseMember.given_name,
      familyName: courseMember.family_name,
      email: courseMember.email,
      roles: roles
    }));
  }
  return users;
};

const getRoster = async (platform: any, role: any): Promise<any> => {

  const results = await new NamesAndRoles().getMembers(platform, {
    role: role
  });
  return returnUsers(results);
};

const getUnassignedStudents = async (platform: any, resourceLinkId: any): Promise<any[]> => {
  const studentsNotAssignedToThisAssignments = [];
  const courseMembersCollection = await new NamesAndRoles().getMembers(
    platform,
    {
      role: "Learner"
    }
  );

  const members = courseMembersCollection.members;

  const assignmentMembersCollection = await new NamesAndRoles().getMembers(
    platform,
    {
      role: "Learner",
      resourceLinkId: resourceLinkId
    }
  );
  const assignmentMembers = assignmentMembersCollection.members;

  for (const key in members) {
    const courseMember = members[key];
    logger.debug("courseMember -" + JSON.stringify(courseMember));
    logger.debug("assignmentMembers -" + JSON.stringify(assignmentMembers));
    const filteredData = assignmentMembers.filter(function (member: any) {
      logger.debug("member -" + JSON.stringify(member));
      return member.user_id == courseMember.user_id;
    });
    logger.debug("filteredData -" + JSON.stringify(filteredData));
    if (filteredData.length <= 0)
      studentsNotAssignedToThisAssignments.push(courseMember);
  }
  return returnUsers(studentsNotAssignedToThisAssignments);
};

const getAssignedStudents = async (platform: any, lineItemId: any, resourceLinkId: any): Promise<any[]> => {

  const assignedStudents = [];
  if (lineItemId) {

    const assignmentMembersCollection = await new NamesAndRoles().getMembers(
      platform,
      {
        role: "Learner",
        resourceLinkId: resourceLinkId
      }
    );
    const assignmentMembers: [any] = assignmentMembersCollection.members;

    for (const key in assignmentMembers) {
      const assignmentMember = assignmentMembers[key];
      assignedStudents.push(assignmentMember);
    }
  }
  return returnUsers(assignedStudents);
};

const putStudentGradeView = async (platform: any, score: SubmitGradeParams, title: string | undefined): Promise<void> => {
  score.timestamp = new Date().toISOString();
  score.userId = platform.userId;
  const results = await new Grade().putGrade(
    platform,
    score,
    {
      id: platform.lineitem,
      userId: platform.userId,
      title: platform.lineitem || title || null
      //if platform.lineitem is null then it means that the SSO was not performed hence we
      //will fetch line item id by matching the assignment title.
    }
  );

  return results;
};



const postDeepLinkAssignment = async (platform: any, contentItems: any): Promise<any> => {
  logger.debug("post deeplink - platform - " + JSON.stringify(platform));
  logger.debug("post deeplink - contentItems - " + JSON.stringify(contentItems));

  // Creates the deep linking request form
  const form = await new DeepLinking().createDeepLinkingForm(
    platform,
    contentItems,
    {
      message: "Successfully registered resource!"
    }
  );

  return { form: form };
};

const forwardDeepLinkAssignmentPost = async (response: any, platform: any, contentItems: any): Promise<void> => {
  logger.debug("forward deeplink - platform - " + JSON.stringify(platform));
  logger.debug("forward deeplink - contentItems - " + JSON.stringify(contentItems));

  // Creates the deep linking request form
  new DeepLinking().postDeepLink(response,
    platform,
    contentItems,
    {
      message: "Successfully registered resource!"
    }
  );
};

const putStudentGrade = async (platform: any, score: SubmitGradeParams, title: string | undefined): Promise<void> => {
  score.timestamp = new Date().toISOString();
  const results = await new Grade().putGrade(
    platform,
    score,
    {
      id: platform.lineitem,
      userId: score.userId,
      title: platform.lineitem || title || null
    }
  );

  return results;
};

const deleteLineItem = async (platform: any, lineItemId: any): Promise<any> => {

  if (lineItemId) {
    const results = await new Grade().deleteLineItems(platform, {
      id: lineItemId
    });
    return results;
  }
  return null;
};

const getGrades = async (platform: any, resourceId: any, userId: any): Promise<any> => {
  const scoreData = [];
  if (resourceId) {
    const results: any = ([] = await new Grade().getGrades(platform, {
      resourceId: resourceId,
      resourceLinkId: false,
      userId: userId
    }));
    logger.debug(
      "results.results - " + JSON.stringify(results)
    );

    const membersCollection = await new NamesAndRoles().getMembers(platform, {
      role: "Learner"
    });
    logger.debug(
      "Get Grades - members - " + JSON.stringify(membersCollection)
    );
    if (results.length <= 0) return [];
    logger.debug(`full results from GetGrade: ${JSON.stringify(results)}`);

    for (const key in results[0].results) {
      const score = results[0].results[key];
      if (userId && score.userId != userId) {
        continue;
      }
      logger.debug("score results from Tool Consumer - " + JSON.stringify(score));
      //Grades service call will only return user Id along with the score
      //so for this demo, we are retrieving the user info from the session
      //so that we can display name of the student
      //In production env, we can call the Name and Role service and get the user details from there
      const tooltipsData = membersCollection.members.filter(function (
        member: any
      ) {
        return member.user_id == score.userId;
      });

      scoreData.push({
        id: score.id,
        studentId: score.userId,
        studentName: tooltipsData[0].name,
        resultScore: score.resultScore,
        resultMaximum: score.resultMaximum,
        comment: score.comment
      });
    }
    logger.debug("scoreData response - " + JSON.stringify(scoreData));
  }
  return scoreData;
};


export { getGrades, deleteLineItem, putStudentGrade, postDeepLinkAssignment, forwardDeepLinkAssignmentPost, putStudentGradeView, getAssignedStudents, getUnassignedStudents, getRoster };
