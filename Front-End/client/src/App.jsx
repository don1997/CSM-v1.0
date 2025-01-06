// Imports and Dependencies
import { useState, useEffect } from 'react';
import { Box, Button, useColorMode, Flex, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import CodeEditor from './components/CodeEditor';
import Sidebar from './components/Sidebar';
//import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Ensure Footer is used or remove it
import Login from './components/Login';
import Hero from './components/Hero';
import ActivityBar from './components/ActivityBar';
import Register from './components/Register';
import { useAuth } from './components/AuthContext';
import './static/styles.css';
import MarkdownDrawer from './components/MarkdownDrawer';
import CustomNavbar from './components/CustomNavbar';

// Helper Components
function LogoutButton({ onLogout }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <Button onClick={handleLogout} colorScheme="red" size="md" m={4}>
      Logout
    </Button>
  );
}

// Main App Component
function App() {
  // State Declarations
  const [language, setLanguage] = useState('c');
  const [currentSnippet, setCurrentSnippet] = useState({ title: '', content: '', language: 'javascript' });
  const [currentLine, setCurrentLine] = useState(1);
  const [currentColumn, setCurrentColumn] = useState(1);
  const [snippets, setSnippets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { authToken, login, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const newSnippet = () => {
    console.log("newSnippet triggered");

    setCurrentSnippet({ title: '', content: '', language: currentSnippet.language });
  };
  
  // Effects
  useEffect(() => {
    setLanguage(currentSnippet.language);
  }, [currentSnippet.language]);

  
  useEffect(() => {
    if (!authToken) {
      console.log('No authentication token found, redirecting to login...');
      setIsLoading(false);
      return;
    }

    fetch('http://localhost:5000/snippets', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${authToken}` },
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Unauthorized access, redirecting to login...');
        }
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.length > 0) {
        setCurrentSnippet(data[0]);
        setSnippets(data);
      }
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error fetching snippets:', error);
      setIsLoading(false);
    });
  }, [authToken, isLoggedIn]);

  // Event Handlers

  const handleSnippetChange = (updatedSnippet) => {
    const updatedSnippets = snippets.map(snippet => 
      snippet.id === updatedSnippet.id ? updatedSnippet : snippet
    );
    setSnippets(updatedSnippets);
    setCurrentSnippet(updatedSnippet); // Also update the current snippet
  };
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    logout();
    setSnippets([]);
    setCurrentSnippet({ title: '', content: '', language: 'javascript' });
    setIsLoggedIn(false);
  };

  const handleLanguageChange = (newLanguage) => {
    setCurrentSnippet(prev => ({ ...prev, language: newLanguage }));
    setLanguage(newLanguage);
  };

  const handleTitleClick = (title) => {
    const snippet = snippets.find(snippet => snippet.title === title);
    setCurrentSnippet(snippet);
  };

  const resetCurrentSnippet = () => {
    setCurrentSnippet({ title: '', content: '', language: 'javascript' });
  };

  const addSnippet = (newSnippet) => {
    setSnippets(prevSnippets => [...prevSnippets, newSnippet]);
  };

  const handleSaveClick = () => {
    const { id, title, content, language } = currentSnippet;
    if (!content.trim() || !title.trim()) {
      openModal("Title Or content cannot be blank.");
      return;
    }
  
    if (id) {
      updateSnippet(id, title, content, language);
    } else {
      createSnippet(title, content, language);
    }
  };
  
  const createSnippet = (title, content, language) => {
    const url = 'http://localhost:5000/snippets/post';
    const data = { title, content, language };
  
    fetch(url, {
      method: 'POST',
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
    .then(newSnippet => {
      addSnippet(newSnippet);
      setCurrentSnippet(newSnippet);
      toast({
        title: "Snippet created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const updateSnippet = (snippetId, title, content, language) => {
    if (!content.trim() || !title.trim()) {
      openModal("Title and content cannot be blank.");
      return;
    }
    const url = `http://localhost:5000/snippets/update/${snippetId}`;
    const data = { title, content, language };

    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(updatedSnippet => {
      console.log('Updated snippet:', updatedSnippet);
      setSnippets(snippets.map(snippet => snippet.id === updatedSnippet.id ? updatedSnippet : snippet));
      setCurrentSnippet(updatedSnippet);
      // Show success toast message
      toast({
        id: 'snippet-update',
        title: "Snippet updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

const handleUpdateClick = () => {
  const snippetId = currentSnippet.id;
  const newTitle = currentSnippet.title;
  const newContent = currentSnippet.content;
  const newLanguage = currentSnippet.language;  // Get the current language
  updateSnippet(snippetId, newTitle, newContent, newLanguage);  // Pass language to update function
};

const deleteSnippet = (snippetId) => {
  fetch(`http://localhost:5000/snippets/delete/${snippetId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(() => {
    setSnippets(snippets.filter(snippet => snippet.id !== snippetId));
    if (currentSnippet.id === snippetId) {
      resetCurrentSnippet();
    }
  })
  .catch(error => console.error('Error:', error));
};
const [isMarkdownDrawerOpen, setIsMarkdownDrawerOpen] = useState(false);
const handleEditMarkdownClick = () => {
  setIsMarkdownDrawerOpen(!isMarkdownDrawerOpen);
};

// Router Setup
return (
  <Router>
    <Flex direction="column" h="100vh" overflow="hidden">
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={
          <>
          {/* <Navbar toggleColorMode={toggleColorMode} onLanguageChange={handleLanguageChange} onNewClick={resetCurrentSnippet} onSaveClick={handleUpdateClick}/> */}

            <Flex direction="row" h="full" overflow="hidden">
              <Sidebar snippets={snippets} onTitleClick={handleTitleClick} onDeleteSnippet={deleteSnippet} />
              <Flex direction="column" flex="1" ml={6}>
              <CustomNavbar 
  onSaveClick={handleSaveClick} 
  onEditMarkdownClick={handleEditMarkdownClick} 
  onLanguageChange={handleLanguageChange} 
  LogoutButton={<LogoutButton onLogout={handleLogout} colorScheme="red"/>}
  onNewSnippet={newSnippet}  // Confirm this line is correct
  />
              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Notification</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {modalContent}
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={() => setIsModalOpen(false)}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
                <Box flex="1" overflowY="auto">
                  <CodeEditor
                    setCurrentSnippet={setCurrentSnippet}
                    language={currentSnippet.language}
                    snippet={currentSnippet}
                    addSnippet={addSnippet}
                    resetCurrentSnippet={resetCurrentSnippet}
                    setCurrentLine={setCurrentLine}
                    setCurrentColumn={setCurrentColumn}
                    newSnippet={newSnippet}  // Pass this function as a prop

                  />
                </Box>
              </Flex>
            </Flex>
            <ActivityBar language={language} line={currentLine} column={currentColumn} onLanguageChange={handleLanguageChange} />
            {currentSnippet && isMarkdownDrawerOpen && (
  <MarkdownDrawer
    isOpen={isMarkdownDrawerOpen}
    snippet={currentSnippet}
    onSnippetChange={handleSnippetChange}
    onClose={() => setIsMarkdownDrawerOpen(false)}
  />
)}        </>
        } />
      </Routes>
    </Flex>
  </Router>
);

      }
export default App;
