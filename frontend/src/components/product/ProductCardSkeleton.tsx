
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function ProductCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }} aria-hidden="true">
      <Skeleton
        variant="rectangular"
        sx={{
          aspectRatio: compact ? "1 / 1" : "1 / 1.22",
          height: "auto",
        }}
      />
      <Box sx={{ p: 2 }}>
        <Skeleton width="45%" height={12} />
        <Skeleton width="92%" height={16} sx={{ mt: 0.75 }} />
        <Skeleton width="60%" height={16} />
        <Skeleton width="30%" height={12} sx={{ mt: 0.75 }} />
        <Skeleton width="38%" height={22} sx={{ mt: 1 }} />
      </Box>
    </Card>
  );
}
