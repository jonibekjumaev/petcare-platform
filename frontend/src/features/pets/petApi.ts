import { api } from "../../app/api";
import type {
  PetDTO,
  PetCreateRequestDTO,
  PetUpdateRequestDTO,
} from "@petcare/shared";

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
    updatePet: builder.mutation<PetDTO, PetUpdateRequestDTO>({
      query: (input) => ({
        url: "/pet/update",
        method: "POST",
        body: input,
      }),
      invalidatesTags: ["Pet"],
    }),
    deletePet: builder.mutation<PetDTO, string>({
      query: (id) => ({
        url: "/pet/delete",
        method: "POST",
        body: { _id: id },
      }),
      invalidatesTags: ["Pet"],
    }),
  }),
});

export const {
  useGetAllPetsQuery,
  useCreatePetMutation,
  useUpdatePetMutation,
  useDeletePetMutation,
} = petApi;
