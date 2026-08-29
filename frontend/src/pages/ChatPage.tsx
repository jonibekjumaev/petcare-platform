import { useState, useRef, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import { MessageRole } from "@petcare/shared";
import type { ChatSessionDTO } from "@petcare/shared";
import {
  useGetAllSessionsQuery,
  useGetSessionMessagesQuery,
  useSendMessageMutation,
  useDeleteSessionMutation,
} from "../features/chat/chatApi";
import { useGetAllPetsQuery } from "../features/pets/petApi";
import NewChatDialog from "../components/NewChatDialog";
import { PawMark } from "../assets/art";
import { radius, shadow, duration as motion, easing } from "../theme";

export default function ChatPage() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  const { data: sessions, isLoading: sessionsLoading } = useGetAllSessionsQuery();
  const { data: messages, isLoading: messagesLoading } = useGetSessionMessagesQuery(
    activeSessionId!,
    { skip: !activeSessionId },
  );
  const [sendMessage, { isLoading: isSending, error: sendError }] = useSendMessageMutation();
  const [deleteSession, { isLoading: isDeleting, error: deleteError }] = useDeleteSessionMutation();
  const { data: pets } = useGetAllPetsQuery();

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const activeSession = sessions?.find((s) => s._id === activeSessionId);
  const petImageFor = (petId: string) => pets?.find((p) => p._id === petId)?.petImage;

  const pendingEchoed =
    pendingMessage != null &&
    messages?.some((m) => m.messageRole === MessageRole.USER && m.messageContent === pendingMessage);
  const showPending = pendingMessage != null && !pendingEchoed;

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showPending, isSending]);

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setPendingMessage(null);
  };

  const handleSend = async () => {
    if (!draft.trim() || !activeSessionId) return;
    const content = draft;
    setDraft("");
    setPendingMessage(content);
    try {
      await sendMessage({ sessionId: activeSessionId, messageContent: content }).unwrap();
    } catch {
      setPendingMessage(null);
      setDraft(content);
    }
  };

  const handleConfirmDelete = async () => {
    if (!activeSessionId) return;
    try {
      await deleteSession(activeSessionId).unwrap();
      setActiveSessionId(null);
      setPendingMessage(null);
      setConfirmingDelete(false);
    } catch {
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          AI Pet Advisor
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          One conversation per pet, kept separate — every answer starts from their profile and order history.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 2.5 },
          height: { xs: "auto", sm: "72vh" },
          minHeight: { sm: 560 },
        }}
      >
        <SessionsSidebar
          sessions={sessions}
          loading={sessionsLoading}
          activeSessionId={activeSessionId}
          petImageFor={petImageFor}
          onSelect={handleSelectSession}
          onNewChat={() => setDialogOpen(true)}
        />

        <Paper
          sx={(t) => ({
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: { xs: 520, sm: "100%" },
            borderRadius: `${radius.lg}px`,
            boxShadow: shadow.sm,
            backgroundColor: "#FFFFFF",
            ...t.applyStyles("dark", {
              backgroundColor: t.vars.palette.background.paper,
              border: `1px solid ${t.vars.palette.divider}`,
            }),
          })}
        >
          {!activeSession ? (
            <EmptyState onNewChat={() => setDialogOpen(true)} />
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: { xs: 2, md: 3 },
                  py: 2,
                  borderBottom: 1,
                  borderColor: "divider",
                  flexShrink: 0,
                }}
              >
                <Avatar
                  src={petImageFor(activeSession.petId)}
                  sx={{ width: 42, height: 42, bgcolor: "primary.main", color: "primary.contrastText" }}
                >
                  <PawMark width={19} height={19} />
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography noWrap sx={{ fontWeight: 600 }}>
                    {activeSession.sessionTitle}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "primary.main", flex: "none" }} />
                    <Typography variant="caption" color="text.secondary">
                      AI advisor · always available
                    </Typography>
                  </Box>
                </Box>
                <Tooltip title="Delete this conversation">
                  <IconButton
                    aria-label="Delete this conversation"
                    onClick={() => setConfirmingDelete(true)}
                    sx={{
                      flexShrink: 0,
                      color: "text.disabled",
                      "&:hover": { color: "error.main", bgcolor: "action.hover" },
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ flexGrow: 1, overflowY: "auto", px: { xs: 2, md: 3 }, py: 2.5 }}>
                {messagesLoading ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Skeleton variant="rounded" width="55%" height={44} sx={{ borderRadius: `${radius.lg}px` }} />
                    <Skeleton
                      variant="rounded"
                      width="65%"
                      height={44}
                      sx={{ borderRadius: `${radius.lg}px`, alignSelf: "flex-end" }}
                    />
                    <Skeleton variant="rounded" width="40%" height={44} sx={{ borderRadius: `${radius.lg}px` }} />
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, minHeight: "100%" }}>
                    {messages?.length === 0 && !showPending && (
                      <Box sx={{ m: "auto", textAlign: "center", color: "text.secondary", maxWidth: 320 }}>
                        <Typography variant="body2">
                          Ask anything — portions, switching food, whether a product suits them.
                        </Typography>
                      </Box>
                    )}

                    {messages?.map((message) => (
                      <MessageBubble key={message._id} mine={message.messageRole === MessageRole.USER}>
                        {message.messageContent}
                      </MessageBubble>
                    ))}

                    {showPending && <MessageBubble mine>{pendingMessage}</MessageBubble>}
                    {isSending && <TypingIndicator />}
                  </Box>
                )}
                <div ref={threadEndRef} />
              </Box>

              {sendError && (
                <Alert severity="error" sx={{ mx: { xs: 2, md: 3 }, mb: 1.5, flexShrink: 0 }}>
                  Failed to send message. Please try again.
                </Alert>
              )}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: { xs: 1.5, md: 2 },
                  borderTop: 1,
                  borderColor: "divider",
                  flexShrink: 0,
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Ask about your pet…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={isSending}
                  sx={(t) => ({
                    "& .MuiOutlinedInput-root": {
                      borderRadius: `${radius.pill}px`,
                      pl: 0.5,
                      backgroundColor: "#FFFFFF",
                      ...t.applyStyles("dark", { backgroundColor: t.vars.palette.background.paper }),
                    },
                  })}
                />
                <IconButton
                  onClick={handleSend}
                  disabled={isSending || !draft.trim()}
                  aria-label="Send message"
                  sx={(t) => ({
                    width: 42,
                    height: 42,
                    flexShrink: 0,
                    bgcolor: draft.trim() ? "primary.main" : t.vars.palette.action.disabledBackground,
                    color: draft.trim() ? "primary.contrastText" : "text.disabled",
                    transition: `background-color ${motion.fast}ms ${easing.out}`,
                    "&:hover": { bgcolor: draft.trim() ? "primary.dark" : t.vars.palette.action.disabledBackground },
                  })}
                >
                  <SendRoundedIcon fontSize="small" />
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

      <Dialog open={confirmingDelete} onClose={() => setConfirmingDelete(false)}>
        <DialogTitle>Delete this conversation?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {activeSession && `"${activeSession.sessionTitle}" and everything in it will be gone for good.`} This
            cannot be undone.
          </DialogContentText>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Failed to delete the conversation. Please try again.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmingDelete(false)}>Keep Conversation</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete} disabled={isDeleting}>
            {isDeleting ? <CircularProgress size={18} sx={{ color: "inherit" }} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

function SessionsSidebar({
  sessions,
  loading,
  activeSessionId,
  petImageFor,
  onSelect,
  onNewChat,
}: {
  sessions: ChatSessionDTO[] | undefined;
  loading: boolean;
  activeSessionId: string | null;
  petImageFor: (petId: string) => string | undefined;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}) {
  return (
    <Paper
      sx={(t) => ({
        width: { xs: "100%", sm: 300 },
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: `${radius.lg}px`,
        boxShadow: shadow.sm,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        ...t.applyStyles("dark", {
          backgroundColor: t.vars.palette.background.paper,
          border: `1px solid ${t.vars.palette.divider}`,
        }),
      })}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddCommentOutlinedIcon fontSize="small" />}
          onClick={onNewChat}
          sx={{ borderRadius: `${radius.pill}px` }}
        >
          New chat
        </Button>
      </Box>

      <Box sx={{ overflowY: "auto", maxHeight: { xs: 220, sm: "none" }, py: 1 }}>
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, px: 2, py: 1 }}>
            {[0, 1, 2].map((i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Skeleton variant="circular" width={38} height={38} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton width="70%" height={16} />
                  <Skeleton width="40%" height={12} />
                </Box>
              </Box>
            ))}
          </Box>
        ) : sessions?.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 3, textAlign: "center" }}>
            No conversations yet.
          </Typography>
        ) : (
          sessions?.map((session) => {
            const active = session._id === activeSessionId;
            return (
              <ListItemButton
                key={session._id}
                selected={active}
                onClick={() => onSelect(session._id)}
                sx={(t) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mx: 1,
                  my: 0.25,
                  px: 1.25,
                  borderRadius: `${radius.md}px`,
                  "&.Mui-selected": {
                    backgroundColor: t.vars.palette.moss[50],
                    ...t.applyStyles("dark", { backgroundColor: "rgba(255,255,255,.06)" }),
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: t.vars.palette.moss[50],
                    ...t.applyStyles("dark", { backgroundColor: "rgba(255,255,255,.06)" }),
                  },
                })}
              >
                <Avatar
                  src={petImageFor(session.petId)}
                  sx={(t) => ({
                    width: 38,
                    height: 38,
                    flexShrink: 0,
                    bgcolor: active ? "primary.main" : t.vars.palette.moss[50],
                    color: active ? "primary.contrastText" : "primary.main",
                    border: active ? "none" : "1px solid",
                    borderColor: t.vars.palette.moss[200],
                    ...t.applyStyles("dark", {
                      backgroundColor: active ? undefined : "rgba(255,255,255,.05)",
                      borderColor: t.vars.palette.moss[700],
                    }),
                  })}
                >
                  <PawMark width={16} height={16} />
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    noWrap
                    sx={{ fontSize: ".9375rem", fontWeight: active ? 600 : 500, color: active ? "primary.main" : "text.primary" }}
                  >
                    {session.sessionTitle}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </ListItemButton>
            );
          })
        )}
      </Box>
    </Paper>
  );
}

function EmptyState({ onNewChat }: { onNewChat: () => void }) {
  return (
    <Box sx={{ m: "auto", textAlign: "center", maxWidth: 340, px: 3 }}>
      <Box
        sx={(t) => ({
          width: 64,
          height: 64,
          mx: "auto",
          mb: 2.5,
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
        <PawMark width={28} height={28} />
      </Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Select a conversation
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Pick a thread on the left, or start a new one — every conversation is scoped to one pet, so the advice always
        fits.
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddCommentOutlinedIcon fontSize="small" />}
        onClick={onNewChat}
        sx={{ borderRadius: `${radius.pill}px` }}
      >
        Start a conversation
      </Button>
    </Box>
  );
}

function MessageBubble({ mine, children }: { mine: boolean; children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: mine ? "flex-end" : "flex-start",
      }}
    >
      <Box
        sx={{
          maxWidth: "75%",
          px: 2,
          py: 1.25,
          bgcolor: mine ? "primary.main" : "background.muted",
          color: mine ? "primary.contrastText" : "text.primary",
          borderRadius: mine
            ? `${radius.lg}px ${radius.lg}px 6px ${radius.lg}px`
            : `${radius.lg}px ${radius.lg}px ${radius.lg}px 6px`,
          animation: `pcBubbleIn ${motion.slow}ms ${easing.out} both`,
          "@keyframes pcBubbleIn": {
            from: { opacity: 0, transform: "translateY(6px)" },
            to: { opacity: 1, transform: "none" },
          },
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      >
        <Typography sx={{ fontSize: ".9375rem", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{children}</Typography>
      </Box>
    </Box>
  );
}

function TypingIndicator() {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
      <Box
        aria-label="Advisor is typing"
        sx={{
          display: "inline-flex",
          gap: 0.6,
          alignItems: "center",
          px: 2,
          py: 1.5,
          bgcolor: "background.muted",
          borderRadius: `${radius.lg}px ${radius.lg}px ${radius.lg}px 6px`,
          "& span": {
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: "text.disabled",
            animation: "pcTypingDot 1.3s infinite",
          },
          "& span:nth-of-type(2)": { animationDelay: ".18s" },
          "& span:nth-of-type(3)": { animationDelay: ".36s" },
          "@keyframes pcTypingDot": {
            "0%, 60%, 100%": { opacity: 0.3, transform: "translateY(0)" },
            "30%": { opacity: 1, transform: "translateY(-3px)" },
          },
          "@media (prefers-reduced-motion: reduce)": { "& span": { animation: "none" } },
        }}
      >
        <span />
        <span />
        <span />
      </Box>
    </Box>
  );
}
