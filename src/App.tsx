import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "./App.css";

// Pages
import LandingPage from "./pages/LandingPage";
import MainPage from "./pages/MainPage";

// Components
import DefaultContainer from "./components/DefaultContainer";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* <Redirect path="/" to={{ pathname: "/landing" }} /> */}
        <Switch>
          <Route path="/landing" component={LandingPage} />
          <Route path="/main" component={MainPage} />
          <Route path="/page" component={DefaultContainer} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
