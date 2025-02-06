import { useState, useEffect, Suspense } from "react";
import { Oval } from "react-loader-spinner";
import NameAndColorSplitter from "../../utils/generateSpiltNameAndColor";
import useFetchProfile from "../../hooks/useFetchProfile";
import ErrorBoundary from "../../ErrorBoundary";

const Avatar = ({ onClick, updatedProfilePic }) => {
 const baseURL = `http://${window.location.hostname}:5000`; // Replace with your API base URL
 const { profileData, fetching, error } = useFetchProfile(baseURL);
 const { initals, bgColor } = NameAndColorSplitter(profileData.name);

 const [profilePic, setProfilePic] = useState(null);
 const [imageError, setImageError] = useState(false);

 // Update profilePic if updatedProfilePic changes
 useEffect(() => {
  if (updatedProfilePic) {
   setProfilePic(updatedProfilePic);
  } else {
   setProfilePic(profileData.profilePic);
  }
 }, [updatedProfilePic, profileData.profilePic]);

 return (
  <div className="relative flex items-center justify-center" onClick={onClick}>
   <ErrorBoundary
    fallback={
     <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-base"
      style={{ backgroundColor: bgColor || "#4f46e5" }}
     >
      {initals}
     </div>
    }
   >
    <Suspense fallback={<Oval height={25} width={25} color="#4f46e5" />}>
     <img
      src={`${baseURL}${profilePic}`}
      alt="Profile"
      className="w-8 h-8 rounded-full object-cover border border-gray-300"
      onError={() => setImageError(true)} // Handle image load error
     />
    </Suspense>
   </ErrorBoundary>
  </div>
 );
};

export default Avatar;
