import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';
import UserBadgeItem from '../userAvatar/UserBadgeItem';

const GroupChatModel = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [gropuChatName, setGroupChatName] = useState();
    const [selectedUsers, setselectedUsers] = useState([]);
    const [search, setsearch] = useState("");
    const [searchResult, setsearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, chats, setChats } = ChatState();
    const toast = useToast()
    const handleSearch = (name) => {
        setsearch(name)
        if (name == '')
            return;
        setLoading(true)
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }
        axios.get(`http://localhost:1111/api/user?search=${name}`, config).then((res) => {
            setLoading(false)
            setsearchResult(res.data)
            // console.log(res.data)
        }).catch((err) => {
            setLoading(false)
            toast({
                title: "Error Occured !",
                description: `Failed to Load Serch Result for ${search}`,
                status: 'error',
                isClosable: true,
                position: 'bottom-left'
            })
        })
    }
    const handleSubmit = () => {
        if (gropuChatName.length == 0 || selectedUsers.length == 0) {
            toast({
                title: 'please fill all the fields',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top'
            })
            return;
        }
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${user.token}`
            }
        }
        axios.post('http://localhost:1111/api/chat/group', {
            name: gropuChatName,
            users: JSON.stringify(selectedUsers.map(u => u._id))
        }, config).then(({ data }) => {
            setChats([data, ...chats])
            onClose()
            toast({
                title: 'New Group ' + gropuChatName,
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top'
            })
        }).catch((err) => {
            toast({
                title: "Error Occured !",
                description: err.response.data,
                status: 'error',
                isClosable: true,
                position: 'bottom-left'
            })
        })
    }
    const DeleteUser = (usrId) => {
        const data = selectedUsers.filter((ele) => {
            return ele._id != usrId
        })
        setselectedUsers(data)
    }
    const handleGroup = (ele) => {
        // if (selectedUsers.includes(ele)) {
        //     toast({
        //         title: 'User Already Added',
        //         status: 'warning',
        //         duration: 2000,
        //         isClosable: true,
        //         position: 'top'
        //     })
        //     return;
        // }
        const data = selectedUsers.filter((usr) => {
            return usr._id === ele._id
        })
        if (data.length != 0) {
            toast({
                title: 'User Already Added',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top'
            })
            return;
        }
        setselectedUsers([...selectedUsers, ele])
    }
    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"35px"}
                        display={"flex"}
                        justifyContent={"center"}
                    >
                        Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={"flex"}
                        flexDir={"column"}
                        alignItems={"center"}
                    >
                        <FormControl>
                            <Input placeholder='Chat Name' mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add Users' mb={3} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        <Box
                            display={'flex'}
                            width="100%"
                            flexWrap="wrap"
                        >
                            {
                                selectedUsers?.map((ele) => {
                                    return <UserBadgeItem key={ele._id} user={ele} handleFunction={() => DeleteUser(ele._id)} />
                                })
                            }
                        </Box>
                        {loading ? (
                            <Spinner color='red' />
                        ) : (
                            searchResult?.slice(0, 4).map((ele) => {
                                return <UserListItem key={ele._id} user={ele} handleFunction={() => handleGroup(ele)} />
                            })
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit} >
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModel