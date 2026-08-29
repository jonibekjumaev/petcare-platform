import { useState } from "react";
import { Link as RouterLink } from "react-router";
import { useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCartOutlined";
import CheckIcon from "@mui/icons-material/Check";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import type { ReactNode } from "react";
import type { ProductDTO } from "@petcare/shared";
import { addToCart } from "../../features/cart/cartSlice";
import { formatPrice, formatCompactNumber } from "../../lib/format";
import { ProductFallback } from "../../assets/art";
import { shadow } from "../../theme";

const MEDIA_RATIO = "1 / 1.22";

const label = (value: string) => value.charAt(0) + value.slice(1).toLowerCase();

interface ProductCardProps {
  product: ProductDTO;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const dispatch = useDispatch();
  const [justAdded, setJustAdded] = useState(false);

  const image = product.productImages?.[0];
  const outOfStock = product.productLeftCount === 0;
  const lowStock = !outOfStock && product.productLeftCount <= 3;

  const handleAdd = () => {
    dispatch(
      addToCart({
        productId: product._id,
        productName: product.productName,
        productPrice: product.productPrice,
        productImage: image ?? "",
      }),
    );

    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <Card
      variant="outlined"
      sx={(t) => ({
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        transition: t.transitions.create(["box-shadow", "transform"]),
        ...t.applyStyles("dark", {
          backgroundColor: t.vars.palette.background.paper,
        }),
        "@media (hover: hover)": {
          "&:hover": { transform: "translateY(-4px)", boxShadow: shadow.lg },
        },
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
      })}
    >
      <CardActionArea
        component={RouterLink}
        to={`/product/${product._id}`}
        sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", flexGrow: 1 }}
      >
        <Box sx={{ position: "relative" }}>
          {image ? (
            <CardMedia
              component="img"
              image={image}
              alt={product.productName}
              loading="lazy"
              sx={{
                aspectRatio: compact ? "1 / 1" : MEDIA_RATIO,
                objectFit: "cover",
                opacity: outOfStock ? 0.55 : 1,
                bgcolor: "background.muted",
              }}
            />
          ) : (
            <Box
              sx={{
                aspectRatio: compact ? "1 / 1" : MEDIA_RATIO,
                display: "grid",
                placeItems: "center",
                bgcolor: "background.muted",
                opacity: outOfStock ? 0.55 : 1,
                p: 2,
              }}
            >
              <Box sx={{ color: "text.disabled", width: "40%" }}>
                <ProductFallback width="100%" height="100%" />
              </Box>
            </Box>
          )}

          {(outOfStock || lowStock || product.productSold > 40) && (
            <Chip
              size="small"
              label={outOfStock ? "Out of stock" : lowStock ? `Only ${product.productLeftCount} left` : "Best seller"}
              sx={{
                position: "absolute",
                top: 10,
                left: 10,
                fontWeight: 700,
                ...(outOfStock
                  ? { bgcolor: "background.paper", color: "text.secondary" }
                  : lowStock
                    ? { bgcolor: "background.paper", color: "warning.dark" }
                    : { bgcolor: "secondary.main", color: "secondary.contrastText" }),
              }}
            />
          )}
        </Box>

        <CardContent sx={{ width: "100%", flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontSize: ".75rem", lineHeight: 1.6 }}>
            {label(product.productCategory)} · {label(product.productPetType)}
          </Typography>

          <Typography
            component="h3"
            sx={{
              mt: 0.25,
              fontSize: "1rem",
              fontWeight: 500,
              lineHeight: 1.45,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "2.9em",
            }}
          >
            {product.productName}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 0.5, color: "text.secondary" }}>
            <Stat icon={<VisibilityOutlinedIcon sx={{ fontSize: 15 }} />} value={product.productViews} />
            <Stat icon={<FavoriteRoundedIcon sx={{ fontSize: 13 }} />} value={product.productLikes} />
            <Stat icon={<ShoppingBagOutlinedIcon sx={{ fontSize: 13 }} />} value={product.productSold} />
          </Box>

          <Typography
            sx={{
              mt: "auto",
              pt: 0.75,
              fontFamily: (t) => t.typography.h2.fontFamily,
              fontSize: "1.1875rem",
              fontWeight: 600,
              letterSpacing: "-.01em",
              color: outOfStock ? "text.disabled" : "text.primary",
            }}
          >
            {formatPrice(product.productPrice)}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions sx={{ px: 2, pb: 1.5, pt: 0, justifyContent: "flex-end", gap: 0.5 }}>
        <Tooltip title={`Save ${product.productName}`}>
          <IconButton
            aria-label={`Save ${product.productName}`}
            size="small"
            sx={{ color: "text.secondary", "&:hover": { color: "secondary.main" } }}
          >
            <FavoriteBorderIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        {!outOfStock && (
          <Tooltip title={justAdded ? "Added to cart" : "Add to cart"}>
            <IconButton
              aria-label={`Add ${product.productName} to cart`}
              onClick={handleAdd}
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": { bgcolor: "primary.main", color: "primary.contrastText" },
              }}
            >
              {justAdded ? <CheckIcon sx={{ fontSize: 18 }} /> : <AddShoppingCartIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
    </Card>
  );
}

function Stat({ icon, value }: { icon: ReactNode; value: number }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
      {icon}
      <Typography variant="caption" sx={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
        {formatCompactNumber(value)}
      </Typography>
    </Box>
  );
}
