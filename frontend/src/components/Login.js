import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from 'react-router-dom';

import { user } from "../reducers/user";
import StartPage from "./StartPage";

const Login = ({ LOGIN_URL }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionToken = localStorage.getItem("sessionToken");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState(true);

  const handleCredentials = (credentials) => {
    localStorage.setItem("sessionToken", credentials.accessToken);
    localStorage.setItem("sessionId", credentials.userId);
    localStorage.setItem("sessionAlias", credentials.alias);
    dispatch(user.actions.setAccessToken({ accessToken: credentials.accessToken }));
    dispatch(user.actions.setUserId({ userId: credentials.userId }));
    dispatch(user.actions.setAlias({ alias: credentials.alias }));
  };

  const handleLogin = (event) => {
    event.preventDefault();
    fetch(LOGIN_URL, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) {
          setResponse(false);
        }
        return res.json();
      })
      .then((json) => {
        handleCredentials(json);
        history.push("/");
        setEmail("");
        setPassword("");
      })
      .catch((error) => console.error(error))
  };

  return (
    <>
      {sessionToken && <StartPage />}
      {!sessionToken && (
        <section>
          <h1>Welcome to Max and Sandrine's app!</h1>
          <form onSubmit={handleLogin}>
            <p>Please enter your credentials below.</p>
            <label>
              Email:
              <input
                required
                minLength="5"
                type="email"
                value={email}
                name="email"
                onChange={event => setEmail(event.target.value)} />
            </label>
            <label>
              Password:
              <input
                required
                minLength="5"
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)} />
            </label>
            <button type="submit">Login</button>
            {!response && <p>Incorrect credentials, please try again.</p>}
            <p>Not a member yet? Please sign up <Link to={"/signup"}>here</Link>.</p>
          </form>
        </section>
      )}
    </>
  );
};

export default Login;