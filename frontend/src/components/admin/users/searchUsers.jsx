import React, { useState } from 'react';
import { Input, Box, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const SearchUsers = ({ users, setFilteredUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = users.filter((user) => 
      user.name.toLowerCase().includes(term) ||
      user.id.toString().includes(term) ||
      (user.empresaName && user.empresaName.toLowerCase().includes(term))
    );

    setFilteredUsers(filtered);
  };

  return (
    <Box 
      mb={4} 
      width="100%" 
      maxW={{ base: '100%', md: '500px' }}  // Usa 100% de ancho en móviles
      mx="auto" 
      px={{ base: 4, md: 2 }}  // Ajusta padding en móviles para mejor alineación
      borderRadius="md"
    >
      <InputGroup size="md">
        <Input 
          placeholder="Buscar por ID o nombre" 
          value={searchTerm}
          onChange={handleSearch}
          size="md"
          variant="outline"
          bg="rgba(255, 255, 255, 0.6)"
          _placeholder={{ color: 'gray.500' }}
          borderColor="gray.200"
          w="100%"  // Asegura que el input ocupe todo el ancho disponible
        />
        <InputRightElement>
          <IconButton
            aria-label="Buscar"
            icon={<SearchIcon />}
            bg="teal.200"
            color="white"
            borderRadius="full"
            size="sm"
            _hover={{ bg: 'teal.300' }}
          />
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

export default SearchUsers;
