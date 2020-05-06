import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
 import Home from "./screens/Home";
import Table from "./components/Table";

function App() {
  return (
    <Router>
      <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/table">
            <Table />
          </Route>
      </Switch>
    </Router>
  );
}

export default App;
