import { Box } from '@chakra-ui/react'
import React from 'react'

import  {ChatState} from '../ContextApi/context'
import SingleChat from './SingleChat'

function ChatBox({fetching,setFetching}) {
   const {selectChat}=ChatState()

   





  return (
   <Box
   display={{base:selectChat?"flex":"none" ,md:'flex'}}
   alignItems="center"
   flexDir='column'
   p={3}
   bg="white" 
   borderRadius="lg"
   w={{base:'100%',md:"68%"}}
   borderWidth="1px"
   >
     <SingleChat fetching={fetching} setFetching={setFetching} />
   </Box>
  )
}

export default ChatBox