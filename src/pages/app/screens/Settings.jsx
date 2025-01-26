import { RiArrowLeftFill, RiFileSearchFill } from "react-icons/ri"

const Settings = ({open, onClose}) => {
  return (
    <>
      {
        open &&
            <div className="fixed inset-0 h-screen w-full px-1 py-2">
            <div className="flex items-center">
              <button className="p-2 rounded-full hover:bg-neutral-100">
                <RiArrowLeftFill />
              </button>
              <h2 className="text-xl bg-neutral-500">
                Settings
              </h2>
              <button className="p-2 rounded-full ml-auto hover:bg-neutral-100">
                <RiFileSearchFill />
              </button>
            </div>
          </div>
      }
    </>
  )
}

export default Settings