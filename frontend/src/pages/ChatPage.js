import React from "react";
// import axios from 'axios'
const ChatPage = () => {
  return (
    <div>
      {/* <button onClick={() => fetchDeatails()}> click</button> */}
      <h1>ChatPage {localStorage.getItem("userInfo")}</h1>
    </div>
  );
};

export default ChatPage;
