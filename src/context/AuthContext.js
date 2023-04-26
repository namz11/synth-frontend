import React, { createContext, useEffect, useReducer, useRef } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  currentUser: null,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    // This will run only on the client side, after the component is mounted
    const user = JSON.parse(localStorage.getItem("user")) || null;
    dispatch({ type: "SET_USER", payload: user });
  }, []);

  useEffect(() => {
    if (state.currentUser) {
      localStorage.setItem("user", JSON.stringify(state.currentUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser: state.currentUser, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
