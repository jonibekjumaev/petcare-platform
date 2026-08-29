
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { radius } from "../../theme";

const BANNER_RATIO = "946 / 391";

export default function PetLineup() {
  return (
    <Box component="section" sx={{ pb: { xs: 2, md: 3 } }}>
      <Container>
        <Box
          sx={(t) => ({
            borderRadius: `${radius.xl}px`,
            ...t.applyStyles("dark", {
              backgroundColor: "#FFFFFF",
              padding: t.spacing(2),
              boxShadow: t.shadows[6],
            }),
          })}
        >
          <Box
            component="img"
            src="/media/pets-banner.jpg"
            alt="A cat, a German shepherd puppy, a rabbit, a parrot, a budgie, a hamster, a ferret, a chipmunk and a chameleon standing in a row"
            loading="lazy"
            decoding="async"
            width={946}
            height={391}
            sx={{
              display: "block",
              width: "100%",
              height: "auto",
              aspectRatio: BANNER_RATIO,
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}
