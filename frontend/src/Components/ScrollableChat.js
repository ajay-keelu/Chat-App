import React, { useEffect } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isSameSender, isSameSenderMargin, isSameUser, islastMessage } from '../config/chatLogics'
import { ChatState } from '../Context/ChatProvider'
import { Avatar, Tooltip } from '@chakra-ui/react'

const ScrollableChat = ({ messages }) => {
    const { user, selectedChat, notification, setNotification } = ChatState()
    useEffect(() => {
        const filteredNotifications = notification.filter((ele) => ele.chat._id !== selectedChat._id)
        setNotification(filteredNotifications)
    }, [])
    return (
        <ScrollableFeed>
            {messages && messages.map((m, i) => {
                return (
                    <div style={{
                        display: 'flex', width: '100%',
                        justifyContent: `${m.sender._id === user._id ? 'flex-end' : 'flex-start'}`
                    }} key={m._id}>
                        {(isSameSender(messages, m, i, user._id) || islastMessage(messages, i, user._id)) ? (
                            <Tooltip
                                label={m.sender.name}
                                placement='bottom-start'
                                hasArrow
                            >
                                <Avatar
                                    mt='7px'
                                    mr={'1'}
                                    size={'sm'}
                                    cursor={'pointer'}
                                    name={m.sender.name}
                                    src={m.sender.picture}
                                />
                            </Tooltip>
                        ) : <span style={{ width: '35px' }}></span>}
                        <span
                            style={{
                                background: `${m.sender._id === user._id ? '#bee3f8' : '#b9f5d0'}`,
                                borderRadius: '20px',
                                padding: '5px 15px',
                                maxWidth: '75%',
                                marginTop: `${m.sender._id === user._id ? '3px' : '8px'}`
                            }}
                        >
                            {m.content}
                        </span>
                    </div>
                )
            })}
        </ScrollableFeed >
    )
}

export default ScrollableChat
