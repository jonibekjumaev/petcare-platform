import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import {
  useGetMemberDetailQuery,
  useUpdateMemberMutation,
} from "../features/member/memberApi";

const profileSchema = z.object({
  memberNick: z.string().min(1, "Nickname is required"),
  memberPhone: z.string().min(1, "Phone number is required"),
  memberAddress: z.string().optional(),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { data: member, isLoading, isError } = useGetMemberDetailQuery();
  const [updateMember, { isLoading: isSaving, error: saveError }] =
    useUpdateMemberMutation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: member
      ? {
          memberNick: member.memberNick,
          memberPhone: member.memberPhone,
          memberAddress: member.memberAddress ?? "",
        }
      : undefined,
  });

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await updateMember({
        memberNick: values.memberNick,
        memberPhone: values.memberPhone,
        memberAddress: values.memberAddress || undefined,
      }).unwrap();
      setSnackbarOpen(true);
    } catch {
      // xato allaqachon saveError orqali UI'da ko'rsatiladi
    }
  };

  if (isLoading) return <CircularProgress sx={{ m: 4 }} />;
  if (isError || !member) {
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        Failed to load your profile.
      </Alert>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Member since {new Date(member.createdAt).toLocaleDateString()} ·{" "}
          {member.memberPoints} points
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Nickname"
            fullWidth
            margin="normal"
            {...register("memberNick")}
            error={!!errors.memberNick}
            helperText={errors.memberNick?.message}
          />
          <TextField
            label="Phone"
            fullWidth
            margin="normal"
            {...register("memberPhone")}
            error={!!errors.memberPhone}
            helperText={errors.memberPhone?.message}
          />
          <TextField
            label="Address (optional)"
            fullWidth
            margin="normal"
            {...register("memberAddress")}
            error={!!errors.memberAddress}
            helperText={errors.memberAddress?.message}
          />

          {saveError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Failed to update profile. Please try again.
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            disabled={isSaving}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Profile updated"
      />
    </Container>
  );
}
