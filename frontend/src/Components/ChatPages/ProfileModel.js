import { ViewIcon } from '@chakra-ui/icons'
import {
    Button,
    IconButton,
    Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure
} from '@chakra-ui/react'
import React from 'react'
// import { ChatState } from '../../Context/ChatProvider'

const ProfileModel = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    // const { user } = ChatState()
    return (
        <div>
            {children ? <span onClick={onOpen}>{children}</span> :
                <IconButton onClick={onOpen} display={{ base: 'flex' }} icon={<ViewIcon />} />}
            <Modal size={'lg'} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={'35px'}
                        fontFamily={'sans-serif'}
                        display='flex'
                        justifyContent={'center'}
                    >{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        flexDirection={'column'}
                    >
                        <Image src={user.picture} borderRadius={'full'} boxSize={'150px'} alt={`${user.name} image`} />
                        <Text fontSize={{ base: '20px', md: '25px' }} fontFamily='Roboto'>
                            Email : {user.email}
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ProfileModel