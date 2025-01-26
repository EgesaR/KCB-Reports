const Dialog = ({
  open, 
  onClose,
  children
}) => (
  //backdrop
  <div
    onClick={onClose}
    className={`
      fixed inset-0 flex justify-center items-center z-40
      transition-colors
      ${open ? "visible bg-black/20" : "invisible"}
    `}
  >
    {/* Modal */}
    <div
      className={`
        bg-white rounded-2xl shadow py-6 px-4
        transition-all w-[85%]
        ${open ? "scale-100 opacity-100" : "scale-150 opacity-0"}
      `}
      onClick={e => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

export default Dialog