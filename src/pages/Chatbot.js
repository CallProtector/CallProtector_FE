import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSend } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';
import ChatListModal from '../components/Modal/ChatListModal';

const Container = styled.div`
  display: flex;
  height: 93dvh;
  overflow: hidden;
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
  min-height: 0;
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

  // ✅ 이제 일반 세션은 객체 배열로 관리 [{sessionId, title, startTime}]
  const [generalChatSessions, setGeneralChatSessions] = useState([]);
  const [consultChatSessions, setConsultChatSessions] = useState([]); // 그대로
  const [generalChatMap, setGeneralChatMap] = useState({});
  const [consultChatMap, setConsultChatMap] = useState({});
  const [selected, setSelected] = useState(null);
  const [inputText, setInputText] = useState('');
  const [tempSessionId, setTempSessionId] = useState(null);

  const currentChatMap = activeTab === '일반' ? generalChatMap : consultChatMap;
  const setCurrentChatMap = activeTab === '일반' ? setGeneralChatMap : setConsultChatMap;
  const messages = selected ? currentChatMap[selected] || [] : [];

  const selectedSessionMeta =
    activeTab === '일반'
      ? generalChatSessions.find(s => String(s.sessionId) === String(selected))
      : null;

  const loadGeneralSessions = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/chat-session/list', {
        method: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      const data = await res.json();
    

      if (res.ok && data.isSuccess && Array.isArray(data.result)) {
        const list = [...data.result].sort(
          (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );

        setGeneralChatSessions(list);

        setGeneralChatMap(prev => {
          const next = { ...prev };
          list.forEach(({ sessionId }) => {
            if (!next[sessionId]) next[sessionId] = [];
          });
          return next;
        });

        // 기본 선택
        if (!selected && list.length > 0) setSelected(list[0].sessionId);
      } else {
        console.warn('세션 목록 조회 실패:', data?.message);
      }
    } catch (e) {
      console.error('세션 목록 호출 오류:', e);
    }
  };

  useEffect(() => {
    loadGeneralSessions();
  }, []);

  useEffect(() => {
    if (activeTab === '일반') {
      loadGeneralSessions();
    } else {
      setSelected(null);
    }
  }, [activeTab]);

  const startNewChat = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/chat-session', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok && data.isSuccess && data.result?.sessionId) {
        const sessionId = data.result.sessionId;
        setSelected(sessionId);

        // ✅ 새 세션을 목록 맨 위로 (제목 없음, 현재 시각)
        setGeneralChatSessions(prev => [
          { sessionId, title: null, startTime: new Date().toISOString() },
          ...prev,
        ]);

        setGeneralChatMap(prev => ({ ...prev, [sessionId]: [] }));
        setInputText('');
      } else {
        alert('세션 생성 실패: ' + data.message);
      }
    } catch (error) {
      alert('서버 오류로 세션을 생성할 수 없습니다.');
    }
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;

    let sessionId = selected;
    if (!sessionId) {
      sessionId = `chat-${Date.now()}`;
      setTempSessionId(sessionId);
      setSelected(sessionId);
    }

    const userMessage = { fromUser: true, text };
    const chatMap = activeTab === '일반' ? generalChatMap : consultChatMap;

    if (!chatMap[sessionId]) {
      if (activeTab === '일반') {
        // 일반 탭에서 임시 세션이 생겼다면 목록에도 보여주기
        setGeneralChatSessions(prev => [
          { sessionId, title: null, startTime: new Date().toISOString() },
          ...prev,
        ]);
      } else {
        setConsultChatSessions(prev => [...prev, sessionId]);
      }
      setCurrentChatMap(prev => ({ ...prev, [sessionId]: [userMessage] }));
    } else {
      setCurrentChatMap(prev => ({
        ...prev,
        [sessionId]: [...prev[sessionId], userMessage],
      }));
    }

    setInputText('');
    setTempSessionId(null);

    try {
      const token = localStorage.getItem('accessToken');
      const encoded = encodeURIComponent(text);
      const url = `http://localhost:8080/api/chat/stream?sessionId=${sessionId}&question=${encoded}&token=${token}`;

      const eventSource = new EventSource(url);
      let buffer = '';

      const appendBotMessage = chunk => {
        setCurrentChatMap(prev => {
          const existing = prev[sessionId] || [];
          const lastMsg = existing[existing.length - 1];
          if (lastMsg && !lastMsg.fromUser) {
            const updated = [...existing];
            updated[updated.length - 1] = {
              ...lastMsg,
              text: lastMsg.text + chunk,
            };
            return { ...prev, [sessionId]: updated };
          } else {
            return {
              ...prev,
              [sessionId]: [...existing, { fromUser: false, text: chunk }],
            };
          }
        });
      };

      eventSource.onmessage = event => {
        const chunk = event.data;

        if (chunk === '[END]') {
          try {
            buffer = buffer.trim();
            const jsonStart = buffer.indexOf('{');
            const jsonEnd = buffer.lastIndexOf('}') + 1;
            const jsonString = buffer.substring(jsonStart, jsonEnd).trim();
            const parsed = JSON.parse(jsonString);

            if (parsed.answer) {
              let formatted = `${parsed.answer}`;

              if (parsed.sourcePages?.length > 0) {
                formatted += '\n\n 👩⚖️법적으로 이렇게 대응할 수 있어요! \n';
                formatted += parsed.sourcePages
                  .map(
                    sp =>
                      `• 유형: ${sp.유형}\n• 관련법률: ${sp.관련법률 || '없음'}`
                  )
                  .join('\n');
              }

              appendBotMessage(formatted);
            }
          } catch (e) {
            console.warn('JSON 파싱 실패:', e);
            appendBotMessage('[⚠️ 응답 파싱 실패]');
          }

          eventSource.close();
          return;
        }

        if (chunk.startsWith('[JSON]')) {
          buffer = chunk.replace('[JSON]', '').trim();
        }
      };

      eventSource.onerror = e => {
        console.error('⛔ SSE 연결 오류', e);
        appendBotMessage('[⛔ 연결 실패]');
        eventSource.close();
      };
    } catch (err) {
      console.error('스트리밍 처리 중 오류:', err);
      alert('메시지를 가져오는 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container>
      <Sidebar>
        <Tabs>
          <Tab active={activeTab === '일반'} onClick={() => setActiveTab('일반')}>
            일반
          </Tab>
          <Tab active={activeTab === '상담별'} onClick={() => setActiveTab('상담별')}>
            상담별
          </Tab>
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
          {activeTab === '일반'
            ? generalChatSessions.map(({ sessionId, title, startTime }) => (
                <ChatItem
                  key={sessionId}
                  selected={String(selected) === String(sessionId)}
                  onClick={() => setSelected(sessionId)}
                >
                  <div style={{ fontWeight: 600 }}>
                    {title || `새 대화 #${sessionId}`}
                  </div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                    {new Date(startTime).toLocaleString()}
                  </div>
                </ChatItem>
              ))
            : consultChatSessions.map(sessionId => (
                <ChatItem
                  key={sessionId}
                  selected={String(selected) === String(sessionId)}
                  onClick={() => setSelected(sessionId)}
                >
                  {sessionId}
                </ChatItem>
              ))}
        </ChatList>
      </Sidebar>

      <ChatArea>
        {selected && messages.length > 0 && (
          <ChatHeader>
            <ChatTitle>
              {activeTab === '일반'
                ? (selectedSessionMeta?.title || `새 대화 #${selected}`)
                : selected}
              <CallLogButton
                style={{
                  visibility: activeTab === '상담별' ? 'visible' : 'hidden',
                }}
              >
                통화 내용 보기
              </CallLogButton>
            </ChatTitle>
            <ChatDate>
              {activeTab === '일반' && selectedSessionMeta?.startTime
                ? new Date(selectedSessionMeta.startTime).toLocaleString()
                : ' '}
            </ChatDate>
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
            <Input
              placeholder="메시지를 입력하세요"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <SendButton onClick={handleSend}>
              <FiSend size={24} />
            </SendButton>
          </InputWrapper>
        </InputArea>
      </ChatArea>
    </Container>
  );
};

export default Chatbot;
