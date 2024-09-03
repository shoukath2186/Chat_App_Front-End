import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

function ProfileModal({ user, children }) {
    const { isOpen, onOpen, onClose } = useDisclosure();



    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children} </span>
            ) : (
                <IconButton d={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />
            )}
         
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='40px'
                        fontFamily='initial'
                        display='flex'
                        justifyContent='center'
                    >{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="40px"
                        textAlign="center"  
                        height="100%"       
                    >
                        <Image
                            borderRadius="full"
                            boxSize="150px"
                            src={user.pic}
                            alt={user.name}
                            marginBottom="20px" // Adds space between the image and the text
                        />
                        <Text
                            fontSize={{ base: '28px', md: '30px' }}
                            fontFamily="initial"
                        >
                            Email: {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal