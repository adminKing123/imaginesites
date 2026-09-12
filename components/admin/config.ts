export type AdminNavItem = {
  id: string;
  label: string;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { id: "uploaded-images", label: "Uploaded images" },
  { id: "categories", label: "Categories" },
  { id: "prompts", label: "Prompts" },
];

export type AdminSectionId = (typeof ADMIN_NAV_ITEMS)[number]["id"];
