
import Grid from "@mui/material/Grid";
import type { ProductDTO } from "@petcare/shared";
import ProductCard from "../product/ProductCard";
import ProductCardSkeleton from "../product/ProductCardSkeleton";
import Reveal from "../ui/Reveal";

const CELL_COUNT = 8;

interface ProductGridProps {
  products: ProductDTO[];
  isLoading?: boolean;
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <Grid container spacing={{ xs: 2.5, md: 3 }}>
        {Array.from({ length: CELL_COUNT }, (_, i) => (
          <Grid key={i} size={{ xs: 6, md: 3 }}>
            <ProductCardSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (products.length === 0) return null;

  return (
    <Grid container spacing={{ xs: 2.5, md: 3 }}>
      {products.slice(0, CELL_COUNT).map((product, i) => (
        <Grid key={product._id} size={{ xs: 6, md: 3 }}>
          <Reveal delay={i * 80}>
            <ProductCard product={product} />
          </Reveal>
        </Grid>
      ))}
    </Grid>
  );
}
