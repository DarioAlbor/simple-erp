import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Text, Box, Image, useToast } from '@chakra-ui/react';
import { requestWithAuth, routes } from '../../../utils/apiRoutes';

const ModalInfoUser = ({ isOpen, onClose, user }) => {
  const toast = useToast();

  const handleDisableAccount = async () => {
    try {
      const response = await requestWithAuth(routes.disabledAccount, { userId: user.id }, 'POST');
      
      if (response?.success) {
        toast({
          title: 'Cuenta deshabilitada',
          description: 'El usuario ha sido deshabilitado correctamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          variant: 'subtle',
          position: 'top-right',
          containerStyle: {
            backgroundColor: 'green.500',
          }
        });
        onClose();
      } else {
        toast({
          title: 'Error',
          description: response.message || 'No se pudo deshabilitar la cuenta.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al intentar deshabilitar la cuenta.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Información del Usuario</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box display="flex" alignItems="center" mb={4}>
            <Image
              borderRadius="full"
              boxSize="80px"
              src={user.imageprofile}
              alt={`${user.name} ${user.lastname}`}
              mr={4}
            />
            <Text fontSize="lg" fontWeight="bold">
              {user.name} {user.lastname}
            </Text>
          </Box>
          <Text><strong>Email:</strong> {user.email}</Text>
          <Text><strong>Teléfono:</strong> {user.phone}</Text>
          <Text><strong>Ciudad:</strong> {user.city}</Text>
          <Text><strong>País:</strong> {user.country}</Text>
          <Text><strong>Rango:</strong> {user.rank}</Text>
          <Text><strong>Primera Actividad:</strong> {new Date(user.firstactivity).toLocaleString()}</Text>
          <Text><strong>Última Actividad:</strong> {new Date(user.lastactivity).toLocaleString()}</Text>
          <Text><strong>Activo:</strong> {user.isActive ? 'Sí' : 'No'}</Text>
          <Text><strong>Notificaciones:</strong> {user.notifications === '1' ? 'Habilitadas' : 'Deshabilitadas'}</Text>
          <Text><strong>Cuenta Deshabilitada:</strong> {user.disabled === '1' ? 'Sí' : 'No'}</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" color="white" onClick={handleDisableAccount} mr="auto">
            Deshabilitar
          </Button>
          <Button colorScheme="blue" onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalInfoUser;