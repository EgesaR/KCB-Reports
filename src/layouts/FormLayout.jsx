const FormLayout = ({children, className}) => {
return (
<div className={`w-full h-screen bg-green-900 relative overflow-hidden ${className}`}>
  {children}
</div>
);
}

const FormHeader = ({children, className}) => {
return(
<div className={`w-full h-[35%] flex flex-col justify-center gap-3 relative px-3 z-10 ${className}`}>
  {children}
  {/* Background Decorative Circles */}
  <div className="h-[640px] w-[640px] absolute flex justify-center items-center rounded-full bg-green-800 -translate-x-1/2 -translate-y-[21%]">
    <div className="w-[70%] h-[70%] rounded-full bg-green-700"></div>
  </div>
</div>
)
}

const FormBody = ({children, className}) => {
return(
<div className={`pt-10 w-full h-[65%] flex flex-col items-center bg-white z-20 relative px-3 ${className}`}>
  {children}
</div>
)
}

export { FormLayout, FormHeader, FormBody }