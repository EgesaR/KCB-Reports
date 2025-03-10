import { useState } from "react";
import { useStore } from "@nanostores/react";
import { user } from "./StepProvider";

const TeacherProfileForm = () => {
  const [subjects, setSubjects] = useState("");
  const [classes, setClasses] = useState("");
  const [streams, setStreams] = useState("");
  const userInfo = useStore(user);

  const handleSave = () => {
    user.set({ ...userInfo, subjects, classes, streams });
  };

  return (
    <div className="flex flex-col space-y-4">
      <input
        type="text"
        placeholder="Subjects"
        value={subjects}
        onChange={(e) => setSubjects(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Classes"
        value={classes}
        onChange={(e) => setClasses(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Streams"
        value={streams}
        onChange={(e) => setStreams(e.target.value)}
        className="border p-2 rounded"
      />
      <button onClick={handleSave} className="bg-blue-600 text-white p-2 rounded">
        Save
      </button>
    </div>
  );
};

export default TeacherProfileForm;
