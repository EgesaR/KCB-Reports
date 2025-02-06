import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
 Tab,
 TabGroup,
 TabList,
 TabPanel,
 TabPanels,
 Transition,
 TransitionChild
} from "@headlessui/react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import AnimatedListItem from "../../../components/AnimatedListItem";

const Blogs = () => {
 return (
  <div className="min-h-screen w-full bg-white text-black dark:bg-neutral-950 dark:text-neutral-400 px-2 pb-8 pt-16">
   <div className="flex flex-col gap-4">
    <h1 className="text-5xl font-semibold text-slate-600 dark:text-white mt-14">
     Blogs
    </h1>
    <SearchBox />
   </div>
   <InterestTabs />
  </div>
 );
};

const SearchBox = () => {
 const keywords = [
  "HTML",
  "CSS",
  "Easy Tutorials",
  "Javascript",
  "Where to learn coding online",
  "Where to learn web design"
 ];
 const [results, setResults] = useState([]);
 const [phrases, setPhrases] = useState([]);
 const [isFocused, setIsFocused] = useState(false);
 const handleSearch = e => {
  let search = e.target.value;

  if (search) {
   setResults(
    keywords.filter(keyword => {
     return keyword.toLowerCase().includes(search.toLowerCase());
    })
   );
   setPhrases(getPharses(search));
  } else {
   setResults([]);
  }
 };

 const getPharses = word => {
  let phrasesArr = word
   .split("#")
   .filter(a => a)
   .map((w, idx) => {
    if (w.includes("@")) {
     let at_idx = w.indexOf("@");
     let result = {
      harsh: {
       word: `${w.split("").slice(0, at_idx).join("")}`,
       symbol: "harsh"
      },
      at: {
       word: `${w
        .split("")
        .slice(at_idx + 1, w.length)
        .join("")}`,
       symbol: "at"
      }
     };
     return result;
    }
    return { word: w, symbol: "harsh" };
   });

  return phrasesArr;
 };

 return (
  <div className="bg-neutral-100 dark:bg-neutral-800 w-full pt-1 rounded-lg mt-6">
   <div className="flex items-center h-10 gap-2 px-2 pb-1">
    <HiOutlineMagnifyingGlass className="size-6 text-[#555] dark:text-slate-300" />
    <input
     type="text"
     placeholder="Search"
     className="w-full bg-transparent text-[#333] placeholder:text-[#555] h-full px-2 border-0 outline-none focus:outline-none dark:text-neutral-300 dark:placeholder:text-neutral-400"
     autocomplete={false}
     onKeyUp={e => handleSearch(e)}
     onFocus={() => setIsFocused(true)}
     onBlur={() => setTimeout(() => setIsFocused(false), 700)}
    />
   </div>
   <div className="hidden">{JSON.stringify(phrases)}</div>
   <ResultBox results={results} />
   {isFocused && (
    <AnimatePresence>
     <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="flex items-center bg-neutral-200 py-2.5 px-3 rounded-b-lg text-xs flex-wrap dark:bg-neutral-700"
     >
      Type
      <div className="w-5 h-5 grid place-content-center  ml-2 mr-1 border border-slate-400 p-1 rounded-md">
       #
      </div>{" "}
      for blogs,
      <div className="w-5 h-5 grid place-content-center  ml-2 mr-1 border border-slate-400 p-1 rounded-md">
       @
      </div>
      for users, and
      <div className="w-5 h-5 grid place-content-center  ml-2 mr-1 border border-slate-400 p-1 rounded-md">
       ?
      </div>
      for help.
     </motion.div>
    </AnimatePresence>
   )}
  </div>
 );
};

const ResultBox = ({ results }) => (
 <div className="transition-all ease-in-out">
  <AnimatePresence>
   {results.length > 0 && (
    <motion.ul
     initial={{ height: 0, padding: 0 }}
     animate={{ height: "auto" }}
     exit={{ height: 0, padding: 0 }}
     transition={{ duration: 0.6, ease: "easeInOut" }}
     className="border-t border-slate-600 dark:border-slate-200/60 px-[15px] py-[10px] overflow-y-auto"
    >
     {results.map((list, idx) => (
      <AnimatedListItem key={idx}>
       <div className="list-none rounded-[3px] px-[15px] py-[10px] hover:bg-green-100">
        {list}
       </div>
      </AnimatedListItem>
     ))}
    </motion.ul>
   )}
  </AnimatePresence>
  {/*{results.length === 0 && <p className="text-center w-full">Not found</p>}*/}
 </div>
);

function InterestTabs() {
 const interests = [
  {
   name: "For You",
   id: "for-you"
  },
  {
   name: "Research",
   id: "research"
  },
  {
   name: "Training",
   id: "training"
  },
  {
   name: "New",
   id: "new"
  },
  {
   name: "Education",
   id: "education"
  },
  {
   name: "Creative",
   id: "creative"
  }
 ];
 return (
  <AnimatePresence>
   <TabGroup className="text-slate-600 dark:text-slate-200 mt-4">
    <TabList className="mb-4 flex-nowrap overflow-x-auto flex noScrollBar">
     {interests.map(interest => (
      <Tab
       key={interest.id}
       className="data-[selected]:text-black dark:data-[selected]:text-white data-[selected]:border data-[selected]:border-b-2 data-[selected]:border-r-2 data-[selected]:border-zinc-700 dark:data-[selected]:border-zinc-200 px-4 py-2 mr-2 transition duration-300 ease-in-out hover:data-[selected]:outline-0 active:data-[selected]:ring-0 hover:data-[selected]:ring-0 whitespace-nowrap"
      >
       {interest.name}
      </Tab>
     ))}
    </TabList>
    <TabPanels className="overflow-hidden h-auto w-full">
     <TabPanel className="transition duration-300 ease-in">
      <motion.div
       initial={{
        opacity: 0,
        x: 50
       }}
       animate={{
        opacity: 1,
        x: 0
       }}
       exit={{
        opacity: 0,
        x: -50
       }}
      >
       Hello
      </motion.div>
     </TabPanel>
     <TabPanel className="transition duration-300 ease-in">
      {" "}
      <motion.div
       initial={{
        opacity: 0,
        x: 50
       }}
       animate={{
        opacity: 1,
        x: 0
       }}
       exit={{
        opacity: 0,
        x: -50
       }}
      >
       Conremt 2
      </motion.div>
     </TabPanel>
     <TabPanel className="transition duration-300 ease-in">
      {" "}
      <motion.div
       initial={{
        opacity: 0,
        x: 50
       }}
       animate={{
        opacity: 1,
        x: 0
       }}
       exit={{
        opacity: 0,
        x: -50
       }}
      >
       Content 3
      </motion.div>
     </TabPanel>
    </TabPanels>
   </TabGroup>
  </AnimatePresence>
 );
}
export default Blogs;
