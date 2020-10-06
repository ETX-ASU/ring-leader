import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import RouteInstructor from "./routes/RouteInstructor/RouteInstructor";
import RouteAssignment from "./routes/RouteAssignment/RouteAssignment";

import "./App.scss";
import RouteDeepLinking from "./routes/RouteDeepLinking/DeepLinking";
const App: React.FC = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Switch>
          <Route exact path="/instructor">
            <RouteInstructor />
          </Route>
          <Route path="/assignment">
            <RouteAssignment />
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
