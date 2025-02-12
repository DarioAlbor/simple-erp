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
  Input,
  FormControl,
  FormLabel,
  useDisclosure,
  useToast,
  Flex,
  Tooltip,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  Box,
} from '@chakra-ui/react';
import { IoMdAdd } from 'react-icons/io';
import { FaCircleInfo } from 'react-icons/fa6';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { requestWithAuth, getWithAuth, routes } from '../../utils/apiRoutes';

export default function AddZona() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [nombre, setNombre] = useState('');
  const [tarifas, setTarifas] = useState(['']);
  const [repartidores, setRepartidores] = useState([]);
  const [selectedRepartidores, setSelectedRepartidores] = useState([]);
  const toast = useToast();

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

  const handleAddTarifa = () => {
    if (tarifas.length < 4) setTarifas([...tarifas, '']);
  };

  const handleTarifaChange = (index, value) => {
    const updatedTarifas = [...tarifas];
    updatedTarifas[index] = value;
    setTarifas(updatedTarifas);
  };

  const handleRepartidoresChange = (repartidorId) => {
    if (selectedRepartidores.includes(repartidorId)) {
      setSelectedRepartidores(selectedRepartidores.filter((id) => id !== repartidorId));
    } else if (selectedRepartidores.length < 5) {
      setSelectedRepartidores([...selectedRepartidores, repartidorId]);
    }
  };

  const handleAddZona = async () => {
    const repartidoresString = selectedRepartidores.join(',');

    const newZona = {
      nombre,
      tarifa1: tarifas[0] !== '' ? tarifas[0] : null,
      tarifa2: tarifas[1] !== '' ? tarifas[1] : null,
      tarifa3: tarifas[2] !== '' ? tarifas[2] : null,
      tarifa4: tarifas[3] !== '' ? tarifas[3] : null,
      stocktotal: null,
      repartidores: repartidoresString !== '' ? repartidoresString : null,
    };

    try {
      const response = await requestWithAuth(routes.addZona, newZona);
      if (response.status === 201) {
        toast({
          title: 'Zona agregada',
          description: 'La zona se ha agregado exitosamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: 'Error al agregar zona',
          description: 'Hubo un problema al agregar la zona.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error en la solicitud',
        description: 'No se pudo agregar la zona. Inténtalo nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const repartidoresButtonText = selectedRepartidores.length === 0 
    ? 'Seleccionar repartidor(es)' 
    : `${selectedRepartidores.length} Seleccionado(s)`;

  return (
    <>
      <Button
        leftIcon={<IoMdAdd />}
        colorScheme="gray"
        variant="solid"
        onClick={onOpen}
      >
        Agregar Zona
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar nueva zona</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <Flex align="center">
                <FormLabel>Nombre de la zona</FormLabel>
                <Tooltip label="Ejemplo: Zona Norte" placement="right">
                  <span>
                    <Icon as={FaCircleInfo} color="gray.400" ml={2} />
                  </span>
                </Tooltip>
              </Flex>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre de la zona"
              />
            </FormControl>

            {tarifas.map((tarifa, index) => (
              <FormControl mb={4} key={index}>
                <Flex align="center">
                  <FormLabel>{`Tarifa ${index + 1}`}</FormLabel>
                  {index < 3 && tarifas.length < 4 && (
                    <Tooltip label="Agregar otra tarifa" placement="right">
                      <IconButton
                        icon={<IoMdAdd />}
                        variant="ghost"
                        size="sm"
                        aria-label="Agregar tarifa"
                        onClick={handleAddTarifa}
                      />
                    </Tooltip>
                  )}
                </Flex>
                <Input
                  type="number"
                  value={tarifa}
                  onChange={(e) => handleTarifaChange(index, e.target.value)}
                  placeholder={`Tarifa ${index + 1}`}
                />
              </FormControl>
            ))}

            <FormControl mb={4}>
              <FormLabel>Seleccionar repartidor(es)</FormLabel>
              <Menu closeOnSelect={false}>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  {repartidoresButtonText}
                </MenuButton>
                <MenuList maxHeight="200px" overflowY="auto">
                  {repartidores.map((repartidor) => (
                    <MenuItem key={repartidor.id} onClick={() => handleRepartidoresChange(repartidor.id)}>
                      <Flex align="center" justify="space-between" width="100%">
                        <Box>{repartidor.name}</Box>
                        <Checkbox isChecked={selectedRepartidores.includes(repartidor.id)} />
                      </Flex>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" onClick={handleAddZona}>
              Agregar zona
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