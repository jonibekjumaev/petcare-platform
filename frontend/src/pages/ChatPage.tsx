import { useState, useRef, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import SendIcon from "@mui/icons-material/Send";
import { MessageRole } from "@petcare/shared";
import {
  useGetAllSessionsQuery,
  useGetSessionMessagesQuery,
  useSendMessageMutation,
} from "../features/chat/chatApi";
import NewChatDialog from "../components/NewChatDialog";

export default function ChatPage() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: sessions, isLoading: sessionsLoading } =
    useGetAllSessionsQuery();
  const { data: messages, isLoading: messagesLoading } =
    useGetSessionMessagesQuery(activeSessionId!, { skip: !activeSessionId });
  const [sendMessage, { isLoading: isSending, error: sendError }] =
    useSendMessageMutation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!draft.trim() || !activeSessionId) return;
    const content = draft;
    setDraft("");
    try {
      await sendMessage({
        sessionId: activeSessionId,
        messageContent: content,
      }).unwrap();
    } catch {
      // xato sendError orqali ko'rsatiladi
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        AI Pet Advisor
      </Typography>

      <Box sx={{ display: "flex", gap: 2, height: "70vh" }}>
        <Paper sx={{ width: 260, display: "flex", flexDirection: "column" }}>
          <Box sx={{ p: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setDialogOpen(true)}
            >
              New Chat
            </Button>
          </Box>
          {sessionsLoading ? (
            <CircularProgress sx={{ m: 2 }} size={24} />
          ) : (
            <List sx={{ overflowY: "auto" }}>
              {sessions?.map((session) => (
                <ListItemButton
                  key={session._id}
                  selected={session._id === activeSessionId}
                  onClick={() => setActiveSessionId(session._id)}
                >
                  <ListItemText
                    primary={session.sessionTitle}
                    secondary={new Date(session.createdAt).toLocaleDateString()}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Paper>

        <Paper sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {!activeSessionId ? (
            <Box
              sx={{ m: "auto", textAlign: "center", color: "text.secondary" }}
            >
              <Typography>Select a conversation or start a new one.</Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
                {messagesLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  messages?.map((message) => (
                    <Box
                      key={message._id}
                      sx={{
                        display: "flex",
                        justifyContent:
                          message.messageRole === MessageRole.USER
                            ? "flex-end"
                            : "flex-start",
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: "75%",
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          bgcolor:
                            message.messageRole === MessageRole.USER
                              ? "primary.main"
                              : "grey.100",
                          color:
                            message.messageRole === MessageRole.USER
                              ? "primary.contrastText"
                              : "text.primary",
                        }}
                      >
                        <Typography variant="body2">
                          {message.messageContent}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                )}
                {isSending && <CircularProgress size={20} sx={{ ml: 1 }} />}
                <div ref={messagesEndRef} />
              </Box>

              {sendError && (
                <Alert severity="error" sx={{ mx: 2 }}>
                  Failed to send message. Please try again.
                </Alert>
              )}

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  p: 2,
                  borderTop: 1,
                  borderColor: "divider",
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Ask about your pet..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={isSending}
                />
                <IconButton
                  color="primary"
                  onClick={handleSend}
                  disabled={isSending || !draft.trim()}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </>
          )}
        </Paper>
      </Box>

      <NewChatDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={(sessionId) => setActiveSessionId(sessionId)}
      />
    </Container>
  );
}
