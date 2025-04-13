import React from "react";
import ReactGA from 'react-ga4';
import {
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import { ErrorBoundary } from './components/ErrorBoundary';
import { ANALYTICS } from './constants/index';
import { HomePage } from "./pages/HomePage";
import { NoRDVPage } from "./pages/NoRDVPage";
import { SchedulerConfirmationPage } from "./pages/SchedulerConfirmationPage";
import { SchedulerPage } from './pages/SchedulerPage';
import { SchedulerRefusalPage } from "./pages/SchedulerRefusalPage";
import { ValidationPage } from './pages/ValidationPage';

ReactGA.initialize(ANALYTICS);

export default function App() {
  document.documentElement.lang = "fr";
  document.documentElement.translate = false;
  return (
    <ErrorBoundary>
      <Router>
          <Switch>
            <Route path="/validate/:ffaSession">
              {/* Make request then redirect to validate */}
              <ValidationPage />
            </Route>
            <Route path="/validate">
              {HomePage}
            </Route>
            <Route path="/schedule/confirmed">
              <SchedulerConfirmationPage />
            </Route>
            <Route path="/schedule/refusal">
              <SchedulerRefusalPage />
            </Route>
            <Route path="/schedule/otherdates">
              <SchedulerPage />
            </Route>
            <Route path="/schedule">
              <SchedulerPage />
            </Route>
            <Route path="/error">
              {NoRDVPage}
            </Route>
            {/* <Route path="/login">
              <LoginPage />
            </Route> */}
            <Route path="/">  
              {/* <Redirect to="/login" /> */}
              <ValidationPage />
            </Route>
          </Switch>
      </Router>
    </ErrorBoundary>
  );
}