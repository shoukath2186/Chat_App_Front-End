import { Box } from '@chakra-ui/react'
import { ChatState } from '../ContextApi/context'
import React from 'react'
import SideDrawer from '../Components/Micelleneous/SideDrawer'
import ChatBox from '../Components/ChatBox'
import MyChat from '../Components/MyChat'

function ChatPage() {

  const { user } = ChatState()


  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer />}
      <Box 
      display="flex" 
      justifyContent="space-between" 
      width="100%" 
      height="91.5vh" 
      padding="10px" 
      >
        {user && <MyChat />}
        {user && <ChatBox />}
      </Box>
    </div>
  )
}

export default ChatPage