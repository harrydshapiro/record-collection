import { configureStore } from "@reduxjs/toolkit";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import libraryReducer from "./libraryReducer";

export type RootReducerShape = {
  library: ReturnType<typeof libraryReducer>;
};

export const reduxStore = configureStore({
  reducer: { library: libraryReducer },
  devTools: true,
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;
export type ThunkType = (
  dispatch: AppDispatch,
  getState: () => RootReducerShape,
) => void;
export type ThunkAction<
  R, // Return type of the thunk function
  S, // state type used by getState
  E, // any "extra argument" injected into the thunk
  A extends AnyAction, // known types of actions that can be dispatched
> = (
  dispatch: ThunkDispatch<S, E, A>,
  getState: () => S,
  extraArgument: E,
) => R;
