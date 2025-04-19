import { useStore } from "@nanostores/react";
import {
  user,
  currentStep,
  currentRole,
  teacherProfile,
  adminProfile,
  parentProfile,
} from "./StepProvider";

export default function SummaryList() {
  const $user = useStore(user);
  const $currentRole = useStore(currentRole);
  const $teacherProfile = useStore(teacherProfile);
  const $adminProfile = useStore(adminProfile);
  const $parentProfile = useStore(parentProfile);

  const handleChange = (step: number) => {
    currentStep.set(step);
  };

  return (
    <div className="min-h-[50vh] w-full overflow-y-auto">
      <dl className="divide-y divide-neutral-500">
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-neutral-200">
            Name
          </dt>
          <dd className="mt-1 text-sm leading-6 text-neutral-200 sm:col-span-2 sm:mt-0">
            {$user.name || "N/A"}
            <button
              onClick={() => handleChange(1)}
              className="ml-4 text-blue-400 hover:text-blue-600"
            >
              Change
            </button>
          </dd>
        </div>
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-neutral-200">
            DOB
          </dt>
          <dd className="mt-1 text-sm leading-6 text-neutral-200 sm:col-span-2 sm:mt-0">
            {$user.dob || "N/A"}
            <button
              onClick={() => handleChange(1)}
              className="ml-4 text-blue-400 hover:text-blue-600"
            >
              Change
            </button>
          </dd>
        </div>
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-neutral-200">
            Email
          </dt>
          <dd className="mt-1 text-sm leading-6 text-neutral-200 sm:col-span-2 sm:mt-0">
            {$user.email || "N/A"}
            <button
              onClick={() => handleChange(2)}
              className="ml-4 text-blue-400 hover:text-blue-600"
            >
              Change
            </button>
          </dd>
        </div>
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-neutral-200">
            Phone
          </dt>
          <dd className="mt-1 text-sm leading-6 text-neutral-200 sm:col-span-2 sm:mt-0">
            {$user.phone || "N/A"}
            <button
              onClick={() => handleChange(2)}
              className="ml-4 text-blue-400 hover:text-blue-600"
            >
              Change
            </button>
          </dd>
        </div>
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-neutral-200">
            Password
          </dt>
          <dd className="mt-1 text-sm leading-6 text-neutral-200 sm:col-span-2 sm:mt-0">
            {$user.password ? "********" : "N/A"}
            <button
              onClick={() => handleChange(3)}
              className="ml-4 text-blue-400 hover:text-blue-600"
            >
              Change
            </button>
          </dd>
        </div>
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-neutral-200">
            Role
          </dt>
          <dd className="mt-1 text-sm leading-6 text-neutral-200 sm:col-span-2 sm:mt-0">
            {$currentRole.title || "N/A"}
            <button
              onClick={() => handleChange(4)}
              className="ml-4 text-blue-400 hover:text-blue-600"
            >
              Change
            </button>
          </dd>
        </div>
        {$currentRole.title === "Teacher" && (
          <>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-neutral-200">
                Subjects
              </dt>
              <dd className="mt-1 text-sm leading-6 text-neutral-200 sm:col-span-2 sm:mt-0">
                {$teacherProfile.subjects?.join(", ") || "N/A"}
                <button
                  onClick={() => handleChange(5)}
                  className="ml-4 text-blue-400 hover:text-blue-600"
                >
                  Change
                </button>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-neutral-200">
                Classes
              </dt>
              <dd className="mt-1 text-sm leading-6 text-neutral-200 sm:col-span-2 sm:mt-0">
                {$teacherProfile.classes?.join(", ") || "N/A"}
                <button
                  onClick={() => handleChange(5)}
                  className="ml-4 text-blue-400 hover:text-blue-600"
                >
                  Change
                </button>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-neutral-200">
                Schools
              </dt>
              <dd className="mt-1 text-sm leading-6 text-neutral-200 sm:col-span-2 sm:mt-0">
                {$teacherProfile.schools?.join(", ") || "N/A"}
                <button
                  onClick={() => handleChange(5)}
                  className="ml-4 text-blue-400 hover:text-blue-600"
                >
                  Change
                </button>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-neutral-200">
                Streams
              </dt>
              <dd className="mt-1 text-sm leading-6 text-neutral-200 sm:col-span-2 sm:mt-0">
                {$teacherProfile.streams || "N/A"}
                <button
                  onClick={() => handleChange(5)}
                  className="ml-4 text-blue-400 hover:text-blue-600"
                >
                  Change
                </button>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-neutral-200">
                Department Group
              </dt>
              <dd className="mt-1 text-sm leading-6 text-neutral-200 sm:col-span-2 sm:mt-0">
                {$teacherProfile.departmentGroup || "N/A"}
                <button
                  onClick={() => handleChange(5)}
                  className="ml-4 text-blue-400 hover:text-blue-600"
                >
                  Change
                </button>
              </dd>
            </div>
          </>
        )}
        {$currentRole.title === "Admin" && (
          <>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-neutral-200">
                Schools
              </dt>
              <dd className="mt-1 text-sm leading-6 text-neutral-200 sm:col-span-2 sm:mt-0">
                {$adminProfile.schools?.join(", ") || "N/A"}
                <button
                  onClick={() => handleChange(5)}
                  className="ml-4 text-blue-400 hover:text-blue-600"
                >
                  Change
                </button>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-neutral-200">
                Admin Roles
              </dt>
              <dd className="mt-1 text-sm leading-6 text-neutral-200 sm:col-span-2 sm:mt-0">
                {$adminProfile.adminRoles?.join(", ") || "N/A"}
                <button
                  onClick={() => handleChange(5)}
                  className="ml-4 text-blue-400 hover:text-blue-600"
                >
                  Change
                </button>
              </dd>
            </div>
          </>
        )}
        {$currentRole.title === "Parent" && (
          <>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-neutral-200">
                Schools
              </dt>
              <dd className="mt-1 text-sm leading-6 text-neutral-200 sm:col-span-2 sm:mt-0">
                {$parentProfile.schools?.join(", ") || "N/A"}
                <button
                  onClick={() => handleChange(5)}
                  className="ml-4 text-blue-400 hover:text-blue-600"
                >
                  Change
                </button>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-neutral-200">
                Student IDs
              </dt>
              <dd className="mt-1 text-sm leading-6 text-neutral-200 sm:col-span-2 sm:mt-0">
                {$parentProfile.childrenIds?.join(", ") || "N/A"}
                <button
                  onClick={() => handleChange(5)}
                  className="ml-4 text-blue-400 hover:text-blue-600"
                >
                  Change
                </button>
              </dd>
            </div>
          </>
        )}
      </dl>
    </div>
  );
}
