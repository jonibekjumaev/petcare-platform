import { useRef } from "react";
import type { FormEvent } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { Link as RouterLink, useSearchParams } from "react-router";
import { ProductSortOption, ProductCategory } from "@petcare/shared";
import { useGetAllProductsQuery } from "../features/products/productApi";

const PRODUCT_IMAGE_HEIGHT = 180;

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

  const handleCategoryClick = (value: ProductCategory | null) => {
    updateParam("category", value);
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
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Category
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "row", sm: "column" },
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Button
              variant={!category ? "contained" : "outlined"}
              onClick={() => handleCategoryClick(null)}
              sx={{ justifyContent: "flex-start" }}
            >
              All Categories
            </Button>
            {CATEGORY_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={category === opt.value ? "contained" : "outlined"}
                onClick={() => handleCategoryClick(opt.value)}
                sx={{ justifyContent: "flex-start" }}
              >
                {opt.label}
              </Button>
            ))}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 9 }}>
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
              {products.map((product) => (
                <Grid key={product._id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card sx={{ overflow: "hidden" }}>
                    <CardActionArea
                      component={RouterLink}
                      to={`/product/${product._id}`}
                    >
                      {product.productImages[0] ? (
                        <Box
                          sx={{
                            height: PRODUCT_IMAGE_HEIGHT,
                            bgcolor: "action.hover",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={product.productImages[0]}
                            alt={product.productName}
                            sx={{
                              height: "100%",
                              width: "100%",
                              objectFit: "contain",
                            }}
                          />
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            height: PRODUCT_IMAGE_HEIGHT,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "action.hover",
                          }}
                        >
                          <Inventory2Icon
                            sx={{ fontSize: 64, color: "text.disabled" }}
                          />
                        </Box>
                      )}
                      <CardContent>
                        <Typography variant="h6">
                          {product.productName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${product.productPrice}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
