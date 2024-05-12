import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

type UserState = {
    apiKey: string | null;
};

const initialState: UserState = {
    apiKey: null,
};

const UserSlice = createSlice({
    name: "userInformation",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<string>) => {
            state.apiKey = action.payload
        },
        logout: (state) => {
            state.apiKey = null
        },
    },
});

export const selectHasAdminAuth = (state: RootState) => !!state.user.apiKey
export const selectApiKey = (state: RootState) => state.user.apiKey

export const { login, logout } = UserSlice.actions;

export default UserSlice.reducer;
