import React, { useState } from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  IconButton,
  Link,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from '@chakra-ui/react';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { MdEmail, MdClose } from "react-icons/md";
import ForgotPasswordForm from './forgotPaasswordForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseurl, routes } from '../../utils/apiRoutes';
import { useNavigate } from 'react-router-dom';

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const resetButtonState = () => {
    setTimeout(() => {
      setStatus('idle');
    }, 2000);
  };

  const handleLogin = async () => {
    if (!email || !password || loading) return;

    setLoading(true);
    setStatus('loading');

    try {
      const response = await fetch(`${baseurl}${routes.userLogin}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Se retrasa 3 segundos para mostrar las animaciones, sin embargo se puede comentar la función si prefieren velocidad.
      setTimeout(() => {
        if (response.ok) {
          if (data.token) {
            localStorage.setItem('token', data.token);

            setStatus('success');
            toast.success('Inicio de sesión exitoso', { position: 'top-right' });

            setTimeout(() => {
              navigate('/');
            }, 1500);
          } else {
            throw new Error('No se recibió token');
          }
        } else {
          setStatus('error');
          toast.error(data.message || 'Error al iniciar sesión', { position: 'top-right' });
        }
        setLoading(false);
      }, 3000);
    } catch (error) {
      setStatus('error');
      toast.error(error.message || 'Error de conexión al servidor', { position: 'top-right' });
      setLoading(false); 
    } finally {
      resetButtonState();
    }
  };

  const isButtonDisabled = !email || !password || loading;

  return (
    <>
      <Flex align={'center'} justify={'center'}>
        <Box
          rounded={'xl'}
          bg={'white'}
          boxShadow={'2xl'}
          p={8}
          w={'auto'}
        >
          <Stack spacing={6} align={'center'}>
            <Heading fontSize={'4xl'} color={'black'}>
              Inicia sesión en tu cuenta 
            </Heading>
            <Text fontSize={'lg'} color={'black'} textAlign={'center'}>
              Software de gestión open-source 📦
            </Text>
            <Stack spacing={4} w={'100%'}>
              <FormControl id="email" isRequired>
                <FormLabel color={'black'}>Correo electrónico</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <MdEmail color="gray.500" />
                  </InputLeftElement>
                  <Input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroup>
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel color={'black'}>Contraseña</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FaLock color="gray.500" />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                      onClick={handleTogglePassword}
                      variant="ghost"
                      color="gray.500"
                      size="sm"
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Stack spacing={10}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}
                >
                  <Checkbox colorScheme="blue">Recuérdame</Checkbox>
                  <Link color={'blue.400'} onClick={onOpen}>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Stack>

                <Button
                  bg={
                    isButtonDisabled
                      ? 'gray.400'
                      : loading
                      ? 'blue.600'
                      : status === 'success'
                      ? 'green.400'
                      : status === 'error'
                      ? 'red.400'
                      : 'blue.400'
                  }
                  color={'white'}
                  _hover={{
                    bg: !isButtonDisabled && !loading && (status === 'success' ? 'green.500' : status === 'error' ? 'red.500' : 'blue.500'),
                  }}
                  onClick={handleLogin}
                  isLoading={loading}
                  loadingText="Cargando..."
                  disabled={isButtonDisabled || loading}
                  leftIcon={
                    status === 'success'
                      ? <FaCheckCircle />
                      : status === 'error'
                      ? <MdClose />
                      : null
                  }
                >
                  {!loading && status === 'idle' && 'Iniciar sesión'}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
        <ModalContent bg="transparent" boxShadow="none" maxW="none">
          <ModalBody display="flex" justifyContent="center" alignItems="center">
            <ForgotPasswordForm onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <ToastContainer />
    </>
  );
}