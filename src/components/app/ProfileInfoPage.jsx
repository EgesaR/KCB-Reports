import React from "react";
import AccountSlot from "./AccountSlot";

const ProfileInfoPage = ({ onEditAvatar }) => {
  return (
    <div className="w-full h-full flex flex-col gap-1.5">
      <h3 className="text-2xl font-medium text-gray-800">Profile</h3>
      <p className="text-sm font-normal text-gray-500">
        Profiling is a better way to give precise info about you.
      </p>
      <div className="flex flex-col mt-4">
        <p className="text-xs text-gray-600 font-medium">Sign in as</p>
        <AccountSlot
          name="Egesa Elijah Raymond"
          accountType="Teacher Account"
          active={true}
        />
        <p className="text-xs text-gray-600 font-medium mt-4">Other accounts</p>
        <AccountSlot
          name="Egesa Raymond"
          accountType="Parent Account"
          active={false}
        />
        <AccountSlot
          name="Egesa Elijah"
          accountType="Admin Account"
          active={false}
        />
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={onEditAvatar}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileInfoPage;
