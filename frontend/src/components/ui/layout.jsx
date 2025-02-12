import React from 'react';
import { Box, Flex, useMediaQuery } from '@chakra-ui/react';
import Navbar from './navbar';
import Footer from './footer';
import Sidebar from './sidebar';
import SidebarAdmin from '../admin/ui/sidebaradmin';

const Layout = ({ children, showNavbar = true, showSidebar = true, showFooter = true, isAdmin = false }) => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  return (
    <Flex
      direction="column"
      minHeight="100vh"
    >
      {showNavbar && <Navbar />}
      <Flex flex="1">
        {showSidebar && !isMobile && (isAdmin ? <SidebarAdmin /> : <Sidebar />)}
        <Box flex="1" display="flex" flexDirection="column">
          {children}
        </Box>
      </Flex>
      {showFooter && <Footer />}
    </Flex>
  );
};

export default Layout;