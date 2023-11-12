import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuItem, MenuList, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { ChatState } from '../../Context/ChatProvider'
import ProfileModel from './ProfileModel'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ChatLoading from '../ChatLoading'
import UserListItem from '../userAvatar/UserListItem'
const SideDrawer = () => {
    // const { user } = ChatState()
    const navigate = useNavigate()
    const [search, setSearch] = useState()
    const [searchResult, setSearchResult] = useState()
    const [loading, setLoading] = useState()
    const [loadingChat, setLoadingChat] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, setSelectedChat } = ChatState()
    const Logout = () => {
        localStorage.removeItem('userInfo')
        navigate('/')
    }
    const toast = useToast();
    const handleSearch = () => {
        setLoading(true);
        if (!search) {
            toast({
                title: 'Please Enter Something',
                status: 'warning',
                duration: 1000,
                isClosable: true,
                position: 'top-left'
            })
            setLoading(false)
            return;
        }
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }
        axios.get(`http://localhost:1111/api/user/?search=${search}`, config).then((res) => {
            setSearchResult(res.data)
            setLoading(false)
        }).catch((err) => {
            toast({
                title: 'Error Occured',
                status: 'error',
                duration: '2000',
                description: err.message,
                isClosable: true,
                position: 'bottom-left'
            })
            setLoading(false)
        })
    }
    const accessChat = (userId) => {
        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`
            }
        }
        setLoadingChat(true)
        axios.post('http://localhost:1111/api/chat', { userId }, config).then((res) => {
            setSelectedChat(res.data)
            setLoadingChat(false)
            onClose()
        }).catch((err) => {
            toast({
                title: 'Error! Fetching Chat',
                description: err.message,
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top"
            })
        })
    }
    return (
        <>
            <Box
                p='5px 10px'
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bg='white'
                w='100%'
                borderWidth={'5px'}
            >
                <Tooltip label='Search Users' hasArrow placement='bottom-end'>
                    <Button variant='ghost' onClick={onOpen}>
                        <FaSearch /> <Text p={'10px'} display={{ base: 'none', md: 'flex' }}>  Search User </Text>
                    </Button>
                </Tooltip>
                <Text fontSize={'2xl'} letterSpacing={'1px'} fontFamily={'monospace'} textTransform={'uppercase'}>
                    Chat Rambola
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize={'2xl'} m={1} />
                        </MenuButton>
                        {/* <MenuList></MenuList> */}
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} >
                            <Avatar size={'sm'} cursor={'pointer'} name={user.name} src={user.picture} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModel user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModel>
                            <MenuItem onClick={Logout}> Logout </MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer isOpen={isOpen} onClose={onClose} placement='left'>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth={'1px'}>
                        Search User
                    </DrawerHeader>
                    <DrawerBody>
                        <Box display={'flex'} pb={2}>
                            <Input
                                placeholder="Search by name/email "
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch} isLoading={loading}>Go</Button>
                        </Box>
                        {loading ? <ChatLoading /> : (
                            searchResult?.map((user) => {
                                return <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            })
                        )}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}


export default SideDrawer
