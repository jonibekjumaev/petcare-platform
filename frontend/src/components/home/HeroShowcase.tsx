import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  HERO_SLIDES,
  HERO_BACKGROUND,
  HERO_BACKGROUND_ALT,
  HERO_INTERVAL_MS,
  type HeroSlide,
} from "../../data/heroPanels";
import { duration as motion, easing, radius } from "../../theme";

export default function HeroShowcase() {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((next: number) => {
    setIndex(((next % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused || HERO_SLIDES.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % HERO_SLIDES.length),
      HERO_INTERVAL_MS,
    );
    return () => window.clearInterval(timer);
  }, [paused]);

  const active = HERO_SLIDES[index];

  return (
    <Box
      component="section"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      sx={{
        position: "relative",
        width: "100vw",
        marginInline: "calc(50% - 50vw)",
        overflow: "hidden",
        color: "common.white",
        minHeight: { xs: "72svh", md: 780 },
        display: "flex",
        bgcolor: (t) => t.vars.palette.moss[900],
      }}
    >
      <Box
        component="img"
        src={HERO_BACKGROUND}
        alt={HERO_BACKGROUND_ALT}
        fetchPriority="high"
        decoding="async"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 62%",
          transform: active.flipBackground ? "scaleX(-1)" : "none",
          transition: reduceMotion ? "none" : `transform ${motion.slower}ms ${easing.out}`,
        }}
      />

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(${
            active.insetSide === "left" ? "270deg" : "90deg"
          }, rgba(12,16,12,.62) 0%, rgba(12,16,12,.34) 40%, rgba(12,16,12,.06) 70%, rgba(12,16,12,0) 100%)`,
          transition: reduceMotion ? "none" : `background ${motion.slow}ms ${easing.out}`,
          "@media (max-width:900px)": {
            background:
              "linear-gradient(180deg, rgba(12,16,12,.72) 0%, rgba(12,16,12,.42) 48%, rgba(12,16,12,.80) 100%)",
          },
        }}
      />

      <Container
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          py: { xs: 4, md: 5 },
        }}
      >
        <Box sx={{ flexGrow: 1, display: "grid" }}>
          {HERO_SLIDES.map((slide, i) => (
            <Slide
              key={slide.id}
              slide={slide}
              active={i === index}
              reduceMotion={reduceMotion}
              onInteractStart={() => setPaused(true)}
              onInteractEnd={() => setPaused(false)}
            />
          ))}
        </Box>

        <Box
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          sx={{
            display: "flex",
            gap: 1.25,
            justifyContent: "center",
            mt: 3,
          }}
        >
          {HERO_SLIDES.map((slide, i) => {
            const current = i === index;
            return (
              <Box
                key={slide.id}
                component="button"
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show ${slide.eyebrow} slide`}
                aria-current={current}
                sx={{
                  position: "relative",
                  width: 40,
                  height: 40,
                  padding: 0,
                  border: 0,
                  background: "transparent",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                  "&::after": {
                    content: '""',
                    width: current ? 12 : 10,
                    height: current ? 12 : 10,
                    borderRadius: "50%",
                    backgroundColor: current ? "#fff" : "rgba(255,255,255,.48)",
                    transition: `all ${motion.fast}ms ${easing.out}`,
                  },
                  "&:hover::after": { backgroundColor: "#fff" },
                  "&:focus-visible": { outline: "2px solid #fff", outlineOffset: -8, borderRadius: "50%" },
                }}
              />
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}

function Slide({
  slide,
  active,
  reduceMotion,
  onInteractStart,
  onInteractEnd,
}: {
  slide: HeroSlide;
  active: boolean;
  reduceMotion: boolean;
  onInteractStart: () => void;
  onInteractEnd: () => void;
}) {
  return (
    <Box
      role="group"
      aria-roledescription="slide"
      aria-hidden={!active}
      inert={!active}
      sx={{
        gridArea: "1 / 1",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: slide.insetSide === "left" ? "1.05fr 0.95fr" : "0.95fr 1.05fr",
        },
        gap: { xs: 3, md: 5 },
        alignItems: "center",
        opacity: active ? 1 : 0,
        visibility: active ? "visible" : "hidden",
        transition: reduceMotion
          ? "none"
          : `opacity ${motion.slower}ms ${easing.standard}, visibility ${motion.slower}ms`,
      }}
    >
      <Box
        sx={{
          order: { xs: 2, md: slide.insetSide === "left" ? 2 : 1 },
          maxWidth: { md: "32rem" },
          justifySelf: slide.insetSide === "left" ? "end" : "start",
        }}
      >
        <Typography
          variant="overline"
          component="p"
          sx={{ color: (t) => t.vars.palette.apricot[300] }}
        >
          {slide.eyebrow}
        </Typography>

        <Typography
          variant="h1"
          sx={{
            color: "common.white",
            mt: 1.5,
            mb: 3.5,
            fontSize: { xs: "2.1rem", sm: "2.75rem", md: "3.4rem" },
          }}
        >
          {slide.title[0]}
          <br />
          {slide.title[1]}
        </Typography>

        <Button
          component={RouterLink}
          to={slide.ctaHref}
          size="large"
          onMouseEnter={onInteractStart}
          onMouseLeave={onInteractEnd}
          sx={{
            bgcolor: "common.white",
            color: "text.primary",
            "&:hover": { bgcolor: "common.white", transform: "translateY(-1px)" },
          }}
        >
          {slide.cta}
        </Button>
      </Box>

      <Box
        sx={{
          order: { xs: 1, md: slide.insetSide === "left" ? 1 : 2 },
          justifySelf: slide.insetSide === "left" ? "start" : "end",
          width: "100%",
          maxWidth: { xs: 280, sm: 360, md: 500 },
          mx: { xs: "auto", md: 0 },
        }}
      >
        <Box
          component="img"
          src={slide.inset}
          alt={slide.insetAlt}
          loading="eager"
          decoding="async"
          sx={{
            width: "100%",
            aspectRatio: { xs: "4 / 3", md: "4 / 5" },
            objectFit: "cover",
            objectPosition: slide.insetPosition,
            borderRadius: `${radius.lg}px`,
            boxShadow: "0 22px 55px rgba(0,0,0,.42)",
          }}
        />
      </Box>
    </Box>
  );
}
