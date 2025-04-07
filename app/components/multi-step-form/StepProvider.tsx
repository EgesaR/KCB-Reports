import { atom, map } from "nanostores";

// Tracks the current step number (1 to 4)
export const currentStep = atom(1);

// Tracks the status of each step: "success", "failure", or "pending"
export const stepStatuses = atom<Record<number, string>>({
  1: "pending", // Basic Info step
  2: "pending", // Contact Info step
  3: "pending", // Security Info step
  4: "pending", // Teacher Info step
  5: "pending", // Parent Info step
  6: "pending", // Admin Info step
  7: "pending", // Final Summary step
  
});

export const isMonthly = atom(true);

// Tracks the user's current selections and data (General User Information)
export const user = map<Record<string, string | null>>({
  // Basic Info
  name: null,
  dob: null,

  // Contact Info
  email: null,
  phone: null,

  // Security Info
  password: null,
  confirmPassword: null,
});

// Tracks roles (e.g., Teacher, Admin, Parent)
export type RoleType = {
  title: string;
};

export const roleList: RoleType[] = [
  { title: "Teacher" },
  { title: "Admin" },
  { title: "Parent" },
];

export const currentRole = atom<RoleType>(roleList[0]);

// Admin-specific information
type AdminProfileType = {
  [key: string]: string | string[] | null; // Flexible structure for admin data
};

export const adminProfile = map<AdminProfileType>({
  schools: [], // Array of associated schools
  adminRoles: [], // Array of admin roles
});

// Parent-specific information
type ParentProfileType = {
  [key: string]: string | string[] | null;
};

export const parentProfile = map<ParentProfileType>({
  childrenIds: [], // Array of IDs for children associated with the parent
  schools: [], // Array of associated schools
});

// Teacher-specific information
type TeacherProfileType = {
  [key: string]: string | string[] | null;
};

export const teacherProfile = map<TeacherProfileType>({
  subjects: [], // Array for subjects
  classes: [], // Array for classes
  streams: null,
  departmentGroup: null,
});

// Tracks the currently selected field (e.g., "email", "phone", etc.)
export const selectedField = atom<string | null>(null);

// Tracks selected addons (example for additional user features)
export type AddonType = {
  title: string;
  description: string;
  dollarPerMonth: number;
};

export const addonData: AddonType[] = [
  {
    title: "Online service",
    description: "Access to multiplayer games",
    dollarPerMonth: 1,
  },
  {
    title: "Larger storage",
    description: "Extra 1TB of cloud save",
    dollarPerMonth: 2,
  },
  {
    title: "Customizable profile",
    description: "Custom theme on your profile",
    dollarPerMonth: 2,
  },
];

export const addons = atom<AddonType[]>([]);
