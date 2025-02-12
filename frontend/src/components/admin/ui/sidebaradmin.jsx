import React, { useState } from 'react';
import { Box, Flex, Icon, Text, BoxProps, FlexProps } from '@chakra-ui/react';
import { FiHome } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import { IoArrowBackOutline } from 'react-icons/io5';
import { IconType } from 'react-icons';
import { Link as RouterLink } from 'react-router-dom';

interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Inicio', icon: FiHome, path: '/admin/index' },
  { name: 'Usuarios', icon: FaUser, path: '/admin/users' },
];

export default function SimpleSidebar({ children }: { children: React.ReactNode }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const handleMouseEnter = () => setIsSidebarExpanded(true);
  const handleMouseLeave = () => setIsSidebarExpanded(false);

  return (
    <>
      <SidebarContent
        isExpanded={isSidebarExpanded}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        display={{ base: 'none', md: 'block' }}
      />

      <Box p="4" zIndex="1" position="relative">
        {children}
      </Box>
    </>
  );
}

interface SidebarProps extends BoxProps {
  isExpanded: boolean;
}

const SidebarContent = ({ isExpanded, ...rest }: SidebarProps) => {
  return (
    <Box
      bg="white"
      borderRight="1px"
      borderRightColor="gray.200"
      w={isExpanded ? 60 : 20}
      pos="fixed"
      left="0"
      top="64px"
      h="calc(100vh - 64px)"
      zIndex="10"
      transition="width 0.3s ease"
      overflowX="hidden"
      {...rest}
    >
      <Flex h="20" alignItems="center" justifyContent="center" flexDirection={isExpanded ? 'row' : 'column'}>
        <Box as="span" display="inline-block" mb={!isExpanded ? '4' : '0'}>
          <img 
            src="/images/svg/logo.svg" 
            alt="Logo" 
            style={{ height: '40px' }} 
          />
        </Box>
        {isExpanded && (
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" ml="4" color="red">
            Housekeeping
          </Text>
        )}
      </Flex>

      <Flex
        as={RouterLink}
        to="/"
        align="center"
        p="4"
        borderRadius="lg"
        cursor="pointer"
        _hover={{ bg: 'gray.100' }}
        justifyContent="center"
        h="auto"
      >
        <Icon as={IoArrowBackOutline} color="gray.600" />
        {isExpanded && <Text ml="2" color="gray.600">Volver</Text>}
      </Flex>

      <Flex direction="column" alignItems="center" justifyContent="center" mt="8">
        {LinkItems.map((link) => (
          <NavItem key={link.name} icon={link.icon} isExpanded={isExpanded} path={link.path}>
            {isExpanded && link.name}
          </NavItem>
        ))}
      </Flex>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  isExpanded: boolean;
  path: string;
  children: React.ReactNode;
}

const NavItem = ({ icon, children, isExpanded, path, ...rest }: NavItemProps) => {
  return (
    <Flex
      as={RouterLink}
      to={path}
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{ bg: 'cyan.400', color: 'white' }}
      {...rest}
    >
      {icon && (
        <Icon
          mr={isExpanded ? "4" : "0"}
          fontSize="16"
          _groupHover={{ color: 'white' }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  );
};