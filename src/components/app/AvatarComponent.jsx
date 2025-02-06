const AvatarComponent = ({
 onClick,
 type = "icon",
 imageProps,
 textProps,
 iconProps
}) => (
 <div
  className="relative flex items-center justify-center bg-amber-400"
  onClick={onClick}
 >
  {type === "image" && (
   <img
    src={`${imageProps.url}`}
    alt={imageProps.alt ? imageProps.alt : imageProps.url}
    className="w-8 h-8 rounded-full object-cover border border-gray-300"
    onError={() => imageProps.setImageError(true)} // Handle image load error
   />
  )}
  {type === "text" && (
   <div
    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xl"
    style={{ backgroundColor: textProps.bgColor || "#4f46e5" }}
   >
    {textProps.initials}
   </div>
  )}
  {type === "icon" && (
   <div
    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xl"
    style={{ backgroundColor: iconProps.bgColor || "#4f46e5" }}
   >
    {iconProps.icon}
   </div>
  )}
 </div>
);

export default AvatarComponent