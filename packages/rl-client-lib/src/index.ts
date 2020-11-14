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


import { submitGrade as submitGradeAws, submitInstructorGrade as submitInstructorGradeAws
  , getGrades as getGradesAws } from "./servicesAws/GradeService";
import { getUsers as getUsersAws, getUnassignedStudents as getUnassignedStudentsAws, 
  getAssignedStudents as getAssignedStudentsAws} from "./servicesAws/UserService";
import { getLineItems as getLineItemsAws, 
  deleteLineItem as deleteLineItemAws} from "./servicesAws/LineItemService";
import {
  getDeepLinkResourceLinks as getDeepLinkResourceLinksAws,
  submitResourceSelection as submitResourceSelectionAws
} from "./servicesAws/DeepLinkService";

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
  
  getDeepLinkResourceLinksAws,
  submitResourceSelectionAws,
  submitGradeAws,
  submitInstructorGradeAws,
  getGradesAws,
  getUsersAws,
  getUnassignedStudentsAws,
  getAssignedStudentsAws,
  getLineItemsAws,
  deleteLineItemAws,
  
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
