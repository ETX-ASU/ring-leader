import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import RouteInstructor from "./routes/RouteInstructor/RouteInstructor";
import RouteStudentAssignment from "./routes/RouteStudentAssignment/RouteStudentAssignment";
import "./App.scss";
import RouteDeepLinking from "./routes/RouteDeepLinking/RouteDeepLinking";
import RouteStudent from "./routes/RouteStudent/RouteStudent";
const App: React.FC = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Switch>
          <Route exact path="/instructor">
            <RouteInstructor />
          </Route>
          <Route exact path="/RouteStudent">
            <RouteStudent />
          </Route>
          <Route path="/assignment">
            <RouteStudentAssignment />
          </Route>
          <Route path="/deeplink">
            <RouteDeepLinking />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
