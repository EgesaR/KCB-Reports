import { useState } from "react";
import { RiNotificationLine } from "react-icons/ri";
import Button from "../../components/Button";
import ProfileDialog from "../../components/app/ProfileDialog";
import NotificationSidebar from "../../components/app/NotificationSidebar";
import Avatar from "../../components/app/Avatar";

const HomeTab = () => {
 const [showProfileDialog, setShowProfileDialog] = useState(false);
 const [showNotificationBar, setShowNotificationBar] = useState(false);

 return (
  <div className="w-full h-[calc(100%-65px)] overflow-hidden normal-case">
   <nav className="w-full h-12 px-2 flex items-center fixed top-0 left-0 bg-green-200 shadow z-20">
    <h1 className="text-xl font-medium">KCB Reports</h1>
    <div className="flex ml-auto items-center justify-center gap-2">
     <Button className="h-8 w-8 rounded-full grid place-content-center">
      <RiNotificationLine
       onClick={() => setShowNotificationBar(!showNotificationBar)}
       size={18}
      />
     </Button>
     <Avatar onClick={() => setShowProfileDialog(true)} />
    </div>
   </nav>

   <ProfileDialog
    onClose={() => setShowProfileDialog(false)}
    open={showProfileDialog}
   />
   <main className="z-[-1] mt-12 h-full bg-amber-100">
    <NotificationSidebar
     visible={showNotificationBar}
     setVisible={setShowNotificationBar}
    />
    showProfileDialog: {showProfileDialog ? "true" : "false"}
    <Avatar />
   </main>
  </div>
 );
};

export default HomeTab;
