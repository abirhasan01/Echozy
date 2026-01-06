import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import AuthContext from "./AuthContext";



const ChatContex = createContext()

export const ChatContexProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const { backendUrl, socket } = useContext(AuthContext);

  // get all user for side bar
  const getUsers = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  // get messages for selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(backendUrl + `/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  // send message to selected userr
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        backendUrl + `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // subscribe to messages for selected user
  const subscribeToMessages = async () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios.put(backendUrl + `/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: prev[newMessage.senderId]
            ? prev[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  // unsubscribe from messages
  const unsubscribeFromMessages = () => {
    if(socket) socket.off("newMessage")
  }

  useEffect(()=> {
    subscribeToMessages()
    return () => unsubscribeFromMessages()
  },[socket, selectedUser])

  const value = {
    messages, getMessages, sendMessage,
    users,
    selectedUser, setSelectedUser,
    getUsers,
    unseenMessages, setUnseenMessages
  };

  return <ChatContex.Provider value={value}>{children}</ChatContex.Provider>;
}
export default ChatContex