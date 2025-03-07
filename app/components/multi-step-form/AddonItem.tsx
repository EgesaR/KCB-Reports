import React from "react";
import { useStore } from "@nanostores/react";
import { selectedField, user } from "./StepProvider";

function SpecificData() {
  const $selectedField = useStore(selectedField);
  const $user = useStore(user);

  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <h2 className="text-xl font-semibold text-gray-800">Specific Data</h2>
      {$selectedField ? (
        <>
          <p className="text-gray-600">
            <strong>Selected Field:</strong> {$selectedField}
          </p>
          <p className="text-gray-600">
            <strong>Value:</strong>{" "}
            {$user[$selectedField] ?? "No value entered"}
          </p>
        </>
      ) : (
        <p className="text-gray-500">No field selected yet.</p>
      )}
    </div>
  );
}

export default SpecificData;
