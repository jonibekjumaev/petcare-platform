import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
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
import { PetType, PetGender } from "@petcare/shared";
import { useCreatePetMutation } from "../features/pets/petApi";

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
  const [createPet, { isLoading, error }] = useCreatePetMutation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddPetFormValues>({
    resolver: zodResolver(addPetSchema),
    defaultValues: { petType: PetType.DOG, petGender: PetGender.MALE },
  });

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
      }).unwrap();
      navigate("/checkout");
    } catch {
      // xato allaqachon UI'da error orqali ko'rsatiladi
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add a Pet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Tell us about your pet so we can personalize your orders and
          recommendations.
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
