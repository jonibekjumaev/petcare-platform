import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import { useGetAllPetsQuery } from "../features/pets/petApi";
import { useCreateSessionMutation } from "../features/chat/chatApi";

const newChatSchema = z.object({
  petId: z.string().min(1, "Please select a pet"),
});
type NewChatFormValues = z.infer<typeof newChatSchema>;

interface NewChatDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: (sessionId: string) => void;
}

export default function NewChatDialog({
  open,
  onClose,
  onCreated,
}: NewChatDialogProps) {
  const { data: pets } = useGetAllPetsQuery();
  const [createSession, { isLoading, error }] = useCreateSessionMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewChatFormValues>({
    resolver: zodResolver(newChatSchema),
    defaultValues: { petId: "" },
  });

  const onSubmit = async (values: NewChatFormValues) => {
    try {
      const session = await createSession({ petId: values.petId }).unwrap();
      onCreated(session._id);
      onClose();
    } catch {
      // xato allaqachon error orqali ko'rsatiladi
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Start a New Conversation</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <Controller
            name="petId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.petId}>
                <InputLabel id="new-chat-pet-label">
                  Which pet is this about?
                </InputLabel>
                <Select
                  labelId="new-chat-pet-label"
                  label="Which pet is this about?"
                  {...field}
                >
                  {pets?.map((pet) => (
                    <MenuItem key={pet._id} value={pet._id}>
                      {pet.petName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.petId && (
                  <FormHelperText>{errors.petId.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          {pets?.length === 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              You need to add a pet first.
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Failed to start conversation. Please try again.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            Start Chat
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
