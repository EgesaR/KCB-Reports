import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { teacherProfile } from "./StepProvider";
import MultiSelect from "./MultiSelect";
import schoolData from "~/data/school_info_uganda.json";

type TeacherInfo = {
  [key: string]: string | string[] | null; // Updated type for flexibility
};

const TeacherProfileForm = () => {
  const [streams, setStreams] = useState(""); // Input for streams
  const [departmentGroup, setDepartmentGroup] = useState(""); // Input for department group
  const teacherInfo = useStore(teacherProfile) as TeacherInfo; // Cast teacherProfile to TeacherInfo type

  const { subjects = [], classes = [], schools = [] } = schoolData || {};

  useEffect(() => {
    teacherProfile.set({
      ...teacherInfo,
      streams,
      departmentGroup,
    });
  }, [streams, departmentGroup]);

  const handleMultiSelectChange = (key: string, values: string[]) => {
    teacherProfile.set({
      ...teacherInfo,
      [key]: Array.isArray(values) ? values.join(", ") : values, // Convert arrays to comma-separated strings
      streams,
      departmentGroup,
    });
  };

  return (
    <div className="h-[45vh] w-full overflow-hidden mt-2">
      <div className="flex flex-col space-y-2 h-full max-h-full w-full overflow-y-scroll px-2 pb-10 ">
        <div>
          <label className="text-neutral-300">Subjects</label>
          <MultiSelect
            options={subjects.map((subject, index) => ({
              value: `subject_${index}`,
              title: subject,
            }))}
            placeholder="Select Subjects"
            onChange={(values: string[]) =>
              handleMultiSelectChange("subjects", values)
            }
          />
        </div>
        <div>
          <label className="text-neutral-300">Classes</label>
          <MultiSelect
            options={classes.map((classItem, index) => ({
              value: `class_${index}`,
              title: classItem,
            }))}
            placeholder="Select Classes"
            onChange={(values: string[]) =>
              handleMultiSelectChange("classes", values)
            }
          />
        </div>
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
        <div>
          <label className="text-neutral-300">Streams</label>
          <input
            type="text"
            value={streams}
            onChange={(e) => setStreams(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="text-neutral-300">Department Group</label>
          <input
            type="text"
            value={departmentGroup}
            onChange={(e) => setDepartmentGroup(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileForm;
