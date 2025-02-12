import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  Avatar,
  Input,
  Button,
  Tooltip,
  Box,
  Text,
  useToast,
  Icon,
} from '@chakra-ui/react';
import { FaInfoCircle } from 'react-icons/fa';
import { requestWithAuth, routes } from '../../../../../PharmaBroSoft/frontend/src/utils/apiRoutes';

export default function ModalChangeImage({ isOpen, onClose }) {
  const [imageLink, setImageLink] = useState('');
  const toastChakra = useToast();

  const handleConfirmImage = async () => {
    const isValidImage = /\.(jpg|jpeg|png)$/.test(imageLink);

    if (isValidImage) {
      try {
        const response = await requestWithAuth(routes.changeProfileImage, { imageProfile: imageLink });

        if (response.status === 200) {
          toastChakra({
            title: 'Imagen cambiada correctamente',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
          onClose();
        } else {
          toastChakra({
            title: 'Error al cambiar la imagen',
            description: response.data.message || 'Hubo un error al cambiar la imagen.',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        }
      } catch (error) {
        toastChakra({
          title: 'Error en la solicitud',
          description: 'No se pudo cambiar la imagen. Inténtalo nuevamente.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    } else {
      toastChakra({
        title: 'Error en la imagen',
        description: 'Solo se permiten imágenes .jpg, .jpeg y .png.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cambiar Imagen de Perfil</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} position="relative">
            <Box position="relative">
              <Tooltip label="Aceptamos enlaces de cualquier proveedor externo, puedes subir tu imagen por ejemplo a https://imgur.com/ y colocar el enlace." placement="bottom-start" hasArrow>
                <Box>
                  <Avatar size="xl" src={imageLink || ''} />
                  <Box position="absolute" bottom="0" right="0">
                    <Icon as={FaInfoCircle} color="gray.500" w={5} h={5} />
                  </Box>
                </Box>
              </Tooltip>
            </Box>
            <Input
              placeholder="Enlace de imagen"
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
            />
            <Text fontSize="sm" color="gray.500">
              Aceptamos enlaces de imagen .png, .jpg y .jpeg. Tamaño máximo 3MB.
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={handleConfirmImage}>
            Confirmar
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}