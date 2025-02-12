import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Switch,
  Flex,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { RiMailSendLine } from 'react-icons/ri';
import { getWithAuth, requestWithAuth, routes } from '../../utils/apiRoutes';

export default function ConfirmSendEmail() {
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getWithAuth(routes.userInfo);
        if (data) {
          setIsChecked(data.notifications === '1');
        }
      } catch (error) {
        toast({
          title: 'Error al cargar los datos de usuario',
          description: 'Hubo un problema al cargar la configuración de notificaciones.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchUserInfo();
  }, [toast]);

  const handleToggle = async () => {
    setLoading(true);
    const newNotificationState = isChecked ? '0' : '1';

    try {
      const response = await requestWithAuth(routes.updateSendNotifications, {
        notifications: newNotificationState,
      });

      if (response.status === 200) {
        setIsChecked(!isChecked);
        toast({
          title: 'Preferencia actualizada',
          description: `Las notificaciones han sido ${newNotificationState === '1' ? 'habilitadas' : 'deshabilitadas'} correctamente.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error(response.data.message || 'Error al actualizar las preferencias');
      }
    } catch (error) {
      toast({
        title: 'Error al actualizar',
        description: error.message || 'No se pudo actualizar la configuración de notificaciones.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
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
          <Icon as={RiMailSendLine} w={12} h={12} color="teal.500" />
        </Flex>
        <Box flex="1" pl={4}>
          <Heading as="h2" size="lg" mb={4} fontWeight="bold">
            Envío de notificaciones
          </Heading>
          <Text color="gray.500">
            Acepto recibir correos con notificaciones, promociones y actualizaciones por parte de PharmaBro.
          </Text>
        </Box>
      </Flex>

      <Flex justify="center" align="center" mt={6}>
        <Switch
          size="lg"
          colorScheme="green"
          isChecked={isChecked}
          onChange={handleToggle}
          isDisabled={loading}
        />
      </Flex>
    </Box>
  );
}