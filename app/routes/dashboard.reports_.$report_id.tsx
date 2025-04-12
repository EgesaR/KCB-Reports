import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { FaArrowLeft } from "react-icons/fa";
import Chip from "~/components/Chip";
import IconButton from "~/components/IconButton";

const Report = () => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState<"report" | "presentation">(
    "report"
  );

  return (
    <div className="w-full h-screen text-white pt-12 px-2">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <IconButton
            variant="text"
            color="blue"
            icon={<FaArrowLeft />}
            size="md"
            className="focus:ring-0"
            onClick={() => navigate(-1)}
          />
          <div className="flex gap-2 items-center">
            <label
              className="w-8 h-8 rounded-lg text-xs grid place-content-center
               bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500
               transition-colors duration-200"
            >
              EOT
            </label>
            <label className="text-[14px] font-semibold">
              End Of Term Examination
            </label>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Chip
            variant="outlined"
            isActive={activeForm === "report"}
            onClick={() => setActiveForm("report")}
          >
            Report Form
          </Chip>
          <Chip
            variant="outlined"
            isActive={activeForm === "presentation"}
            onClick={() => setActiveForm("presentation")}
          >
            Presentation Form
          </Chip>
        </div>
      </nav>
    </div>
  );
};

export default Report;
