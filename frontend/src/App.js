import React from "react";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import { user } from "./reducers/user";

import Signup from "./components/SignUp";
import Login from "./components/Login";
import UserDetails from "./components/UserDetails";

// const BASE_URL = "http://localhost:8080/";
// const BASE_URL = "https://max-sandrine-auth-api.herokuapp.com/";
const BASE_URL = "https://project-auth-518979433183.europe-north1.run.app/";
const SIGNUP_URL = `${BASE_URL}users`;
const LOGIN_URL = `${BASE_URL}sessions`;

const reducer = combineReducers({ user: user.reducer });

const store = configureStore({ reducer });

export const App = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Switch>
          <Route path="/" exact>
            <Login LOGIN_URL={LOGIN_URL} SIGNUP_URL={SIGNUP_URL} />
          </Route>
          <Route path="/signup" exact>
            <Signup SIGNUP_URL={SIGNUP_URL} />
          </Route>
          <Route path="/userdetails" exact>
            <UserDetails SIGNUP_URL={SIGNUP_URL} />
          </Route>
          <Route path="/404">
            <UserDetails SIGNUP_URL={SIGNUP_URL} />
          </Route>
          <Redirect to="/404"></Redirect>
        </Switch>
      </Provider>
    </BrowserRouter>
  );
};
