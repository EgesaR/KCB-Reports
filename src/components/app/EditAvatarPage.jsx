import React from "react";

const EditProfilePage = ({ onBack }) => {
  return (
    <div className="w-full h-full flex flex-col gap-1.5">
      <h3 className="text-2xl font-medium text-gray-800">Edit Profile</h3>
      <p className="text-sm font-normal text-gray-500">
        Update your profile details.
      </p>

      {/* Form for editing profile details */}
      <form className="mt-4 flex flex-col gap-3">
        <div>
          <label className="text-sm font-medium text-gray-600">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full mt-1 px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mt-1 px-3 py-2 border rounded-md"
          />
        </div>
        {/* Additional fields can be added here */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-300 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
