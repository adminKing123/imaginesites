export const FIRESTORE_COLLECTIONS = {
  users: "users",
} as const;

export const USER_TYPES = {
  user: "user",
} as const;

export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];
