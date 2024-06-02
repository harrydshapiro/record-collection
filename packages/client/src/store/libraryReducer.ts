import {
  Action,
  createSlice,
  PayloadAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import { RootState } from ".";
import { GetAlbumsReturnType } from "@songhaus/server";
import { getAlbums } from "../api/client";

// TYPES

type LibraryState = {
  albums: GetAlbumsReturnType;
};

const initialState: LibraryState = {
  albums: [],
};

// REDUCERS

const LibrarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setAlbums: (state, action: PayloadAction<GetAlbumsReturnType>) => {
      state.albums = action.payload;
    },
  },
});

export default LibrarySlice.reducer;

// SELECTORS

export const selectAlbums = (state: RootState) => state.library.albums;

// THUNKS

const { setAlbums } = LibrarySlice.actions;

export const updateAlbums =
  (): ThunkAction<void, RootState, unknown, Action> => async (dispatch) => {
    const albums = await getAlbums();
    dispatch(setAlbums(albums));
  };
