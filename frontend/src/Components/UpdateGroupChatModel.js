import { ViewIcon } from '@chakra-ui/icons'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    useDisclosure,
    Button,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner,
} from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { useState } from 'react'
import UserBadgeItem from './userAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from './userAvatar/UserListItem'

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, selectedChat, setSelectedChat } = ChatState()
    const [groupChatName, setGroupChatName] = useState()
    const [search, setsearch] = useState()
    const [searchResult, setsearchResult] = useState([])
    const [loadingRename, setLoadingRename] = useState(false)
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }
    const removeUsrFrmGrp = (id) => {
        if (selectedChat.groupAdmin._id !== user._id && user._id !== id) {
            toast({
                title: 'Only Admin can remove Someone',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top'
            })
            return;
        }
        setLoading(true)
        axios.put('http://localhost:1111/api/chat/removemember', {
            chatId: selectedChat._id,
            userId: id
        }, config).then((val) => {
            id === user._id ? setSelectedChat("") : setSelectedChat(val.data)
            setFetchAgain(!fetchAgain)
            fetchMessages()
            setLoading(false)
        }).catch((err) => {
            toast({
                title: "Error Occured!",
                description: err.message,
                status: 'error',
                isClosable: true,
                position: 'bottom-left'
            })
            setLoading(false)
        })
    }

    const handleRename = () => {
        if (!groupChatName) return;
        axios.put('http://localhost:1111/api/chat/rename', { chatId: selectedChat._id, chatName: groupChatName }, config).then((val) => {
            // console.log(val.data)
            setSelectedChat(val.data)
            setFetchAgain(!fetchAgain)
            setLoadingRename(false)
        }).catch((err) => {
            toast({
                title: 'Error Occured',
                description: err.response.data.message,
                status: 'error',
                isClosable: true,
                position: 'bottom'
            })
            setGroupChatName("")
        })
    }
    const handleSearch = (name) => {
        setsearch(name)
        if (name === '')
            return;
        setLoading(true)
        axios.get(`http://localhost:1111/api/user?search=${name}`, config).then((res) => {
            setLoading(false)
            setsearchResult(res.data)
        }).catch((err) => {
            toast({
                title: "Error Occured !",
                description: `Failed to Load Serch Result for ${search}`,
                status: 'error',
                isClosable: true,
                position: 'bottom-left'
            })
            setLoading(false)
        })
    }
    const handleAddUser = (usr) => {
        const data = selectedChat.users.filter((ele) => {
            return usr._id === ele._id
        })
        setLoading(true)
        if (data.length !== 0) {
            toast({
                title: 'User Already Exists',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top'
            })
            setLoading(false)
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Only Admin can add Someone',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top'
            })
            return;
        }
        axios.put('http://localhost:1111/api/chat/addmember', {
            chatId: selectedChat._id,
            userId: usr._id
        }, config).then((val) => {
            setSelectedChat(val.data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        }).catch((err) => {
            toast({
                title: "Error Occured!",
                description: err.response.data.message,
                status: 'error',
                isClosable: true,
                position: 'bottom-left'
            })
            setLoading(false)
        })
    }
    return (
        <>
            <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen}>Open Modal</IconButton>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={'35px'}
                        display={'flex'}
                        justifyContent={'center'}
                    >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w={"100%"} display="flex" flexWrap="wrap" pb={3}>
                            {selectedChat.users.map((u) => {
                                return <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => removeUsrFrmGrp(u._id)}
                                />
                            })}
                        </Box>
                        <FormControl display={'flex'}>
                            <Input placeholder='Chat name' mb={3} value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)} />
                            <Button variant={'solid'} colorScheme='teal' ml='1' isLoading={loadingRename}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add user to group' mb='1'
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ? (
                            <Spinner color='red' size={'lg'} />
                        ) : (
                            searchResult?.slice(0, 4).map((ele) => {
                                return <UserListItem key={ele._id} user={ele} handleFunction={() => handleAddUser(ele)} />
                            })
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={() => removeUsrFrmGrp(user._id)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModel
