import { atom, map } from "nanostores";

// Tracks the current step number (1 to 4)
export const currentStep = atom(1);

// Tracks the status of each step: "success", "failure", or "pending"
export const stepStatuses = atom<Record<number, string>>({
  1: "pending",
  2: "pending",
  3: "pending",
  4: "pending",
});

export const teacherProfile = map<Record<string, string | null>>({
  subjects: null,
  classes: null,
  streams: null,
  departmentGroup: null,
});


// Tracks the user's current selections and data
export const user = map<Record<string, string | null>>({
  name: null,
  dob: null
  //email: null,
  //phone: null,
  //password: null,
});

// Tracks the currently selected field (e.g., "email", "phone", etc.)
export const selectedField = atom<string | null>(null);

// Tracks roles (e.g., Teacher, Parent, Admin)
export type roleType = {
  title: string;
};

export const roleList: roleType[] = [
  { title: "Teacher" },
  { title: "Parent" },
  { title: "Admin" },
];

export const currentRole = atom<roleType>(roleList[0]);

// Tracks selected addons
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
