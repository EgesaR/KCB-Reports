import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedListItem from "../AnimatedListItem";
import { FiPlus, FiSend, FiExternalLink, FiTrash2 } from "react-icons/fi";
import parseDate from "../../utils/parseDate";

let base = 4;
let t = d => d * base;

const NotificationSidebar = ({ visible, setVisible }) => {
 const [messages, setMessages] = useState([]);
 const [selectedMessages, setSelectedMessages] = useState([]);

 const archiveMessages = () => {
  setMessages(prev => {
   return prev.filter(message => !selectedMessages.includes(message.id));
  });

  setSelectedMessages([]);
 };

 const removeToggleFromMessages = () => setSelectedMessages([]);

 const selectAllMessages = () => {
  console.log(messages, messages.length);
  /*if (messages.length > 0) {
   setMessages(prev => console.log(prev));
  }*/
 };
 return (
  <AnimatePresence>
   {visible && (
    <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0, transition: { delay: 0.5 } }}
     className="fixed top-12 right-0 w-[90%] translate-x-0 h-[calc(100vh-113px)] text-white z-10 bg-zinc-100 "
    >
     <AnimatePresence>
      {visible && (
       <motion.div
        initial={{
         x: 400
        }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{
         ease: "easeIn",
         duration: 0.5
        }}
        className="w-full h-full bg-white shadow-md relative"
        onClick={removeToggleFromMessages}
       >
        <nav className="flex justify-between w-full border-b-zinc-300 border-b-[0.5px] px-4 py-2.5">
         <AnimatePresence initial={false}>
          <motion.div className="overflow-hidden">
           {selectedMessages.length === 0 && (
            <motion.h1
             initial={{ y: 25, opacity: 1 }}
             animate={{
              y: 0,
              opacity: 1,
              transition: {
               type: "spring",
               bounce: 0.3,
               opacity: {
                delay: t(0.025)
               }
              }
             }}
             exit={{ y: 100, opacity: 0 }}
             transition={{
              duration: t(0.15),
              type: "spring",
              bounce: 0,
              opacity: {
               duration: t(0.03)
              }
             }}
             className="text-lg font-medium text-zinc-700 relative"
            >
             Notifications
            </motion.h1>
           )}
           {selectedMessages.length > 0 && (
            <motion.h1
             initial={{ y: 25, opacity: 1 }}
             animate={{
              y: 0,
              opacity: 1,
              transition: {
               type: "spring",
               bounce: 0.3,
               opacity: {
                delay: t(0.025)
               }
              }
             }}
             exit={{ y: 100, opacity: 0 }}
             transition={{
              duration: t(0.15),
              type: "spring",
              bounce: 0,
              opacity: {
               duration: t(0.03)
              }
             }}
             className="text-lg font-medium text-zinc-700 relative"
            >
             {selectedMessages.length} selected
            </motion.h1>
           )}
          </motion.div>
         </AnimatePresence>
         <div className="flex gap-2" onClick={e => e.stopPropagation()}>
          <motion.button
           whileTap={{
            scale: 0.5
           }}
           className="text-blue-700 hover:text-white hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-xs px-2 py-1 text-center dark:hover:text-white dark:hover:bg-blue-500"
           onClick={selectAllMessages}
          >
           Select All
          </motion.button>
          <motion.button
           whileTap={{
            scale: 0.5
           }}
           className="rounded bg-red-300/20 px-1.5 py-1 text-[16px] text-red-300 transition-colors font-medium"
           onClick={archiveMessages}
          >
           <FiTrash2 />
          </motion.button>
         </div>
        </nav>
        <main
         className={`bg-teal-200 px-3 py-2 overflow-y-auto pb-4 max-h-[95%] ${
          messages.length === 0 &&
          "h-[95%] flex gap-2 justify-center items-center"
         }`}
        >
         <ul>
          <Messages
           messages={messages}
           setSelectedMessages={setSelectedMessages}
           selectedMessages={selectedMessages}
          />
         </ul>
         <Form setMessages={setMessages} />
        </main>
       </motion.div>
      )}
     </AnimatePresence>
    </motion.div>
   )}
  </AnimatePresence>
 );
};

const Form = ({ setMessages }) => {
 const [visible, setVisible] = useState(false);
 const [title, setTitle] = useState("");
 const [messageBody, setMessageBody] = useState("");

 const handleSubmit = () => {
  if (!title.length || !messageBody) return;

  setMessages(pv => [
   {
    id: Math.random(),
    title,
    messages: messageBody,
    timeSent: new Date()
   },
   ...pv
  ]);
 };
 return (
  <div
   className="absolute bottom-[6%] right-1.5 w-full px-2 pl-6"
   onClick={e => e.stopPropagation()}
  >
   <AnimatePresence>
    {visible && (
     <motion.form
      initial={{
       opacity: 0,
       y: 25
      }}
      animate={{
       opacity: 1,
       y: 0
      }}
      onSubmit={e => {
       e.preventDefault();
       handleSubmit();
      }}
      className="mb-6 w-full px-0.5 flex flex-col gap-2"
     >
      <div className="w-full rounded-md border border-zinc-700 bg-zinc-90">
       <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="What's the topic?"
        className="w-full resize-none rounded bg-zinc-900 py-3 px-3 text-sm text-zinc-50 placeholder:text-zinc-500 caret-zinc-500 focus:outline-0"
       />
      </div>
      <div className="h-32 w-full rounded-md border border-zinc-700 bg-zinc-900 flex flex-col gap-3.5">
       <textarea
        value={messageBody}
        onChange={e => setMessageBody(e.target.value)}
        placeholder="Message..."
        className="h-24 w-full resize-none rounded bg-zinc-900 py-3 px-3 text-sm text-zinc-50 placeholder:text-zinc-500 caret-zinc-500 focus:outline-0 border-white border"
       />
       <div className="flex justify-between items-end h-8 px-3 border border-white">
        <div>
         <buttton className="h-4 w-8 rounded-full grid place-content-center">
          <FiExternalLink size={18} />
         </buttton>
        </div>
        <motion.button
         whileTap={{ scale: 0.5 }}
         className="h-8 w-8 rounded-full grid place-content-center bg-green-400"
         type="submit"
        >
         <FiSend size={16} />
        </motion.button>
       </div>
      </div>
     </motion.form>
    )}
   </AnimatePresence>
   <motion.button
    whileTap={{ scale: 0.5 }}
    className="grid w-full place-content-center rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-lg text-white transition-colors hover:bg-zinc-800 active:bg-zinc-900"
    onClick={() => setVisible(pv => !pv)}
   >
    <FiPlus
     className={`transition-transform ${visible ? "rotate-45" : "rotate-0"}`}
    />
   </motion.button>
  </div>
 );
};

const Messages = ({ messages, selectedMessages, setSelectedMessages }) => {
 const toggleMessage = id => {
  if (selectedMessages.includes(id)) {
   setSelectedMessages(prev => prev.filter(i => i !== id));
  } else {
   setSelectedMessages(prev => [...prev, id]);
  }
 };

 return (
  <AnimatePresence initial={false}>
   {messages.length === 0 && (
    <AnimatedListItem>
     <h1 className="text-center font-semibold text-zinc-500 py-4">
      You have no messages
     </h1>
    </AnimatedListItem>
   )}
   {messages.map(message => (
    <AnimatedListItem key={message.id}>
     <div className="py-0.5 transition">
      <button
       className={`flex w-full p-2 rounded-md transition-colors ${
        selectedMessages.includes(message.id) ? "bg-blue-400" : "bg-white"
       }`}
       onClick={e => {
        e.stopPropagation();
        toggleMessage(message.id);
       }}
      >
       <div className="flex flex-col items-start">
        <p
         className={`font-medium transition-colors ${
          selectedMessages.includes(message.id) ? "text-white" : "text-zinc-600"
         }`}
        >
         {message.title}
        </p>
        <span
         className={`text-sm transition-colors w-full ${
          selectedMessages.includes(message.id)
           ? "text-zinc-100"
           : "text-zinc-400"
         }`}
        >
         {message.messages.length <= 21
          ? message.messages
          : message.messages.replace(
             message.messages.slice(21, message.messages.length),
             "..."
            )}
        </span>
       </div>
       <span
        className={`text-xs transition-colors ml-auto ${
         selectedMessages.includes(message.id)
          ? "text-zinc-100"
          : "text-zinc-400"
        }`}
       >
        {parseDate(message.timeSent).fullTime}
       </span>
      </button>
     </div>
    </AnimatedListItem>
   ))}
  </AnimatePresence>
 );
};

export default NotificationSidebar;
