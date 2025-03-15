import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { parentProfile } from "./StepProvider"; // Updated to reflect parent-specific profile storage
import MultiSelect from "./MultiSelect";
import schoolData from "~/data/school_info_uganda.json";

type ParentInfo = {
  [key: string]: string | string[] | null;
};

const ParentProfileInfo = () => {
  const parentInfo = useStore(parentProfile) as ParentInfo;

  // Extract schools from schoolData
  const { schools = [] } = schoolData || {};

  // State for Student ID
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    parentProfile.set({
      ...parentInfo,
      studentId, // Add Student ID to the profile data
    });
  }, [studentId]);

  const handleMultiSelectChange = (key: string, values: string[]) => {
    parentProfile.set({
      ...parentInfo,
      [key]: Array.isArray(values) ? values.join(", ") : values,
    });
  };

  return (
    <div className="h-[45vh] w-full overflow-hidden mt-4">
      <div className="flex flex-col space-y-4 h-full max-h-full w-full overflow-y-auto px-2 pb-10">
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

        {/* Student ID Input */}
        <div>
          <label className="text-neutral-300">Student ID</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="Enter Student ID"
          />
        </div>
      </div>
    </div>
  );
};

export default ParentProfileInfo;
