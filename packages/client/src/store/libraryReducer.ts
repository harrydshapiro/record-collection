import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { Song } from "@songhaus/server";

export type Album = {
  albumName: string;
  artistName: string;
  coverArtSrc: string;
  tracks: Song[];
};

type LibraryState = {
  albums: Album[];
};

const initialState: LibraryState = {
  albums: [],
};

const LibrarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setAlbums: (state, action: PayloadAction<Album[]>) => {
      state.albums = action.payload;
    },
  },
});

export const selectAlbums = (state: RootState) => state.library.albums;

export const { setAlbums } = LibrarySlice.actions;

export default LibrarySlice.reducer;
