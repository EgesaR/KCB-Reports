import { useReport } from "~/contexts/ReportContext";
import Header from "~/components/Header";

export default function ReportHeader() {
  const {
    mode,
    setMode,
    openSideSheet,
    toggleSideSheet,
    handleSave,
    handleUndo,
    handleRedo,
  } = useReport();
  return (
    <Header
      title="Document Editor"
      mode={mode}
      setMode={setMode}
      onUndo={handleUndo}
      onRedo={handleRedo}
      onSave={handleSave}
      toggleSideSheet={toggleSideSheet}
      openSideSheet={openSideSheet}
    />
  );
}
