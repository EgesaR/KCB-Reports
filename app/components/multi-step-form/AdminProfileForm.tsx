import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useStore } from "@nanostores/react";
import { adminProfile } from "./StepProvider";
import MultiSelect from "./MultiSelect";

interface AdminProfileFormProps {
  loaderData: { schools: string[] };
}

const AdminProfileForm = forwardRef<
  { validateStep: () => boolean },
  AdminProfileFormProps
>(({ loaderData }, ref) => {
  const { schools } = loaderData;
  const adminInfo = useStore(adminProfile);
  const [adminRoles, setAdminRoles] = useState<string[]>(
    adminInfo.adminRoles || []
  );
  const [errors, setErrors] = useState({ schools: "", adminRoles: "" });

  useImperativeHandle(ref, () => ({
    validateStep: () => {
      const newErrors = {
        schools: adminInfo.schools?.length
          ? ""
          : "At least one school is required",
        adminRoles: adminRoles.length ? "" : "At least one role is required",
      };
      setErrors(newErrors);
      return !Object.values(newErrors).some((e) => e);
    },
  }));

  useEffect(() => {
    adminProfile.set({ ...adminInfo, adminRoles });
  }, [adminRoles]);

  const handleMultiSelectChange = (key: string, values: string[]) => {
    adminProfile.set({ ...adminInfo, [key]: values });
  };

  return (
    <div className="min-h-[50vh] w-full overflow-y-auto mt-2 px-2 pb-10 flex flex-col space-y-2">
      <div>
        <label className="text-neutral-200">Schools</label>
        <MultiSelect
          options={schools.map((school, index) => ({
            value: `school_${index}`,
            title: school,
          }))}
          placeholder="Select Schools"
          onChange={(values) => handleMultiSelectChange("schools", values)}
        />
        {errors.schools && (
          <span className="text-sm text-red-500">{errors.schools}</span>
        )}
      </div>
      <div>
        <label className="text-neutral-200">Admin Roles</label>
        <MultiSelect
          options={["Principal", "Registrar", "Dean"].map((role, index) => ({
            value: `role_${index}`,
            title: role,
          }))}
          placeholder="Select Admin Roles"
          onChange={(values) => setAdminRoles(values)}
        />
        {errors.adminRoles && (
          <span className="text-sm text-red-500">{errors.adminRoles}</span>
        )}
      </div>
    </div>
  );
});

export default AdminProfileForm;
