// app/routes/settings.tsx
import {
  LoaderFunctionArgs,
  ActionFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { getUserId } from "~/utils/session.server";
import { prisma } from "~/db.server";
import type { User, Session, Subject, UserRole } from "@prisma/client";

// ======================
// Type Definitions
// ======================

const settingTypes = [
  "text",
  "password",
  "toggle",
  "dropdown",
  "multi-select",
  "button",
  "session-list",
  "image-upload",
  "color-picker",
  "number",
] as const;

type SettingType = (typeof settingTypes)[number];

interface SettingBase<T extends SettingType> {
  id: string;
  label: string;
  type: T;
  role?: "student" | "teacher" | "admin";
  warning?: boolean;
}

interface TextSetting extends SettingBase<"text" | "password" | "number"> {
  min?: number;
  max?: number;
}

interface ToggleSetting extends SettingBase<"toggle"> {}

interface DropdownSetting extends SettingBase<"dropdown"> {
  options: string[];
}

interface MultiSelectSetting extends SettingBase<"multi-select"> {
  options: string[];
}

interface ButtonSetting extends SettingBase<"button"> {}

interface SessionListSetting extends SettingBase<"session-list"> {}

interface ImageUploadSetting extends SettingBase<"image-upload"> {}

interface ColorPickerSetting extends SettingBase<"color-picker"> {}

type Setting =
  | TextSetting
  | ToggleSetting
  | DropdownSetting
  | MultiSelectSetting
  | ButtonSetting
  | SessionListSetting
  | ImageUploadSetting
  | ColorPickerSetting;

interface SettingsSection {
  id: string;
  label: string;
  settings: Setting[];
}

interface SettingsTab {
  id: string;
  label: string;
  icon?: string;
  items: SettingsSection[];
}

// ======================
// Helper Functions
// ======================

function createSetting<T extends Setting>(setting: T): T {
  return setting;
}

// ======================
// Loader Types
// ======================

interface LoaderData {
  user: {
    id: string;
    name: string;
    email: string;
    title: string | null;
    contact: string | null;
    profilePicture: string | null;
    department: string | null;
    studentId: string | null;
    darkMode: boolean;
    accentColor: string | null;
    highContrast: boolean;
    reportFont: string | null;
    institutionalLogo: string | null;
    twoFactorEnabled: boolean;
    subjects: string[];
    sessions: Array<{
      id: string;
      ipAddress: string;
      userAgent: string;
      createdAt: string;
    }>;
    roles: string[];
  };
  allSubjects: string[];
  availableDepartments: string[];
  availableFonts: string[];
}

// ======================
// Loader
// ======================

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (!userId) throw new Response("Unauthorized", { status: 401 });

  try {
    // Get user with all available fields
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        accentColor: true,
        contact: true,
        department: true,
        highContrast: true,
        institutionalLogo: true,
        reportFont: true,
        studentId: true,
        themePreference: true,
        title: true,
        twoFactorEnabled: true,
        roles: {
          select: {
            role: true,
          },
        },
      },
    });

    if (!user) throw new Response("User not found", { status: 404 });

    // Get related data in parallel
    const [userSubjects, sessions, allSubjects] = await Promise.all([
      prisma.userSubject.findMany({
        where: { userId },
        include: { subject: { select: { name: true } } },
      }),
      prisma.session.findMany({
        where: {
          userId,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          ipAddress: true,
          userAgent: true,
          createdAt: true,
        },
      }),
      prisma.subject.findMany({
        select: { name: true },
      }),
    ]);

    return json<LoaderData>({
      user: {
        ...user,
        darkMode: user.themePreference === "DARK",
        subjects: userSubjects.map((us) => us.subject.name),
        sessions: sessions.map((session) => ({
          id: session.id,
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
          createdAt: session.createdAt.toISOString(),
        })),
        roles: user.roles.map((role) => role.role),
      },
      allSubjects: allSubjects.map((subject) => subject.name),
      availableDepartments: ["Science", "Arts", "Mathematics"],
      availableFonts: ["Arial", "Times New Roman", "Calibri"],
    });
  } catch (error) {
    console.error("Settings loader error:", error);
    throw new Response("Internal Server Error", { status: 500 });
  }
};

// ======================
// Action
// ======================

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await getUserId(request);
  if (!userId) throw new Response("Unauthorized", { status: 401 });

  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  try {
    switch (intent) {
      case "update-profile": {
        await prisma.user.update({
          where: { id: userId },
          data: {
            name: formData.get("name") as string,
            title: formData.get("title") as string,
            contact: formData.get("contact") as string,
            department: formData.get("department") as string,
            studentId: formData.get("student-id") as string,
          },
        });
        break;
      }

      case "update-subjects": {
        const subjectNames = formData.getAll("subjects") as string[];
        const subjects = await prisma.subject.findMany({
          where: { name: { in: subjectNames } },
        });

        await prisma.user.update({
          where: { id: userId },
          data: {
            userSubjects: {
              deleteMany: {},
              create: subjects.map((subject) => ({
                subjectId: subject.id,
              })),
            },
          },
        });
        break;
      }

      case "update-appearance": {
        await prisma.user.update({
          where: { id: userId },
          data: {
            themePreference:
              formData.get("dark-mode") === "on" ? "DARK" : "LIGHT",
            accentColor: formData.get("accent-color") as string,
            highContrast: formData.get("high-contrast") === "on",
            reportFont: formData.get("report-font") as string,
          },
        });
        break;
      }

      case "update-security": {
        await prisma.user.update({
          where: { id: userId },
          data: {
            twoFactorEnabled: formData.get("2fa") === "on",
          },
        });
        break;
      }

      case "change-password": {
        const newPassword = formData.get("new-password") as string;
        // In production, hash the password before saving
        await prisma.user.update({
          where: { id: userId },
          data: { password: newPassword },
        });
        break;
      }

      case "revoke-session": {
        const sessionId = formData.get("sessionId") as string;
        await prisma.session.delete({
          where: { id: sessionId, userId },
        });
        break;
      }

      default:
        throw new Response(`Invalid intent: ${intent}`, { status: 400 });
    }

    return redirect("/dashboard/settings");
  } catch (error) {
    console.error("Settings update failed:", error);
    return json({ error: "Failed to update settings" }, { status: 500 });
  }
};

// ======================
// UI Components
// ======================

const SessionList = ({
  sessions,
}: {
  sessions: LoaderData["user"]["sessions"];
}) => {
  const fetcher = useFetcher();

  const handleRevokeSession = (sessionId: string) => {
    fetcher.submit({ intent: "revoke-session", sessionId }, { method: "POST" });
  };

  return (
    <div className="session-list">
      {sessions.map((session) => (
        <div key={session.id} className="session-item">
          <div className="session-info">
            <div className="session-device">{session.userAgent}</div>
            <div className="session-ip">{session.ipAddress}</div>
            <div className="session-date">
              {new Date(session.createdAt).toLocaleString()}
            </div>
          </div>
          <button
            onClick={() => handleRevokeSession(session.id)}
            className="session-revoke"
            disabled={fetcher.state !== "idle"}
          >
            {fetcher.state === "idle" ? "Revoke" : "Revoking..."}
          </button>
        </div>
      ))}
    </div>
  );
};

const ThemeToggle = React.memo(
  ({ theme, toggleTheme }: { theme: Theme; toggleTheme: () => void }) => (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="theme-toggle"
    >
      <span className={`theme-icon ${theme}`}>
        {theme === "light" ? "🌙" : "☀️"}
      </span>
    </button>
  )
);

const ToggleSwitch = React.memo(
  ({
    id,
    checked,
    onChange,
  }: {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <div className="toggle-switch">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="toggle-input"
      />
      <label
        htmlFor={id}
        className={`toggle-label ${checked ? "checked" : ""}`}
      />
    </div>
  )
);

const SelectInput = React.memo(
  ({
    id,
    value,
    options,
    onChange,
  }: {
    id: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
  }) => (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="select-input"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
);

const MultiSelectInput = React.memo(
  ({
    id,
    value,
    options,
    onChange,
  }: {
    id: string;
    value: string[];
    options: string[];
    onChange: (value: string[]) => void;
  }) => (
    <select
      id={id}
      multiple
      value={value}
      onChange={(e) => {
        const selected = Array.from(
          e.target.selectedOptions,
          (option) => option.value
        );
        onChange(selected);
      }}
      className="multi-select-input"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
);

const TextInput = React.memo(
  ({
    id,
    type = "text",
    value,
    onChange,
    min,
    max,
  }: {
    id: string;
    type?: "text" | "password" | "number";
    value: string;
    onChange: (value: string) => void;
    min?: number;
    max?: number;
  }) => (
    <input
      type={type}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-input"
      min={min}
      max={max}
    />
  )
);

const ButtonInput = React.memo(
  ({
    id,
    label,
    warning = false,
    onClick,
  }: {
    id: string;
    label: string;
    warning?: boolean;
    onClick: () => void;
  }) => (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={`button-input ${warning ? "warning" : ""}`}
    >
      {label}
    </button>
  )
);

const TabButton = React.memo(
  ({
    tab,
    isActive,
    onClick,
  }: {
    tab: SettingsTab;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`tab-button ${isActive ? "active" : ""}`}
    >
      {isActive && (
        <motion.span
          layoutId="tab-indicator"
          className="tab-indicator"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="tab-label">{tab.label}</span>
    </button>
  )
);

const SettingsSection = React.memo(
  ({
    section,
    renderSettingInput,
  }: {
    section: SettingsSection;
    renderSettingInput: (setting: Setting) => React.ReactNode;
  }) => (
    <section className="settings-section">
      <h2 className="section-title">{section.label}</h2>
      <div className="settings-grid">
        {section.settings.map((setting) => (
          <div key={setting.id} className="setting-row">
            <label htmlFor={setting.id} className="setting-label">
              {setting.label}
            </label>
            <div className="setting-input">{renderSettingInput(setting)}</div>
          </div>
        ))}
      </div>
    </section>
  )
);

const SaveButton = React.memo(
  ({
    isSubmitting,
    onClick,
  }: {
    isSubmitting: boolean;
    onClick: () => void;
  }) => (
    <div className="save-container">
      <button
        type="button"
        onClick={onClick}
        disabled={isSubmitting}
        className="save-button"
      >
        {isSubmitting ? (
          <>
            <span className="loading-spinner" aria-hidden="true" />
            <span className="sr-only">Saving</span>
          </>
        ) : (
          <>
            Save Changes
            <span className="sr-only">Save changes</span>
          </>
        )}
      </button>
    </div>
  )
);

// ======================
// Main Component
// ======================

type Theme = "light" | "dark";

export default function SettingsPage() {
  const { user, allSubjects, availableDepartments, availableFonts } =
    useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const [activeTab, setActiveTab] = useState("profile");
  const [formValues, setFormValues] = useState<Record<string, any>>({
    name: user.name || "",
    title: user.title || "",
    contact: user.contact || "",
    "profile-pic": user.profilePicture || "",
    department: user.department || availableDepartments[0],
    "student-id": user.studentId || "",
    subjects: user.subjects || [],
    "dark-mode": user.darkMode || false,
    "accent-color": user.accentColor || "#3b82f6",
    "high-contrast": user.highContrast || false,
    "report-font": user.reportFont || availableFonts[0],
    "institutional-logo": user.institutionalLogo || "",
    "2fa": user.twoFactorEnabled || false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theme, setTheme] = useState<Theme>(user.darkMode ? "dark" : "light");
  const contentRef = useRef<HTMLDivElement>(null);

  const createSettingsData = useCallback(
    (
      roles: string[],
      allSubjects: string[],
      availableDepartments: string[],
      availableFonts: string[]
    ): SettingsTab[] => {
      const isTeacher = roles.includes("TEACHER");
      const isStudent = roles.includes("STUDENT");

      const profileSettings: SettingsTab = {
        id: "profile",
        label: "Profile",
        items: [
          {
            id: "personal-info",
            label: "Personal Information",
            settings: [
              createSetting<TextSetting>({
                id: "name",
                label: "Name",
                type: "text",
              }),
              createSetting<TextSetting>({
                id: "title",
                label: "Title/Role",
                type: "text",
              }),
              createSetting<TextSetting>({
                id: "contact",
                label: "Contact Details",
                type: "text",
              }),
              createSetting<ImageUploadSetting>({
                id: "profile-pic",
                label: "Profile Picture",
                type: "image-upload",
              }),
            ],
          },
          {
            id: "professional-details",
            label: "Professional Details",
            settings: [
              createSetting<DropdownSetting>({
                id: "department",
                label: "Department/Faculty",
                type: "dropdown",
                options: availableDepartments,
              }),
              ...(isTeacher
                ? [
                    createSetting<MultiSelectSetting>({
                      id: "subjects",
                      label: "Subjects Taught",
                      type: "multi-select",
                      options: allSubjects,
                    }),
                  ]
                : []),
              ...(isStudent
                ? [
                    createSetting<TextSetting>({
                      id: "student-id",
                      label: "Student ID/Roll Number",
                      type: "text",
                    }),
                  ]
                : []),
            ],
          },
        ],
      };

      const accountSettings: SettingsTab = {
        id: "account",
        label: "Account",
        items: [
          {
            id: "security",
            label: "Login & Security",
            settings: [
              createSetting<TextSetting>({
                id: "change-password",
                label: "Change Password",
                type: "password",
              }),
              createSetting<ToggleSetting>({
                id: "2fa",
                label: "Two-Factor Authentication",
                type: "toggle",
              }),
              createSetting<SessionListSetting>({
                id: "active-sessions",
                label: "Linked Devices",
                type: "session-list",
              }),
            ],
          },
          {
            id: "data",
            label: "Data Management",
            settings: [
              createSetting<ButtonSetting>({
                id: "export-data",
                label: "Export Data",
                type: "button",
              }),
              createSetting<ButtonSetting>({
                id: "delete-account",
                label: "Delete Account",
                type: "button",
                warning: true,
              }),
            ],
          },
        ],
      };

      const appearanceSettings: SettingsTab = {
        id: "appearance",
        label: "Appearance",
        items: [
          {
            id: "theme",
            label: "Theme Customization",
            settings: [
              createSetting<ToggleSetting>({
                id: "dark-mode",
                label: "Dark Mode",
                type: "toggle",
              }),
              createSetting<ColorPickerSetting>({
                id: "accent-color",
                label: "Accent Color",
                type: "color-picker",
              }),
              createSetting<ToggleSetting>({
                id: "high-contrast",
                label: "High Contrast Mode",
                type: "toggle",
              }),
            ],
          },
          {
            id: "report-styling",
            label: "Report Styling",
            settings: [
              createSetting<DropdownSetting>({
                id: "report-font",
                label: "Default Font",
                type: "dropdown",
                options: availableFonts,
              }),
              createSetting<ImageUploadSetting>({
                id: "institutional-logo",
                label: "Add Logo",
                type: "image-upload",
              }),
            ],
          },
        ],
      };

      return [profileSettings, accountSettings, appearanceSettings];
    },
    []
  );

  const SETTINGS_DATA = useMemo(
    () =>
      createSettingsData(
        user.roles,
        allSubjects,
        availableDepartments,
        availableFonts
      ),
    [
      user.roles,
      allSubjects,
      availableDepartments,
      availableFonts,
      createSettingsData,
    ]
  );

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      fetcher.submit(
        {
          intent: "update-appearance",
          "dark-mode": newTheme === "dark" ? "on" : "off",
        },
        { method: "POST" }
      );
      return newTheme;
    });
  }, [fetcher]);

  const currentTab = useMemo(
    () => SETTINGS_DATA.find((tab) => tab.id === activeTab),
    [activeTab, SETTINGS_DATA]
  );

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const handleInputChange = useCallback((settingId: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [settingId]: value }));
  }, []);

  const handleButtonAction = useCallback((settingId: string) => {
    if (settingId === "export-data") {
      console.log("Exporting data...");
      // Implement export logic
    } else if (settingId === "delete-account") {
      console.log("Deleting account...");
      // Implement delete logic
    }
  }, []);

  const handleSave = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      Object.entries(formValues).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(key, v));
        } else {
          formData.append(key, value);
        }
      });

      formData.append("intent", `update-${activeTab}`);

      await fetcher.submit(formData, { method: "POST" });
    } finally {
      setIsSubmitting(false);
    }
  }, [formValues, activeTab, fetcher]);

  const renderSettingInput = useCallback(
    (setting: Setting) => {
      const value = formValues[setting.id] ?? "";

      switch (setting.type) {
        case "toggle":
          return (
            <ToggleSwitch
              id={setting.id}
              checked={!!value}
              onChange={(checked) => handleInputChange(setting.id, checked)}
            />
          );
        case "dropdown":
          return (
            <SelectInput
              id={setting.id}
              value={value}
              options={setting.options || []}
              onChange={(val) => handleInputChange(setting.id, val)}
            />
          );
        case "multi-select":
          return (
            <MultiSelectInput
              id={setting.id}
              value={value}
              options={setting.options || []}
              onChange={(val) => handleInputChange(setting.id, val)}
            />
          );
        case "text":
        case "password":
        case "number":
          return (
            <TextInput
              id={setting.id}
              type={setting.type}
              value={value}
              onChange={(val) => handleInputChange(setting.id, val)}
              min={"min" in setting ? setting.min : undefined}
              max={"max" in setting ? setting.max : undefined}
            />
          );
        case "button":
          return (
            <ButtonInput
              id={setting.id}
              label={setting.label}
              warning={setting.warning || false}
              onClick={() => handleButtonAction(setting.id)}
            />
          );
        case "session-list":
          return <SessionList sessions={user.sessions} />;
        default:
          return (
            <div className="unsupported-input">
              Input type "{setting.type}" not supported
            </div>
          );
      }
    },
    [formValues, handleInputChange, handleButtonAction, user.sessions]
  );

  return (
    <div className={`settings-container ${theme}`}>
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

      <nav className="settings-nav">
        {SETTINGS_DATA.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </nav>

      <main ref={contentRef} className="settings-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentTab && (
              <>
                <h1 className="settings-title">{currentTab.label}</h1>
                {currentTab.items.map((section) => (
                  <SettingsSection
                    key={section.id}
                    section={section}
                    renderSettingInput={renderSettingInput}
                  />
                ))}
                <SaveButton
                  isSubmitting={isSubmitting || fetcher.state !== "idle"}
                  onClick={handleSave}
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}