import {
  getDeepLinkResourceLinks,
  submitResourceSelection
} from "./services/DeepLinkService";
import { submitGrade, submitInstructorGrade, getGrades } from "./services/GradeService";
import { getUsers, getUnassignedStudents, getAssignedStudents } from "./services/UserService";
import { getLineItems, deleteLineItem } from "./services/LineItemService";

import { submitGrade as submitGradeRedirect, submitInstructorGrade as submitInstructorGradeRedirect
  , getGrades as getGradesRedirect } from "./servicesRedirect/GradeService";
import { getUsers as getUsersRedirect, getUnassignedStudents as getUnassignedStudentsRedirect, 
  getAssignedStudents as getAssignedStudentsRedirect} from "./servicesRedirect/UserService";
import { getLineItems as getLineItemsRedirect, 
  deleteLineItem as deleteLineItemRedirect} from "./servicesRedirect/LineItemService";
import {
  getDeepLinkResourceLinks as getDeepLinkResourceLinksRedirect,
  submitResourceSelection as submitResourceSelectionRedirect
} from "./servicesRedirect/DeepLinkService";

export {
  getDeepLinkResourceLinks,
  submitResourceSelection,
  submitGrade,
  submitInstructorGrade,
  getGrades,
  getUsers,
  getUnassignedStudents,
  getAssignedStudents,
  getLineItems,
  deleteLineItem,

  
  getDeepLinkResourceLinksRedirect,
  submitResourceSelectionRedirect,
  submitGradeRedirect,
  submitInstructorGradeRedirect,
  getGradesRedirect,
  getUsersRedirect,
  getUnassignedStudentsRedirect,
  getAssignedStudentsRedirect,
  getLineItemsRedirect,
  deleteLineItemRedirect
};
