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
  Text,
  Box,
  Input,
  FormControl,
  FormLabel,
  IconButton,
  Avatar,
  useToast,
} from '@chakra-ui/react';
import { MdDelete, MdEdit } from "react-icons/md";
import { requestWithAuth, routes } from '../../utils/apiRoutes';

const ModalProduct = ({ isOpen, onClose, product }) => {
  const [isEditing, setIsEditing] = useState(false); // Estado de edición
  const [editableProduct, setEditableProduct] = useState({ ...product }); // Estado para los campos editables
  const [showImageInput, setShowImageInput] = useState(false); // Estado para mostrar/ocultar el campo de la URL de la imagen
  const toast = useToast();

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableProduct({
      ...editableProduct,
      [name]: value,
    });
    setIsEditing(true); // Al cambiar un valor, habilitamos la edición
  };

  // Guardar los cambios realizados
  const handleSaveChanges = async () => {
    try {
      const response = await requestWithAuth(`${routes.editProduct}/${product.id}`, editableProduct, 'PUT');
      if (response.status === 200) {
        toast({
          title: "Producto actualizado",
          description: "Los cambios se han guardado exitosamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setIsEditing(false); // Desactivar edición después de guardar
      } else {
        toast({
          title: "Error",
          description: "Hubo un problema al guardar los cambios.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error en la solicitud",
        description: "No se pudieron guardar los cambios. Inténtalo nuevamente.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Función para borrar el producto
  const handleDeleteProduct = async () => {
    try {
      const response = await requestWithAuth(`${routes.deleteProduct}/${product.id}`, {}, 'DELETE');
      if (response.status === 200) {
        toast({
          title: "Producto eliminado",
          description: "El producto ha sido eliminado exitosamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose(); // Cerrar el modal después de eliminar
      } else {
        toast({
          title: "Error",
          description: "Hubo un problema al eliminar el producto.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error en la solicitud",
        description: "No se pudo eliminar el producto. Inténtalo nuevamente.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Cancelar la edición
  const handleCancel = () => {
    setEditableProduct({ ...product }); // Revertir a los valores originales
    setIsEditing(false); // Desactivar edición
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Detalles del Producto</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Nombre */}
          <FormControl mb={4}>
            <FormLabel>Nombre:</FormLabel>
            <Input
              name="descripcion"
              value={editableProduct.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción del producto"
            />
          </FormControl>

          {/* Precios */}
          <FormControl mb={4}>
            <FormLabel>Precio 1:</FormLabel>
            <Input
              name="precio"
              type="number"
              value={editableProduct.precio || ''}
              onChange={handleInputChange}
              placeholder="Precio 1"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Precio 2:</FormLabel>
            <Input
              name="precio2"
              type="number"
              value={editableProduct.precio2 || ''}
              onChange={handleInputChange}
              placeholder="Precio 2"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Precio 3:</FormLabel>
            <Input
              name="precio3"
              type="number"
              value={editableProduct.precio3 || ''}
              onChange={handleInputChange}
              placeholder="Precio 3"
            />
          </FormControl>

          {/* Imagen del producto como Avatar */}
          <Box textAlign="center" mb={4}>
            <Text fontWeight="bold" mb={2}>Imagen del producto:</Text>
            <Avatar
              size="xl"
              name={editableProduct.descripcion}
              src={editableProduct.img}
              bg="gray.100"
              mb={2}
            />
            {/* Botón para editar la URL de la imagen */}
            <IconButton
              icon={<MdEdit />}
              mt={2}
              colorScheme="teal"
              aria-label="Editar imagen"
              onClick={() => setShowImageInput(!showImageInput)}
            />
            {showImageInput && (
              <Input
                mt={4}
                name="img"
                value={editableProduct.img}
                onChange={handleInputChange}
                placeholder="URL de la imagen"
              />
            )}
          </Box>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          {/* Botón de borrar o cancelar */}
          {isEditing ? (
            <Button colorScheme="red" onClick={handleCancel}>
              Cancelar
            </Button>
          ) : (
            <Button colorScheme="red" leftIcon={<MdDelete />} onClick={handleDeleteProduct}>
              Borrar
            </Button>
          )}

          {/* Botón de guardar cambios o cerrar */}
          <Button colorScheme="teal" onClick={isEditing ? handleSaveChanges : onClose}>
            {isEditing ? 'Guardar' : 'Cerrar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalProduct;