import { useRef } from "react";
import type { FormEvent } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { useSearchParams } from "react-router";
import { ProductSortOption, ProductCategory } from "@petcare/shared";
import { useGetAllProductsQuery } from "../features/products/productApi";
import ProductCard from "../components/product/ProductCard";
import CollectionTile from "../components/home/CollectionTile";
import Reveal from "../components/ui/Reveal";
import { PawMark } from "../assets/art";
import { CATEGORY_MEDIA } from "../data/media";

const SORT_OPTIONS: { value: ProductSortOption; label: string }[] = [
  { value: ProductSortOption.NEWEST, label: "Newest" },
  { value: ProductSortOption.BEST_SELLER, label: "Best Seller" },
  { value: ProductSortOption.PRICE_LOW_TO_HIGH, label: "Price" },
];

const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: ProductCategory.FOOD, label: "Food" },
  { value: ProductCategory.TOY, label: "Toys" },
  { value: ProductCategory.ACCESSORY, label: "Accessories" },
  { value: ProductCategory.SUPPLEMENT, label: "Supplements" },
  { value: ProductCategory.HYGIENE, label: "Hygiene" },
];

const ALL_PRODUCTS_LIMIT = 1000;

const CARDS_PER_ROW = 4;

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const order =
    (searchParams.get("order") as ProductSortOption | null) ??
    ProductSortOption.NEWEST;
  const category = searchParams.get("category") as ProductCategory | null;
  const search = searchParams.get("search") ?? "";

  const {
    data: products,
    isLoading,
    isError,
  } = useGetAllProductsQuery({
    order,
    productCategory: category ?? undefined,
    search: search || undefined,
    limit: ALL_PRODUCTS_LIMIT,
  });

  const updateParam = (key: string, value: string | null) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
  };

  const handleSortClick = (value: ProductSortOption) => {
    updateParam("order", value === ProductSortOption.NEWEST ? null : value);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateParam("search", searchInputRef.current?.value.trim() || null);
  };

  if (isLoading) return <CircularProgress sx={{ m: 4 }} />;
  if (isError || !products)
    return <Alert severity="error">Failed to load products.</Alert>;

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: { xs: 5, md: 7 } }}>
        <Typography variant="h2" align="center" sx={{ mb: { xs: 3, md: 4 } }}>
          Our Pet Care Collections
        </Typography>
        <Grid
          container
          spacing={{ xs: 2.5, sm: 3, md: 4 }}
          sx={{ justifyContent: "center" }}
        >
          <Grid size={{ xs: 4, sm: 4, md: 12 / 6 }}>
            <Reveal>
              <CollectionTile
                to="/products"
                label="All"
                icon={PawMark}
                active={!category}
              />
            </Reveal>
          </Grid>
          {CATEGORY_OPTIONS.map((opt, i) => {
            const photo = CATEGORY_MEDIA[opt.value];
            return (
              <Grid key={opt.value} size={{ xs: 4, sm: 4, md: 12 / 6 }}>
                <Reveal delay={(i + 1) * 60}>
                  <CollectionTile
                    to={`/products?category=${opt.value}`}
                    label={opt.label}
                    src={photo?.src}
                    alt={photo?.alt}
                    active={category === opt.value}
                  />
                </Reveal>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h4">Products</Typography>
          <Typography variant="body2" color="text.secondary">
            {products.length} products
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{ display: "flex", gap: 1 }}
        >
          <TextField
            size="small"
            placeholder="Search products..."
            defaultValue={search}
            inputRef={searchInputRef}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button type="submit" variant="contained">
            Search
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        {SORT_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={order === opt.value ? "contained" : "outlined"}
            onClick={() => handleSortClick(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </Box>

      {products.length === 0 ? (
        <Alert severity="info">No products match your filters.</Alert>
      ) : (
        <Grid container spacing={3}>
          {products.map((product, i) => (
            <Grid key={product._id} size={{ xs: 6, sm: 6, md: 3 }}>
              <Reveal delay={(i % CARDS_PER_ROW) * 80}>
                <ProductCard product={product} />
              </Reveal>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
