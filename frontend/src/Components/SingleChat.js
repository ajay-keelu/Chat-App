import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/chatLogics'
import ProfileModel from './ChatPages/ProfileModel'
import UpdateGroupChatModel from './UpdateGroupChatModel'
import axios from 'axios'
import typ from './Animation/typing.gif'
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client'
const ENDPOINT = 'http://localhost:1111'
var socket, selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()
    const [messages, setMessags] = useState([])
    const [loading, setLoading] = useState()
    const [socketConnected, setSocketConnected] = useState()
    const [newMessage, setNewMessage] = useState()
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const toast = useToast()
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
        }
    }
    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit('setup', user)
        socket.on('connected', () => {
            setSocketConnected(true)
        })
        socket.on('typing', () => setIsTyping(true))
        socket.on('stop typing', () => setIsTyping(false))
    }, [])
    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification])
                    setFetchAgain(!fetchAgain)
                }
            } else {
                setMessags([...messages, newMessageReceived])
            }
        })
    })
    const sendMessage = (event) => {
        if (event.key === 'Enter' && newMessage) {
            socket.emit('stop typing', selectedChat._id)
            setNewMessage("")
            axios.post('http://localhost:1111/api/messages', {
                content: newMessage, chatId: selectedChat._id
            }, config).then(({ data }) => {
                // console.log(data)
                socket.emit("new message", data)
                setMessags([...messages, data])
                // console.log(messages)
                // console.log('data', data)
            }).catch((err) => {
                toast({
                    title: 'Error Occured',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: 'top'
                })
            })
        }
    }

    const fetchMessages = () => {
        if (!selectedChat) return;
        setLoading(true)
        axios.get(`http://localhost:1111/api/messages/${selectedChat._id}`, config).then(({ data }) => {
            setMessags(data)
            setLoading(false)
            socket.emit("join chat", selectedChat._id)
        }).catch((err) => {
            toast({
                title: 'Error Occured',
                description: 'Failed to load Message',
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top'
            })
        })
    }
    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat
    }, [selectedChat])


    const typingHandler = (e) => {
        setNewMessage(e.target.value)
        if (!socketConnected) return;
        if (!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat._id)
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime
            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id)
                setTyping(false)
            }
        }, timerLength)

    }
    return (<>{
        selectedChat ? <>
            <Text
                fontSize={{ base: '28px', md: '30px' }}
                pb={3}
                px={2}
                w={'100%'}
                display={'flex'}
                justifyContent={{ base: 'space-between' }}
                alignItems={'center'}
            >
                <IconButton
                    display={{ base: 'flex', md: 'none' }}
                    icon={<ArrowBackIcon />}
                    onClick={() => setSelectedChat("")}
                />
                {
                    !selectedChat.isGroupChat ? (<>
                        {getSender(user, selectedChat.users)}
                        <ProfileModel user={getSenderFull(user, selectedChat.users)} />
                    </>) : (
                        <>
                            <div style={{ textTransform: 'capitalize' }}>{selectedChat.chatName}</div>
                            <UpdateGroupChatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}
                                fetchMessages={fetchMessages}
                            />
                        </>
                    )
                }
            </Text>
            <Box
                display={'flex'}
                flexDir={'column'}
                justifyContent={'flex-end'}
                p={3}
                bg={'#e8e8e8'}
                w={'100%'}
                h={'100%'}
                borderRadius={'lg'}
                overflowY={'hidden'}
            >
                {loading ? <>
                    <Spinner color='teal' size={'xl'} w={'20'} h='20' alignSelf={'center'} margin={'auto'} />
                </> :
                    <div className='messages-chat'>
                        <ScrollableChat messages={messages}  />
                    </div>
                }
                <FormControl onKeyDown={sendMessage} isRequired mt='3' position={'relative'}>
                    {isTyping ? <span style={{ width: 'fit-content' }}><img style={{ position: 'absolute', top: '-100%', zIndex: '11111' }} src={typ} width={'100px'} /></span> : <></>}
                    <Input variant={'filled'} bg={'lightgray'} placeholder='Enter Message' value={newMessage} onChange={typingHandler} />
                </FormControl>
            </Box>
        </> : (
            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                h={'100%'}
            >
                <Text fontSize={'3xl'} pb={3}  >
                    Click on User to Start Chatting
                </Text>
            </Box>
        )
    }</>)
}

export default SingleChat
