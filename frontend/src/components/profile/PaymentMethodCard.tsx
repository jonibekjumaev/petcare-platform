import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CreditCardIcon from "@mui/icons-material/CreditCardOutlined";
import ContactlessOutlinedIcon from "@mui/icons-material/ContactlessOutlined";
import type { MemberDTO } from "@petcare/shared";
import { radius, shadow } from "../../theme";

const CARD_BRANDS = ["VISA", "MASTERCARD", "AMEX", "PAYPAL"];

interface PaymentMethodCardProps {
  member?: MemberDTO;
}

export default function PaymentMethodCard({ member }: PaymentMethodCardProps) {
  return (
    <Paper
      sx={(t) => ({
        p: 3,
        backgroundColor: "#FFFFFF",
        boxShadow: shadow.sm,
        ...t.applyStyles("dark", {
          backgroundColor: t.vars.palette.background.paper,
          border: `1px solid ${t.vars.palette.divider}`,
        }),
      })}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <CreditCardIcon fontSize="small" color="action" />
        <Typography variant="subtitle2" color="text.secondary">
          Payment Method
        </Typography>
      </Box>

      <Box
        sx={(t) => ({
          position: "relative",
          borderRadius: `${radius.lg}px`,
          p: 2.5,
          color: "#fff",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${t.vars.palette.moss[600]} 0%, ${t.vars.palette.moss[900]} 100%)`,
          boxShadow: shadow.md,
        })}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: -46,
            right: -30,
            width: 140,
            height: 140,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,.07)",
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            bottom: -64,
            left: -40,
            width: 160,
            height: 160,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,.05)",
          }}
        />

        <Box sx={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box
            aria-hidden
            sx={{
              width: 34,
              height: 24,
              borderRadius: "5px",
              background: "linear-gradient(135deg, #F3D98B 0%, #C9A227 100%)",
            }}
          />
          <ContactlessOutlinedIcon sx={{ opacity: 0.8, transform: "rotate(90deg)" }} />
        </Box>

        <Typography
          sx={{
            position: "relative",
            mt: 3,
            fontFamily: "monospace",
            fontSize: "1.1875rem",
            letterSpacing: "3px",
          }}
        >
          •••• •••• •••• 7495
        </Typography>

        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            mt: 2.5,
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: ".625rem", opacity: 0.75, letterSpacing: ".08em", textTransform: "uppercase" }}>
              Card holder
            </Typography>
            <Typography noWrap sx={{ fontWeight: 600 }}>
              {member?.memberNick ?? "Card holder"}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right", flexShrink: 0 }}>
            <Typography sx={{ fontSize: ".625rem", opacity: 0.75, letterSpacing: ".08em", textTransform: "uppercase" }}>
              Expires
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>07 / 24</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          {CARD_BRANDS.map((brand) => (
            <Typography
              key={brand}
              component="span"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 0.5,
                bgcolor: "action.selected",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              {brand}
            </Typography>
          ))}
        </Box>
        <Typography variant="caption" color="text.secondary">
          CVV •••
        </Typography>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
        Demo card on file — shown for display purposes only, not a real payment method.
      </Typography>
    </Paper>
  );
}
