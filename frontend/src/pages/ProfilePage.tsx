import { useState, useEffect } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { Link as RouterLink } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import PersonIcon from "@mui/icons-material/Person";
import PhotoCameraIcon from "@mui/icons-material/PhotoCameraOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import type { Theme } from "@mui/material/styles";
import type { MemberDTO } from "@petcare/shared";
import {
  useGetMemberDetailQuery,
  useUpdateMemberMutation,
} from "../features/member/memberApi";
import PaymentMethodCard from "../components/profile/PaymentMethodCard";
import { radius, shadow, duration as motion, easing } from "../theme";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const whiteSurface = (t: Theme) => ({
  backgroundColor: "#FFFFFF",
  ...t.applyStyles("dark", {
    backgroundColor: t.vars.palette.background.paper,
    border: `1px solid ${t.vars.palette.divider}`,
  }),
});

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

  return <ProfileScreen member={member} />;
}

function ProfileScreen({ member }: { member: MemberDTO }) {
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
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <ProfileHero
        member={member}
        previewUrl={previewUrl}
        onFileChange={handleFileChange}
        fileError={fileError}
      />

      <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mt: { xs: 0.5, md: 1 } }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={(t) => ({ p: { xs: 3, md: 4 }, boxShadow: shadow.sm, ...whiteSurface(t) })}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Edit details
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
                {isSaving ? <CircularProgress size={22} sx={{ color: "inherit" }} /> : "Save Changes"}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 3, md: 4 } }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <QuickLinkCard
                to="/pets"
                icon={<PetsOutlinedIcon />}
                title="My Pets"
                subtitle="Profiles, breed & care notes"
              />
              <QuickLinkCard
                to="/orders"
                icon={<ReceiptLongOutlinedIcon />}
                title="My Orders"
                subtitle="Track and manage purchases"
              />
            </Box>

            <PaymentMethodCard member={member} />
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Profile updated"
      />
    </Container>
  );
}

interface ProfileHeroProps {
  member: MemberDTO;
  previewUrl: string | null;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  fileError: string | null;
}

function ProfileHero({ member, previewUrl, onFileChange, fileError }: ProfileHeroProps) {
  return (
    <Paper sx={(t) => ({ overflow: "hidden", mb: { xs: 3, md: 4 }, boxShadow: shadow.sm, ...whiteSurface(t) })}>
      <Box
        sx={(t) => ({
          height: 88,
          background: `linear-gradient(135deg, ${t.vars.palette.moss[500]}, ${t.vars.palette.moss[700]})`,
        })}
      />

      <Box sx={{ px: { xs: 3, md: 4 }, pb: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: 2.5,
            mt: -6.5,
          }}
        >
          <Box sx={{ position: "relative", flexShrink: 0 }}>
            <Avatar
              src={previewUrl ?? undefined}
              sx={{
                width: 112,
                height: 112,
                border: "4px solid",
                borderColor: "background.paper",
                boxShadow: shadow.md,
                bgcolor: "action.hover",
              }}
            >
              {!previewUrl && <PersonIcon sx={{ fontSize: 44, color: "text.disabled" }} />}
            </Avatar>
            <IconButton
              component="label"
              size="small"
              aria-label="Change profile photo"
              sx={{
                position: "absolute",
                bottom: 2,
                right: 2,
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                boxShadow: shadow.sm,
                transition: `background-color ${motion.base}ms ${easing.out}, color ${motion.base}ms ${easing.out}`,
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  borderColor: "primary.main",
                },
              }}
            >
              <PhotoCameraIcon sx={{ fontSize: 16 }} />
              <input type="file" accept="image/*" hidden onChange={onFileChange} />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, textAlign: { xs: "center", sm: "left" }, minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", sm: "flex-start" },
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {member.memberNick}
              </Typography>
              <Chip
                label={member.memberType}
                size="small"
                sx={{
                  fontSize: ".6875rem",
                  fontWeight: 700,
                  letterSpacing: ".04em",
                  height: 22,
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Member since {new Date(member.createdAt).toLocaleDateString()}
            </Typography>
            {member.memberAddress && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", sm: "flex-start" },
                  gap: 0.5,
                  mt: 1,
                  color: "text.secondary",
                }}
              >
                <LocationOnIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2" noWrap>
                  {member.memberAddress}
                </Typography>
              </Box>
            )}
          </Box>

          <Box
            sx={(t) => ({
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              px: 2.25,
              py: 1.25,
              borderRadius: `${radius.lg}px`,
              bgcolor: t.vars.palette.apricot[50],
              border: "1px solid",
              borderColor: t.vars.palette.apricot[200],
              ...t.applyStyles("dark", {
                backgroundColor: "rgba(255,255,255,.05)",
                borderColor: t.vars.palette.apricot[700],
              }),
            })}
          >
            <EmojiEventsOutlinedIcon sx={{ color: "secondary.dark" }} />
            <Box>
              <Typography sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                {member.memberPoints}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                points
              </Typography>
            </Box>
          </Box>
        </Box>

        {fileError && (
          <Typography
            variant="caption"
            color="error"
            sx={{ display: "block", mt: 1.5, textAlign: { xs: "center", sm: "left" } }}
          >
            {fileError}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

function QuickLinkCard({
  to,
  icon,
  title,
  subtitle,
}: {
  to: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Box
      component={RouterLink}
      to={to}
      sx={(t) => ({
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2.25,
        borderRadius: `${radius.lg}px`,
        textDecoration: "none",
        color: "inherit",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: shadow.sm,
        ...whiteSurface(t),
        transition: `transform ${motion.base}ms ${easing.out}, box-shadow ${motion.base}ms ${easing.out}, border-color ${motion.base}ms ${easing.out}`,
        "@media (hover: hover)": {
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: shadow.md,
            borderColor: t.vars.palette.primary.main,
          },
          "&:hover .ql-chevron": { transform: "translateX(2px)", color: t.vars.palette.primary.main },
        },
      })}
    >
      <Box
        sx={(t) => ({
          flex: "none",
          width: 44,
          height: 44,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          backgroundColor: t.vars.palette.moss[50],
          border: "1px solid",
          borderColor: t.vars.palette.moss[200],
          color: t.vars.palette.primary.main,
          ...t.applyStyles("dark", {
            backgroundColor: "rgba(255,255,255,.05)",
            borderColor: t.vars.palette.moss[700],
          }),
        })}
      >
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {subtitle}
        </Typography>
      </Box>
      <ChevronRightIcon
        className="ql-chevron"
        sx={{ color: "text.disabled", transition: `transform ${motion.base}ms ${easing.out}, color ${motion.base}ms ${easing.out}` }}
      />
    </Box>
  );
}
