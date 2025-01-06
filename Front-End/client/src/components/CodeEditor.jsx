// CodeEditor.jsx
import {Box, useColorMode, Heading, Button, Editable, EditablePreview, EditableInput} from '@chakra-ui/react';
import {Editor, useMonaco} from "@monaco-editor/react"
import { useEffect, useState, useRef } from 'react';
import { EditIcon } from '@chakra-ui/icons';

const CodeEditor = ({ language, snippet, setCurrentSnippet, addSnippet, resetCurrentSnippet, setCurrentLine, setCurrentColumn, newSnippet}) => {
   const [code, setCode] = useState(snippet.content || "// Write your code here!");
   const [title, setTitle] = useState(snippet.title || "Untitled");
  const monaco = useMonaco();
  const editorRef = useRef();
  const { colorMode } = useColorMode();
  


  //updated this to Avoid render ontop of each other cursor pos stuck in c 0 r 0
  useEffect(() => {
    
    if (editorRef.current && monaco) {
      const model = editorRef.current.getModel();
      monaco.editor.setModelLanguage(model, language);
  
      // Define and set the custom theme
      monaco.editor.defineTheme('myCustomTheme', {
        base: 'vs-dark', // can be vs (light), vs-dark (dark), or hc-black (high contrast)
        inherit: true, // whether to inherit the base theme's rules
        rules: [], // additional rules
        
        colors: {
          'editor.background': '#19120A', // Set your desired background color here
        },
      });
      monaco.editor.setTheme('myCustomTheme');

      // Only update if different to avoid resetting cursor position
      if (editorRef.current.getValue() !== snippet.content) {
        editorRef.current.setValue(snippet.content);
      }
      if (title !== snippet.title) {
        setTitle(snippet.title);
      }
    }
  }, [language, monaco, snippet, title]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.onDidChangeCursorPosition(({ position }) => {
      setCurrentLine(position.lineNumber);
      setCurrentColumn(position.column);
    });
  };

  const saveSnippet = () => {
        // Prevent saving if the content is blank
    if (!code.trim()) {
      alert("Snippet content cannot be blank.");
      return;
    }
    
    const data = {
      title: title.trim() || "Untitled", // Ensure title is not just whitespace
      content: code,
      language: language
    };
  
    const url = snippet.id ? `http://localhost:5000/snippets/${snippet.id}` : 'http://localhost:5000/snippets/post';
    const method = snippet.id ? 'PATCH' : 'POST';
  
    
    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Received data:', data);
      if (method === 'POST') {
        addSnippet(data);
      } else {
        // Update the snippet in your local state as needed
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };


  // Assuming you have inputs or editor events that trigger these functions
  const handleTitleChange = (newTitle) => {
    setTitle(newTitle); // Update local state if needed
    setCurrentSnippet(prev => ({ ...prev, title: newTitle }));
  };

  const handleContentChange = (newContent) => {
    setCode(newContent); // Update local state if needed
    setCurrentSnippet(prev => ({ ...prev, content: newContent }));
  };

  return (
    <Box>
      <Editable value={title} onChange={handleTitleChange} onSubmit={handleTitleChange} isValueEmpty={title === ''} placeholder="Insert Title">
      <EditablePreview fontSize="4xl" fontWeight="bold" color="orange.200" />
      <EditIcon ml={2} color="orange.200" />  
      <EditableInput fontSize="4xl" fontWeight="bold" color="orange.300" />
      </Editable>
      <Editor 
        height="75vh" 
        theme={colorMode === 'light' ? 'vs-light' : 'vs-dark'}
        value={code}
        onChange={handleContentChange}
        onMount={handleEditorDidMount}
        options={{ fontSize: 16 }}  // Directly set font size here

      />
    </Box>
  )
}

export default CodeEditor;