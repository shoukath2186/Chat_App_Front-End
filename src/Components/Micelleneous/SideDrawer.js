import React, { useState } from 'react'
import { Avatar, Box, useToast, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, useDisclosure, Spinner } from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../../ContextApi/context';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAveter/UserListItem';

function SideDrawer() {
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()
    

    const { isOpen, onOpen, onClose } = useDisclosure()
    //chats,setChats
    const { user,setSelectChat,chats,setChats } = ChatState()

    const history = useHistory()

    function LogoutUser() {
        localStorage.removeItem('userInfo');
        history.push('/')
    }
    const toast = useToast()


    async function handleSearch() {

        if (!search.trim()) {
            toast({
                title: 'Please Enter something in Search.',
                status: 'warning',
                position: 'top',
                duration: 5000,
                isClosable: true,
            })
            return
        }
        setLoading(true)

        


        try {
           

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }


            const { data } = await axios.get(`/api/user?search=${search}`, config)
            setLoading(false)
            setSearchResult(data)
           

        } catch (error) {
           

            console.log(error.message);
            setLoading(false)
        }
        

    }

    const accessChat=async(userId)=>{
          try {
            setLoadingChat(true);
            const config = {
                headers: {
                    'Content-type':"application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data}=await axios.post("/api/chat",{userId},config)

            if(!chats.find((c)=>c._id===data._id)) setChats({data,...chats})
           
            setSelectChat(data)
            setLoadingChat(false);
            onClose();

          } catch (error) {
            console.log(error.message);
            
            toast({
                title: 'Error the fetching the chat.',
                description:error.message,
                status: 'warning',
                position: 'top',
                duration: 5000,
                isClosable: true,
            })
          }
    }

    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white" 
                width="100%"
                padding="5px 10px"
                borderWidth="1px"   >

                <Tooltip label="Search User to Chat" hasArrow placement='bottom-end'>

                    <Button variant='ghost' onClick={onOpen}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                        <Text d={{ base: "none", nd: "flex" }} px="4">
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize='2xl' fontFamily='initial'>
                    WhatsApp
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize='2xl' />
                        </MenuButton>
                    </Menu>
                    <Menu> 
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={LogoutUser}>Log Out</MenuItem>

                        </MenuList>
                    </Menu>
                </div>

            </Box>
            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth='1px'>Search User</DrawerHeader>
                    <DrawerBody>
                        <Box display='flex' pb={2}>
                            <Input
                                placeholder='Search by email or name.'
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? (<ChatLoading />) : (searchResult.map((user) => (
                            <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={() => accessChat(user._id)}
                            />
                        )))}
                        {searchResult.length==0&& <span>No Result</span>}
                        {loadingChat &&<Spinner ml='auto' display="flex"/>}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer