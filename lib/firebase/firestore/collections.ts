export const FIRESTORE_COLLECTIONS = {
  users: "users",
  imageUploads: "image_uploads",
  prompts: "prompts",
  categories: "categories",
} as const;

export const USER_TYPES = {
  user: "user",
  admin: "admin",
} as const;

export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

export function isAdminUser(userType: UserType | undefined) {
  return userType === USER_TYPES.admin;
}
