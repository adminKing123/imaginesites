import type { UserType } from "./collections";

export type UserProfileData = {
  user_type: UserType;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};
