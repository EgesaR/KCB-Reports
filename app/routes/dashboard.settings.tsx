import { useState, useEffect } from "react";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch, Tab } from "@headlessui/react";
import { clsx } from "clsx";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUserId } from "~/utils/session.server";
import { prisma } from "~/utils/prisma.server";

// Type Definitions
const settingTypes = [
  "text",
  "password",
  "toggle",
  "dropdown",
  "multi-select",
  "button",
  "color-picker",
  "number",
] as const;

type SettingType = (typeof settingTypes)[number];

interface SettingBase<T extends SettingType> {
  id: string;
  label: string;
  type: T;
  description?: string;
  warning?: boolean;
}

interface TextSetting extends SettingBase<"text" | "password" | "number"> {
  min?: number;
  max?: number;
  placeholder?: string;
}

interface ToggleSetting extends SettingBase<"toggle"> {}

interface DropdownSetting extends SettingBase<"dropdown"> {
  options: string[];
}

interface MultiSelectSetting extends SettingBase<"multi-select"> {
  options: string[];
}

interface ButtonSetting extends SettingBase<"button"> {
  actionType?: "submit" | "button" | "reset";
}

interface ColorPickerSetting extends SettingBase<"color-picker"> {
  presetColors?: string[];
}

type Setting =
  | TextSetting
  | ToggleSetting
  | DropdownSetting
  | MultiSelectSetting
  | ButtonSetting
  | ColorPickerSetting;

interface SettingsSection {
  id: string;
  label: string;
  description?: string;
  settings: Setting[];
}

interface SettingsTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  items: SettingsSection[];
}

const validRoles = ["ADMIN", "PARENT", "TEACHER", "STUDENT"] as const;
type Role = (typeof validRoles)[number];

// Loader
export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      profileUrl: true,
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

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return json({
    user: {
      ...user,
      roles: user.roles.map((r) => r.role),
      darkMode: user.themePreference === "DARK",
      notifications: true,
      reduceMotion: false,
    },
  });
}

// UI Components
const ToggleInput = ({
  id,
  checked,
  onChange,
  disabled = false,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) => (
  <Switch
    checked={checked}
    onChange={onChange}
    disabled={disabled}
    id={id}
    className={clsx(
      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
      checked ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700",
      disabled && "opacity-50 cursor-not-allowed"
    )}
  >
    <motion.span
      className={clsx(
        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
        checked ? "translate-x-6" : "translate-x-1"
      )}
      layout
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  </Switch>
);

const TextInput = ({
  id,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "password" | "number";
  placeholder?: string;
  disabled?: boolean;
}) => (
  <motion.div whileHover={{ scale: disabled ? 1 : 1.01 }}>
    <input
      type={type}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={clsx(
        "w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset transition-all",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
        disabled
          ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
        "ring-gray-300 dark:ring-gray-600"
      )}
    />
  </motion.div>
);

const DropdownInput = ({
  id,
  value,
  options,
  onChange,
  disabled = false,
}: {
  id: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) => (
  <motion.div whileHover={{ scale: disabled ? 1 : 1.01 }}>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={clsx(
        "w-full rounded-md border-0 py-1.5 pl-3 pr-10 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-blue-500 focus:outline-none",
        disabled
          ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
        "ring-gray-300 dark:ring-gray-600"
      )}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </motion.div>
);

const ColorPickerInput = ({
  id,
  value,
  onChange,
  presetColors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"],
  disabled = false,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  presetColors?: string[];
  disabled?: boolean;
}) => (
  <div className="flex items-center space-x-2">
    <input
      type="color"
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={clsx(
        "h-10 w-10 rounded-md cursor-pointer disabled:cursor-not-allowed",
        disabled && "opacity-50"
      )}
    />
    <div className="flex space-x-1">
      {presetColors.map((color) => (
        <button
          key={color}
          type="button"
          className="h-6 w-6 rounded-md border border-gray-300 dark:border-gray-600"
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
          disabled={disabled}
        />
      ))}
    </div>
  </div>
);

const SettingsTabButton = ({
  tab,
  isSelected,
}: {
  tab: SettingsTab;
  isSelected: boolean;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={clsx(
      "relative px-4 py-3 text-left rounded-lg w-full",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
      isSelected
        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium"
        : "text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
    )}
  >
    {isSelected && (
      <motion.span
        layoutId="tab-indicator"
        className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-l-lg"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <div className="flex items-center space-x-3">
      {tab.icon && <span className="text-lg">{tab.icon}</span>}
      <span>{tab.label}</span>
    </div>
  </motion.div>
);

const SettingsSection = ({
  section,
  renderSettingInput,
}: {
  section: SettingsSection;
  renderSettingInput: (setting: Setting) => React.ReactNode;
}) => (
  <motion.section
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className="mb-10"
  >
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {section.label}
      </h2>
      {section.description && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {section.description}
        </p>
      )}
    </div>
    <div className="space-y-6">
      {section.settings.map((setting) => (
        <motion.div
          key={setting.id}
          layout
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <div className="space-y-1">
            <label
              htmlFor={setting.id}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {setting.label}
            </label>
            {setting.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {setting.description}
              </p>
            )}
          </div>
          <div className="md:col-span-2">{renderSettingInput(setting)}</div>
        </motion.div>
      ))}
    </div>
  </motion.section>
);

// Settings Configuration
const SETTINGS_DATA: SettingsTab[] = [
  {
    id: "profile",
    label: "Profile",
    icon: "👤",
    items: [
      {
        id: "personal-info",
        label: "Personal Information",
        description: "Update your personal details",
        settings: [
          {
            id: "name",
            label: "Full Name",
            type: "text",
            placeholder: "Enter your full name",
          },
          {
            id: "email",
            label: "Email Address",
            type: "text",
            placeholder: "your.email@example.com",
          },
        ],
      },
      {
        id: "preferences",
        label: "Preferences",
        description: "Customize your experience",
        settings: [
          {
            id: "darkMode",
            label: "Dark Mode",
            type: "toggle",
            description: "Enable dark theme",
          },
          {
            id: "notifications",
            label: "Email Notifications",
            type: "toggle",
            description: "Receive email updates",
          },
        ],
      },
    ],
  },
  {
    id: "account",
    label: "Account",
    icon: "🔒",
    items: [
      {
        id: "security",
        label: "Security",
        description: "Manage your account security",
        settings: [
          {
            id: "password",
            label: "Change Password",
            type: "password",
            placeholder: "Enter new password",
          },
          {
            id: "twoFactor",
            label: "Two-Factor Authentication",
            type: "toggle",
            description: "Add an extra layer of security",
          },
        ],
      },
      {
        id: "roles",
        label: "Roles",
        description: "Manage your account roles",
        settings: [
          {
            id: "roles",
            label: "Account Roles",
            type: "multi-select",
            options: [...validRoles],
            description: "Select roles for your account",
          },
        ],
      },
      {
        id: "danger-zone",
        label: "Danger Zone",
        description: "Irreversible actions",
        settings: [
          {
            id: "deleteAccount",
            label: "Delete Account",
            type: "button",
            warning: true,
            description: "Permanently delete your account and all data",
          },
        ],
      },
    ],
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: "🎨",
    items: [
      {
        id: "theme",
        label: "Theme",
        description: "Customize the look and feel",
        settings: [
          {
            id: "themeStyle",
            label: "Theme Style",
            type: "dropdown",
            options: ["System", "Light", "Dark", "OLED"],
          },
          {
            id: "accentColor",
            label: "Accent Color",
            type: "color-picker",
            presetColors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"],
          },
        ],
      },
      {
        id: "display",
        label: "Display",
        description: "Adjust display settings",
        settings: [
          {
            id: "reduceMotion",
            label: "Reduce Motion",
            type: "toggle",
            description: "Disable animations and transitions",
          },
          {
            id: "highContrast",
            label: "High Contrast Mode",
            type: "toggle",
            description: "Increase contrast for better visibility",
          },
        ],
      },
    ],
  },
];

// Main Component
export default function SettingsPage() {
  const { user } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [formValues, setFormValues] = useState(user);

  useEffect(() => {
    setFormValues(user);
  }, [user]);

  const handleInputChange = (
    key: string,
    value: string | boolean | string[]
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("intent", "update");
    formData.append("themePreference", formValues.darkMode ? "DARK" : "LIGHT");

    Object.entries(formValues).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    fetcher.submit(formData, {
      method: "post",
      action: "/api/users",
    });
  };

  const RoleToggle = ({ role }: { role: Role }) => (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={`role-${role}`}
        checked={(formValues.roles as Role[])?.includes(role) || false}
        onChange={(e) => {
          const newRoles = e.target.checked
            ? [...((formValues.roles as Role[]) || []), role]
            : ((formValues.roles as Role[]) || []).filter(
                (r: Role) => r !== role
              );
          handleInputChange("roles", newRoles);
        }}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label
        htmlFor={`role-${role}`}
        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
      >
        {role}
      </label>
    </div>
  );

  const renderSettingInput = (setting: Setting) => {
    switch (setting.type) {
      case "toggle":
        return (
          <div className="flex items-center">
            <ToggleInput
              id={setting.id}
              checked={Boolean(
                formValues[setting.id as keyof typeof formValues]
              )}
              onChange={(checked) => handleInputChange(setting.id, checked)}
              disabled={fetcher.state === "submitting"}
            />
            {fetcher.state === "submitting" && (
              <span className="ml-2 text-sm text-gray-500">Saving...</span>
            )}
          </div>
        );
      case "text":
      case "password":
      case "number":
        return (
          <TextInput
            id={setting.id}
            value={String(
              formValues[setting.id as keyof typeof formValues] || ""
            )}
            onChange={(val) => handleInputChange(setting.id, val)}
            type={setting.type}
            placeholder={"placeholder" in setting ? setting.placeholder : ""}
            disabled={fetcher.state === "submitting"}
          />
        );
      case "dropdown":
        return (
          <DropdownInput
            id={setting.id}
            value={String(
              formValues[setting.id as keyof typeof formValues] || ""
            )}
            options={setting.options}
            onChange={(val) => handleInputChange(setting.id, val)}
            disabled={fetcher.state === "submitting"}
          />
        );
      case "multi-select":
        if (setting.id === "roles") {
          return (
            <div className="space-y-2">
              {validRoles.map((role) => (
                <RoleToggle key={role} role={role} />
              ))}
            </div>
          );
        }
        return null;
      case "color-picker":
        return (
          <ColorPickerInput
            id={setting.id}
            value={String(
              formValues[setting.id as keyof typeof formValues] || ""
            )}
            onChange={(val) => handleInputChange(setting.id, val)}
            presetColors={
              "presetColors" in setting ? setting.presetColors : undefined
            }
            disabled={fetcher.state === "submitting"}
          />
        );
      case "button":
        if (setting.id === "deleteAccount") {
          return (
            <fetcher.Form method="post" action="/api/users">
              <input type="hidden" name="intent" value="delete" />
              <input type="hidden" name="id" value={user.id} />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={clsx(
                  "px-4 py-2 rounded-md font-medium transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                  "bg-red-500 text-white hover:bg-red-600",
                  fetcher.state === "submitting" && "opacity-50"
                )}
                disabled={fetcher.state === "submitting"}
              >
                {fetcher.state === "submitting" ? "Deleting..." : setting.label}
              </motion.button>
            </fetcher.Form>
          );
        }
        return (
          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={clsx(
              "px-4 py-2 rounded-md font-medium transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
              setting.warning
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-blue-500 text-white hover:bg-blue-600",
              fetcher.state === "submitting" && "opacity-50"
            )}
            disabled={fetcher.state === "submitting"}
          >
            {fetcher.state === "submitting" ? "Saving..." : setting.label}
          </motion.button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <Tab.Group>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto lg:pb-8"
            >
              <Tab.List className="space-y-1">
                {SETTINGS_DATA.map((tab) => (
                  <Tab key={tab.id} className="focus:outline-none w-full">
                    {({ selected }) => (
                      <SettingsTabButton tab={tab} isSelected={selected} />
                    )}
                  </Tab>
                ))}
              </Tab.List>
            </motion.div>

            <Tab.Panels className="focus:outline-none">
              <AnimatePresence mode="wait">
                {SETTINGS_DATA.map((tab) => (
                  <Tab.Panel key={tab.id}>
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:p-8"
                    >
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                          {tab.icon && (
                            <span className="text-2xl">{tab.icon}</span>
                          )}
                          <span>{tab.label}</span>
                        </h2>
                      </div>

                      <div className="space-y-10 overflow-y-auto max-h-[calc(100vh-250px)]">
                        {tab.items.map((section) => (
                          <SettingsSection
                            key={section.id}
                            section={section}
                            renderSettingInput={renderSettingInput}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </Tab.Panel>
                ))}
              </AnimatePresence>
            </Tab.Panels>
          </div>
        </Tab.Group>
      </div>
    </div>
  );
}
