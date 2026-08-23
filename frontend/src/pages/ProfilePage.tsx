import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import type { MemberDTO } from "@petcare/shared";
import {
  useGetMemberDetailQuery,
  useUpdateMemberMutation,
} from "../features/member/memberApi";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB — backenddagi multer limitiga mos

const profileSchema = z.object({
  memberNick: z.string().min(1, "Nickname is required"),
  memberPhone: z.string().min(1, "Phone number is required"),
  memberAddress: z.string().optional(),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { data: member, isLoading, isError } = useGetMemberDetailQuery();

  if (isLoading) return <CircularProgress sx={{ m: 4 }} />;
  if (isError || !member) {
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        Failed to load your profile.
      </Alert>
    );
  }

  return <ProfileForm member={member} />;
}

function ProfileForm({ member }: { member: MemberDTO }) {
  const [updateMember, { isLoading: isSaving, error: saveError }] =
    useUpdateMemberMutation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    member.memberImage ?? null,
  );
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      memberNick: member.memberNick,
      memberPhone: member.memberPhone,
      memberAddress: member.memberAddress ?? "",
    },
  });

  // Yangi tanlangan fayl uchun yaratilgan blob: URL'ni xotiradan tozalash
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
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

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const updated = await updateMember({
        memberNick: values.memberNick,
        memberPhone: values.memberPhone,
        memberAddress: values.memberAddress || undefined,
        imageFile: imageFile ?? undefined,
      }).unwrap();
      setImageFile(null);
      setPreviewUrl(updated.memberImage ?? null);
      setSnackbarOpen(true);
    } catch {
      // xato allaqachon saveError orqali UI'da ko'rsatiladi
    }
  };

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
              sx={{ width: 96, height: 96, bgcolor: "action.hover" }}
            >
              {!previewUrl && (
                <PersonIcon sx={{ fontSize: 40, color: "text.disabled" }} />
              )}
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
