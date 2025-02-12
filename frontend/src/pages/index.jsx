import React from 'react';
import { Heading, Text, Flex, VStack, Button, Grid, GridItem, Icon } from '@chakra-ui/react';
import { MdInventory, MdOutlineAttachMoney } from "react-icons/md";
import { FaRoute } from "react-icons/fa";
import { TbUserDollar } from "react-icons/tb";
import { SiGoogleanalytics } from "react-icons/si";
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <Flex
        direction="column"
        bg="linear-gradient(135deg, #000000, #171829, #3B276E, #292F52, #223545, #28407F, #354E77, #3E6574, #5A9EA0)"
        color="white"
        minH="100vh"
        w="100%"
        overflow="hidden"
        alignItems="center"
      >
        <VStack spacing={2} mt={10} align="center">
          <Heading as="h1" size="2xl" textAlign="center">
            ¡Gracias por usar el software de gestión!
          </Heading>
          <Text fontSize="lg" textAlign="center">
            Software ágil para la gestión de la empresa 📦
          </Text>
        </VStack>

        <Flex flexGrow={1} justify="center" align="center">
          <Grid templateColumns="repeat(5, 1fr)" gap={6}>

            <GridItem>
              <Button
                variant="ghost"
                colorScheme="teal"
                size="md"
                flexDirection="column"
                _hover={{ bg: 'teal.600', color: 'white' }}
                w="100%"
                h="100%"  
                onClick={() => navigate('/inventario')}
              >
                <Icon as={MdInventory} w={12} h={12} />
                <Text mt={2} color="white">Inventario</Text>
              </Button>
            </GridItem>

            <GridItem>
              <Button
                variant="ghost"
                colorScheme="teal"
                size="md"
                flexDirection="column"
                _hover={{ bg: 'teal.600', color: 'white' }}
                w="100%"
                h="100%"
                onClick={() => navigate('/logistica')}
              >
                <Icon as={FaRoute} w={12} h={12} />
                <Text mt={2} color="white">Logística</Text>
              </Button>
            </GridItem>

            <GridItem>
              <Button
                variant="ghost"
                colorScheme="teal"
                size="md"
                flexDirection="column"
                _hover={{ bg: 'teal.600', color: 'white' }}
                w="100%"
                h="100%"
                onClick={() => navigate('/pedidos')}
              >
                <Icon as={MdOutlineAttachMoney} w={12} h={12} />
                <Text mt={2} color="white">Pedidos</Text>
              </Button>
            </GridItem>
          </Grid>
        </Flex>
      </Flex>
    </>
  );
}