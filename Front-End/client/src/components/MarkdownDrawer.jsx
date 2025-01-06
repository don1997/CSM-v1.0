import React, { useState, useEffect } from 'react';
import { useToast, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Button, useDisclosure, Textarea } from '@chakra-ui/react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css'; // or any other theme you prefer
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-scheme'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-apl'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-jsx';
import { useColorMode } from '@chakra-ui/react';
function MarkdownDrawer({snippet, onSnippetChange, isOpen, onClose }) {
  const toast = useToast();
  const [markdown, setMarkdown] = useState('');
  const [showEditor, setShowEditor] = useState(true);
  const [drawerSize, setDrawerSize] = useState('md');
  const { colorMode } = useColorMode();
  // Load the description into the markdown editor when the component mounts or the snippet changes
  useEffect(() => {
    if (snippet && snippet.description) {
      setMarkdown(snippet.description);
    }
    else {
      setMarkdown(''); 
    }
  }, [snippet]);
  const saveMarkdown = () => {
    const snippetId = snippet.id;
    const updatedDescription = markdown;
    

    fetch(`http://localhost:5000/snippets/update/${snippetId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ description: updatedDescription })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Markdown updated:', data);
      setMarkdown(updatedDescription); // Update local state with the new markdown
      onSnippetChange(data); // Use destructured onSnippetChange directly

      
      toast({
        title: "Success",
        description: "Markdown was successfully saved.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right"
      });
      // Update local state or context here, e.g.:
      // updateSnippet(data); // Assuming you have a function to update the snippet in your state
      
    })
    .catch(error => {
      console.error('Error updating markdown:', error);
      toast({
        title: "Error",
        description: "Failed to save markdown.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right"
      });
    });
  };
  // Function to highlight code
const toggleDrawerSize = () => {
  setDrawerSize(drawerSize === 'md' ? 'xl' : 'md');
};
  const highlightMarkdown = markdownText => {
    const rawMarkup = marked(markdownText);
    const sanitizedMarkup = DOMPurify.sanitize(rawMarkup, {
      ALLOWED_TAGS: ['code', 'pre', 'span', 'h1', 'h2', 'h3', 'p', 'ul', 'li', 'strong', 'em', 'blockquote', 'ol', 'hr'], // Ensure 'ol' and 'hr' are allowed
      ALLOWED_ATTRS: ['class'] // You might need to allow certain attributes for styling or classes
    });
    const container = document.createElement('div');
    container.innerHTML = sanitizedMarkup;
    Prism.highlightAllUnder(container);
    return container.innerHTML;
  };


  const handleInputChange = (event) => {
    setMarkdown(event.target.value);
  };

  const getMarkdownText = () => {
    const rawMarkup = marked(markdown);
    const cleanMarkup = DOMPurify.sanitize(rawMarkup);
    return { __html: cleanMarkup };
  };

  const toggleEditor = () => {
    setShowEditor(!showEditor);
  };

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={drawerSize}>
        <DrawerOverlay />
       <DrawerContent style={{ backgroundColor: colorMode === 'light' ? '#fff' : '#25201D', color: colorMode === 'light' ? '#000' : '#fff' }}>          
       <DrawerCloseButton />
          <DrawerHeader fontSize="2xl" color="orange.300">Markdown Editor</DrawerHeader>
          <DrawerBody fontSize="md">
          <Button mt={4} onClick={toggleDrawerSize}>
          {drawerSize === 'md' ? 'Expand Drawer' : 'Shrink Drawer'}
        </Button>
                        <Button mt={4} onClick={toggleEditor}>
              {showEditor ? 'Hide Editor' : 'Show Editor'}
            </Button>
            <Button mt={4} onClick={saveMarkdown}>
            Save Changes
          </Button>
            {showEditor && (
              <Textarea
                value={markdown}
                onChange={handleInputChange}
                placeholder="Enter some markdown"
                size="md"
                height="200px"
              />
            )}
<div className="markdown-content" dangerouslySetInnerHTML={{ __html: highlightMarkdown(markdown) }} style={{ marginTop: '20px', backgroundColor: '#25201D', padding: '10px' }} />            
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default MarkdownDrawer;