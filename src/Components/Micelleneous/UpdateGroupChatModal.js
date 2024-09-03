import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    IconButton,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner,
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../../ContextApi/context'
import UserBadgeItem from '../UserAveter/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAveter/UserListItem';

function UpdateGroupChatModal({ fetchAgain, setFetchAgain }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)
    // const [selectdUsers, setSelectdUsers] = useState()

    const toast = useToast()
    const { user, selectChat, setSelectChat } = ChatState();

    async function removeUser(user1) {
        if (selectChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only admins can remove someone.",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
            return
        }

        try {
            setLoading(true)

            const config = {  
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put("/api/chat/groupremove", {
                chatId: selectChat._id,
                userId: user1._id
            }, config)
            console.log(1111, selectChat);

            console.log(1234, data);

            setSelectChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false)


        } catch (error) {
            console.log(error);

            toast({
                title: "Error Occured!.",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
            setLoading(false)
        }

    }

    const handleRename = async () => {
        if (!groupChatName.trim()) return

        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put("/api/chat/rename", {
                chatId: selectChat._id,
                chatName: groupChatName
            }, config)
            setSelectChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false)

        } catch (error) {
            toast({
                title: 'Error Occured.',
                description: error.message,
                status: 'error',
                position: 'top',
                duration: 5000,
                isClosable: true,
            })
            setRenameLoading(false);
        }
    }

    const handileGroup = async (user1) => {

        if (selectChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: "User Already in Group",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
            return
        }
        if (selectChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone.",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
            return
        }

        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put("/api/chat/groupadd", {
                chatId: selectChat._id,
                userId: user1._id
            }, config)

            

            setSelectChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false)


        } catch (error) {
            toast({
                title: "Error Occured!.",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
            setLoading(false)
        }



    }

    const hadilSearch = async (query) => {

        if (!query.trim()) { return }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }


            const { data } = await axios.get(`/api/user?search=${query}`, config)


            setSearchResult(data)

            setLoading(false)

        } catch (error) {
            toast({
                title: 'Error the fetching the User.',
                description: error.message,
                status: 'error',
                position: 'top',
                duration: 5000,
                isClosable: true,
            })
        }


    }

    const handileRemove = async (user1) => {

        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put("/api/chat/groupremove", {
                chatId: selectChat._id,
                userId: user1._id
            }, config)

            

            setSelectChat();
            setFetchAgain(!fetchAgain);
            setLoading(false)
            // onClose()

        } catch (error) {
            toast({
                title: "Error Occured!.",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
            setLoading(false)
        }
        
    }

    return (
        <>
            <IconButton display='flex' icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectChat.chatName.toUpperCase()}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display='flex' w='100%' flexWrap='wrap'>
                            <Box px={2} py={1} borderRadius='lg'  m={1} mb={2} color='white' fontSize={12} backgroundColor="purple" cursor='pointer'>
                                {user.name}  
                            </Box>
                            {selectChat.users.filter((value) => value._id !== user._id).map((user) => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => removeUser(user)}
                                />
                            ))}
                        </Box>

                        <FormControl display='flex'>
                            <Input placeholder={selectChat.chatName} mb={5} onChange={(e) => setGroupChatName(e.target.value)}>
                            </Input>
                            <Button variant='solid' colorScheme='teal' ml={1} isLoading={renameLoading} onClick={handleRename}>
                                Update
                            </Button>
                        </FormControl>
                        <FormControl >
                            <Input placeholder='Add User to group' mb={5} onChange={(e) => hadilSearch(e.target.value)} />

                        </FormControl>
                        {loading ? (<Spinner />) : (
                            searchResult?.slice(0, 4).map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handileGroup(user)}
                                />
                            ))
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={()=>handileRemove(user)}>
                           Leave Group
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default UpdateGroupChatModal