import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from '@chakra-ui/react';
import { requestWithAuth, routes } from '../../../utils/apiRoutes';

const ModalAddUser = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    rank: 'client',
  });

  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await requestWithAuth(routes.userRegister, formData);

      if (response.status === 201) {
        toast({
          title: 'Usuario creado',
          description: 'El usuario ha sido agregado exitosamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: 'Error',
          description: 'Hubo un problema al crear el usuario.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al agregar el usuario.',
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
        <ModalHeader>Agregar Nuevo Usuario</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="name" mb={4} isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input type="text" name="name" value={formData.name} onChange={handleChange} />
          </FormControl>
          <FormControl id="lastname" mb={4} isRequired>
            <FormLabel>Apellido</FormLabel>
            <Input type="text" name="lastname" value={formData.lastname} onChange={handleChange} />
          </FormControl>
          <FormControl id="email" mb={4} isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} />
          </FormControl>
          <FormControl id="password" mb={4} isRequired>
            <FormLabel>Contraseña</FormLabel>
            <Input type="password" name="password" value={formData.password} onChange={handleChange} />
          </FormControl>
          <FormControl id="rank" mb={4} isRequired>
            <FormLabel>Rango</FormLabel>
            <Select name="rank" value={formData.rank} onChange={handleChange}>
              <option value="client">Cliente</option>
              <option value="admin">Administrador</option>
              <option value="seller">Vendedor</option>
              <option value="dealer">Repartidor</option>
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
            Confirmar
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalAddUser;