import React, { useState } from 'react';
import { Input, InputGroup, InputRightElement, IconButton, Box } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const SearchProducts = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm); // Envía el término de búsqueda al componente padre
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Ejecuta la búsqueda cuando se presiona Enter
    }
  };

  return (
    <Box maxW="400px" w="100%"> {/* Limita el tamaño de la barra de búsqueda */}
      <InputGroup>
        <Input
          placeholder="Buscar por ID, nombre, código de barra o zona"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown} // Detectar la tecla Enter
        />
        <InputRightElement>
          <IconButton
            aria-label="Buscar"
            icon={<SearchIcon />}
            onClick={handleSearch}
            colorScheme="teal"
            variant="ghost"
          />
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

export default SearchProducts;
