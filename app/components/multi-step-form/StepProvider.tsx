import { atom, map } from "nanostores";

export interface Role {
  title: string;
}

export const currentStep = map<{ value: number }>({ value: 1 });

export const roleList = atom<Role[]>([
  { title: "Teacher" },
  { title: "Admin" },
  { title: "Parent" },
]);

export const currentRole = map<Role>({ title: "" });

export const user = map<{
  name?: string;
  email?: string;
  password?: string;
  dob?: string;
  phone?: string;
}>({});

function parseTextField(field: string | undefined): string[] {
  if (!field) return [];
  try {
    return JSON.parse(field);
  } catch {
    return field
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

export const teacherProfile = map<{
  subjects: string[];
  classes: string[];
  streams: string;
  departmentGroup: string;
  schools: string[];
}>({
  subjects: [],
  classes: [],
  streams: "",
  departmentGroup: "",
  schools: [],
});

export const adminProfile = map<{
  adminRole: string;
  schools: string[];
}>({
  adminRole: "",
  schools: [],
});

export const parentProfile = map<{
  studentIds: string[];
  schools: string[];
}>({
  studentIds: [],
  schools: [],
});

export function setTeacherProfileFromDb(data: {
  subjects: string;
  classes: string;
  streams: string;
  departmentGroup: string;
}) {
  teacherProfile.set({
    ...teacherProfile.get(),
    subjects: parseTextField(data.subjects),
    classes: parseTextField(data.classes),
    streams: data.streams || "",
    departmentGroup: data.departmentGroup || "",
  });
}
