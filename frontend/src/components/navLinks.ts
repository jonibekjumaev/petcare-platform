
export interface NavLink {
  label: string;
  to: string;
  auth?: boolean;
}

export const PRIMARY_LINKS: NavLink[] = [
  { label: "Shop", to: "/products" },
  { label: "AI Advisor", to: "/chat", auth: true },
  { label: "My Pets", to: "/pets", auth: true },
  { label: "Orders", to: "/orders", auth: true },
  { label: "Help", to: "/help" },
];

export const ACCOUNT_LINKS: NavLink[] = [
  { label: "My Orders", to: "/orders", auth: true },
  { label: "My Pets", to: "/pets", auth: true },
  { label: "Profile", to: "/profile", auth: true },
];
