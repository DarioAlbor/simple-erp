// src/components/admin/users/ButtonAddUser.jsx
import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { FaUserPlus } from 'react-icons/fa';
import ModelAddUser from './modalAddUser';

const ButtonAddUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button 
        leftIcon={<FaUserPlus color="white" />} 
        colorScheme="teal" 
        variant="solid" 
        onClick={handleOpenModal}
        color="white"
      >
        Agregar Usuario
      </Button>
      {isModalOpen && <ModelAddUser isOpen={isModalOpen} onClose={handleCloseModal} />}
    </>
  );
};

export default ButtonAddUser;