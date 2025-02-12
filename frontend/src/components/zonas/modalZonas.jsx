import React from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  IconButton,
  ModalFooter,
  useDisclosure,
  Flex,
  Box,
} from '@chakra-ui/react';
import { FaCog } from 'react-icons/fa';
import { GrDocumentText } from 'react-icons/gr';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { FaRoute } from 'react-icons/fa';
import ModalConfigZone from './modalConfigZone';
import ModalListSells from './modalListSells';
import ModalListStock from './modalListStock';
import ModalCortes from './modalCortes';

export default function ModalZonas({ isOpen, onClose, zona }) {
  const { isOpen: isConfigOpen, onOpen: onConfigOpen, onClose: onConfigClose } = useDisclosure();
  const { isOpen: isSellsOpen, onOpen: onSellsOpen, onClose: onSellsClose } = useDisclosure();
  const { isOpen: isStockOpen, onOpen: onStockOpen, onClose: onStockClose } = useDisclosure();
  const { isOpen: isCortesOpen, onOpen: onCortesOpen, onClose: onCortesClose } = useDisclosure();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align="center" width="100%">
              <IconButton
                icon={<FaCog />}
                onClick={onConfigOpen}
                aria-label="Configurar Zona"
                variant="ghost"
              />
              <Box flex="1" textAlign="center">
                {zona.nombre}
              </Box>
              <ModalCloseButton position="relative" />
            </Flex>
          </ModalHeader>

          <ModalBody>
            <Button
              colorScheme="teal"
              leftIcon={<GrDocumentText />}
              onClick={onSellsOpen}
              mr={2}
              mb={2}
            >
              Ver Pedidos
            </Button>
            <Button
              colorScheme="blue"
              leftIcon={<MdOutlineProductionQuantityLimits />}
              onClick={onStockOpen}
              mr={2}
              mb={2}
            >
              Ver Stock
            </Button>
            <Button
              colorScheme="orange"
              leftIcon={<FaRoute />}
              onClick={onCortesOpen}
              mr={2}
              mb={2}
            >
              Ver Cortes
            </Button>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>

      <ModalConfigZone isOpen={isConfigOpen} onClose={onConfigClose} zona={zona} />

      <ModalListSells isOpen={isSellsOpen} onClose={onSellsClose} zona={zona} />

      <ModalListStock isOpen={isStockOpen} onClose={onStockClose} zona={zona} />

      <ModalCortes isOpen={isCortesOpen} onClose={onCortesClose} zona={zona} />
    </>
  );
}