import { useStore } from "@nanostores/react";
import {
  currentStep,
  user,
  currentRole,
  addons,
  teacherProfile,
  adminProfile,
  parentProfile,
} from "./StepProvider";

const SummaryList = () => {
  const $currentStep = useStore(currentStep);
  const $user = useStore(user);
  const $currentRole = useStore(currentRole);
  const $addons = useStore(addons);
  const $teacherProfile = useStore(teacherProfile);
  const $adminProfile = useStore(adminProfile);
  const $parentProfile = useStore(parentProfile);

  const handleChangeClick = (step: number) => {
    currentStep.set(step); // Navigate to the step to update the corresponding data
  };

  return (
    <div className="h-[48vh] w-full overflow-hidden mt-1 pt-2">
      <div className="rounded-lg p-6 px-1 shadow-lg h-full max-h-full w-full overflow-y-scroll">
        <div>
          <h3 className="font-medium text-xl text-gray-900 dark:text-gray-200">
            Information
          </h3>
          <dl className="border-t border-gray-200">
          {/* Name */}          
            <div className="justify-between flex border-b border-gray-200 last:border-0 py-2.5">
              <dt className="text-gray-500 dark:text-gray-200">Name</dt>
              <dd className="text-gray-900 dark:text-gray-200 flex gap-2.5">
                {$user.name || "N/A"}{" "}
                <button
                  className="text-blue-500 underline"
                  onClick={() => handleChangeClick(1)}
                >
                  Change
                </button>
              </dd>
            </div>

          {/* DOB */}
            <div className="justify-between flex border-b border-gray-200 last:border-0 py-2.5">
              <dt className="text-gray-500 dark:text-gray-200">Date of birth</dt>
              <dd className="text-gray-900 dark:text-gray-200 flex gap-2.5">
                {$user.dob || "N/A"}{" "}
                <button
                  className="text-blue-500 underline"
                  onClick={() => handleChangeClick(1)}
                >
                  Change
                </button>
              </dd>
            </div>

          {/* Email */}
            <div className="justify-between flex border-b border-gray-200 last:border-0 py-2.5">
              <dt className="text-gray-500 dark:text-gray-200">Email</dt>
              <dd className="text-gray-900 dark:text-gray-200 flex gap-2.5">
                {$user.email || "N/A"}{" "}
                <button
                  className="text-blue-500 underline"
                  onClick={() => handleChangeClick(2)}
                >
                  Change
                </button>
              </dd>
            </div>
          {/* Phone Number */}
            <div className="justify-between flex border-b border-gray-200 last:border-0 py-2.5">
              <dt className="text-gray-500 dark:text-gray-200">Phone Number</dt>
              <dd className="text-gray-900 dark:text-gray-200 flex gap-2.5">
                {$user.phone || "N/A"}{" "}
                <button
                  className="text-blue-500 underline"
                  onClick={() => handleChangeClick(2)}
                >
                  Change
                </button>
              </dd>
            </div>

          {/* Password */}
          <div className="justify-between flex border-b border-gray-200 last:border-0 py-2.5">
            <dt className="text-gray-500 dark:text-gray-200">Password</dt>
            <dd className="text-gray-900 dark:text-gray-200 flex gap-2.5">
              {$user.password || "N/A"}{" "}
              <button
                className="text-blue-500 underline"
                onClick={() => handleChangeClick(3)}
              >
                Change
              </button>
            </dd>
          </div>
         </dl>
        </div>

        <div>
          <h3 className="font-medium text-xl text-gray-900 dark:text-gray-200 mt-4.5">
            Roles
          </h3>
          <dl className="border-y border-gray-200">
            {/* User Type */}
            <div className="justify-between flex border-b border-gray-200 last:border-0 py-2.5">
              <dt className="text-gray-500 dark:text-gray-200">User Type</dt>
              <dd className="text-gray-900 dark:text-gray-200 flex gap-2.5">
                {$currentRole.title || "N/A"}{" "}
                <button
                  className="text-blue-500 underline"
                  onClick={() => handleChangeClick(4)}
                >
                  Change
                </button>
              </dd>
            </div>

            {/* Conditional Role-Specific Information */}
            {(() => {
              switch ($currentRole.title) {
                case "Teacher":
                  return (
                    <div className="mt-2">
                      {/* Subjects */}
                      <div className="justify-between flex border-b border-gray-200 last:border-0 py-2.5">
                        <dt className="text-gray-500 dark:text-gray-200">
                          Subjects
                        </dt>
                        <dd className="text-gray-900 dark:text-gray-200 flex gap-2.5">
                          {Array.isArray($teacherProfile.subjects) &&
                          $teacherProfile.subjects.length > 0
                            ? $teacherProfile.subjects.join(", ")
                            : "No subjects assigned"}
                          <button
                            className="text-blue-500 underline"
                            onClick={() => handleChangeClick(5)}
                          >
                            Change
                          </button>
                        </dd>
                      </div>
                      {/* Classes */}
                      <div className="justify-between flex border-b border-gray-200 last:border-0 py-2.5">
                        <dt className="text-gray-500 dark:text-gray-200">
                          Classes
                        </dt>
                        <dd className="text-gray-900 dark:text-gray-200 flex gap-2.5">
                          {Array.isArray($teacherProfile.classes) &&
                          $teacherProfile.classes.length > 0
                            ? $teacherProfile.classes.join(", ")
                            : "No classes assigned"}
                          <button
                            className="text-blue-500 underline"
                            onClick={() => handleChangeClick(5)}
                          >
                            Change
                          </button>
                        </dd>
                      </div>
                    </div>
                  );
                case "Admin":
                  return (
                    <div className="mt-2">
                      {/* Schools */}
                      <div className="justify-between flex border-b border-gray-200 last:border-0 py-2.5">
                        <dt className="text-gray-500 dark:text-gray-200">
                          Schools
                        </dt>
                        <dd className="text-gray-900 dark:text-gray-200 flex gap-2.5">
                          {Array.isArray($adminProfile.schools) &&
                          $adminProfile.schools.length > 0
                            ? $adminProfile.schools.join(", ")
                            : "No schools assigned"}
                          <button
                            className="text-blue-500 underline"
                            onClick={() => handleChangeClick(5)}
                          >
                            Change
                          </button>
                        </dd>
                      </div>
                      {/* Roles */}
                      <div className="justify-between flex border-b border-gray-200 last:border-0 py-2.5">
                        <dt className="text-gray-500 dark:text-gray-200">
                          Roles
                        </dt>
                        <dd className="text-gray-900 dark:text-gray-200 flex gap-2.5">
                          {Array.isArray($adminProfile.adminRoles) &&
                          $adminProfile.adminRoles.length > 0
                            ? $adminProfile.adminRoles.join(", ")
                            : "No roles assigned"}
                          <button
                            className="text-blue-500 underline"
                            onClick={() => handleChangeClick(5)}
                          >
                            Change
                          </button>
                        </dd>
                      </div>
                    </div>
                  );
                case "Parent":
                  return (
                    <div className="mt-2">
                      {/* Children IDs */}
                      <div className="justify-between flex border-b border-gray-200 last:border-0 py-2.5">
                        <dt className="text-gray-500 dark:text-gray-200">
                          Children IDs
                        </dt>
                        <dd className="text-gray-900 dark:text-gray-200 flex gap-2.5">
                          {Array.isArray($parentProfile.childrenIds) &&
                          $parentProfile.childrenIds.length > 0
                            ? $parentProfile.childrenIds.join(", ")
                            : "No children IDs"}
                          <button
                            className="text-blue-500 underline"
                            onClick={() => handleChangeClick(5)}
                          >
                            Change
                          </button>
                        </dd>
                      </div>
                      {/* Schools */}
                      <div className="justify-between flex border-b border-gray-200 last:border-0 py-2.5">
                        <dt className="text-gray-500 dark:text-gray-200">
                          Schools
                        </dt>
                        <dd className="text-gray-900 dark:text-gray-200 flex gap-2.5">
                          {Array.isArray($parentProfile.schools) &&
                          $parentProfile.schools.length > 0
                            ? $parentProfile.schools.join(", ")
                            : "No schools assigned"}
                          <button
                            className="text-blue-500 underline"
                            onClick={() => handleChangeClick(5)}
                          >
                            Change
                          </button>
                        </dd>
                      </div>
                    </div>
                  );
                default:
                  return <p>No additional details available for this role.</p>;
              }
            })()}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default SummaryList;
