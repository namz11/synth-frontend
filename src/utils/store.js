import { configureStore } from "@reduxjs/toolkit";
import { composeWithDevTools } from "@redux-devtools/extension";
import playerReducer from "./playerReducer";

const store = configureStore({ reducer: playerReducer }, composeWithDevTools());

export default store;
