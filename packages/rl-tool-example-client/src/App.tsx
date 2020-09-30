import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import RouteInstructor from "./routes/RouteInstructor/RouteInstructor";
import RouteAssignment from "./routes/RouteAssignment/RouteAssignment";

import "./App.scss";
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
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
