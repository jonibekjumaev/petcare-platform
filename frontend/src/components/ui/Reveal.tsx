
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import useMediaQuery from "@mui/material/useMediaQuery";
import { duration as motion, easing } from "../../theme";

interface RevealProps {
  children: ReactNode;
  delay?: number;
}

export default function Reveal({ children, delay = 0 }: RevealProps) {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  const shown = reduceMotion || inView;

  useEffect(() => {
    if (reduceMotion) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <Box ref={ref}>
      <Fade in={shown} timeout={{ enter: motion.slow }} style={{ transitionDelay: `${delay}ms` }}>
        <Box
          sx={{
            transform: shown ? "none" : "translateY(14px)",
            transition: `transform ${motion.slow}ms ${easing.out} ${delay}ms`,
          }}
        >
          {children}
        </Box>
      </Fade>
    </Box>
  );
}
