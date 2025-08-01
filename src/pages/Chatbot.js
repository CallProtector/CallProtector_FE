import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSend } from 'react-icons/fi';
import { FaPlus } from "react-icons/fa";
import ChatListModal from '../components/Modal/ChatListModal';

const Container = styled.div`
  display: flex;
  height: 100%;
`;

const Sidebar = styled.div`
  width: 300px;
  border-right: 1px solid #ddd;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
`;

const Tabs = styled.div`
  display: flex;
  margin-top: 20px;
  border-bottom: 1px solid #ccc;
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 13px 13px 0 0;
  background: ${({ active }) => (active ? '#fff' : 'transparent')};
  border: none;
  border-bottom: ${({ active }) => (active ? '3px solid #5C24AF' : 'none')};
  cursor: pointer;
  color: ${({ active }) => (active ? '#000' : '#888')};
`;

const SidebarActionButton = styled.button`
  margin-top: 16px;
  padding: 12px;
  font-size: 17px;
  background-color: #F3F6FE;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
  border-bottom: 1px solid #efefef;

  &:hover {
    background-color: #efefef;
  }
`;

const ChatList = styled.div`
  margin-top: 16px;
`;

const ChatItem = styled.div`
  padding: 10px;
  margin-bottom: 5px;
  background-color: ${({ selected }) => (selected ? '#eaeaea' : '#fff')};
  border-radius: 4px;
  cursor: pointer;
  font-size: 17px;
  transition: background 0.2s;
  &:hover {
    background-color: #efefef;
  }
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: 30px 40px 10px 40px;
  border-bottom: 1px solid #ddd;
  font-size: 24px;
`;

const ChatTitle = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
`;

const CallLogButton = styled.button`
  padding: 8px 13px;
  font-weight: bold;
  background-color: #fff;
  border: 2px solid #5C24AF;
  border-radius: 14px;
  &:hover {
    background-color: #efefef;
  }
`;

const ChatDate = styled.div`
  padding-bottom: 6px;
  font-size: 13px;
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ChatBubble = styled.div`
  max-width: 70%;
  padding: 15px;
  border-radius: 8px;
  background-color: ${({ fromUser }) => (fromUser ? '#ffe9ab' : '#fff')};
  align-self: ${({ fromUser }) => (fromUser ? 'flex-end' : 'flex-start')};
  margin-bottom: 12px;
  white-space: pre-wrap;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const EmptyMessage = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  color: #777;
`;

const InputArea = styled.div`
  display: flex;
  padding: 40px;
`;

const InputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 50px 15px 20px;
  border-radius: 25px;
  border: 1px solid #ccc;
  font-size: 15px;
`;


const SendButton = styled.button`
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #5C24AF;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Chatbot = () => {
  const [activeTab, setActiveTab] = useState('일반');
  const [showModal, setShowModal] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [chatMap, setChatMap] = useState({});

  const startNewChat = () => {
    const newId = `chat-${Date.now()}`;
    setChatSessions((prev) => [...prev, newId]);
    setChatMap((prev) => ({ ...prev, [newId]: [] }));
    setSelected(newId);
  };

  const messages = selected ? chatMap[selected] || [] : [];

  return (
    <Container>
      <Sidebar>
        <Tabs>
          <Tab active={activeTab === '일반'} onClick={() => setActiveTab('일반')}>일반</Tab>
          <Tab active={activeTab === '상담별'} onClick={() => setActiveTab('상담별')}>상담별</Tab>
        </Tabs>

        {activeTab === '일반' ? (
          <SidebarActionButton onClick={startNewChat}>
            <FaPlus size={14} /> 새로운 채팅
          </SidebarActionButton>
        ) : (
          <SidebarActionButton onClick={() => setShowModal(true)}>
            <FaPlus size={14} /> 상담 내역 불러오기
          </SidebarActionButton>
        )}

        {showModal && <ChatListModal onClose={() => setShowModal(false)} />}

        <ChatList>
          {chatSessions.map((sessionId) => (
            <ChatItem
              key={sessionId}
              selected={selected === sessionId}
              onClick={() => setSelected(sessionId)}
            >
              {sessionId}
            </ChatItem>
          ))}
        </ChatList>
      </Sidebar>

      <ChatArea>
        {selected && (
          <ChatHeader>
            <ChatTitle>
              {selected}
              <CallLogButton style={{ visibility: activeTab === '상담별' ? 'visible' : 'hidden' }}>
                통화 내용 보기
              </CallLogButton>
            </ChatTitle>
            <ChatDate>2025년 3월 19일</ChatDate>
          </ChatHeader>
        )}

        <ChatBody>
          {messages.length === 0 ? (
            <EmptyMessage>상담 중 불편한 상황이 발생하였나요?</EmptyMessage>
          ) : (
            messages.map((msg, idx) => (
              <ChatBubble key={idx} fromUser={msg.fromUser}>
                {msg.text}
              </ChatBubble>
            ))
          )}
        </ChatBody>

        <InputArea>
          <InputWrapper>
            <Input placeholder="메시지를 입력하세요" />
            <SendButton>
              <FiSend size={24} />
            </SendButton>
          </InputWrapper>
        </InputArea>
      </ChatArea>
    </Container>
  );
};

export default Chatbot;
