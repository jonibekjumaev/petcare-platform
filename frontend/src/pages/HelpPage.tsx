import { useState, type SyntheticEvent } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmailIcon from "@mui/icons-material/Email";
import { TERMS } from "../data/terms";
import { FAQ_CATEGORIES } from "../data/faq";

type HelpTab = "terms" | "faq" | "contact";

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState<HelpTab>("terms");

  const handleTabChange = (_event: SyntheticEvent, value: HelpTab) => {
    setActiveTab(value);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Help Center
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Terms, frequently asked questions, and ways to get in touch
      </Typography>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab value="terms" label="Terms" sx={{ fontWeight: 600 }} />
        <Tab value="faq" label="FAQ" sx={{ fontWeight: 600 }} />
        <Tab value="contact" label="Contact" sx={{ fontWeight: 600 }} />
      </Tabs>

      {activeTab === "terms" && (
        <Paper sx={{ p: 3 }}>
          {TERMS.map((term, index) => (
            <Box key={term}>
              <Typography variant="body1" sx={{ py: 1.5 }}>
                {term}
              </Typography>
              {index < TERMS.length - 1 && <Divider />}
            </Box>
          ))}
        </Paper>
      )}

      {activeTab === "faq" && (
        <Box>
          {FAQ_CATEGORIES.map((category) => (
            <Box key={category.title} sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {category.title}
              </Typography>
              {category.items.map((item) => (
                <Accordion key={item.question} disableGutters>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 500 }}>
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ))}
        </Box>
      )}

      {activeTab === "contact" && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <EmailIcon color="action" />
            <Box>
              <Typography variant="body1">
                This is a solo portfolio project.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add your own contact email or social/portfolio link here.
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Container>
  );
}
