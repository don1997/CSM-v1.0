import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Button, 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
} from 'react-icons/fi'
function Sidebar({snippets,onTitleClick, onDeleteSnippet}) { 
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box minH="50vh" bg={useColorModeValue('gray.100', 'gray.900')}>
    <SidebarContent onClose={onClose} display={{ base: 'none', md: 'block' }} snippets={snippets} onTitleClick={onTitleClick} onDeleteSnippet={onDeleteSnippet} /> 
  <Drawer
    isOpen={isOpen}
    placement="left"
    onClose={onClose}
    returnFocusOnClose={false}
    onOverlayClick={onClose}
    size="full">
    <DrawerContent>
    <SidebarContent onClose={onClose} snippets={snippets} onTitleClick={onTitleClick} onDeleteSnippet={onDeleteSnippet} /> 
    </DrawerContent>
  </Drawer>
  {/* mobilenav */}
  <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
  <Box ml={{ base: 0, md: 60 }} p="4">
    {/* Content */}
  </Box>
</Box>  )
}



const SidebarContent = ({ onClose, snippets, onTitleClick, onDeleteSnippet, ...rest }) => {
  const { isOpen, onOpen, onClose: onModalClose } = useDisclosure();
  const [selectedSnippetId, setSelectedSnippetId] = useState(null);

  const openDeleteModal = (snippetId) => {
    setSelectedSnippetId(snippetId);
    onOpen();
  };

  const handleDeleteClick = (e, snippetId) => {
    e.stopPropagation(); // Prevents the click from bubbling up to the parent elements
    openDeleteModal(snippetId);
  };
  console.log(snippets); 

  return (
    <Box
      //bg={useColorModeValue('white', 'gray.900')}
      bg="black" // Set this to match the editor's background color
      borderRight="1px solid var(--chakra-colors-gray-700)" // Utilizing Chakra UI's color scheme for light-colored border

      w={{ base: 'full', md: '100%' }}
      h="full"
      overflowY="auto" 
      maxH="100vh" 
      
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="4xl" fontFamily="monospace" fontWeight="bold" color={'yellow.700'}>
          CSM
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {Array.isArray(snippets) && snippets.map((snippet) => (
  <NavItem 
    key={snippet.id} 
    onClick={() => onTitleClick(snippet.title)}
    onDelete={(e) => handleDeleteClick(e, snippet.id)}
  >
    {snippet.title}
  </NavItem>
))}


<Modal isOpen={isOpen} onClose={onModalClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Delete Snippet</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      Are you sure you want to delete this snippet?
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="red" mr={3} onClick={() => {
        onDeleteSnippet(selectedSnippetId);
        onModalClose();
      }}>
        Delete
      </Button>
      <Button variant="ghost" onClick={onModalClose}>Cancel</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </Box>  )



}

SidebarContent.propTypes = {
  onClose: PropTypes.func.isRequired,
}

const NavItem = ({ icon, children, onClick, onDelete, ...rest }) => {
  return (
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="0"  // Adjusted for less rounded corners
      role="group"
      cursor="pointer"
      justifyContent="space-between"  // Ensures space between title and delete icon
      _hover={{
        bg: 'yellow.800',
        color: 'white',
      }}
      {...rest}
    >
      <Box onClick={onClick} style={{ flexGrow: 1 }}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Box>
      <DeleteIcon 
        onClick={onDelete} 
        cursor="pointer" 
        color="white" 
        _hover={{ color: "red.500" }}
        w={4} 
        h={4} 
      />
    </Flex>
  );
}

NavItem.propTypes = {
  icon: PropTypes.elementType,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
};

const MobileNav = (props) => {
  const { onOpen, ...rest } = props;
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px" 
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}>
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Logo
      </Text>
    </Flex>  )
}

MobileNav.propTypes = {
  onOpen: PropTypes.func.isRequired,
}

export default Sidebar;