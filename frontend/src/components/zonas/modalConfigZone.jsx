import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Flex,
  Box,
  Tag,
  TagLabel,
  TagCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { IoMdAdd } from 'react-icons/io';
import { requestWithAuth, getWithAuth, routes } from '../../utils/apiRoutes';

export default function ModalConfigZone({ isOpen, onClose, zona }) {
  const [nombre, setNombre] = useState(zona.nombre);
  const [tarifa1, setTarifa1] = useState(zona.tarifa1 || '');
  const [tarifa2, setTarifa2] = useState(zona.tarifa2 || '');
  const [tarifa3, setTarifa3] = useState(zona.tarifa3 || '');
  const [tarifa4, setTarifa4] = useState(zona.tarifa4 || '');
  const [repartidores, setRepartidores] = useState([]);
  const [selectedRepartidores, setSelectedRepartidores] = useState(zona.repartidores ? zona.repartidores.split(',') : []);
  const toast = useToast();
  const [showRepartidoresMenu, setShowRepartidoresMenu] = useState(false);

  useEffect(() => {
    const fetchRepartidores = async () => {
      try {
        const response = await getWithAuth(routes.getAllUsers);
        if (Array.isArray(response)) {
          const dealers = response.filter((user) => user.rank === 'dealer');
          setRepartidores(dealers);
        } else {
          toast({
            title: 'Error',
            description: 'No se pudo obtener la lista de repartidores.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Hubo un error al cargar los repartidores.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchRepartidores();
  }, [toast]);

  const handleRemoveRepartidor = (repartidorId) => {
    setSelectedRepartidores(selectedRepartidores.filter((id) => id !== repartidorId));
  };

  const handleAddRepartidor = (repartidorId) => {
    if (selectedRepartidores.length < 5) {
      setSelectedRepartidores([...selectedRepartidores, repartidorId]);
      setShowRepartidoresMenu(false);
    } else {
      toast({
        title: 'Límite alcanzado',
        description: 'No puedes agregar más de 5 repartidores a una zona.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const repartidoresDisponibles = repartidores.filter(
    (repartidor) => !selectedRepartidores.includes(String(repartidor.id))
  );

  const handleSaveChanges = async () => {
    const repartidoresString = selectedRepartidores.length > 0 ? selectedRepartidores.join(',') : null;

    const updatedZone = { 
      nombre, 
      tarifa1, 
      tarifa2, 
      tarifa3, 
      tarifa4, 
      repartidores: repartidoresString 
    };

    try {
      const response = await requestWithAuth(`${routes.editZona}/${zona.id}`, updatedZone, 'PUT');
      if (response.status === 200) {
        toast({
          title: 'Zona actualizada',
          description: 'Los cambios se han guardado exitosamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: 'Error al actualizar zona',
          description: 'No se pudieron guardar los cambios.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error en la solicitud',
        description: 'Hubo un error al intentar actualizar la zona.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteZone = async () => {
    try {
      const response = await requestWithAuth(`${routes.deleteZona}/${zona.id}`, {}, 'DELETE');
      if (response.status === 200) {
        toast({
          title: 'Zona eliminada',
          description: 'La zona ha sido eliminada exitosamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: 'Error al eliminar zona',
          description: 'Hubo un problema al intentar eliminar la zona.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error en la solicitud',
        description: 'No se pudo eliminar la zona. Inténtalo nuevamente.',
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
        <ModalHeader>Configuración de Zona: {zona.nombre}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Nombre de la Zona</FormLabel>
            <Input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Tarifa 1</FormLabel>
            <Input
              type="number"
              value={tarifa1}
              onChange={(e) => setTarifa1(e.target.value)}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Tarifa 2</FormLabel>
            <Input
              type="number"
              value={tarifa2}
              onChange={(e) => setTarifa2(e.target.value)}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Tarifa 3</FormLabel>
            <Input
              type="number"
              value={tarifa3}
              onChange={(e) => setTarifa3(e.target.value)}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Tarifa 4</FormLabel>
            <Input
              type="number"
              value={tarifa4}
              onChange={(e) => setTarifa4(e.target.value)}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Repartidores Asignados</FormLabel>
            {selectedRepartidores.length > 0 ? (
              <Flex direction="column" gap={2}>
                {selectedRepartidores.map((repartidorId) => {
                  const repartidor = repartidores.find((r) => String(r.id) === repartidorId);
                  return (
                    <Tag size="lg" key={repartidorId} borderRadius="full" variant="solid" colorScheme="teal">
                      <TagLabel>{repartidor ? repartidor.name : 'Repartidor desconocido'}</TagLabel>
                      <TagCloseButton onClick={() => handleRemoveRepartidor(repartidorId)} />
                    </Tag>
                  );
                })}
              </Flex>
            ) : (
              <Box>No hay repartidores asignados</Box>
            )}
          </FormControl>

          {selectedRepartidores.length < 5 && (
            <Button
              leftIcon={<IoMdAdd />}
              onClick={() => setShowRepartidoresMenu(!showRepartidoresMenu)}
              mb={4}
            >
              Agregar repartidor
            </Button>
          )}

          {showRepartidoresMenu && (
            <FormControl mb={4}>
              <Menu closeOnSelect={false}>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  Repartidores Disponibles
                </MenuButton>
                <MenuList maxHeight="200px" overflowY="auto">
                  {repartidoresDisponibles.length > 0 ? (
                    repartidoresDisponibles.map((repartidor) => (
                      <MenuItem key={repartidor.id} onClick={() => handleAddRepartidor(String(repartidor.id))}>
                        {repartidor.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>No hay repartidores disponibles</MenuItem>
                  )}
                </MenuList>
              </Menu>
            </FormControl>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" colorScheme="red" mr={3} onClick={handleDeleteZone}>
            Borrar Zona
          </Button>
          <Button colorScheme="teal" onClick={handleSaveChanges}>
            Guardar Cambios
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}