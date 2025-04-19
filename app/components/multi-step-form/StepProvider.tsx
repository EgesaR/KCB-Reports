import { map } from "nanostores";

export const currentStep = map({ value: 1 });

export const user = map<{
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  dob?: string;
}>({});

export const currentRole = map<{ title: string }>({ title: "" });

export const roleList = map([
  { title: "Teacher" },
  { title: "Admin" },
  { title: "Parent" },
]);

export const teacherProfile = map<{
  subjects?: string[];
  classes?: string[];
  schools?: string[];
  streams?: string;
  departmentGroup?: string;
}>({});

export const adminProfile = map<{
  schools?: string[];
  adminRoles?: string[];
}>({});

export const parentProfile = map<{
  schools?: string[];
  childrenIds?: string[];
}>({});
