import { useState } from "react";
import { Link as RouterLink } from "react-router";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Fade from "@mui/material/Fade";
import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import type { ProductDTO } from "@petcare/shared";
import { ProductPetType } from "@petcare/shared";
import type { RootState } from "../../app/store";
import { useGetAllProductsQuery } from "../../features/products/productApi";
import { formatPrice } from "../../lib/format";
import { PawMark, ProductFallback } from "../../assets/art";
import {
  KINDS,
  AGE_BANDS,
  SIZE_BANDS,
  buildAdvice,
  draftParams,
  PET_DRAFT_KEY,
  type PetKind,
  type AgeBand,
  type SizeBand,
} from "../../data/advisor";
import { duration as motion, easing, radius } from "../../theme";

const PANEL_MIN_HEIGHT = 316;

export default function HeroAdvisor() {
  const member = useSelector((state: RootState) => state.auth.member);
  const { data: products, isLoading } = useGetAllProductsQuery();

  const [kind, setKind] = useState<PetKind | null>(null);
  const [age, setAge] = useState<AgeBand | null>(null);
  const [size, setSize] = useState<SizeBand | null>(null);

  const step = kind === null ? 0 : age === null ? 1 : size === null ? 2 : 3;
  const advice = kind && age && size ? buildAdvice(kind, age, size) : null;

  const back = () => {
    if (size !== null) setSize(null);
    else if (age !== null) setAge(null);
    else setKind(null);
  };

  const restart = () => {
    setKind(null);
    setAge(null);
    setSize(null);
  };

  const matches: ProductDTO[] = (() => {
    if (!advice || !products) return [];
    const forSpecies = products.filter(
      (p) =>
        (p.productPetType === advice.petType || p.productPetType === ProductPetType.ALL) &&
        p.productLeftCount > 0,
    );
    const first = forSpecies.find((p) => p.productCategory === advice.primary);
    const second = forSpecies.find((p) => p.productCategory === advice.secondary && p !== first);
    return [first, second, ...forSpecies].filter(Boolean).slice(0, 2) as ProductDTO[];
  })();

  const saveHref =
    advice && kind ? (member ? `/pets/new?${draftParams(advice, kind)}` : "/signup") : "/signup";

  const rememberDraft = () => {
    if (!advice || !kind) return;
    try {
      sessionStorage.setItem(PET_DRAFT_KEY, draftParams(advice, kind));
    } catch {
    }
  };

  return (
    <Card
      sx={(t) => ({
        p: { xs: 2.5, sm: 3 },
        minHeight: PANEL_MIN_HEIGHT,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        borderColor: "transparent",
        boxShadow: 7,
        ...t.applyStyles("dark", {
          backgroundColor: t.vars.palette.background.paper,
          borderColor: t.vars.palette.divider,
        }),
      })}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
        <Avatar sx={{ bgcolor: "primary.main", color: "primary.contrastText", width: 38, height: 38 }}>
          <PawMark width={19} height={19} />
        </Avatar>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="subtitle2">PetCare Advisor</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: ".8125rem" }}>
            {step < 3 ? "Three taps. No account needed." : "Here's the short version"}
          </Typography>
        </Box>

        {step > 0 && (
          <Button
            size="small"
            onClick={step === 3 ? restart : back}
            startIcon={step === 3 ? <RestartAltIcon /> : <ArrowBackIcon />}
            sx={{ flex: "none" }}
          >
            {step === 3 ? "Start over" : "Back"}
          </Button>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 0.75, mb: 2.5 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              height: 3,
              flex: 1,
              borderRadius: 3,
              bgcolor: i < step ? "primary.main" : "action.hover",
              transition: `background-color ${motion.base}ms ${easing.out}`,
            }}
          />
        ))}
      </Box>

      <Box sx={{ flexGrow: 1 }} aria-live="polite">
        {step === 0 && (
          <StepPanel question="Who are we shopping for?">
            {KINDS.map((option) => (
              <Choice key={option.value} label={option.label} onClick={() => setKind(option.value)} />
            ))}
          </StepPanel>
        )}

        {step === 1 && kind && (
          <StepPanel question={`How old is your ${kind === "DOG" ? "dog" : "cat"}?`}>
            {AGE_BANDS[kind].map((band) => (
              <Choice
                key={band.value}
                label={band.label}
                detail={band.detail}
                onClick={() => setAge(band.value)}
              />
            ))}
          </StepPanel>
        )}

        {step === 2 && kind && (
          <StepPanel question="Roughly what size?">
            {SIZE_BANDS[kind].map((band) => (
              <Choice
                key={band.value}
                label={band.label}
                detail={band.detail}
                onClick={() => setSize(band.value)}
              />
            ))}
          </StepPanel>
        )}

        {step === 3 && advice && (
          <Fade in timeout={motion.slow}>
            <Box>
              <Typography variant="overline" color="text.secondary" component="p">
                {advice.summary}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: 0.5, mb: 0.5 }}>
                <Typography
                  component="span"
                  sx={{
                    fontFamily: (t) => t.typography.h1.fontFamily,
                    fontSize: "2.25rem",
                    fontWeight: 600,
                    letterSpacing: "-.03em",
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {advice.gramsPerDay} g
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  of dry food a day, across {advice.meals} meals
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {advice.focus}
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ display: "block", mb: 2 }}>
                A rough guide from weight and age — your vet's advice always wins.
              </Typography>

              <Box sx={{ display: "grid", gap: 1, mb: 2.5 }}>
                {isLoading
                  ? [0, 1].map((i) => <Skeleton key={i} variant="rounded" height={62} />)
                  : matches.map((product) => <MiniProduct key={product._id} product={product} />)}
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                component={RouterLink}
                to={saveHref}
                onClick={rememberDraft}
                endIcon={<ArrowForwardIcon />}
              >
                {member ? "Save this as a profile" : "Save this — create an account"}
              </Button>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", textAlign: "center", mt: 1.25 }}
              >
                Then the advisor answers about your pet by name, not by size band.
              </Typography>
            </Box>
          </Fade>
        )}
      </Box>
    </Card>
  );
}

function StepPanel({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <Fade in key={question} timeout={motion.base}>
      <Box>
        <Typography variant="h5" component="p" sx={{ mb: 2 }}>
          {question}
        </Typography>
        <Box sx={{ display: "grid", gap: 1 }}>{children}</Box>
      </Box>
    </Fade>
  );
}

function Choice({
  label,
  detail,
  onClick,
}: {
  label: string;
  detail?: string;
  onClick: () => void;
}) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={(t) => ({
        justifyContent: "space-between",
        textAlign: "left",
        px: 2.25,
        py: 1.75,
        minHeight: 60,
        borderRadius: `${radius.md}px`,
        backgroundColor: "#FFFFFF",
        border: "1px solid",
        borderColor: t.vars.palette.divider,
        boxShadow: t.shadows[2],
        color: t.vars.palette.text.primary,
        transition: `border-color ${motion.fast}ms ${easing.out}, box-shadow ${motion.fast}ms ${easing.out}, transform ${motion.fast}ms ${easing.out}`,
        "&:hover": {
          borderColor: t.vars.palette.primary.main,
          boxShadow: t.shadows[4],
          transform: "translateY(-1px)",
        },
        "&:active": { transform: "scale(.99)" },
        ...t.applyStyles("dark", {
          backgroundColor: t.vars.palette.background.muted,
        }),
      })}
    >
      <Box>
        <Typography variant="subtitle2">{label}</Typography>
        {detail && (
          <Typography variant="caption" color="text.secondary">
            {detail}
          </Typography>
        )}
      </Box>
      <ArrowForwardIcon sx={{ fontSize: 18, color: "text.disabled" }} />
    </ButtonBase>
  );
}

function MiniProduct({ product }: { product: ProductDTO }) {
  const image = product.productImages?.[0];

  return (
    <ButtonBase
      component={RouterLink}
      to={`/product/${product._id}`}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1,
        borderRadius: `${radius.md}px`,
        border: 1,
        borderColor: "divider",
        textAlign: "left",
        transition: `border-color ${motion.fast}ms ${easing.out}, background-color ${motion.fast}ms ${easing.out}`,
        "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
      }}
    >
      <Box
        sx={{
          width: 46,
          height: 46,
          flex: "none",
          borderRadius: `${radius.sm}px`,
          bgcolor: "background.muted",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
          color: "text.disabled",
        }}
      >
        {image ? (
          <Box
            component="img"
            src={image}
            alt={product.productName}
            loading="lazy"
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <ProductFallback width={22} height={22} />
        )}
      </Box>

      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
          {product.productName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatPrice(product.productPrice)}
        </Typography>
      </Box>

      <ArrowForwardIcon sx={{ fontSize: 16, color: "text.disabled", mr: 0.5 }} />
    </ButtonBase>
  );
}
