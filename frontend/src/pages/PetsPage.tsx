import { useState } from "react";
import { Link as RouterLink } from "react-router";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import PetsIcon from "@mui/icons-material/Pets";
import type { PetDTO } from "@petcare/shared";
import {
  useGetAllPetsQuery,
  useDeletePetMutation,
} from "../features/pets/petApi";
import EditPetDialog from "../components/EditPetDialog";

const PET_IMAGE_HEIGHT = 180;

export default function PetsPage() {
  const { data: pets, isLoading, isError } = useGetAllPetsQuery();
  const [deletePet, { isLoading: isDeleting }] = useDeletePetMutation();

  const [editingPet, setEditingPet] = useState<PetDTO | null>(null);
  const [deletingPet, setDeletingPet] = useState<PetDTO | null>(null);

  const handleConfirmDelete = async () => {
    if (!deletingPet) return;
    try {
      await deletePet(deletingPet._id).unwrap();
      setDeletingPet(null);
    } catch {
      // xato holatida dialog ochiq qoladi, foydalanuvchi qayta urinishi mumkin
    }
  };

  if (isLoading) return <CircularProgress sx={{ m: 4 }} />;
  if (isError || !pets) {
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        Failed to load your pets.
      </Alert>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">My Pets</Typography>
        <Button variant="contained" component={RouterLink} to="/pets/new">
          Add Pet
        </Button>
      </Box>

      {pets.length === 0 ? (
        <Alert severity="info">You haven't added any pets yet.</Alert>
      ) : (
        <Grid container spacing={3}>
          {pets.map((pet) => (
            <Grid key={pet._id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                {pet.petImage ? (
                  <Box
                    sx={{
                      height: PET_IMAGE_HEIGHT,
                      bgcolor: "action.hover",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={pet.petImage}
                      alt={pet.petName}
                      sx={{
                        height: "100%",
                        width: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: PET_IMAGE_HEIGHT,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "action.hover",
                    }}
                  >
                    <PetsIcon sx={{ fontSize: 64, color: "text.disabled" }} />
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{pet.petName}</Typography>
                  <Box
                    sx={{ display: "flex", gap: 1, flexWrap: "wrap", my: 1 }}
                  >
                    <Chip label={pet.petType} size="small" />
                    <Chip label={pet.petGender} size="small" />
                  </Box>
                  {pet.petBreed && (
                    <Typography variant="body2" color="text.secondary">
                      Breed: {pet.petBreed}
                    </Typography>
                  )}
                  {pet.petAgeMonths !== undefined && (
                    <Typography variant="body2" color="text.secondary">
                      Age: {pet.petAgeMonths} months
                    </Typography>
                  )}
                  {pet.petWeight !== undefined && (
                    <Typography variant="body2" color="text.secondary">
                      Weight: {pet.petWeight} kg
                    </Typography>
                  )}
                  {pet.petNotes && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {pet.petNotes}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => setEditingPet(pet)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => setDeletingPet(pet)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <EditPetDialog
        key={editingPet?._id}
        pet={editingPet}
        onClose={() => setEditingPet(null)}
      />

      <Dialog open={!!deletingPet} onClose={() => setDeletingPet(null)}>
        <DialogTitle>Delete pet?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{deletingPet?.petName}"? This
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingPet(null)}>Cancel</Button>
          <Button
            color="error"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
