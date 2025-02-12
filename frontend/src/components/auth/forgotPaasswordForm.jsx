import {
  Button,
  FormControl,
  Heading,
  Input,
  Stack,
  Text,
  Box,
  CloseButton,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { MdEmail } from 'react-icons/md';

export default function ForgotPasswordForm({ onClose }) {
  return (
    <Box
      rounded={'xl'}
      bg={'white'}
      boxShadow={'2xl'}
      p={8}
      w={'auto'}
      position="relative"
    >
      <CloseButton position="absolute" top={2} right={2} onClick={onClose} />
      <Stack spacing={6} align={'center'}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }} color={'black'}>
          ¿Olvidaste tu contraseña?
        </Heading>
        <Text fontSize={{ base: 'sm', sm: 'md' }} color={'black'} textAlign={'center'}>
          Recibirás un correo electrónico con un enlace para restablecer tu contraseña
        </Text>
        <FormControl id="email">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <MdEmail color="gray.500" />
            </InputLeftElement>
            <Input
              placeholder="tu-correo@ejemplo.com"
              _placeholder={{ color: 'gray.500' }}
              type="email"
            />
          </InputGroup>
        </FormControl>
        <Stack spacing={6} w={'100%'}>
          <Button
            bg={'blue.400'}
            color={'white'}
            _hover={{
              bg: 'blue.500',
            }}
          >
            Solicitar Restablecimiento
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}