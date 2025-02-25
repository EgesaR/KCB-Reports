import { atom, map } from "nanostores";

export const currentStep = atom(1);

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

export type roleType = {
  title: string;
};

export const roleList: roleType[] = [
  {
    title: "Teacher",
  },
  {
    title: "Parent",
  },
  {
    title: "Admin",
  },
];

export const currentRole = atom<roleType>(roleList[0]);

export const addons = atom<AddonType[]>([]);

export const user = map<Record<string, string | null>>({
  name: null,
  email: null,
  phone: null,
  password: null
});
