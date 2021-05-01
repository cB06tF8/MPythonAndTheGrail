import logo from './logo.svg';
import './App.css';

import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Navigation, Footer, Home, UploadFiles } from "./components";
function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/uploadFiles" exact component={() => <UploadFiles />} />
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}
export default App;
