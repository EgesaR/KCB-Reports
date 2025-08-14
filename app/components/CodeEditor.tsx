import { useRef, useState, useEffect, useCallback } from "react";
import Prism from "prismjs"; // npm install prismjs
import "prismjs/themes/prism.css"; // Use prism.css or prism-dark.css
import * as esprima from "esprima"; // npm install esprima

// Custom debounce
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

interface CodeEditorProps {
  initialCode?: string;
  onSave?: (code: string) => void;
}

export default function CodeEditor({
  initialCode = "function hello() {\n  console.log('Hello, world!');\n}",
  onSave,
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null); // Hidden editing div
  const displayRef = useRef<HTMLPreElement>(null); // Visible highlighted div
  const gutterRef = useRef<HTMLDivElement>(null);
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);
  const [code, setCode] = useState(initialCode);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [syntaxError, setSyntaxError] = useState<{
    line: number;
    message: string;
  } | null>(null);
  const keyHoldRef = useRef<{
    key: string | null;
    timer: NodeJS.Timeout | null;
  }>({
    key: null,
    timer: null,
  });
  const lastTextRef = useRef<string>("");

  const updateLineNumbersAndCode = useCallback(() => {
    if (!editorRef.current) return;
    editorRef.current.getBoundingClientRect(); // Force DOM reflow
    let text =
      editorRef.current.innerText || editorRef.current.textContent || "";
    text = text.replace(/\u200B/g, "");
    let linesArr = text.split("\n");
    while (linesArr.length > 1 && linesArr[linesArr.length - 1].trim() === "") {
      linesArr.pop();
    }
    setLineNumbers(Array.from({ length: linesArr.length }, (_, i) => i + 1));
    setCode(linesArr.join("\n"));
    console.log("Update - Text:", text, "Lines:", linesArr.length); // Debug
  }, []);

  const debouncedHighlight = debounce(() => {
    if (!editorRef.current || !displayRef.current) return;
    const text = editorRef.current.innerText;
    if (text === lastTextRef.current) {
      console.log("Highlight - Skipped, no text change"); // Debug
      return;
    }
    lastTextRef.current = text;
    if (text.length > 5000) return; // Skip for large texts
    console.log(
      "Highlight - Text:",
      text,
      "DOM:",
      displayRef.current.innerHTML
    ); // Debug
    displayRef.current.innerHTML = Prism.highlight(
      text,
      Prism.languages.javascript,
      "javascript"
    );
  }, 200);

  const throttledParse = debounce(() => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText;
    try {
      esprima.parseScript(text);
      setSyntaxError(null);
    } catch (e: any) {
      setSyntaxError({
        line: e.lineNumber || 1,
        message: e.description || "Syntax error",
      });
    }
  }, 100);

  const syncSelection = () => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount || !editorRef.current) return;
    const range = sel.getRangeAt(0);
    const startOffset = range.startOffset;
    console.log(
      "Sync - Offset:",
      startOffset,
      "Has focus:",
      document.activeElement === editorRef.current
    ); // Debug
    if (document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
  };

  const insertAtCaret = (textToInsert: string) => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount || !editorRef.current) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(textToInsert);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    console.log(
      "Insert - Text:",
      textToInsert,
      "New text:",
      editorRef.current.innerText
    ); // Debug
  };

  const getCurrentLine = () => {
    const sel = window.getSelection();
    if (!sel || !editorRef.current) return 1;
    const range = sel.getRangeAt(0);
    const textBeforeCaret = editorRef.current.innerText.slice(
      0,
      range.startOffset
    );
    return textBeforeCaret.split("\n").length;
  };

  const selectLine = (lineNumber: number) => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText;
    const lines = text.split("\n");
    if (lineNumber < 1 || lineNumber > lines.length) return;

    const startOffset =
      lines.slice(0, lineNumber - 1).join("\n").length +
      (lineNumber > 1 ? 1 : 0);
    const endOffset = startOffset + lines[lineNumber - 1].length;

    const sel = window.getSelection();
    if (!sel) return;
    const range = document.createRange();
    range.setStart(
      editorRef.current.firstChild || editorRef.current,
      startOffset
    );
    range.setEnd(editorRef.current.firstChild || editorRef.current, endOffset);
    sel.removeAllRanges();
    sel.addRange(range);
    setCurrentLine(lineNumber);
    editorRef.current.focus();
    console.log(
      "SelectLine - Line:",
      lineNumber,
      "Offset:",
      startOffset,
      "-",
      endOffset
    ); // Debug
  };

  const toggleComment = () => {
    if (!editorRef.current) return;
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const text = editorRef.current.innerText;
    const lines = text.split("\n");
    const startLine = getCurrentLine();
    const endLine =
      range.endContainer === range.startContainer
        ? startLine
        : text.slice(0, range.endOffset).split("\n").length;

    let newText = lines
      .map((line, i) => {
        const lineNum = i + 1;
        if (lineNum >= startLine && lineNum <= endLine) {
          if (line.trim().startsWith("//")) {
            return line.replace(/^\/\/\s?/, "");
          } else {
            return "// " + line;
          }
        }
        return line;
      })
      .join("\n");

    editorRef.current.innerText = newText;
    updateLineNumbersAndCode();
    debouncedHighlight();
    selectLine(startLine);
  };

  const moveCursor = (direction: "up" | "down") => {
    const sel = window.getSelection();
    if (!sel || !editorRef.current) return;
    const range = sel.getRangeAt(0);
    const text = editorRef.current.innerText;
    const lines = text.split("\n");
    const currentLine = getCurrentLine();
    const newLine = direction === "up" ? currentLine - 1 : currentLine + 1;

    if (newLine < 1 || newLine > lines.length) return;

    const lineStartOffset =
      lines.slice(0, newLine - 1).join("\n").length + (newLine > 1 ? 1 : 0);
    const newOffset = Math.min(
      lineStartOffset + lines[newLine - 1].length,
      text.length
    );

    range.setStart(
      editorRef.current.firstChild || editorRef.current,
      newOffset
    );
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    setCurrentLine(newLine);

    const lineHeight = 1.2 * 16;
    editorRef.current.scrollTop = (newLine - 1) * lineHeight;
    if (gutterRef.current && displayRef.current) {
      gutterRef.current.scrollTop = editorRef.current.scrollTop;
      displayRef.current.scrollTop = editorRef.current.scrollTop;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey && e.key === "z") {
      e.preventDefault();
      document.execCommand("undo");
      updateLineNumbersAndCode();
      debouncedHighlight();
      setCurrentLine(getCurrentLine());
    } else if (e.ctrlKey && e.shiftKey && e.key === "Z") {
      e.preventDefault();
      document.execCommand("redo");
      updateLineNumbersAndCode();
      debouncedHighlight();
      setCurrentLine(getCurrentLine());
    } else if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      if (onSave) onSave(code);
      else console.log("Saved code:", code);
    } else if (e.ctrlKey && e.key === "/") {
      e.preventDefault();
      toggleComment();
    } else if (e.key === "Enter") {
      e.preventDefault();
      insertAtCaret("\n");
      setTimeout(updateLineNumbersAndCode, 0);
      debouncedHighlight();
      setCurrentLine(getCurrentLine());
    } else if (e.key === "Tab") {
      e.preventDefault();
      insertAtCaret("    ");
      updateLineNumbersAndCode();
      debouncedHighlight();
      setCurrentLine(getCurrentLine());
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      setCurrentLine(getCurrentLine());
      if (!keyHoldRef.current.key) {
        keyHoldRef.current.key = e.key;
        keyHoldRef.current.timer = setTimeout(() => {
          const interval = setInterval(() => {
            if (keyHoldRef.current.key === "ArrowUp") {
              moveCursor("up");
            } else if (keyHoldRef.current.key === "ArrowDown") {
              moveCursor("down");
            }
          }, 50);
          keyHoldRef.current.timer = interval;
        }, 200);
      }
    } else if (e.key === "Backspace" || e.key === "Delete") {
      console.log("Delete - Before:", editorRef.current?.innerText); // Debug
    } else if ([",", ";", "="].includes(e.key)) {
      console.log(
        "Symbol - Key:",
        e.key,
        "Text:",
        editorRef.current?.innerText
      ); // Debug
    }
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      if (keyHoldRef.current.timer) {
        clearInterval(keyHoldRef.current.timer);
        clearTimeout(keyHoldRef.current.timer);
        keyHoldRef.current.timer = null;
        keyHoldRef.current.key = null;
      }
    }
  };

  const onInput = () => {
    updateLineNumbersAndCode();
    debouncedHighlight();
    throttledParse();
    syncSelection();
    console.log("Input - Text:", editorRef.current?.innerText); // Debug
  };

  const onScroll = () => {
    if (editorRef.current && gutterRef.current && displayRef.current) {
      gutterRef.current.scrollTop = editorRef.current.scrollTop;
      displayRef.current.scrollTop = editorRef.current.scrollTop;
    }
  };

  useEffect(() => {
    if (editorRef.current && displayRef.current) {
      editorRef.current.innerText = initialCode;
      updateLineNumbersAndCode();
      debouncedHighlight();
      throttledParse();
      editorRef.current.focus();
    }
  }, [initialCode, updateLineNumbersAndCode]);

  return (
    <>
      <style>
        {`
          /* Override Prism.js styles to remove boxes around symbols */
          /*.token.operator, .token.punctuation {
            background: transparent !important;
            border: none !important;
            outline: none !important;
          }*/
          /* Ensure consistent rendering */
          /*.editor-container pre, .editor-container div[contenteditable] {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            font-size: 0.875rem;
            line-height: 1.2rem;
            padding: 0.25rem;
            margin: 0;
          }*/
          /* Ensure cursor visibility */
          /*.editor-container div[contenteditable] {
            caret-color: inherit; /* Match default or Prism theme */
          }*/
        `}
      </style>
      <div className="flex font-mono border border-gray-300 rounded overflow-hidden h-64 relative editor-container">
        {/* Line numbers gutter */}
        <div
          ref={gutterRef}
          className="w-10 bg-gray-100 p-1 text-right select-none text-gray-500 text-sm leading-[1.2rem] overflow-hidden"
        >
          {lineNumbers.map((n) => (
            <div
              key={n}
              onClick={() => selectLine(n)}
              className={`h-[1.2rem] cursor-pointer hover:bg-gray-200 ${
                n === currentLine ? "bg-gray-200 font-bold" : ""
              } ${n === syntaxError?.line ? "bg-red-100" : ""}`}
            >
              {n}
            </div>
          ))}
        </div>

        {/* Hidden editable area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onInput={onInput}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onScroll={onScroll}
          onClick={() => {
            setCurrentLine(getCurrentLine());
            syncSelection();
          }}
          className="absolute top-0 left-10 right-0 bottom-0 whitespace-pre-wrap outline-none text-sm leading-[1.2rem] overflow-auto"
          style={
            {
              minHeight: `${lineNumbers.length * 1.2}rem`,
              zIndex: 2,
              opacity: 0,
              background: "transparent",
            } as React.CSSProperties
          }
        />

        {/* Visible highlighted area */}
        <pre
          ref={displayRef}
          className="flex-1 whitespace-pre-wrap text-sm leading-[1.2rem] overflow-auto pointer-events-none bg-white"
          style={{ minHeight: `${lineNumbers.length * 1.2}rem`, zIndex: 1 }}
        />

        {/* Error tooltip */}
        {syntaxError && (
          <div
            className="absolute bottom-2 left-12 bg-red-500 text-white text-xs p-2 rounded shadow"
            style={{ zIndex: 10 }}
          >
            Line {syntaxError.line}: {syntaxError.message}
          </div>
        )}
      </div>
    </>
  );
}
