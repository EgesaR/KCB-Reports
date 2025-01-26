import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { RiNotificationLine } from "react-icons/ri";
import Button from "../../../components/Button";
import ProfileDialog from "../../../components/app/ProfileDialog"
import Avatar from "../../../components/app/Avatar"
// HomeTab Component
const HomeTab = () => {
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const token = localStorage.getItem("token");
  return (
    <div className="w-full normal-case">
      <nav className="w-full h-12 px-2 flex items-center fixed top-0 left-0 bg-green-200 shadow">
        <h1 className="text-xl font-medium">KCB Reports</h1>
        <div className="flex ml-auto items-center justify-center gap-2">
          <Button className="h-8 w-8 rounded-full grid place-content-center">
            <RiNotificationLine size={18} />
          </Button>
          <Avatar
            onClick={() => setShowProfileDialog(true)}
          />
        </div>
      </nav>
        <ProfileDialog onClose={() => setShowProfileDialog(false)} open={showProfileDialog} />
      <main className="text-[18px]">
        showProfileDialog: {showProfileDialog ? "true" : "false"}
        <p className="text-[2px] px-36">token: {token}</p>
        <Avatar />
      </main>
    </div>
  );
};

export default HomeTab;
