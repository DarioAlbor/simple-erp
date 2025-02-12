import React, { useEffect, useState, useRef } from 'react';
import { IconButton, Fade, Box, CloseButton, useBreakpointValue } from '@chakra-ui/react';
import { FaGithub } from "react-icons/fa";

const VisitGithub = () => {
  const messages = [
    "Visita mi perfil",
    "Si te gusto el software, por favor puntúa el repositorio",
    "Tu estrella me incentiva a realizar más software open-source"
  ];

  const [messageIndex, setMessageIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [closed, setClosed] = useState(false);

  const timeoutsRef = useRef([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
  }

  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const messageWidth = useBreakpointValue({ base: '200px', md: '250px' });
  const bottomPosition = useBreakpointValue({ base: '10px', md: '20px' });
  const leftPosition = useBreakpointValue({ base: '10px', md: '20px' });
  const messageBottom = useBreakpointValue({ base: '60px', md: '25px' });
  const messageLeft = useBreakpointValue({ base: '10px', md: '70px' });

  useEffect(() => {
    if (closed) return;
    const cycleMessages = () => {
      setShowMessage(true);
      const hideTimeout = setTimeout(() => {
        setShowMessage(false);
        const afterFadeTimeout = setTimeout(() => {
          const nextMessageTimeout = setTimeout(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
            if (!closed) {
              cycleMessages();
            }
          }, 60000);
          timeoutsRef.current.push(nextMessageTimeout);
        }, 500);

        timeoutsRef.current.push(afterFadeTimeout);
      }, 5000);

      timeoutsRef.current.push(hideTimeout);
    };

    cycleMessages();

    return () => {
      clearAllTimeouts();
    };
  }, [closed, messages.length]);

  const openGithub = () => {
    window.open('https://github.com/DarioAlbor', '_blank');
  };

  const handleClose = () => {
    setClosed(true);
    setShowMessage(false);
    clearAllTimeouts();
  }

  return (
    <>
      <IconButton
        icon={<FaGithub />}
        onClick={openGithub}
        position="fixed"
        bottom={bottomPosition}
        left={leftPosition}
        borderRadius="full"
        bg="blue.900"
        color="white"
        size={buttonSize}
        _hover={{ bg: 'teal.500' }}
        aria-label="Visitar Github"
        zIndex={1000}
      />
      {!closed && (
        <Box 
          position="fixed" 
          bottom={messageBottom}
          left={messageLeft}
          zIndex={1000}
        >
          <Fade in={showMessage}>
            <Box
              bg="gray.800"
              color="white"
              p="2"
              borderRadius="md"
              boxShadow="md"
              position="relative"
              transition="opacity 0.5s"
              minWidth={messageWidth}
              maxWidth="90vw"
              mx={2}
            >
              <CloseButton 
                size="sm" 
                position="absolute" 
                top="2px" 
                right="2px" 
                color="white"
                onClick={handleClose}
              />
              {messages[messageIndex]}
            </Box>
          </Fade>
        </Box>
      )}
    </>
  );
};

export default VisitGithub;