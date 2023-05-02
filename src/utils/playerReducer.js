import { async } from "@firebase/util";
import { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import axios from "axios";
import { Provider } from "react-redux";
import store from "./store";

const initialState = { undefined };

const playerReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_DEVICE_ID":
      return {
        ...state,
        deviceId: payload.deviceId,
      };
    case "GET_DEVICE_ID":
      return state.deviceId;
    default:
      return state;
  }
};

export default playerReducer;
