import React, { useState, useEffect } from 'react';
import { Box, Heading, Grid, GridItem, Flex } from '@chakra-ui/react';
import ListUsers from '../../components/admin/users/listUsers';
import SearchUsers from '../../components/admin/users/searchUsers';
import ButtonAddUser from '../../components/admin/users/buttonAddUser';

import { getWithAuth, routes } from '../../utils/apiRoutes';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getWithAuth(routes.getAllUsers);

        if (!Array.isArray(usersData)) {
          console.error('Expected usersData to be an array, but got:', usersData);
          return;
        }

        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box p={6}>
      <Grid 
        templateColumns={{ base: '1fr', md: '1fr 2fr 1fr' }} 
        gap={4} 
        mb={4} 
        alignItems="center"
      >
        <GridItem display={{ base: 'none', md: 'block' }}></GridItem>
        <GridItem textAlign="center">
          <Heading as="h2" size="lg">
            Usuarios Activos
          </Heading>
        </GridItem>
        <GridItem display={{ base: 'none', md: 'block' }} textAlign="right">
          <Heading as="h2" size="lg" mr={{ md: '80px' }}>
            Gestión de Usuarios
          </Heading>
          <Flex
            bg="white"
            p={4}
            borderRadius="md"
            borderWidth="1px"
            borderColor="gray.200"
            mt={4}
            justifyContent="center"
            alignItems="center"
          >
            <ButtonAddUser />
          </Flex>
        </GridItem>
      </Grid>
      <Box mb={4}>
        <SearchUsers users={users} setFilteredUsers={setFilteredUsers} />
      </Box>
      <Box mb={4}>
        <ListUsers filteredUsers={filteredUsers} />
      </Box>
      <Box display={{ base: 'block', md: 'none' }}>
        <Heading as="h2" size="lg" textAlign="center" mb={4}>
          Gestión de Usuarios
        </Heading>
        <Flex
          bg="white"
          p={4}
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.200"
          mb={4}
          justifyContent="center"
          alignItems="center"
        >
          <ButtonAddUser />
        </Flex>
      </Box>
      <Box
        bg="white"
        p={4}
        borderRadius="md"
        borderWidth="1px"
        borderColor="gray.200"
        display={{ base: 'none', md: 'block' }}
        position="absolute"
        top="6"
        right="6"
        width="250px"
      >
      </Box>
    </Box>
  );
}