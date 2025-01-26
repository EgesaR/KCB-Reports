const generateSplitNameAndColor = (name) => {
  const nameParts = name.trim().split(" ")
  let initals = ""
  
  //First letters of the first two names
  if(nameParts.length > 1) initals = nameParts[0][0]+nameParts[1][0];
  else initals = name.substring(0,2).toUpperCase();
  
  //Generate a unique background color from the initals
  const hash = initals.split(" ").reduce(( acc, char ) => acc + char.charCodeAt(0),0)
  //Map hash to a hue value
  const hue = hash%360
  
  const bgColor = `hsl(${hue}, 70%, 50%)`
  
  return { initals, bgColor };
}

export default generateSplitNameAndColor