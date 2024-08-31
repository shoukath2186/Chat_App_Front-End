import React, { useEffect, useState } from 'react'
import { ChatState } from '../ContextApi/context'
import { useToast, Box, Button, Stack } from '@chakra-ui/react'
import axios from 'axios'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from './ChatLoading';
function MyChat() {
  const [logUser, setLogUser] = useState()

  const { user, setUser, selectChat, setSelectChat, chats, setChats } = ChatState()

  const toast = useToast()

  const fetchUserData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get('/api/chat', config);

      setChats(data)
      console.log(data);

    } catch (error) {
      toast({
        title: 'Error Occured!.',
        description: "fiald to load the chats",
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true,
      })
    }
  }
  useEffect(() => {
    setLogUser(JSON.parse(localStorage.getItem('userInfo')))
    fetchUserData()
  }, [])

  return (
    <Box
      display={{ base: selectChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px", }}
        fontFamily='inherit'
        display='flex'
        w="100%"
        justifyContent='space-between'
        alignItems='center'
      >
        My Chat
        <Button
          display="flex"
          fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          rightIcon={<AddIcon />}
        >
          New Group Chat
        </Button>
      </Box>
      <Box
        display='flex'
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h='100%'
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflow="scroll">
           {chats.map((chat)=>{
            <Box
            onClick={() => setSelectChat(chat)}
            cursor="pointer"
            bg={selectChat===chat?"#38B2AC":"#E8E8E8"}
            color={selectChat==chat?"white":"black"}
            px={3}
            py={2}
            borderRadius="lg"
            key={chat._id}
          >
          </Box>
           })}
            
          </Stack>
        ) : (
          <ChatLoading />
        )}

      </Box>


    </Box>
  )
}

export default MyChat