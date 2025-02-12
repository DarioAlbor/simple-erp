import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Flex,
  Avatar,
  Text,
  Icon,
  Divider,
  Center,
  Tooltip,
  useDisclosure,
  useToast,
  Grid,
  GridItem,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { getWithAuth, requestWithAuth, routes } from '../../../../../PharmaBroSoft/frontend/src/utils/apiRoutes';
import { FaPencilAlt, FaInfoCircle } from 'react-icons/fa';
import ModalChangePassword from './modalChangePassword';
import ModalChangeImage from './modalChangeImage'; 

const LATAM_COUNTRIES = [
  { name: 'Argentina', code: 'ar', phoneCode: '+54' },
  { name: 'Bolivia', code: 'bo', phoneCode: '+591' },
  { name: 'Brasil', code: 'br', phoneCode: '+55' },
  { name: 'Chile', code: 'cl', phoneCode: '+56' },
  { name: 'Colombia', code: 'co', phoneCode: '+57' },
  { name: 'Costa Rica', code: 'cr', phoneCode: '+506' },
  { name: 'Cuba', code: 'cu', phoneCode: '+53' },
  { name: 'Ecuador', code: 'ec', phoneCode: '+593' },
  { name: 'El Salvador', code: 'sv', phoneCode: '+503' },
  { name: 'Guatemala', code: 'gt', phoneCode: '+502' },
  { name: 'Honduras', code: 'hn', phoneCode: '+504' },
  { name: 'México', code: 'mx', phoneCode: '+52' },
  { name: 'Nicaragua', code: 'ni', phoneCode: '+505' },
  { name: 'Panamá', code: 'pa', phoneCode: '+507' },
  { name: 'Paraguay', code: 'py', phoneCode: '+595' },
  { name: 'Perú', code: 'pe', phoneCode: '+51' },
  { name: 'Uruguay', code: 'uy', phoneCode: '+598' },
  { name: 'Venezuela', code: 've', phoneCode: '+58' },
];

const getFlagUrl = (countryCode) => {
  return `https://flagicons.lipis.dev/flags/4x3/${countryCode}.svg`;
};

export default function UserConfig() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    phoneCode: '',
    country: '',
    city: '',
    imageProfile: '',
    password: '********',
  });
  const { isOpen: isImageModalOpen, onOpen: onOpenImageModal, onClose: onCloseImageModal } = useDisclosure();
  const { isOpen: isPasswordModalOpen, onOpen: onOpenPasswordModal, onClose: onClosePasswordModal } = useDisclosure();
  const [isHovered, setIsHovered] = useState(false); 
  const [isPhoneMenuOpen, setPhoneMenuOpen] = useState(false);
  const [isCountryMenuOpen, setCountryMenuOpen] = useState(false);
  const toastChakra = useToast();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await getWithAuth(routes.userInfo);

        if (userData) {
          const selectedCountry = LATAM_COUNTRIES.find(country => userData.phone.startsWith(country.phoneCode));

          setUserInfo({
            name: userData.name,
            lastname: userData.lastname,
            email: userData.email,
            phone: userData.phone ? userData.phone.replace(selectedCountry?.phoneCode, '') : '',
            phoneCode: selectedCountry?.phoneCode || '',
            country: userData.country || selectedCountry?.name || '',
            city: userData.city || '',
            imageProfile: userData.imageprofile,
            password: '********',
          });
        }
      } catch (error) {
        toastChakra({
          title: 'Error al cargar los datos de usuario',
          description: 'Hubo un problema al cargar los datos del usuario.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchUserInfo();
  }, [toastChakra]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handlePhoneInputChange = (e) => {
    const { value } = e.target;
    const cleanedValue = value.replace(/\D/g, '');
    setUserInfo({ ...userInfo, phone: cleanedValue });
  };

  const handleSubmit = async () => {
    const fullPhone = userInfo.phoneCode + userInfo.phone;
    const dataToUpdate = {
      name: userInfo.name,
      lastname: userInfo.lastname,
      phone: fullPhone,
      country: userInfo.country,
      city: userInfo.city,
    };

    try {
      const response = await requestWithAuth(routes.updateUserData, dataToUpdate);

      if (response.status === 200) {
        toastChakra({
          title: 'Datos actualizados correctamente',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toastChakra({
          title: 'Error al actualizar la información',
          description: response.data.message || 'Hubo un problema al actualizar los datos.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toastChakra({
        title: 'Error en la solicitud',
        description: 'No se pudo actualizar la información. Inténtalo nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} maxW="800px" mx="auto">
      <VStack spacing={6} align="stretch">
        <Box
          bg="white"
          borderRadius="lg"
          border="1px"
          borderColor="gray.200"
          p={6}
        >
          <Heading as="h2" size="lg" textAlign="left">
            Configuración de usuario
          </Heading>

          <Divider my={4} />

          <VStack spacing={6} align="stretch">
            <Box align="left">
              <Flex align="center" mb={4}>
                <Box
                  position="relative"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <Avatar
                    size="xl"
                    src={userInfo.imageProfile || ''}
                  />
                  {isHovered && (
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      bg="rgba(0, 0, 0, 0.6)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="full"
                      cursor="pointer"
                      onClick={onOpenImageModal}
                    >
                      <Center>
                        <Icon as={FaPencilAlt} w={6} h={6} color="white" />
                      </Center>
                    </Box>
                  )}
                  <Box position="absolute" bottom="-5px" right="3px" zIndex="1500">
                    <Tooltip
                      label="Aceptamos enlaces de cualquier proveedor externo, puedes subir tu imagen por ejemplo a https://imgur.com/ y colocar el enlace."
                      placement="bottom-start"
                      hasArrow
                    >
                      <Box>
                        <Icon as={FaInfoCircle} color="gray.500" w={5} h={5} />
                      </Box>
                    </Tooltip>
                  </Box>
                </Box>
                <Box ml={4}>
                  <Text fontWeight="bold" fontSize="md">Imagen de perfil</Text>
                  <Text fontSize="sm" color="gray.500">
                    Aceptamos enlaces de imagen .png, .jpg y .jpeg. Tamaño máximo 3MB.
                  </Text>
                  <Button mt={2} size="sm" colorScheme="teal" onClick={onOpenImageModal}>
                    Subir imagen
                  </Button>
                </Box>
              </Flex>
            </Box>

            <Divider />

            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap={6}
            >
              <GridItem>
                <Text fontSize="md" mb={2} fontWeight="bold">
                  Nombre <Text as="span" color="red">*</Text>
                </Text>
                <Input
                  placeholder="Nombre"
                  name="name"
                  value={userInfo.name}
                  onChange={handleInputChange}
                />
              </GridItem>
              <GridItem>
                <Text fontSize="md" mb={2} fontWeight="bold">
                  Apellido <Text as="span" color="red">*</Text>
                </Text>
                <Input
                  placeholder="Apellido"
                  name="lastname"
                  value={userInfo.lastname}
                  onChange={handleInputChange}
                />
              </GridItem>
              <GridItem>
                <Text fontSize="md" mb={2} fontWeight="bold">
                  Correo electrónico <Text as="span" color="red">*</Text>
                </Text>
                <Input
                  placeholder="Correo electrónico"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  isDisabled
                />
              </GridItem>
              <GridItem>
                <Text fontSize="md" mb={2} fontWeight="bold">
                  Número de teléfono
                </Text>
                <Flex>
                  <Menu isOpen={isPhoneMenuOpen} onClose={() => setPhoneMenuOpen(false)} onOpen={() => setPhoneMenuOpen(true)}>
                    <MenuButton
                      as={Button}
                      rightIcon={isPhoneMenuOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                      w="70px"
                      mr={2}
                      textAlign="left"
                    >
                      {userInfo.phoneCode ? (
                        <Flex align="center">
                          <Image
                            src={getFlagUrl(LATAM_COUNTRIES.find(country => country.phoneCode === userInfo.phoneCode)?.code || 'ar')}
                            alt={userInfo.phoneCode}
                            boxSize="1.5rem"
                            mr="8px"
                          />
                        </Flex>
                      ) : (
                        '...'
                      )}
                    </MenuButton>
                    <MenuList maxHeight="200px" overflowY="auto">
                      {LATAM_COUNTRIES.map((country) => (
                        <MenuItem
                          key={country.code}
                          onClick={() => handleInputChange({ target: { name: 'phoneCode', value: country.phoneCode } })}
                        >
                          <Flex align="center">
                            <Image
                              src={getFlagUrl(country.code)}
                              alt={country.name}
                              boxSize="1.5rem"
                              mr="8px"
                            />
                            {country.phoneCode}
                          </Flex>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                  <Input
                    placeholder="Número de teléfono"
                    name="phone"
                    value={userInfo.phone}
                    onChange={handlePhoneInputChange}
                    flex="1"
                    type="tel"
                  />
                </Flex>
              </GridItem>

              <GridItem>
                <Text fontSize="md" mb={2} fontWeight="bold">
                  País
                </Text>
                <Menu isOpen={isCountryMenuOpen} onClose={() => setCountryMenuOpen(false)} onOpen={() => setCountryMenuOpen(true)}>
                  <MenuButton
                    as={Button}
                    rightIcon={isCountryMenuOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    w="100%"
                    textAlign="left"
                  >
                    {userInfo.country ? (
                      <Flex align="center">
                        <Image
                          src={getFlagUrl(LATAM_COUNTRIES.find(country => country.name === userInfo.country)?.code || 'ar')}
                          alt={userInfo.country}
                          boxSize="1.5rem"
                          mr="8px"
                        />
                        {userInfo.country}
                      </Flex>
                    ) : 'Seleccionar País'}
                  </MenuButton>
                  <MenuList maxHeight="200px" overflowY="auto">
                    {LATAM_COUNTRIES.map((country) => (
                      <MenuItem
                        key={country.code}
                        onClick={() => handleInputChange({ target: { name: 'country', value: country.name } })}
                      >
                        <Flex align="center">
                          <Image
                            src={getFlagUrl(country.code)}
                            alt={country.name}
                            boxSize="1.5rem"
                            mr="8px"
                          />
                          {country.name}
                        </Flex>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </GridItem>

              <GridItem>
                <Text fontSize="md" mb={2} fontWeight="bold">
                  Ciudad
                </Text>
                <Input
                  placeholder="Ciudad"
                  name="city"
                  value={userInfo.city}
                  onChange={handleInputChange}
                />
              </GridItem>

              <GridItem>
                <Text fontSize="md" mb={2} fontWeight="bold">
                  Contraseña
                </Text>
                <InputGroup>
                  <Input
                    placeholder="Contraseña"
                    name="password"
                    value={userInfo.password}
                    isDisabled
                  />
                  <InputRightElement>
                    <Icon as={FaPencilAlt} w={5} h={5} cursor="pointer" onClick={onOpenPasswordModal} />
                  </InputRightElement>
                </InputGroup>
              </GridItem>
            </Grid>

            <Button mt={6} colorScheme="teal" onClick={handleSubmit}>
              Guardar Cambios
            </Button>
          </VStack>
        </Box>
      </VStack>

      <ModalChangePassword isOpen={isPasswordModalOpen} onClose={onClosePasswordModal} />
      <ModalChangeImage isOpen={isImageModalOpen} onClose={onCloseImageModal} />
    </Box>
  );
}