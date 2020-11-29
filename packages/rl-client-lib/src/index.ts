import {
  getDeepLinkResourceLinks,
  submitResourceSelection
} from "./services/DeepLinkService";
import { submitGrade, submitInstructorGrade, getGrades, getGrade } from "./services/GradeService";
import { getUsers, getUnassignedStudents, getAssignedStudents } from "./services/UserService";
import { getLineItems, deleteLineItem } from "./services/LineItemService";

import { submitGrade as submitGradeRedirect, submitInstructorGrade as submitInstructorGradeRedirect
  , getGrades as getGradesRedirect, getGrade as getGradeRedirect } from "./servicesRedirect/GradeService";
import { getUsers as getUsersRedirect, getUnassignedStudents as getUnassignedStudentsRedirect, 
  getAssignedStudents as getAssignedStudentsRedirect} from "./servicesRedirect/UserService";
import { getLineItems as getLineItemsRedirect, 
  deleteLineItem as deleteLineItemRedirect} from "./servicesRedirect/LineItemService";
import {
  getDeepLinkResourceLinks as getDeepLinkResourceLinksRedirect,
  submitResourceSelection as submitResourceSelectionRedirect
} from "./servicesRedirect/DeepLinkService";
import {
  hasValidSession as hasValidSessionAwsRedirect,
} from "./servicesRedirect/ValidateSessionService";

import { submitGrade as submitGradeAws, submitInstructorGrade as submitInstructorGradeAws
  , getGrades as getGradesAws, getGrade as getGradeAws } from "./servicesAws/GradeService";
import { getUsers as getUsersAws, getUnassignedStudents as getUnassignedStudentsAws, 
  getAssignedStudents as getAssignedStudentsAws} from "./servicesAws/UserService";
import { getLineItems as getLineItemsAws, 
  deleteLineItem as deleteLineItemAws} from "./servicesAws/LineItemService";
import {
  getDeepLinkResourceLinks as getDeepLinkResourceLinksAws,
  submitResourceSelection as submitResourceSelectionAws
} from "./servicesAws/DeepLinkService";

import {
  hasValidSession as hasValidSessionAws,
} from "./servicesAws/ValidateSessionService";


export {
  getDeepLinkResourceLinks,
  submitResourceSelection,
  submitGrade,
  submitInstructorGrade,
  getGrades,
  getGrade,
  getUsers,
  getUnassignedStudents,
  getAssignedStudents,
  getLineItems,
  deleteLineItem,
  
  getDeepLinkResourceLinksAws,
  submitResourceSelectionAws,
  submitGradeAws,
  submitInstructorGradeAws,
  getGradesAws,
  getGradeAws,
  getUsersAws,
  getUnassignedStudentsAws,
  getAssignedStudentsAws,
  getLineItemsAws,
  deleteLineItemAws,
  hasValidSessionAws,
  
  getDeepLinkResourceLinksRedirect,
  submitResourceSelectionRedirect,
  submitGradeRedirect,
  submitInstructorGradeRedirect,
  getGradesRedirect,
  getGradeRedirect,
  getUsersRedirect,
  getUnassignedStudentsRedirect,
  getAssignedStudentsRedirect,
  getLineItemsRedirect,
  deleteLineItemRedirect,
  hasValidSessionAwsRedirect
};
