import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Icon, useDisclosure, Spinner } from '@chakra-ui/react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { getWithAuth, routes } from '../../utils/apiRoutes';
import ModalZonas from './modalZonas';

const ListZonas = () => {
  const [zonas, setZonas] = useState([]);
  const [selectedZona, setSelectedZona] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const fetchZonas = async () => {
      try {
        const response = await getWithAuth(routes.getAllZonas);
        if (Array.isArray(response)) {
          setZonas(response);
        }
      } catch (error) {
      } finally {
        setLoading(false);
        setIsFirstLoad(false);
      }
    };

    fetchZonas();

    const intervalId = setInterval(fetchZonas, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleOpenModal = (zona) => {
    setSelectedZona(zona);
    onOpen();
  };

  const handleCloseModal = () => {
    onClose();
    setSelectedZona(null);
  };

  if (isFirstLoad && loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Box
        maxHeight="600px"
        overflowY={zonas.length > 12 ? 'auto' : 'visible'} className="scrollbar"
      >
        <Grid templateColumns="repeat(5, 1fr)" gap={4}>
          {zonas.map((zona) => (
            <Button
              key={zona.id}
              variant="ghost"
              height="100px"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              _hover={{ bg: 'teal.500', color: 'white' }}
              onClick={() => handleOpenModal(zona)}
            >
              <Icon as={FaMapMarkerAlt} boxSize={8} />
              <Box mt={2}>{zona.nombre}</Box>
            </Button>
          ))}
        </Grid>
      </Box>

      {selectedZona && (
        <ModalZonas
          isOpen={isOpen}
          onClose={handleCloseModal}
          zona={selectedZona}
        />
      )}
    </Box>
  );
};

export default ListZonas;