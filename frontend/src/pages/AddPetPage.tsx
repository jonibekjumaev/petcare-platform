import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams } from "react-router";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import PetsIcon from "@mui/icons-material/Pets";
import PhotoCameraIcon from "@mui/icons-material/PhotoCameraOutlined";
import { PetType, PetGender } from "@petcare/shared";
import { useCreatePetMutation } from "../features/pets/petApi";
import { PET_DRAFT_KEY } from "../data/advisor";
import { radius, shadow } from "../theme";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function readDraft(params: URLSearchParams): Partial<AddPetFormValues> {
  let source = params;
  if (!source.get("petType")) {
    try {
      const stored = sessionStorage.getItem(PET_DRAFT_KEY);
      if (stored) source = new URLSearchParams(stored);
    } catch {
    }
  }

  const draft: Partial<AddPetFormValues> = {};

  const type = source.get("petType");
  if (type && Object.values(PetType).includes(type as PetType)) {
    draft.petType = type as PetType;
  }

  const months = source.get("petAgeMonths");
  if (months && /^\d+$/.test(months)) draft.petAgeMonths = months;

  const weight = source.get("petWeight");
  if (weight && Number.isFinite(Number(weight)) && Number(weight) > 0) {
    draft.petWeight = weight;
  }

  return draft;
}

const addPetSchema = z.object({
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
type AddPetFormValues = z.infer<typeof addPetSchema>;

export default function AddPetPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [createPet, { isLoading, error }] = useCreatePetMutation();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddPetFormValues>({
    resolver: zodResolver(addPetSchema),
    defaultValues: {
      petType: PetType.DOG,
      petGender: PetGender.MALE,
      ...readDraft(searchParams),
    },
  });

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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

  const onSubmit = async (values: AddPetFormValues) => {
    try {
      await createPet({
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
      navigate("/pets");
    } catch {
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper
        sx={(t) => ({
          p: 4,
          borderRadius: `${radius.lg}px`,
          boxShadow: shadow.sm,
          backgroundColor: "#FFFFFF",
          ...t.applyStyles("dark", {
            backgroundColor: t.vars.palette.background.paper,
            border: `1px solid ${t.vars.palette.divider}`,
          }),
        })}
      >
        <Typography variant="h4" gutterBottom>
          Add a Pet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Tell us about your pet so we can personalize your orders and
          recommendations.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={(t) => ({
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#FFFFFF",
              ...t.applyStyles("dark", { backgroundColor: t.vars.palette.background.paper }),
            },
          })}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={previewUrl ?? undefined}
                sx={{ width: 104, height: 104, bgcolor: "background.muted" }}
              >
                {!previewUrl && (
                  <PetsIcon sx={{ fontSize: 42, color: "text.disabled" }} />
                )}
              </Avatar>
              <IconButton
                component="label"
                size="small"
                aria-label="Upload pet photo"
                sx={(t) => ({
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  bgcolor: "background.paper",
                  border: 1,
                  borderColor: "divider",
                  boxShadow: shadow.sm,
                  "&:hover": {
                    bgcolor: t.vars.palette.primary.main,
                    color: t.vars.palette.primary.contrastText,
                    borderColor: t.vars.palette.primary.main,
                  },
                })}
              >
                <PhotoCameraIcon sx={{ fontSize: 16 }} />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </IconButton>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              Upload Photo
            </Typography>
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
                    <InputLabel id="pet-type-label">Type</InputLabel>
                    <Select labelId="pet-type-label" label="Type" {...field}>
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
                    <InputLabel id="pet-gender-label">Gender</InputLabel>
                    <Select
                      labelId="pet-gender-label"
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
              Failed to add pet. Please try again.
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={isLoading}
          >
            Add Pet
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
