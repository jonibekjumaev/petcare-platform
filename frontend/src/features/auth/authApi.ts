import { api } from "../../app/api";
import { setCredentials } from "./authSlice";
import type {
  AuthResponseDTO,
  LoginRequestDTO,
  SignupRequestDTO,
} from "@petcare/shared";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponseDTO, LoginRequestDTO>({
      query: (credentials) => ({
        url: "/member/login",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {
          
        }
      },
    }),
    signup: builder.mutation<AuthResponseDTO, SignupRequestDTO>({
      query: (input) => ({
        url: "/member/signup",
        method: "POST",
        body: input,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {
          
        }
      },
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;
