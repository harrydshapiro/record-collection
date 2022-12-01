import { createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

type UserState = {
    hasAdminAuth: boolean;
};

const initialState: UserState = {
    hasAdminAuth: true,
};

const UserSlice = createSlice({
    name: "userInformation",
    initialState,
    reducers: {
        login: (state) => {
            state.hasAdminAuth = true
        },
        logout: (state) => {
            state.hasAdminAuth = false
        },
    },
});

export const selectHasAdminAuth = (state: RootState) => state.user.hasAdminAuth

export const { login, logout } = UserSlice.actions;

export default UserSlice.reducer;
