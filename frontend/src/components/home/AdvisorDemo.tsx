import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PawMark } from "../../assets/art";
import { radius, duration as motion, easing } from "../../theme";

interface Line {
  from: "me" | "them";
  text: string;
}

const SCRIPT: Line[] = [
  { from: "me", text: "Are the joint chews okay for Luna?" },
  {
    from: "them",
    text: "She's 8 kg, so use the small-breed chews — one a day, not the 25–35 kg dose printed on the tub.",
  },
  { from: "them", text: "You last ordered them in March, so she's about due." },
  { from: "me", text: "Will they upset her stomach?" },
  {
    from: "them",
    text: "Unlikely — she's been on the same food since January and these go down with a meal. Introduce over three days to be safe.",
  },
];

const PAUSE_AFTER_USER = 850;
const TYPING_TIME = 1500;
const LOOP_PAUSE = 4500;

export default function AdvisorDemo() {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [step, setStep] = useState(0);

  const shown = reduceMotion ? SCRIPT.length : step;

  const typing = !reduceMotion && inView && shown < SCRIPT.length && SCRIPT[shown].from === "them";

  useEffect(() => {
    if (reduceMotion) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !inView) return;
    const finished = step >= SCRIPT.length;
    const delay = finished
      ? LOOP_PAUSE
      : SCRIPT[step].from === "them"
        ? TYPING_TIME
        : PAUSE_AFTER_USER;
    const timer = window.setTimeout(() => setStep(finished ? 0 : step + 1), delay);
    return () => window.clearTimeout(timer);
  }, [step, inView, reduceMotion]);

  return (
    <Card
      ref={ref}
      sx={(t) => ({
        p: { xs: 2, sm: 3 },
        borderRadius: `${radius.xl}px`,
        backgroundColor: t.vars.palette.background.paper,
        display: "flex",
        flexDirection: "column",
        boxShadow: 8,
        height: { xs: 460, md: 580 },
      })}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          pb: 2,
          mb: 1.5,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Avatar
          src="/media/pet-luna.jpg"
          alt=""
          sx={{ width: 52, height: 52 }}
        />
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontSize: "1.125rem" }}>
            Luna's advisor
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "primary.main",
                flex: "none",
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: ".875rem" }}>
              Cavalier · 4 years · 8 kg
            </Typography>
          </Box>
        </Box>
        <Avatar
          sx={{ width: 34, height: 34, bgcolor: "primary.main", color: "primary.contrastText" }}
        >
          <PawMark width={17} height={17} />
        </Avatar>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 1.5,
          overflow: "hidden",
        }}
      >
        {SCRIPT.slice(0, shown).map((line, i) => (
          <Bubble key={i} from={line.from} reduceMotion={reduceMotion}>
            {line.text}
          </Bubble>
        ))}
        {typing && <TypingDots />}
      </Box>

      <Box
        aria-hidden
        sx={{
          mt: 2.25,
          display: "flex",
          alignItems: "center",
          gap: 1,
          border: 1,
          borderColor: "divider",
          borderRadius: `${radius.pill}px`,
          px: 2.25,
          py: 1.5,
          color: "text.disabled",
          fontSize: "1rem",
        }}
      >
        Ask about Luna…
      </Box>
    </Card>
  );
}

function Bubble({
  from,
  children,
  reduceMotion,
}: {
  from: "me" | "them";
  children: React.ReactNode;
  reduceMotion: boolean;
}) {
  const mine = from === "me";
  return (
    <Box
      sx={{
        maxWidth: "86%",
        px: 2.25,
        py: 1.5,
        alignSelf: mine ? "flex-end" : "flex-start",
        bgcolor: mine ? "primary.main" : "background.muted",
        color: mine ? "primary.contrastText" : "text.primary",
        borderRadius: mine
          ? `${radius.lg}px ${radius.lg}px 6px ${radius.lg}px`
          : `${radius.lg}px ${radius.lg}px ${radius.lg}px 6px`,
        animation: reduceMotion
          ? "none"
          : `bubbleIn ${motion.slow}ms ${easing.out} both`,
        "@keyframes bubbleIn": {
          from: { opacity: 0, transform: "translateY(8px) scale(.98)" },
          to: { opacity: 1, transform: "none" },
        },
      }}
    >
      <Typography sx={{ fontSize: { xs: ".9375rem", md: "1.0625rem" }, lineHeight: 1.55 }}>
        {children}
      </Typography>
    </Box>
  );
}

function TypingDots() {
  return (
    <Box
      aria-hidden
      sx={{
        alignSelf: "flex-start",
        display: "inline-flex",
        gap: 0.6,
        alignItems: "center",
        px: 2,
        py: 1.75,
        bgcolor: "background.muted",
        borderRadius: `${radius.lg}px ${radius.lg}px ${radius.lg}px 6px`,
        "& span": {
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: "text.disabled",
          animation: `dot 1.3s infinite`,
        },
        "& span:nth-of-type(2)": { animationDelay: ".18s" },
        "& span:nth-of-type(3)": { animationDelay: ".36s" },
        "@keyframes dot": {
          "0%, 60%, 100%": { opacity: 0.3, transform: "translateY(0)" },
          "30%": { opacity: 1, transform: "translateY(-3px)" },
        },
      }}
    >
      <span />
      <span />
      <span />
    </Box>
  );
}
