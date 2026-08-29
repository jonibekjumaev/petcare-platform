import { useMemo } from "react";
import { Link as RouterLink } from "react-router";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { ProductCategory } from "@petcare/shared";
import type { RootState } from "../app/store";
import { useGetAllProductsQuery } from "../features/products/productApi";
import ProductCarousel from "../components/home/ProductCarousel";
import ProductGrid from "../components/home/ProductGrid";
import SectionHeading from "../components/ui/SectionHeading";
import Reveal from "../components/ui/Reveal";
import { PawMark } from "../assets/art";
import HeroShowcase from "../components/home/HeroShowcase";
import AiAdvisorSection from "../components/home/AiAdvisorSection";
import PetLineup from "../components/home/PetLineup";
import CollectionTile from "../components/home/CollectionTile";
import { CATEGORY_MEDIA, STORIES } from "../data/media";
import { section, radius, shadow } from "../theme";

const ROW_SIZE = 10;
const NEW_ARRIVALS_SIZE = 8;

const BIGGER_HEADING_SX = { fontSize: { xs: "2.625rem", md: "3rem" } };

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: ProductCategory.FOOD, label: "Food" },
  { value: ProductCategory.TOY, label: "Toys" },
  { value: ProductCategory.ACCESSORY, label: "Accessories" },
  { value: ProductCategory.SUPPLEMENT, label: "Supplements" },
  { value: ProductCategory.HYGIENE, label: "Hygiene" },
];

export default function HomePage() {
  const member = useSelector((state: RootState) => state.auth.member);
  const { data: products, isLoading } = useGetAllProductsQuery();

  const bestSellers = useMemo(
    () => (products ?? []).toSorted((a, b) => b.productSold - a.productSold).slice(0, ROW_SIZE),
    [products],
  );

  const newArrivals = useMemo(
    () =>
      (products ?? [])
        .toSorted((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
        .slice(0, NEW_ARRIVALS_SIZE),
    [products],
  );

  return (
    <Box>
      <Box sx={{ textAlign: "center", pt: { xs: 4, md: 5 }, pb: { xs: 3, md: 4 } }}>
        <Typography
          variant="h2"
          sx={{
            textTransform: "uppercase",
            letterSpacing: ".02em",
            fontSize: { xs: "1.9rem", sm: "2.4rem", md: "3rem" },
          }}
        >
          More than a shop
        </Typography>
      </Box>
      <HeroShowcase />
      <AiAdvisorSection />
      <PetLineup />

      <Box component="section" sx={{ pt: { xs: 2, md: 3 }, pb: section.md }}>
        <Container>
          <SectionHeading align="center" title="Our Pet Care Collections" />

          <Grid container spacing={{ xs: 2.5, sm: 3, md: 4 }} sx={{ justifyContent: "center" }}>
            {CATEGORIES.map((category, i) => {
              const photo = CATEGORY_MEDIA[category.value];
              return (
                <Grid key={category.value} size={{ xs: 4, sm: 4, md: 12 / 5 }}>
                  <Reveal delay={i * 60}>
                    <CollectionTile
                      to={`/products?category=${category.value}`}
                      label={category.label}
                      src={photo?.src ?? ""}
                      alt={photo?.alt ?? ""}
                    />
                  </Reveal>
                </Grid>
              );
            })}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 4, md: 5 } }}>
            <Button component={RouterLink} to="/products" endIcon={<ArrowForwardIcon />}>
              All products
            </Button>
          </Box>
        </Container>
      </Box>

      <Box component="section" sx={{ pt: section.md, pb: { xs: 5, md: 7 } }}>
        <Container>
          <SectionHeading title="Best Sellers" titleSx={BIGGER_HEADING_SX} />
          <ProductCarousel label="Best sellers" products={bestSellers} isLoading={isLoading} />
        </Container>
      </Box>

      <Box component="section" sx={{ pb: section.md }}>
        <Container>
          <SectionHeading title="New Arrivals" titleSx={BIGGER_HEADING_SX} />
          <ProductGrid products={newArrivals} isLoading={isLoading} />

          <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 4, md: 5 } }}>
            <Button component={RouterLink} to="/products" variant="contained" size="large">
              View all products
            </Button>
          </Box>
        </Container>
      </Box>

      <Stories />

      {member ? (
        <Box component="section" sx={{ py: section.md }}>
          <Container>
            <Card
              sx={{
                px: { xs: 3, md: 8 },
                py: { xs: 5, md: 7 },
                textAlign: "center",
                bgcolor: "primary.main",
                borderColor: "transparent",
              }}
            >
              <Typography variant="h2" sx={{ color: "primary.contrastText" }}>
                Still have a question about your pet?
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "primary.contrastText", opacity: 0.85, mt: 1.5, mb: 3.5 }}
              >
                The advisor already knows their profile and your order history — no need to explain from scratch.
              </Typography>
              <Button
                component={RouterLink}
                to="/chat"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: "common.white",
                  color: "text.primary",
                  "&:hover": { bgcolor: "common.white", transform: "translateY(-1px)" },
                }}
              >
                Ask the advisor
              </Button>
            </Card>
          </Container>
        </Box>
      ) : (
        <Box component="section" sx={{ py: section.md }}>
          <Container>
            <Card
              sx={{
                px: { xs: 3, md: 8 },
                py: { xs: 5, md: 7 },
                textAlign: "center",
                bgcolor: "secondary.main",
                borderColor: "transparent",
              }}
            >
              <Typography variant="h2" sx={{ color: "secondary.contrastText" }}>
                Start with one pet profile.
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "secondary.contrastText", opacity: 0.82, mt: 1.5, mb: 3.5 }}
              >
                It takes a minute, and every recommendation afterwards is about your animal.
              </Typography>
              <Button
                component={RouterLink}
                to="/signup"
                size="large"
                sx={{
                  bgcolor: "common.white",
                  color: "text.primary",
                  "&:hover": { bgcolor: "common.white", transform: "translateY(-1px)" },
                }}
              >
                Create an account
              </Button>
            </Card>
          </Container>
        </Box>
      )}
    </Box>
  );
}

function Stories() {
  return (
    <Box
      component="section"
      sx={{ py: section.md }}
    >
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Sample content"
          title="Why owners keep a profile"
          subtitle="Placeholder stories for this build — replace them with real ones before launch."
        />
        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          {STORIES.map((story, i) => (
            <Grid key={story.petName} size={{ xs: 12, md: 4 }}>
              <Reveal delay={i * 80}>
                <Card
                  sx={(t) => ({
                    p: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: `${radius.lg}px`,
                    boxShadow: shadow.sm,
                    backgroundColor: "#FFFFFF",
                    ...t.applyStyles("dark", {
                      backgroundColor: t.vars.palette.background.paper,
                      border: `1px solid ${t.vars.palette.divider}`,
                    }),
                  })}
                >
                  <Typography
                    aria-hidden
                    sx={(t) => ({
                      fontFamily: t.typography.h2.fontFamily,
                      fontSize: "3.5rem",
                      lineHeight: 1,
                      fontWeight: 600,
                      color: t.vars.palette.moss[200],
                      mb: 0.5,
                      ...t.applyStyles("dark", { color: t.vars.palette.moss[700] }),
                    })}
                  >
                    “
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 2.5 }}>
                    {story.quote}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, pt: 2, borderTop: 1, borderColor: "divider" }}>
                    <Avatar
                      sx={(t) => ({
                        width: 38,
                        height: 38,
                        bgcolor: t.vars.palette.moss[50],
                        color: "primary.main",
                        border: "1px solid",
                        borderColor: t.vars.palette.moss[200],
                        ...t.applyStyles("dark", {
                          backgroundColor: "rgba(255,255,255,.05)",
                          borderColor: t.vars.palette.moss[700],
                        }),
                      })}
                    >
                      <PawMark width={18} height={18} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{story.petName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {story.petDetail}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
