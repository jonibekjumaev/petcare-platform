import { api } from "../../app/api";
import { setCredentials } from "../auth/authSlice";
import type { MemberDTO, MemberUpdateRequestDTO } from "@petcare/shared";
import type { RootState } from "../../app/store";

export const memberApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMemberDetail: builder.query<MemberDTO, void>({
      query: () => "/member/detail",
      providesTags: ["Member"],
    }),
    updateMember: builder.mutation<MemberDTO, MemberUpdateRequestDTO>({
      query: (input) => ({
        url: "/member/update",
        method: "POST",
        body: input,
      }),
      invalidatesTags: ["Member"],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled, getState }) => {
        try {
          const { data: updatedMember } = await queryFulfilled;
          const state = getState() as RootState;
          const accessToken = state.auth.accessToken;
          if (accessToken) {
            dispatch(setCredentials({ member: updatedMember, accessToken }));
          }
        } catch {
          // xato allaqachon UI'da mutation'ning error holati orqali ko'rsatiladi
        }
      },
    }),
  }),
});

export const { useGetMemberDetailQuery, useUpdateMemberMutation } = memberApi;
