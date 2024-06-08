import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { GetAlbumsReturnType } from "@songhaus/server";

export interface LibraryState {
  albums: GetAlbumsReturnType;
}

const initialState: LibraryState = {
  albums: [],
};

export const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setAlbums: (state, action: PayloadAction<GetAlbumsReturnType>) => {
      state.albums = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAlbums } = librarySlice.actions;

export default librarySlice.reducer;
