import { api } from "../../app/api";
import type { PetDTO, PetCreateRequestDTO } from "@petcare/shared";

export const petApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllPets: builder.query<PetDTO[], void>({
      query: () => "/pet/all",
      providesTags: ["Pet"],
    }),
    createPet: builder.mutation<PetDTO, PetCreateRequestDTO>({
      query: (input) => ({
        url: "/pet/create",
        method: "POST",
        body: input,
      }),
      invalidatesTags: ["Pet"],
    }),
  }),
});

export const { useGetAllPetsQuery, useCreatePetMutation } = petApi;
