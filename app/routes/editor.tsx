import { useEffect, useRef, useState } from "react";
import CodeEditor from "~/components/CodeEditor";

const Editor = () => {
    return <div className="">
      <CodeEditor initialCode="function hello() {\n  console.log('Hello, world!');\n}"
  onSave={(code) => console.log("Saved:", code)} />
  </div>;
};

export default Editor;
