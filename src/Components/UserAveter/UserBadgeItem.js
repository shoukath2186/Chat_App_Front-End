
import { Box } from "@chakra-ui/react";

import { CloseIcon } from '@chakra-ui/icons'

import React from 'react'

function UserBadgeItem({user,handleFunction}) {
  return (
    <Box
    px={2}
    py={1}
    borderRadius='lg'
    m={1}
    mb={2}
    color='white'
    fontSize={12}
    backgroundColor="purple"
    cursor='pointer'
    onClick={handleFunction}
    >
      {user.name}
      <CloseIcon m='1' color='black'/>
    
    </Box>
  )
}

export default UserBadgeItem