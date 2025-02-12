// src/components/admin/users/ListUsers.jsx
import React, { useState } from 'react';
import {
  Box,
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  useDisclosure,
  Image,
  Text,
  VStack,
  Avatar,
  Badge,
  Tooltip,
  Flex,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import ModalInfoUser from './modalInfoUser';

const ListUsers = ({ filteredUsers }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const formatDate = (dateString) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'America/Argentina/Buenos_Aires',
    };
    return new Intl.DateTimeFormat('es-AR', options).format(new Date(dateString));
  };

  return (
    <Box
      p={{ base: 2, md: 4 }}
      width="100%"
      maxW={{ base: '100%', md: '600px' }}
      mx="auto"
    >
      {filteredUsers.length === 0 ? (
        <VStack spacing={4} align="center" justify="center">
          <Image
            src="/images/svg/search404.svg"
            alt="No hay resultados"
            boxSize={{ base: '100px', md: '150px' }}
          />
          <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600">
            No hay resultados
          </Text>
        </VStack>
      ) : (
        <TableContainer
          maxH={{ base: '300px', md: '400px' }} // Ajusta la altura máxima para móviles y escritorio
          width="100%"
          overflowY="auto" // Habilita el desplazamiento vertical
          css={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#63E6BE #F5F5F5',
            '&::-webkit-scrollbar': {
              width: '10px',
              backgroundColor: '#F5F5F5',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#63E6BE',
              borderRadius: '10px',
              backgroundImage:
                '-webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent)',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#F5F5F5',
            },
          }}
        >
          <Table variant="simple" size="sm" width="100%">
            <Tbody>
              <Tr>
                <Th
                  p={{ base: 2, md: 3 }}
                  fontSize={{ base: 'sm', md: 'md' }}
                  minWidth="100px"
                  whiteSpace="nowrap"
                >
                  Nombre
                </Th>
                <Th
                  p={{ base: 2, md: 3 }}
                  fontSize={{ base: 'sm', md: 'md' }}
                  minWidth="80px"
                  whiteSpace="nowrap"
                  textAlign="center"
                >
                  Acciones
                </Th>
              </Tr>
              {filteredUsers.slice(0, 7).map((user) => (
                <Tr key={user.id}>
                  <Td
                    p={{ base: 2, md: 3 }}
                    fontSize={{ base: 'sm', md: 'md' }}
                    minWidth="100px"
                    whiteSpace="nowrap"
                  >
                    <Flex alignItems="center">
                      <Tooltip
                        label={`Última actividad: ${formatDate(user.lastactivity)}`}
                        fontSize="sm"
                      >
                        <Box position="relative" display="inline-block" mr={2}>
                          <Avatar
                            size="sm"
                            src={user.imageprofile || undefined}
                            name={user.name}
                          />
                          <Badge
                            position="absolute"
                            bottom="0"
                            right="0"
                            boxSize="10px"
                            borderRadius="full"
                            bg={user.isActive ? 'green.500' : 'gray.500'}
                          />
                        </Box>
                      </Tooltip>
                      {user.name}
                    </Flex>
                  </Td>
                  <Td
                    p={{ base: 2, md: 3 }}
                    minWidth="80px"
                    textAlign="center"
                  >
                    <IconButton
                      icon={<InfoIcon />}
                      colorScheme="teal"
                      size={{ base: 'sm', md: 'md' }}
                      onClick={() => handleOpenModal(user)}
                      aria-label="Ver información del usuario"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      {selectedUser && (
        <ModalInfoUser isOpen={isOpen} onClose={onClose} user={selectedUser} />
      )}
    </Box>
  );
};

export default ListUsers;