import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 260px;
  background-color: #f6f6f7;
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
  font-size: 14px;
  background: ${({ active }) => (active ? '#fff' : 'transparent')};
  border: none;
  border-bottom: ${({ active }) => (active ? '3px solid #7a5af8' : 'none')};
  cursor: pointer;
  color: ${({ active }) => (active ? '#000' : '#888')};
`;

const ChatList = styled.div`
  margin-top: 16px;
`;

const ChatItem = styled.div`
  padding: 10px;
  margin-bottom: 6px;
  background-color: ${({ selected }) => (selected ? '#e4e4e4' : '#fff')};
  border-radius: 4px;
  cursor: pointer;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ChatBubble = styled.div`
  max-width: 60%;
  padding: 12px;
  border-radius: 8px;
  background-color: ${({ fromUser }) => (fromUser ? '#ffe9ab' : '#fff')};
  align-self: ${({ fromUser }) => (fromUser ? 'flex-end' : 'flex-start')};
  margin-bottom: 12px;
  white-space: pre-wrap;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const InputArea = styled.div`
  display: flex;
  padding: 12px 20px;
  border-top: 1px solid #ddd;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
`;

const SendButton = styled.button`
  margin-left: 10px;
  padding: 10px 16px;
  border-radius: 20px;
  background-color: #7a5af8;
  color: white;
  border: none;
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
        `▶ 형법 제314조(업무방해죄): 지속적인 폭언으로 인해 정상적인 업무 수행이 방해된 경우 적용될 수 있습니다.\n\n`+
        `⚖️ 대응 방법:\n` +
        `1. 사내 대응\n` +
        `▶ 해당 상담 기록을 기반으로 내부 신고 절차를 진행할 수 있습니다.\n` +
        `▶ 추가적인 고객 응대를 피할 수 있도록 관련 부서에 요청 가능합니다.\n`+
        `2. 법적 조치\n` +
        `▶ 고객의 폭언이 지속되었거나 협박이 포함되었다면, 법적 대응(내용 증명 발송, 경찰 신고 등)을 고려할 수 있습니다.\n` +
        `▶ 필요하다면 변호사 상담을 연결해드릴 수도 있습니다.\n\n` + 
        `추가적으로 도움이 필요하시면 언제든 말씀해주세요!`

    },
    {
      fromUser: true,
      text:
        '고객이 저에게 무례했습니다. 대화 녹음도 있고, 법률적으로 이걸 대응할 수 있는 방법도 포함해 도움을 요청하고 싶어요.'
    }
  ]);

  return (
    <Container>
      <Sidebar>
        <Tabs>
          <Tab active={activeTab === '일반'} onClick={() => setActiveTab('일반')}>일반</Tab>
          <Tab active={activeTab === '상담별'} onClick={() => setActiveTab('상담별')}>상담별</Tab>
        </Tabs>

        <ChatList>
          <ChatItem selected={selected === 'D250319-06'} onClick={() => setSelected('D250319-06')}>
            D250319-06
          </ChatItem>
          <ChatItem>D250319-05</ChatItem>
        </ChatList>
      </Sidebar>

      <ChatArea>
        <ChatHeader>
          {selected}
          <button>응대 내용 보기</button>
        </ChatHeader>
        <ChatBody>
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} fromUser={msg.fromUser}>
              {msg.text}
            </ChatBubble>
          ))}
        </ChatBody>
        <InputArea>
          <Input placeholder="메시지를 입력하세요" />
          <SendButton>전송</SendButton>
        </InputArea>
      </ChatArea>
    </Container>
  );
};

export default Chatbot;
