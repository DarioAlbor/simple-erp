import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  Icon,
  FormLabel,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { requestWithAuth, routes } from '../../../../../PharmaBroSoft/frontend/src/utils/apiRoutes';

export default function ModalChangePassword({ isOpen, onClose }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Las contraseñas no coinciden',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await requestWithAuth(routes.changePassword, {
        oldPassword,
        newPassword,
      });

      if (response.status === 200) {
        toast({
          title: 'Contraseña cambiada correctamente',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } else if (response.status === 401) {
        toast({
          title: 'Error al cambiar la contraseña',
          description: 'La contraseña antigua es incorrecta.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error al cambiar la contraseña',
          description: response.data.message || 'Hubo un problema al cambiar la contraseña.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error en la solicitud',
        description: 'No se pudo cambiar la contraseña. Inténtalo nuevamente.',
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
        <ModalHeader>Cambiar Contraseña</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="old-password" mb={4}>
            <FormLabel>Contraseña Antigua</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña Antigua"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <InputRightElement>
                <Icon
                  as={showPassword ? FaEyeSlash : FaEye}
                  cursor="pointer"
                  onClick={handlePasswordVisibility}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl id="new-password" mb={4}>
            <FormLabel>Nueva Contraseña</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Nueva Contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <InputRightElement>
                <Icon
                  as={showPassword ? FaEyeSlash : FaEye}
                  cursor="pointer"
                  onClick={handlePasswordVisibility}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl id="confirm-password">
            <FormLabel>Repetir Contraseña</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Repetir Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <InputRightElement>
                <Icon
                  as={showPassword ? FaEyeSlash : FaEye}
                  cursor="pointer"
                  onClick={handlePasswordVisibility}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={handleSavePassword}>
            Guardar Contraseña
          </Button>
          <Button variant="ghost" ml={3} onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}