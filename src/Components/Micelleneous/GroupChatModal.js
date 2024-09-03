

import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../ContextApi/context'
import axios from 'axios'
import UserListItem from '../UserAveter/UserListItem'
import UserBadgeItem from '../UserAveter/UserBadgeItem'

function GroupChatModal({ children }) {
     
    const [groupChatName, setGroupChatName] = useState('')
    const [selectdUsers, setSelectedUsers] = useState([])
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false) 

     

    const { isOpen, onOpen, onClose } = useDisclosure()

    const toast = useToast()

    const { user, chats, setChats } = ChatState();

    const handileSearch = async (query) => {
       
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
            setLoading(false)
        }

    }

    const handileSubmit =async () => {

        if(!groupChatName.trim()||!selectdUsers){
            toast({
                title: 'Please fill all the feilds  .',
                status: 'warning',
                position: 'top',
                duration: 5000,
                isClosable: true, 
            })
            return
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data}=await axios.post('/api/chat/group',{
                name:groupChatName,
                users:JSON.stringify(selectdUsers.map((u)=>u._id))
            },config)

          
            setChats([data,...chats])
            toast({
                title: 'New Group Chat Created!.',
                status: 'success',
                position: 'top',
                duration: 5000,
                isClosable: true, 
            })

            setGroupChatName('')
            setSelectedUsers([])
            setSearchResult([])
            onClose()

            
        } catch (error) {
            console.log(1212,error);
            toast({
                title: 'Requst faild!.',
                description:error.response.data,
                status: 'error',
                position: 'top',
                duration: 5000,
                isClosable: true, 
            })
        }

    }
    const handileDelete = (user) => {
       setSelectedUsers(selectdUsers.filter(v=>v._id!==user._id))
    }

    const handileGroup = (userToAdd) => {
        if (selectdUsers.includes(userToAdd)) {
            toast({
                title: "User Already added",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
            return
        }
        setSelectedUsers([...selectdUsers, userToAdd])
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="revert"
                        display='flex'
                        justifyContent='center'
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDirection="column" alignItems='center'>
                        <FormControl>
                            <Input placeholder='Group Name' mb={5} onChange={(e) => setGroupChatName(e.target.value)}>
                            </Input>
                            <Input placeholder='Add User' mb={5} onChange={(e) => handileSearch(e.target.value)}>
                            </Input>
                            <Box display="flex" w='100%' flexWrap='wrap'>
                            {selectdUsers.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handileDelete(u)}
                                />
                            ))}
                            </Box>

                            {loading ? (<div>Loading...</div>) : (
                                searchResult?.slice(0, 4).map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handileGroup(user)}
                                    />
                                ))
                            )}
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handileSubmit} isLoading={loading}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal