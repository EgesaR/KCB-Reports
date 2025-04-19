import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useStore } from "@nanostores/react";
import { parentProfile } from "./StepProvider";
import MultiSelect from "./MultiSelect";

interface ParentProfileInfoProps {
  loaderData: { schools: string[] };
}

const ParentProfileInfo = forwardRef<
  { validateStep: () => boolean },
  ParentProfileInfoProps
>(({ loaderData }, ref) => {
  const { schools } = loaderData;
  const parentInfo = useStore(parentProfile);
  const [studentIds, setStudentIds] = useState<string[]>(
    parentInfo.childrenIds || []
  );
  const [errors, setErrors] = useState({ childrenIds: "" });

  useImperativeHandle(ref, () => ({
    validateStep: () => {
      const newErrors = {
        childrenIds: studentIds.length
          ? ""
          : "At least one student ID is required",
      };
      setErrors(newErrors);
      return !Object.values(newErrors).some((e) => e);
    },
  }));

  useEffect(() => {
    parentProfile.set({ ...parentInfo, childrenIds: studentIds });
  }, [studentIds]);

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
          onChange={(values) =>
            parentProfile.set({ ...parentInfo, schools: values })
          }
        />
      </div>
      <div>
        <label className="text-neutral-200">
          Student IDs (comma-separated)
        </label>
        <input
          type="text"
          value={studentIds.join(", ")}
          onChange={(e) =>
            setStudentIds(
              e.target.value
                .split(",")
                .map((id) => id.trim())
                .filter(Boolean)
            )
          }
          className="border rounded p-2 w-full dark:border-neutral-500"
          aria-describedby="studentIds-error"
        />
        {errors.childrenIds && (
          <span id="studentIds-error" className="text-sm text-red-500">
            {errors.childrenIds}
          </span>
        )}
      </div>
    </div>
  );
});

export default ParentProfileInfo;
