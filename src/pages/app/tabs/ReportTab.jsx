import { useState } from "react"
import NameAndColorSplitter from "../../../utils/generateSpiltNameAndColor"
import Dailog from "../../../components/app/Dialog"
const ReportTab = () => {
  const {initals, bgColor} = NameAndColorSplitter("Egesa Elijah Raymond")
  const [open, setOpen] = useState(false)
  return (
    <div>
      Name: {initals}
      bgColor: {bgColor}
      
      <div>
        <button onClick={() => setOpen(true)}>
          Open Dailog
        </button>
        <Dailog open={open} onClose={() => setOpen(false)}>
          Hi here
        </Dailog>
      </div>
    </div>
  )
}

export default ReportTab