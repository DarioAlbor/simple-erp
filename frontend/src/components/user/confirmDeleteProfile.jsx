import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Icon,
  Button,
  useToast,
} from '@chakra-ui/react';
import { FaUserAltSlash } from "react-icons/fa";
import { requestWithAuth, routes } from '../../../../../PharmaBroSoft/frontend/src/utils/apiRoutes';

export default function ConfirmDeleteProfile() {
  const [isDisabled, setIsDisabled] = useState(false);
  const toast = useToast();

  const handleDisable = async () => {
    try {
      const response = await requestWithAuth(routes.disabledAccount);

      if (response.status === 200) {
        setIsDisabled(true);
        toast({
          title: 'Cuenta deshabilitada',
          description: 'Tu cuenta ha sido deshabilitada correctamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        setTimeout(async () => {
          try {
            const exitResponse = await requestWithAuth(routes.exitSession);

            if (exitResponse.status === 200) {
              window.location.href = '/';
            } else {
              throw new Error(exitResponse.data.message);
            }
          } catch (error) {
            toast({
              title: 'Error al cerrar sesión',
              description: 'Hubo un problema al intentar cerrar tu sesión.',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
          }
        }, 3000);
      } else {
        throw new Error(response.data.message || 'Error al deshabilitar la cuenta.');
      }
    } catch (error) {
      toast({
        title: 'Error al deshabilitar la cuenta',
        description: error.message || 'Hubo un problema al intentar deshabilitar tu cuenta.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      bg="white"
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
      p={6}
      maxW="500px"
      mx="auto"
      mt={10}
      boxShadow="md"
    >
      <Flex alignItems="center">
        <Flex
          flex="0 0 80px"
          justifyContent="center"
          alignItems="center"
          h="100px"
        >
          <Icon as={FaUserAltSlash} w={12} h={12} color="red.500" />
        </Flex>
        <Box flex="1" pl={4}>
          <Heading as="h2" size="lg" mb={4} fontWeight="bold" color="red.500">
            Deshabilitar cuenta
          </Heading>
          <Text color="gray.500">
            Una vez que deshabilitas tu cuenta, no hay vuelta atrás. Por favor, asegúrate de tener esto en consideración.
          </Text>
        </Box>
      </Flex>

      <Flex justify="center" align="center" mt={6}>
        <Button
          onClick={handleDisable}
          variant="outline"
          colorScheme="red"
          fontWeight="bold"
          borderColor="red.500"
          color="red.500"
          _hover={{ bg: "red.50" }}
          isDisabled={isDisabled}
        >
          {isDisabled ? "Cuenta deshabilitada" : "Deshabilitar"}
        </Button>
      </Flex>
    </Box>
  );
}