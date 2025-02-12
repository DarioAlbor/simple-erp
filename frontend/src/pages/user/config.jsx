import React from 'react';
import { Box, Divider, Flex } from '@chakra-ui/react';
import UserConfig from '../../components/user/userConfig';
import ConfirmSendEmail from '../../components/user/confirmSendEmail';
import ConfirmDeleteProfile from '../../components/user/confirmDeleteProfile';

export default function ConfigPage() {
  return (
    <Box>
        <UserConfig />
        <Divider my={6} width="40%" borderColor="gray.400" mx="auto" />

        <Flex
          justifyContent={{ base: 'center', md: 'space-between' }}
          alignItems="flex-start"
          flexDirection={{ base: 'column', md: 'row' }} // Column for mobile, row for desktop
          gap={{ base: 6, md: 0 }} // Add space between components in mobile
        >
          <ConfirmDeleteProfile />
          <ConfirmSendEmail />
        </Flex>
    </Box>
  );
}