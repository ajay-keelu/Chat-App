import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Components/ChatPages/SideDrawer";
import MyChats from "../Components/MyChats";
import ChatArea from "../Components/ChatArea";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false)
  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer />}
      <Box display='flex' justifyContent='space-between' w='100%' h='90vh' p='10px'>
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatArea fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default ChatPage;
