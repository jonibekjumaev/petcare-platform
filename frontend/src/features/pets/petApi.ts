import { api } from "../../app/api";
import type { PetDTO } from "@petcare/shared";

export const petApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllPets: builder.query<PetDTO[], void>({
      query: () => "/pet/all",
      providesTags: ["Pet"],
    }),
  }),
});

export const { useGetAllPetsQuery } = petApi;
