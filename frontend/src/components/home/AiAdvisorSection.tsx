import { Link as RouterLink } from "react-router";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { RootState } from "../../app/store";
import AdvisorDemo from "./AdvisorDemo";
import HeroAdvisor from "./HeroAdvisor";
import Reveal from "../ui/Reveal";
import { section } from "../../theme";

const STEPS = [
  {
    title: "Register your pet once",
    body: "Breed, age, weight, and anything the vet has told you. Takes a minute.",
  },
  {
    title: "It reads the profile and your orders",
    body: "Every answer starts from your animal and what you have actually bought — not a generic article about dogs.",
  },
  {
    title: "Ask anything, any time",
    body: "Portions, switching food, whether a product suits them. One conversation per pet, kept separate.",
  },
];

export default function AiAdvisorSection() {
  const member = useSelector((state: RootState) => state.auth.member);

  return (
    <>
      <Box component="section" sx={{ py: section.lg }}>
        <Container>
          <Box>
            <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
              <Typography
                sx={{
                  fontSize: { xs: "1.9rem", sm: "2.4rem", md: "3rem" },
                  fontWeight: 800,
                  lineHeight: 1.45,
                  whiteSpace: { md: "nowrap" },
                }}
              >
                Talk to an advisor that already knows your pet.
              </Typography>
            </Box>

              <Grid container spacing={{ xs: 5, md: 7 }} sx={{ alignItems: "center" }}>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Box sx={{ display: "grid", gap: 3.5 }}>
                    {STEPS.map((step, i) => (
                      <Reveal key={step.title} delay={i * 90}>
                        <Box sx={{ display: "flex", gap: 2.5, alignItems: "flex-start" }}>
                          <Box
                            aria-hidden
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
                              fontWeight: 700,
                              fontSize: "1.0625rem",
                              fontVariantNumeric: "tabular-nums",
                              ...t.applyStyles("dark", {
                                backgroundColor: "rgba(255,255,255,.05)",
                                borderColor: t.vars.palette.moss[700],
                              }),
                            })}
                          >
                            {i + 1}
                          </Box>
                          <Box>
                            <Typography
                              variant="h5"
                              component="h3"
                              sx={{ mb: 0.75, fontSize: { xs: "1.125rem", md: "1.25rem" } }}
                            >
                              {step.title}
                            </Typography>
                            <Typography
                              variant="body1"
                              color="text.secondary"
                              sx={{
                                maxWidth: "42ch",
                                fontSize: { xs: ".9375rem", md: "1.0625rem" },
                              }}
                            >
                              {step.body}
                            </Typography>
                          </Box>
                        </Box>
                      </Reveal>
                    ))}
                  </Box>

                  <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mt: 4.5 }}>
                    <Button
                      component={RouterLink}
                      to="/chat"
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                    >
                      Ask the advisor
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/pets/new"
                      variant="outlined"
                      size="large"
                    >
                      Register a pet
                    </Button>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                  <Reveal>
                    <AdvisorDemo />
                  </Reveal>
                </Grid>
              </Grid>
          </Box>
        </Container>
      </Box>

      {!member && (
      <Box component="section" sx={{ pb: section.md }}>
        <Container>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="overline"
              component="p"
              color="text.secondary"
              sx={{ fontSize: { xs: ".875rem", md: "1rem" }, letterSpacing: ".14em" }}
            >
              No account needed
            </Typography>
            <Typography
              variant="h3"
              component="h2"
              sx={{ mt: 1, fontSize: { xs: "1.6rem", md: "2rem" } }}
            >
              Try it now — three taps
            </Typography>
          </Box>

          <Box sx={{ maxWidth: 560, mx: "auto" }}>
            <HeroAdvisor />
          </Box>
        </Container>
      </Box>
      )}
    </>
  );
}
