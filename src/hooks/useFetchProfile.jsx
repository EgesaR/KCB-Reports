import { useState, useEffect } from "react";
import axios from "axios";

const useFetchProfile = (baseURL) => {
  const [profileData, setProfileData] = useState({ profilePic: null, name: "" });
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setFetching(true);
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${baseURL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData({
          profilePic: response.data.profilePic || null,
          name: response.data.name || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to fetch profile.");
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [baseURL]);

  return { profileData, fetching, error };
};

export default useFetchProfile;
