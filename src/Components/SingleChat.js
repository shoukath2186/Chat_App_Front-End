import React, { useEffect, useState } from 'react'
import { ChatState } from '../ContextApi/context'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from './Config/ChatLogic';
import ProfileModal from './Micelleneous/ProfileModal';
import UpdateGroupChatModal from './Micelleneous/UpdateGroupChatModal';
import axios from 'axios';
import Lottie from 'react-lottie'
import ScrollebleChat from './ScrollebleChat';
import './Style.css'
import io from 'socket.io-client'
import animationData from '../Loading/loading.json'

const ENPOINT = 'http://localhost:3333'
var socket, selectChatCompare;

function SingleChat({ fetching, setFetching }) {

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState('');
    const [chenge, setChenge] = useState(true);
    const [socketConnected, setSocketConnected] = useState(false);

    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const toast = useToast()


    const { user, selectChat, setSelectChat, notification, setNotification } = ChatState()

    const fetchMessages = async () => {


        if (!selectChat) {
            return
        }
        try {

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/message/${selectChat._id}`, config)



            setMessages(data)
            setLoading(false)
            socket.emit('join chat', selectChat._id);

        } catch (error) {
            console.log(error);

            toast({
                title: 'Error Occured!.',
                description: "Faild to load the Message.",
                status: 'error',
                position: 'top',
                duration: 5000,
                isClosable: true,
            })

        }
    }

    useEffect(() => {
        socket = io(ENPOINT)
        socket.emit("setup", user)
        socket.on('connected', () => setSocketConnected(true));
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));
    }, [])

    useEffect(() => {
        setLoading(true)
        fetchMessages()
        selectChatCompare = selectChat;
    }, [selectChat])

    useEffect(() => {
        socket.on("message recieved", (newMessageReceived) => {

           

            if (!selectChatCompare || selectChatCompare._id !== newMessageReceived.chat._id) {

              
                   
                   
                   
                if (!notification.includes(newMessageReceived)) {

                    setNotification([newMessageReceived, ...notification]);

                    setFetching(!fetching);
                    console.log('finish',newMessageReceived);
                    
                }


            } else {
                setMessages([...messages, newMessageReceived]);
            }
        });

    })


    const sendMessage = async (event) => {
        socket.emit("stop typing", selectChat._id);
        if (event.key === "Enter" && newMessage.trim()) {
            try {
                const config = {
                    headers: {
                        'Content-type': "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                const { data } = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectChat._id
                }, config)

                socket.emit("new message", data);

                setChenge(v => !v)
                setMessages([...messages, data])
                setNewMessage('')

            } catch (error) {

            }
        }
    }


    const typingHandile = (e) => {

        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectChat._id);
        }
        
        let lastTypingTime = new Date().getTime();

        var timeLength = 3000;

        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= 2000 && typing) {

                socket.emit("stop typing", selectChat._id);

                setTyping(false)
            }

        }, timeLength);
    }




    return (
        <>
            {selectChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w='100%'
                        fontFamily='revert'
                        display='flex'
                        justifyContent={{ base: "space-between" }}
                        alignItems='center'
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectChat('')}
                        >
                        </IconButton>
                        {!selectChat.isGroupChat ? (
                            <>
                                {getSender(user, selectChat.users).toUpperCase()}
                                <ProfileModal user={getSenderFull(user, selectChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal fetchAgain={fetching} setFetchAgain={setFetching} />
                            </>
                        )}

                    </Text>
                    <Box
                        display='flex'
                        flexDir="column"
                        justifyContent='flex-end'
                        p={3}
                        bg="#e8e8e8"
                        w="100%"
                        h="100%"
                        borderRadius='lg'
                        overflowY='auto'
                    >
                        {loading ? (
                            <Spinner size='xl' w={20} h={20} alignSelf='center' margin="auto" />
                        ) : (
                            <div className='messages'>
                                <ScrollebleChat message={messages} />
                            </div>
                        )}
                        
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        {isTyping ? <>
                            <Lottie
                                options={defaultOptions}
                                height={80} 
                                width={90}  
                                style={{marginLeft:'2px'}} 
                            />
                        </> : null}

                            <Input
                                variant="filled"
                                bg="#E0E0E0"
                                placeholder='Enter a message'
                                onChange={typingHandile}
                                value={newMessage}
                            />

                        </FormControl>
                    </Box>
                </>

            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="-moz-initial">
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat