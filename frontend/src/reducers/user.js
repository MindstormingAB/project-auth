import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  login: {
    accessToken: "",
    userId: "",
    alias: "",
  },
};

export const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      const { accessToken } = action.payload;
      state.login.accessToken = accessToken;
    },
    setUserId: (state, action) => {
      const { userId } = action.payload;
      state.login.userId = userId;
    },
    setAlias: (state, action) => {
      const { alias } = action.payload;
      state.login.alias = alias;
    },
    deleteAccessToken: (state, action) => {
      state.login.accessToken = "";
    },
    deleteUserId: (state, action) => {
      state.login.userId = "";
    },
  }
});