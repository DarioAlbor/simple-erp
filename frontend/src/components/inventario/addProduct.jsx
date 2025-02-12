import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
  useDisclosure,
  useToast,
  Avatar,
  Flex,
  Tooltip,
  Icon,
  IconButton,
} from '@chakra-ui/react';
import { IoMdAdd } from 'react-icons/io';
import { FaCircleInfo } from 'react-icons/fa6'; // Importar icono de información
import { requestWithAuth, routes } from '../../utils/apiRoutes';

export default function AddProduct() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [descripcion, setDescripcion] = useState('');
  const [img, setImg] = useState('');
  const [precios, setPrecios] = useState(['']); // Estado para los precios
  const toast = useToast();

  // Manejo de precios (agregar)
  const handleAddPrecio = () => {
    if (precios.length < 3) setPrecios([...precios, '']);
  };

  // Manejo de precios (cambiar valor)
  const handlePrecioChange = (index, value) => {
    const updatedPrecios = [...precios];
    updatedPrecios[index] = value;
    setPrecios(updatedPrecios);
  };

  const handleAddProduct = async () => {
    const newProduct = {
      descripcion,
      img,
      precio: precios[0] || null,
      precio2: precios[1] || null,
      precio3: precios[2] || null,
    };

    try {
      const response = await requestWithAuth(routes.addProduct, newProduct);
      if (response.status === 201) {
        toast({
          title: 'Producto agregado',
          description: 'El producto se ha agregado exitosamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: 'Error al agregar producto',
          description: 'Hubo un problema al agregar el producto.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error en la solicitud',
        description: 'No se pudo agregar el producto. Inténtalo nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button
        leftIcon={<IoMdAdd />}
        colorScheme="gray"
        variant="solid"
        onClick={onOpen}
      >
        Agregar producto
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar nuevo producto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Descripción */}
            <FormControl mb={4}>
              <Flex align="center">
                <FormLabel>Descripción</FormLabel>
                <Tooltip label="Ejemplo: Televisor Samsung 55 pulgadas" placement="right">
                  <span>
                    <Icon as={FaCircleInfo} color="gray.400" ml={2} />
                  </span>
                </Tooltip>
              </Flex>
              <Input
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción del producto"
              />
            </FormControl>

            {/* Precios */}
            {precios.map((precio, index) => (
              <FormControl mb={4} key={index}>
                <Flex align="center">
                  <FormLabel>{`Precio ${index + 1}`}</FormLabel>
                  {index < 2 && precios.length < 3 && (
                    <Tooltip label="Agregar otro precio" placement="right">
                      <IconButton
                        icon={<IoMdAdd />}
                        variant="ghost"
                        size="sm"
                        aria-label="Agregar precio"
                        onClick={handleAddPrecio}
                      />
                    </Tooltip>
                  )}
                </Flex>
                <Input
                  type="number"
                  value={precio}
                  onChange={(e) => handlePrecioChange(index, e.target.value)}
                  placeholder={`Precio ${index + 1}`}
                />
              </FormControl>
            ))}

            {/* URL de la imagen */}
            <FormControl mb={4}>
              <Flex align="center">
                <FormLabel>URL de la imagen</FormLabel>
                <Tooltip label="Ejemplo: https://example.com/image.jpg" placement="right">
                  <span>
                    <Icon as={FaCircleInfo} color="gray.400" ml={2} />
                  </span>
                </Tooltip>
              </Flex>
              <Input
                value={img}
                onChange={(e) => setImg(e.target.value)}
                placeholder="URL de la imagen"
              />
            </FormControl>

            {/* Avatar para previsualización de la imagen */}
            <Flex justify="center" mt={4} mb={4}>
              <Avatar
                size="xl"
                src={img}
                name={descripcion}
              />
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" onClick={handleAddProduct}>
              Agregar producto
            </Button>
            <Button variant="ghost" ml={3} onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}