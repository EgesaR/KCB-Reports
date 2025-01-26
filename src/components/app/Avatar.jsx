import React, { useState, useEffect } from "react";
import axios from "axios";
import "cropperjs/dist/cropper.css";
import { Oval } from "react-loader-spinner";
import NameAndColorSplitter from "../../utils/generateSpiltNameAndColor";

const Avatar = ({ onClick, updatedProfilePic }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false); // State for image load error
  const baseURL = "https://kcb-reports-api.vercel.app" //`http://${window.location.hostname}:5000`;
  const [name, setName] = useState("");
  const { initials, bgColor } = NameAndColorSplitter(name);

  // Fetch profile data on initial render
  useEffect(() => {
    const fetchProfile = async () => {
      setFetching(true);
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${baseURL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfilePic(response.data.profilePic || null);
        setName(response.data.name || "");
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to fetch profile.");
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [baseURL]);

  // Update profilePic if updatedProfilePic changes
  useEffect(() => {
    if (updatedProfilePic) {
      setProfilePic(updatedProfilePic);
    }
  }, [updatedProfilePic]);

  return (
    <div className="relative flex items-center justify-center" onClick={onClick}>
      {
        fetching ? (
          <Oval height={25} width={25} color="#4f46e5" />
        ) : !error && !imageError && profilePic ? (
          <img
            src={`${baseURL}${profilePic}`}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border border-gray-300"
            onError={() => setImageError(true)} // Handle image load error
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xl"
            style={{ backgroundColor: bgColor || "#4f46e5" }}
          >
            {initials}
          </div>
        )
      }
    </div>
  );
};

export default Avatar;
