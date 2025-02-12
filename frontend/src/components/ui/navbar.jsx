import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Text,
  MenuItem,
  MenuDivider,
  useDisclosure,
  IconButton,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  DrawerBody,
  VStack,
  CloseButton,
  Link,
} from '@chakra-ui/react';
import { HamburgerIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { FaCog, FaUserSecret } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";
import { getWithAuth, requestWithAuth, routes } from '../../utils/apiRoutes';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import ModalAddSell from '../ventas/modalAddSell';

const Links = ['', '', ''];

const NavLink = (props) => {
  const { children } = props;
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: 'gray.200',
      }}
      href={'#'}
    >
      {children}
    </Box>
  );
};

export default function WithAction({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userProfileImage, setUserProfileImage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSubnavbar, setShowSubnavbar] = useState(true);
  const { isOpen: isModalOpen, onClose: onModalClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getWithAuth(routes.userInfo);
        if (data) {
          if (data.imageprofile) {
            setUserProfileImage(data.imageprofile);
          }
          if (data.rank === 'admin') {
            setIsAdmin(true);
          }
        }
      } catch {}
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await requestWithAuth(routes.exitSession);
      if (response.message === 'Sesión cerrada exitosamente') {
        localStorage.removeItem('token');
        setTimeout(() => {
          navigate('/login');
        }, 500);
      }
    } catch {}
  };

  const handleConfig = () => {
    navigate('/user/config');
  };

  const handleHK = () => {
    navigate('/admin/index');
  };

  const handleCloseSubnavbar = () => {
    setShowSubnavbar(false);
    const expireTime = new Date().getTime() + 60 * 60 * 1000;
    localStorage.setItem('subnavbarHiddenUntil', expireTime);
  };

  useEffect(() => {
    const expireTime = localStorage.getItem('subnavbarHiddenUntil');
    if (expireTime && new Date().getTime() < expireTime) {
      setShowSubnavbar(false);
    }
  }, []);

  return (
    <>
      <Box bg="white" px={4} position="fixed" width="100%" top="0" zIndex="900" boxShadow="md">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={<HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={onOpen}
          />

          <HStack as={'nav'} spacing={4} justify="center" flex="1" display={{ base: 'none', md: 'flex' }}>
            {Links.map((link, index) => (
              <NavLink key={`nav-link-${index}`}>{link}</NavLink>
            ))}
          </HStack>

          <Flex alignItems={'center'} ml="auto">
      <Box mr={4}>
      <ModalAddSell isOpen={isModalOpen} onClose={onModalClose} />
      </Box>
            <Menu>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}
                    rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  >
                    <Avatar size={'sm'} src={userProfileImage || undefined} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem icon={<FaCog />} onClick={handleConfig}>
                      Configuración
                    </MenuItem>
                    {isAdmin && (
                      <MenuItem icon={<FaUserSecret />} onClick={handleHK}>
                        Housekeeping
                      </MenuItem>
                    )}
                    <MenuDivider />
                    <MenuItem icon={<IoMdExit />} onClick={handleLogout}>
                      Cerrar sesión
                    </MenuItem>
                  </MenuList>
                </>
              )}
            </Menu>
          </Flex>
        </Flex>
      </Box>

      {showSubnavbar && (
        <Box
          bg="linear-gradient(to right, rgba(56, 178, 172, 0.7), rgba(0, 123, 255, 0.7))"
          px={4}
          py={2}
          position="fixed"
          width="100%"
          top="64px"
          zIndex="2"
          color="white"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          fontSize="md"
        >
          <Link 
            href="https://darioalbor.netlify.app/" 
            isExternal 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            flex="1"
          >
            <Text as="span" fontWeight="bold" ml={2}>
              Gracias por utilizar el software de gestión, puedes ver más proyectos en mi portafolio 🥳🎉
            </Text>
          </Link>
          <CloseButton onClick={handleCloseSubnavbar} />

          <Confetti
            width={window.innerWidth}
            height={40}
            numberOfPieces={50}
            gravity={0.2}
            recycle={true}
            initialVelocityX={0}
            initialVelocityY={5}
            confettiSource={{ x: 0, y: 0, w: window.innerWidth, h: 10 }}
          />
        </Box>
      )}

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">
              <Flex justifyContent="center" alignItems="center">
                <Box as="span" display="inline-block" mr="4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style={{ height: '30px' }}>
                  <path fill="#FFD43B" d="M50.7 58.5L0 160l208 0 0-128L93.7 32C75.5 32 58.9 42.3 50.7 58.5zM240 160l208 0L397.3 58.5C389.1 42.3 372.5 32 354.3 32L240 32l0 128zm208 32L0 192 0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-224z"/>
                  </svg>
                </Box>
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                  En desarrollo
                </Text>
              </Flex>
              <CloseButton position="absolute" top="8px" right="8px" onClick={onClose} />
            </DrawerHeader>
            <DrawerBody>
              <VStack as={'nav'} spacing={4}>
                {Links.map((link, index) => (
                  <NavLink key={`drawer-link-${index}`}>{link}</NavLink>
                ))}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      <Box pt="16">{children}</Box>
    </>
  );
}