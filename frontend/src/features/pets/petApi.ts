import { api } from "../../app/api";
import type {
  PetDTO,
  PetCreateRequestDTO,
  PetUpdateRequestDTO,
} from "@petcare/shared";

interface CreatePetArgs extends Omit<PetCreateRequestDTO, "petImage"> {
  imageFile?: File;
}

interface UpdatePetArgs extends Omit<PetUpdateRequestDTO, "petImage"> {
  imageFile?: File;
}

const buildPetFormData = (
  fields: Record<string, unknown>,
  imageFile?: File,
): FormData => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, String(value));
  });
  if (imageFile) formData.append("petImage", imageFile);
  return formData;
};

export const petApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllPets: builder.query<PetDTO[], void>({
      query: () => "/pet/all",
      providesTags: ["Pet"],
    }),
    createPet: builder.mutation<PetDTO, CreatePetArgs>({
      query: ({ imageFile, ...fields }) => ({
        url: "/pet/create",
        method: "POST",
        body: buildPetFormData(fields, imageFile),
      }),
      invalidatesTags: ["Pet"],
    }),
    updatePet: builder.mutation<PetDTO, UpdatePetArgs>({
      query: ({ imageFile, ...fields }) => ({
        url: "/pet/update",
        method: "POST",
        body: buildPetFormData(fields, imageFile),
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
