import React, { useState } from 'react';
import { Flex, Button, Box, Image } from '@chakra-ui/react';
import SignInForm from '../../components/auth/signinForm';

export default function IndexPage() {
  const [showSignInForm, setShowSignInForm] = useState(false);

  const handleButtonClick = () => {
    setShowSignInForm(true);
  };

  return (
    <Flex
      align={'center'}
      justify={'center'}
      minH={'100vh'}
      direction="column"
      bg={'radial-gradient(circle at 30% 30%, #1f3c65, #12152b, #0a0b15)'}
      position="relative"
    >
      {!showSignInForm && (
        <>
        <Image
          src="/images/svg/logo.svg"
          alt="Logo"
          style={{ width: '10%', height: 'auto' }}
        />
          <Button
            onClick={handleButtonClick}
            variant="outline"
            borderColor="gray.400"
            color="gray.400"
            background="transparent"
            borderRadius="md"
            _hover={{ borderColor: 'gray.600', color: 'gray.600' }}
            _active={{ background: 'transparent' }}
            mt={90}
          >
            Iniciar sesión
          </Button>
        </>
      )}

      {showSignInForm && (
        <Box mt={4}>
          <SignInForm />
        </Box>
      )}
    </Flex>
  );
}