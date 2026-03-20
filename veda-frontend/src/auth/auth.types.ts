export type UserProfile = {
  userName: string;
  schoolName: string;
  schoolLocation: string;
  schoolIconUrl: string;
  teacherSubject: string;
  className: string;
  subject: string;
  timeAllowedMinutes: number;
};

export type AuthSession = {
  userId: string;
  email: string;
  isAuthenticated: boolean;
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  userName: "John Doe",
  schoolName: "Delhi Public School",
  schoolLocation: "Bokaro Steel City",
  schoolIconUrl: "",
  teacherSubject: "Science",
  className: "5th",
  subject: "Science",
  timeAllowedMinutes: 45,
};
