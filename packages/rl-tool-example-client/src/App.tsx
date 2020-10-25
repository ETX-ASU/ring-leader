import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import RouteInstructor from "./routes/RouteInstructor/RouteInstructor";
import RouteStudentAssignment from "./routes/RouteStudentAssignment/RouteStudentAssignment";
import "./App.scss";
import RouteDeepLinking from "./routes/RouteDeepLinking/RouteDeepLinking";
import RouteStudent from "./routes/RouteStudent/RouteStudent";
import {LTI_ASSIGNMENT_REDIRECT, LTI_DEEPLINK_REDIRECT, LTI_INSTRUCTOR_REDIRECT, LTI_STUDENT_REDIRECT}  from "@asu-etx/rl-shared";
const App: React.FC = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Switch>
          <Route exact path={LTI_INSTRUCTOR_REDIRECT}>
            <RouteInstructor />
          </Route>
          <Route exact path={LTI_STUDENT_REDIRECT}>
            <RouteStudent />
          </Route>
          <Route path={LTI_ASSIGNMENT_REDIRECT}>
            <RouteStudentAssignment />
          </Route>
          <Route path={LTI_DEEPLINK_REDIRECT}>
            <RouteDeepLinking />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
