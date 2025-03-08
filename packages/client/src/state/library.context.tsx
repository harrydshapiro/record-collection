import { createContext, useEffect, useReducer } from "react";
import { getAlbums } from "../api/client";
import { GetAlbumsReturnType } from "@record-collection/server";

type LibraryState = {
  albums: GetAlbumsReturnType;
};

type LibraryAction = {
  type: "newAlbums";
  payload: GetAlbumsReturnType;
};

const initialState: LibraryState = {
  albums: [],
};

export const LibraryContext = createContext(initialState);
export const LibraryDispatchContext =
  createContext<React.Dispatch<LibraryAction> | null>(null);

const libraryReducer: React.Reducer<LibraryState, LibraryAction> = (
  currentState,
  action,
) => {
  switch (action.type) {
    case "newAlbums":
      return {
        ...currentState,
        albums: action.payload,
      };
    default:
      return currentState;
  }
};

export function LibraryProvider({ children }: { children: JSX.Element }) {
  const [libraryState, dispatch] = useReducer(libraryReducer, initialState);

  useEffect(() => {
    void getAlbums().then((a) => {
      dispatch({
        type: "newAlbums",
        payload: a,
      });
    });
  }, []);

  return (
    <LibraryContext.Provider value={libraryState}>
      <LibraryDispatchContext.Provider value={dispatch}>
        {children}
      </LibraryDispatchContext.Provider>
    </LibraryContext.Provider>
  );
}
