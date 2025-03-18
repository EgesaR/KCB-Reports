import {
  FaCog,
  FaChartLine,
  FaRobot,
  FaQuestionCircle,
  FaUsers,
  FaSync,
} from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import IconButton from "./ButtonComponent";

const Sidebar = () => {
  return (
    <div className="h-full w-[5%] border-r flex flex-col justify-between items-center py-2">
      {/* First Div: Top Icons */}
      <div className="flex flex-col gap-3">
        <IconButton
          icon={<FaHouse className="w-5 h-5 bg-transparent dark:bg-transparent" />}
          onClick={() => alert("Home clicked!")}
        />
        <IconButton
          icon={<FaChartLine className="w-5 h-5 bg-transparent dark:bg-transparent" />}
          onClick={() => alert("Analysis clicked!")}
        />
        <IconButton
          icon={<FaRobot className="w-5 h-5 bg-transparent dark:bg-transparent" />}
          onClick={() => alert("AI clicked!")}
        />
        <IconButton
          icon={<FaUsers className="w-5 h-5 bg-transparent dark:bg-transparent" />}
          onClick={() => alert("Departments clicked!")}
        />
        <IconButton
          icon={<FaSync className="w-5 h-5 bg-transparent dark:bg-transparent" />}
          onClick={() => alert("Updates clicked!")}
        />
      </div>

      {/* Second Div: Bottom Icons */}
      <div className="flex flex-col gap-3">
        <IconButton
          icon={<FaCog className="w-5 h-5 bg-transparent dark:bg-transparent" />}
          onClick={() => alert("Settings clicked!")}
        />
        <IconButton
          icon={<FaQuestionCircle className="w-5 h-5 bg-transparent dark:bg-transparent" />}
          onClick={() => alert("Feedback and Help clicked!")}
        />
      </div>
    </div>
  );
};

export default Sidebar;
