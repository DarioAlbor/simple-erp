import React, { useState, useEffect } from 'react';
import { IconButton } from '@chakra-ui/react';
import { FaArrowUp } from "react-icons/fa";

const UpArrow = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {showScrollButton && (
        <IconButton
          icon={<FaArrowUp />}
          onClick={scrollToTop}
          position="fixed"
          bottom="20px"
          right="20px"
          borderRadius="full"
          bg="blue.900"
          color="white"
          size="lg"
          _hover={{ bg: 'teal.500' }}
          aria-label="Subir arriba"
        />
      )}
    </>
  );
};

export default UpArrow;