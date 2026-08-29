import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import type { PetDTO } from "@petcare/shared";
import { PetType, PetGender } from "@petcare/shared";
import { useUpdatePetMutation } from "../features/pets/petApi";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const editPetSchema = z.object({
  petName: z.string().min(1, "Pet name is required"),
  petType: z.nativeEnum(PetType),
  petGender: z.nativeEnum(PetGender),
  petBreed: z.string().optional(),
  petAgeMonths: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), "Age must be a whole number"),
  petWeight: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), "Weight must be a number"),
  petNotes: z.string().optional(),
});
type EditPetFormValues = z.infer<typeof editPetSchema>;

interface EditPetDialogProps {
  pet: PetDTO | null;
  onClose: () => void;
}

export default function EditPetDialog({ pet, onClose }: EditPetDialogProps) {
  const [updatePet, { isLoading, error }] = useUpdatePetMutation();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    pet?.petImage ?? null,
  );
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditPetFormValues>({
    resolver: zodResolver(editPetSchema),
    values: pet
      ? {
          petName: pet.petName,
          petType: pet.petType,
          petGender: pet.petGender,
          petBreed: pet.petBreed ?? "",
          petAgeMonths:
            pet.petAgeMonths !== undefined ? String(pet.petAgeMonths) : "",
          petWeight: pet.petWeight !== undefined ? String(pet.petWeight) : "",
          petNotes: pet.petNotes ?? "",
        }
      : undefined,
  });

  
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!pet) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      setFileError("Image must be smaller than 5MB");
      return;
    }

    setFileError(null);
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = async (values: EditPetFormValues) => {
    try {
      await updatePet({
        _id: pet._id,
        petName: values.petName,
        petType: values.petType,
        petGender: values.petGender,
        petBreed: values.petBreed || undefined,
        petAgeMonths: values.petAgeMonths
          ? Number(values.petAgeMonths)
          : undefined,
        petWeight: values.petWeight ? Number(values.petWeight) : undefined,
        petNotes: values.petNotes || undefined,
        imageFile: imageFile ?? undefined,
      }).unwrap();
      onClose();
    } catch {
      
    }
  };

  return (
    <Dialog open={!!pet} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Pet</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <Avatar
              src={previewUrl ?? undefined}
              alt={pet.petName}
              sx={{ width: 96, height: 96, fontSize: 32 }}
            >
              {!previewUrl && pet.petName.charAt(0).toUpperCase()}
            </Avatar>
            <Button component="label" size="small">
              Change Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {fileError && (
              <Typography variant="caption" color="error">
                {fileError}
              </Typography>
            )}
          </Box>

          <TextField
            label="Pet name"
            fullWidth
            margin="normal"
            {...register("petName")}
            error={!!errors.petName}
            helperText={errors.petName?.message}
          />

          <Grid container spacing={2}>
            <Grid size={6}>
              <Controller
                name="petType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="edit-pet-type-label">Type</InputLabel>
                    <Select
                      labelId="edit-pet-type-label"
                      label="Type"
                      {...field}
                    >
                      <MenuItem value={PetType.DOG}>Dog</MenuItem>
                      <MenuItem value={PetType.CAT}>Cat</MenuItem>
                      <MenuItem value={PetType.FISH}>Fish</MenuItem>
                      <MenuItem value={PetType.OTHER}>Other</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={6}>
              <Controller
                name="petGender"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="edit-pet-gender-label">Gender</InputLabel>
                    <Select
                      labelId="edit-pet-gender-label"
                      label="Gender"
                      {...field}
                    >
                      <MenuItem value={PetGender.MALE}>Male</MenuItem>
                      <MenuItem value={PetGender.FEMALE}>Female</MenuItem>
                      <MenuItem value={PetGender.UNKNOWN}>Unknown</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>

          <TextField
            label="Breed (optional)"
            fullWidth
            margin="normal"
            {...register("petBreed")}
          />

          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                label="Age (months, optional)"
                fullWidth
                margin="normal"
                {...register("petAgeMonths")}
                error={!!errors.petAgeMonths}
                helperText={errors.petAgeMonths?.message}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Weight (kg, optional)"
                fullWidth
                margin="normal"
                {...register("petWeight")}
                error={!!errors.petWeight}
                helperText={errors.petWeight?.message}
              />
            </Grid>
          </Grid>

          <TextField
            label="Notes (optional)"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            {...register("petNotes")}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Failed to update pet. Please try again.
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            Save Changes
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
