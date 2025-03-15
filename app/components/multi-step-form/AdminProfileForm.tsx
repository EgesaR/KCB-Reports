import { useStore } from "@nanostores/react";
import { adminProfile } from "./StepProvider";
import MultiSelect from "./MultiSelect";
import schoolData from "~/data/school_info_uganda.json";
import adminRolesData from "~/data/admin_roles.json"; // Import the admin_roles.json file

type AdminInfo = {
  [key: string]: string | string[] | null;
};

const AdminProfileForm = () => {
  const adminInfo = useStore(adminProfile) as AdminInfo;

  // Extract schools from schoolData and adminRoles from admin_roles.json
  const { schools = [] } = schoolData || {};
  const adminRoles = adminRolesData || []; // No destructuring since it's a flat array

  // Debugging Logs
  console.log("Admin Info from adminProfile:", adminInfo); // Logs the current state of adminProfile
  console.log("Schools data:", schools); // Logs the school data being used for MultiSelect
  console.log("Admin Roles data:", adminRoles); // Logs the roles data being used for MultiSelect

  const handleMultiSelectChange = (key: string, values: string[]) => {
    const updatedValues = values.map((value) => {
      if (key === "schools") {
        // Map the selected school values to their corresponding names
        const school = schools.find((s, index) => `school_${index}` === value);
        return school?.name || value; // Use the name if found, or fallback to the value
      } else if (key === "adminRoles") {
        // Map the selected role values to their corresponding titles
        const role = adminRoles.find((r) => `role_${r.id}` === value);
        return role?.adminRole || value; // Use the adminRole if found, or fallback to the value
      }
      return value;
    });

    adminProfile.set({
      ...adminInfo,
      [key]: updatedValues, // Store the actual names/titles
    });

    console.log(`Updated ${key} in adminProfile:`, adminProfile.get());
  };



  return (
    <div className="h-[45vh] overflow-hidden w-full mt-4">
      <div className="flex flex-col space-y-4 h-full max-h-full w-full px-2 pb-10">
        {/* Schools Multi-Select */}
        <div>
          <label className="text-neutral-300">Schools</label>
          <MultiSelect
            options={schools.map((school, index) => ({
              value: `school_${index}`,
              title: school.name,
            }))}
            placeholder="Select Schools"
            onChange={(values: string[]) =>
              handleMultiSelectChange("schools", values)
            }
          />
        </div>

        {/* Administrative Roles Multi-Select */}
        <div>
          <label className="text-neutral-300">Administrative Roles</label>
          <MultiSelect
            options={adminRoles.map((role) => ({
              value: `role_${role.id}`, // Using `id` for unique values
              title: role.adminRole, // Matches the property name in the JSON
            }))}
            placeholder="Select Administrative Roles"
            onChange={(values: string[]) =>
              handleMultiSelectChange("adminRoles", values)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AdminProfileForm;
