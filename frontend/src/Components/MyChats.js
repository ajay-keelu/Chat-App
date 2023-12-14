import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from './ChatLoading'
import { getSender } from '../config/chatLogics'
import GroupChatModel from './ChatPages/GroupChatModel'
const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState()
  const [loggedUser, setLoggedUser] = useState()
  const toast = useToast()
  const fetchChats = () => {
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${user.token}`
      }
    }
    axios.get('http://localhost:1111/api/chat', config).then((val) => {
      setChats(val.data);
      // console.log('data  bro', val.data)
    }).catch((error) => {
      toast({
        title: 'Error Occured',
        description: error.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top'
      })
      return;
    })
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats()
  }, [fetchAgain])


  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={'column'}
      alignItems={"center"}
      p={3}
      bg={'white'}
      width={{ base: "100%", md: "30%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "20px", md: "30px" }}
        display={"flex"}
        justifyContent={"space-between"}
        width={"100%"}
        alignItems={"center"}
      >
        Chat
        <GroupChatModel>
          <Button
            display={"flex"}
            fontSize={{ base: "12px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg={"#f8f8f8"}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {
          chats ? (
            <Stack overflowY={"scroll"}>
              {
                chats.map((ele) => {
                  return <Box
                    onClick={() => setSelectedChat(ele)}
                    cursor={"pointer"}
                    bg={selectedChat === ele ? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat === ele ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius={"lg"}
                    key={ele._id}
                  >
                    <Text>
                      {
                        !ele.isGroupChat ? getSender(loggedUser, ele.users) : ele.chatName
                      }
                    </Text>
                  </Box>
                })
              }
            </Stack>
          ) : (
            <ChatLoading />
          )
        }
      </Box>
    </Box>
  )
}

export default MyChats
