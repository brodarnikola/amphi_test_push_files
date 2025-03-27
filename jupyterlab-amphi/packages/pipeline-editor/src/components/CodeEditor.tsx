import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-github';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange }) => {
  const [editorValue, setEditorValue] = useState(code);

  const handleChange = (newValue: string) => {
    setEditorValue(newValue);
    onChange(newValue);
  };

  return (
    <AceEditor
      mode="python"
      theme="github"
      name="code_editor"
      value={editorValue}
      onChange={handleChange}
      editorProps={{ $blockScrolling: true }}
      width="100%"
      height="400px"
      setOptions={{
        showGutter: true,
        highlightActiveLine: true,
        fontSize: 14,
      }}
    />
  );
};

export default CodeEditor;