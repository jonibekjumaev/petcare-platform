import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { ProductDTO } from "@petcare/shared";
import ProductCard from "../product/ProductCard";
import ProductCardSkeleton from "../product/ProductCardSkeleton";

const VISIBLE = { xs: 1.6, sm: 2.5, md: 4 };
const GAP = 24;
const SECONDS_PER_CARD = 6;

const cardWidth = (n: number) =>
  `calc((100cqw - ${Math.round((n - 1) * GAP * 100) / 100}px) / ${n})`;

interface ProductCarouselProps {
  products: ProductDTO[];
  isLoading?: boolean;
  label: string;
}

export default function ProductCarousel({ products, isLoading, label }: ProductCarouselProps) {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  if (isLoading) {
    return (
      <Row label={label} scrollable>
        {Array.from({ length: 6 }, (_, i) => (
          <Item key={i}>
            <ProductCardSkeleton />
          </Item>
        ))}
      </Row>
    );
  }

  if (products.length === 0) return null;

  const canLoop = !reduceMotion && products.length >= 6;

  if (!canLoop) {
    return (
      <Row label={label} scrollable>
        {products.map((product) => (
          <Item key={product._id}>
            <ProductCard product={product} />
          </Item>
        ))}
      </Row>
    );
  }

  const seconds = products.length * SECONDS_PER_CARD;

  return (
    <Row label={label}>
      <Box
        className="carousel-track"
        sx={{
          display: "flex",
          width: "max-content",
          animation: `carouselScroll ${seconds}s linear infinite`,
          "@keyframes carouselScroll": {
            from: { transform: "translate3d(0, 0, 0)" },
            to: { transform: "translate3d(-50%, 0, 0)" },
          },
        }}
      >
        {products.map((product) => (
          <Item key={product._id}>
            <ProductCard product={product} />
          </Item>
        ))}
        <Box aria-hidden inert sx={{ display: "flex" }}>
          {products.map((product) => (
            <Item key={`echo-${product._id}`}>
              <ProductCard product={product} />
            </Item>
          ))}
        </Box>
      </Box>
    </Row>
  );
}

function Row({
  children,
  label,
  scrollable = false,
}: {
  children: React.ReactNode;
  label: string;
  scrollable?: boolean;
}) {
  return (
    <Box
      role="group"
      aria-label={label}
      sx={{
        containerType: "inline-size",
        py: 1,
        ...(scrollable
          ? {
              overflowX: "auto",
              scrollSnapType: "x proximity",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }
          : { overflowX: "clip", overflowY: "visible" }),
        "&:hover .carousel-track": { animationPlayState: "paused" },
        "&:focus-within .carousel-track": { animationPlayState: "paused" },
      }}
    >
      {scrollable ? <Box sx={{ display: "flex", width: "max-content" }}>{children}</Box> : children}
    </Box>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        flex: "none",
        width: {
          xs: cardWidth(VISIBLE.xs),
          sm: cardWidth(VISIBLE.sm),
          md: cardWidth(VISIBLE.md),
        },
        marginRight: `${GAP}px`,
        scrollSnapAlign: "start",
      }}
    >
      {children}
    </Box>
  );
}
