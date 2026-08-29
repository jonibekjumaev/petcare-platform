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
import { useLoginMutation } from "../features/auth/authApi";

const loginSchema = z.object({
  memberNick: z.string().min(1, "Nickname is required"),
  memberPassword: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values).unwrap();
      navigate("/");
    } catch {
      
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom>
        Log in
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
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          {...register("memberPassword")}
          error={!!errors.memberPassword}
          helperText={errors.memberPassword?.message}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Login failed. Please check your credentials.
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={isLoading}
        >
          Log in
        </Button>
      </Box>
    </Container>
  );
}
