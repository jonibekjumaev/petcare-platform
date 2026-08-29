import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { useSignupMutation } from "../features/auth/authApi";

const signupSchema = z.object({
  memberNick: z.string().min(3, "Nickname must be at least 3 characters"),
  memberPhone: z.string().min(1, "Phone number is required"),
  memberPassword: z.string().min(6, "Password must be at least 6 characters"),
  memberAddress: z.string().optional(),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const [signup, { isLoading, error }] = useSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await signup(values).unwrap();
      navigate("/");
    } catch {
      
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom>
        Sign up
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
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          {...register("memberPassword")}
          error={!!errors.memberPassword}
          helperText={errors.memberPassword?.message}
        />
        <TextField
          label="Address (optional)"
          fullWidth
          margin="normal"
          {...register("memberAddress")}
          error={!!errors.memberAddress}
          helperText={errors.memberAddress?.message}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Sign up failed. Please try again.
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={isLoading}
        >
          Sign up
        </Button>
      </Box>
    </Container>
  );
}
