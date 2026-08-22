import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MemberDTO } from "@petcare/shared";

interface AuthState {
  member: MemberDTO | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  member: JSON.parse(localStorage.getItem("member") ?? "null"),
  accessToken: localStorage.getItem("accessToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ member: MemberDTO; accessToken: string }>,
    ) => {
      state.member = action.payload.member;
      state.accessToken = action.payload.accessToken;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("member", JSON.stringify(action.payload.member));
    },
    logout: (state) => {
      state.member = null;
      state.accessToken = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("member");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
