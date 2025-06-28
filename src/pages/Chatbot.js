import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSend } from 'react-icons/fi';

const Container = styled.div`
  display: flex;
  height: 100vh;
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
  border-bottom: ${({ active }) => (active ? '3px solid #7a5af8' : 'none')};
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
  border: 2px solid #7a5af8;
  border-radius: 14px;
  &:hover {
    background-color: #efefef;
  }
`
const Date = styled.div`
  padding-bottom: 6px;
  font-size: 13px;
`
const ChatBody = styled.div`
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ChatBubble = styled.div`
  max-width: 60%;
  padding: 15px;
  border-radius: 8px;
  background-color: ${({ fromUser }) => (fromUser ? '#ffe9ab' : '#fff')};
  align-self: ${({ fromUser }) => (fromUser ? 'flex-end' : 'flex-start')};
  margin-bottom: 12px;
  white-space: pre-wrap;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
  color: #7a5af8;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Chatbot = () => {
  const [selected, setSelected] = useState('D250319-06');
  const [activeTab, setActiveTab] = useState('일반');

  const [messages] = useState([
    {
      fromUser: false,
      text:
        `안녕하세요 000님, 방금 상담 중 고객으로부터 폭언과 부당한 요구를 받으셨네요. 많이 힘드셨을 것 같아요. 관련 법률과 대응 방법을 안내해드릴게요.\n\n` +
        `📜 적용 가능한 법률\n` +
        `▶ 형법 제311조(모욕죄): 상대방을 공개적으로 모욕할 경우 적용될 수 있습니다.\n` +
        `▶ 형법 제307조(명예훼손죄): 상담원의 명예를 훼손하는 발언이 포함된 경우 성립 가능성이 있습니다.\n` +
        `▶ 형법 제314조(업무방해죄): 지속적인 폭언으로 인해 정상적인 업무 수행이 방해된 경우 적용될 수 있습니다.\n\n` +
        `⚖️ 대응 방법:\n` +
        `1. 사내 대응\n` +
        `▶ 해당 상담 기록을 기반으로 내부 신고 절차를 진행할 수 있습니다.\n` +
        `▶ 추가적인 고객 응대를 피할 수 있도록 관련 부서에 요청 가능합니다.\n` +
        `2. 법적 조치\n` +
        `▶ 고객의 폭언이 지속되었거나 협박이 포함되었다면, 법적 대응(내용 증명 발송, 경찰 신고 등)을 고려할 수 있습니다.\n` +
        `▶ 필요하다면 변호사 상담을 연결해드릴 수도 있습니다.\n\n` +
        `추가적으로 도움이 필요하시면 언제든 말씀해주세요!`
    },
    {
      fromUser: true,
      text: '고객이 저에게 무례했습니다. 대화 녹음도 있고, 법률적으로 이걸 대응할 수 있는 방법도 포함해 도움을 요청하고 싶어요.'
    }
  ]);

  return (
    <Container>
      <Sidebar>
        <Tabs>
          <Tab active={activeTab === '일반'} onClick={() => setActiveTab('일반')}>일반</Tab>
          <Tab active={activeTab === '상담별'} onClick={() => setActiveTab('상담별')}>상담별</Tab>
        </Tabs>

        {activeTab === '일반' ? (
          <SidebarActionButton onClick={() => alert('새 채팅 시작')}>
            + 새로운 채팅
          </SidebarActionButton>
        ) : (
          <SidebarActionButton onClick={() => alert('상담 내역 불러오기')}>
            + 상담 내역 불러오기
          </SidebarActionButton>
        )}

        <ChatList>
          <ChatItem selected={selected === 'D250319-06'} onClick={() => setSelected('D250319-06')}>
            D250319-06
          </ChatItem>
          <ChatItem selected={selected === 'D250319-05'} onClick={() => setSelected('D250319-05')}>
            D250319-05
          </ChatItem>
        </ChatList>
      </Sidebar>

      <ChatArea>

        <ChatHeader>
          <ChatTitle>
            {selected}
            <CallLogButton style={{ visibility: activeTab === '상담별' ? 'visible' : 'hidden' }}>
              통화 내용 보기
            </CallLogButton>
          </ChatTitle>
          <Date>2025년 3월 19일</Date>
        </ChatHeader>
        <ChatBody>
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} fromUser={msg.fromUser}>
              {msg.text}
            </ChatBubble>
          ))}
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
