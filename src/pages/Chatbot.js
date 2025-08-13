import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSend, FiChevronDown, FiChevronRight } from 'react-icons/fi';
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
  padding: 0 6px 0 20px;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const Tabs = styled.div`
  display: flex;
  margin-top: 20px;
  border-bottom: 1px solid #ccc;
  flex-shrink: 0;
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px;
  font-size: 20px;
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
  font-size: 19px;
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
  flex-shrink: 0;

  &:hover {
    background-color: #efefef;
  }
`;

const Section = styled.div`
  margin-top: 16px;
`;

const SectionHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  border: none;
  padding: 10px 6px;
  font-size: 19px;
  font-weight: 700;
  color: #555;
  cursor: pointer;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #F3F6FE;
`;

const SectionBody = styled.div`
  margin-top: 8px;
`;

const Chevron = ({ open }) =>
  open ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />;

const ChatList = styled.div`
  margin-top: 16px;
  flex: 1;
  overflow-y: scroll;
  padding-right: 6px;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.15);
    border-radius: 4px;
  }
`;

const ChatItem = styled.div`
  padding: 10px;
  margin-bottom: 5px;
  background-color: ${({ selected }) => (selected ? '#eaeaea' : '#fff')};
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
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
  font-size: 25px;
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
  font-size: 15px;
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
  font-size: 17px;
  white-space: pre-wrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const EmptyMessage = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 23px;
  color: #777;
  text-align: center;
  padding: 0 24px;
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
  font-size: 17px;
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

  // 세션/메시지 상태
  const [generalChatSessions, setGeneralChatSessions] = useState([]); // [{sessionId, title, startTime}]
  const [consultChatSessions, setConsultChatSessions] = useState([]); // [{sessionId, title, createdAt}]
  const [generalChatMap, setGeneralChatMap] = useState({});
  const [consultChatMap, setConsultChatMap] = useState({});
  const [selected, setSelected] = useState(null);
  const [inputText, setInputText] = useState('');
  const [tempSessionId, setTempSessionId] = useState(null);

  const currentChatMap = activeTab === '일반' ? generalChatMap : consultChatMap;
  const setCurrentChatMap =
    activeTab === '일반' ? setGeneralChatMap : setConsultChatMap;
  const messages = selected ? currentChatMap[selected] || [] : [];

  const selectedSessionMeta =
    activeTab === '일반'
      ? generalChatSessions.find((s) => String(s.sessionId) === String(selected))
      : consultChatSessions.find((s) => String(s.sessionId) === String(selected));

  // 날짜 유틸
  const isToday = (d) => {
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  };
  const isWithin7Days = (d) => {
    const now = new Date();
    const ms = now - d;
    const days = ms / (1000 * 60 * 60 * 24);
    return days < 7 && !isToday(d);
  };

  // 섹션 open/close 상태
  const [openGroups, setOpenGroups] = useState({
    today: true,
    week: true,
    rest: true,
  });

  // 일반 세션 그룹핑
  const groupedGeneral = React.useMemo(() => {
    const g = { today: [], week: [], rest: [] };
    for (const s of generalChatSessions) {
      const dt = new Date(s.startTime);
      if (isToday(dt)) g.today.push(s);
      else if (isWithin7Days(dt)) g.week.push(s);
      else g.rest.push(s);
    }
    return g;
  }, [generalChatSessions]);

  // 상담별 세션 그룹핑
  const groupedConsult = React.useMemo(() => {
    const g = { today: [], week: [], rest: [] };
    for (const s of consultChatSessions) {
      const dt = new Date(s.createdAt);
      if (isToday(dt)) g.today.push(s);
      else if (isWithin7Days(dt)) g.week.push(s);
      else g.rest.push(s);
    }
    return g;
  }, [consultChatSessions]);

  const toggleGroup = (key) =>
    setOpenGroups((p) => ({ ...p, [key]: !p[key] }));

  // Bot 메시지 포맷
  const formatBotMessage = (answer, sourcePages) => {
    let formatted = `${answer || ''}`;
    if (Array.isArray(sourcePages) && sourcePages.length > 0) {
      formatted += '\n\n 👩⚖️법적으로 이렇게 대응할 수 있어요! \n';
      formatted += sourcePages
        .map(
          (sp) => `• 유형: ${sp?.유형}\n• 관련법률: ${sp?.관련법률 || '없음'}`
        )
        .join('\n');
    }
    return formatted.trim();
  };

  // 일반 세션 목록 로드
  const loadGeneralSessions = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/chat-sessions/list', {
        method: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      const data = await res.json();

      if (res.ok && data.isSuccess && Array.isArray(data.result)) {
        const list = [...data.result].sort(
          (a, b) =>
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );

        setGeneralChatSessions(list);

        setGeneralChatMap((prev) => {
          const next = { ...prev };
          list.forEach(({ sessionId }) => {
            if (!next[sessionId]) next[sessionId] = [];
          });
          return next;
        });
      } else {
        console.warn('세션 목록 조회 실패:', data?.message);
      }
    } catch (e) {
      console.error('세션 목록 호출 오류:', e);
    }
  };

  // 상담별 세션 목록 로드
  const loadConsultSessions = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/call-chat-sessions/list',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      const data = await res.json();

      if (res.ok && data.isSuccess && Array.isArray(data.result)) {
        const list = [...data.result].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setConsultChatSessions(list);

        setConsultChatMap((prev) => {
          const next = { ...prev };
          list.forEach(({ sessionId }) => {
            if (!next[sessionId]) next[sessionId] = [];
          });
          return next;
        });
        return list;
      } else {
        console.warn('상담별 세션 목록 조회 실패:', data?.message);
        return [];
      }
    } catch (e) {
      console.error('상담별 세션 목록 호출 오류:', e);
      return [];
    }
  };

  // 세션 로그 로드 (일반/상담별 공용)
  const loadChatLogs = async (sessionId, which = 'general') => {
    try {
      const token = localStorage.getItem('accessToken');
      let url;

      if (which === 'general') {
        url = `http://localhost:8080/api/chat-log/session/${sessionId}`;
      } else {
        // 상담별 조회
        url = `http://localhost:8080/api/call-chat-log/session/${sessionId}`;
      }

      const res = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.isSuccess && Array.isArray(data.result)) {
        const logs = [...data.result].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        // 초기 분석 유저 메시지 숨기기
        const isInitialAnalysis = (q) =>
          typeof q === 'string' && /^\s*\[초기\s*분석]/.test(q);

        const msgList = [];
        logs.forEach((item) => {
          if (item.question && !isInitialAnalysis(item.question)) {
            msgList.push({ fromUser: true, text: item.question });
          }
          msgList.push({
            fromUser: false,
            text: formatBotMessage(item.answer, item.sourcePages),
          });
        });

        const setMap =
          which === 'general' ? setGeneralChatMap : setConsultChatMap;
        setMap((prev) => ({ ...prev, [sessionId]: msgList }));
      } else {
        console.warn('대화 로그 조회 실패:', data?.message);
      }
    } catch (e) {
      console.error('대화 로그 호출 오류:', e);
    }
  };

  // 새 일반 세션 생성
  const ensureSessionId = async () => {
    if (selected && /^\d+$/.test(String(selected))) return selected;

    const res = await fetch('http://localhost:8080/api/chat-sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    if (!res.ok || !data.isSuccess || !data.result?.sessionId) {
      throw new Error(data?.message || '세션 생성 실패');
    }
    const newId = data.result.sessionId;

    // 목록 상단에 추가
    setGeneralChatSessions((prev) => [
      { sessionId: newId, title: null, startTime: new Date().toISOString() },
      ...prev,
    ]);

    setGeneralChatMap((prev) => ({ ...prev, [newId]: [] }));
    setSelected(newId);

    return newId;
  };

  // 첫 진입
  useEffect(() => {
    loadGeneralSessions();
  }, []);

  // 탭 전환 시 목록 로딩
  useEffect(() => {
    if (activeTab === '일반') {
      loadGeneralSessions();
    } else {
      loadConsultSessions();
    }
  }, [activeTab]);

  // 세션 선택 시 해당 로그 로드 (현재 탭 기준)
  useEffect(() => {
    if (!selected) return;

    const map = activeTab === '일반' ? generalChatMap : consultChatMap;
    const alreadyLoaded = Array.isArray(map[selected]) && map[selected].length > 0;
    if (!alreadyLoaded) {
      const isNumeric = String(selected).match(/^\d+$/);
      if (isNumeric)
        loadChatLogs(selected, activeTab === '일반' ? 'general' : 'consult');
    }
  }, [selected, activeTab, generalChatMap, consultChatMap]);

  const startNewChat = () => {
    // 일반 탭에서만 새 빈 화면
    if (activeTab !== '일반') return;

    const currMsgs = selected ? currentChatMap[selected] || [] : [];
    if (!selected || currMsgs.length === 0) {
      setInputText('');
      setSelected(null);
      return;
    }
    setInputText('');
    setSelected(null);
  };

  // === 공용 SSE 전송 ===
  const openSseAndStream = ({ url, sessionId }) => {
    const eventSource = new EventSource(url);
    let buffer = '';

    const appendBotMessage = (chunk) => {
      setCurrentChatMap((prev) => {
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

    eventSource.onmessage = (event) => {
      const chunk = event.data;

      if (chunk === '[END]') {
        try {
          buffer = buffer.trim();
          const jsonStart = buffer.indexOf('{');
          const jsonEnd = buffer.lastIndexOf('}') + 1;
          const jsonString = buffer.substring(jsonStart, jsonEnd).trim();
          const parsed = JSON.parse(jsonString);

          if (parsed.answer) {
            const formatted = formatBotMessage(
              parsed.answer,
              parsed.sourcePages
            );
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

    eventSource.onerror = (e) => {
      console.error('⛔ SSE 연결 오류', e);
      appendBotMessage('[⛔ 연결 실패]');
      eventSource.close();
    };
  };

  // 메시지 전송
  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;

    const token = localStorage.getItem('accessToken');

    // 탭별 세션 아이디 결정 + 유저 메시지 먼저 append
    let sessionId;
    if (activeTab === '일반') {
      sessionId = await ensureSessionId();
    } else {
      if (!selected) {
        alert('상담별 탭에서는 세션을 선택한 뒤 메시지를 전송하세요.');
        return;
      }
      sessionId = selected; // 상담별: callChatSessionId
    }

    const userMessage = { fromUser: true, text };
    const chatMap = activeTab === '일반' ? generalChatMap : consultChatMap;

    if (!chatMap[sessionId]) {
      setCurrentChatMap((prev) => ({ ...prev, [sessionId]: [userMessage] }));
    } else {
      setCurrentChatMap((prev) => ({
        ...prev,
        [sessionId]: [...prev[sessionId], userMessage],
      }));
    }

    setInputText('');
    setTempSessionId(null);

    try {
      const encoded = encodeURIComponent(text);

      // ✅ 탭에 따라 전송 API 분기
      const url =
        activeTab === '일반'
          ? `http://localhost:8080/api/chat/stream?sessionId=${sessionId}&question=${encoded}&token=${token}`
          : `http://localhost:8080/api/call-chat/stream?callChatSessionId=${sessionId}&question=${encoded}&token=${token}`;

      openSseAndStream({ url, sessionId });
    } catch (err) {
      console.error('스트리밍 처리 중 오류:', err);
      alert('메시지를 가져오는 중 오류가 발생했습니다.');
    }
  };

  const ensureCallChatSessionFromCall = async (callSessionId) => {
    try {
      const raw = localStorage.getItem('accessToken');
      const token = raw ? raw.replace(/^"+|"+$/g, '') : '';
      const url = `http://localhost:8080/api/call-chat-sessions/by-call-session?callSessionId=${encodeURIComponent(
        callSessionId
      )}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.isSuccess || !data.result?.sessionId) {
        console.warn('상담별 세션 확보 실패:', data?.message);
        return null;
      }
      const session = data.result; // { sessionId, title?, createdAt? }

      // 목록에 없으면 추가
      setConsultChatSessions((prev) => {
        const exists = prev.some(
          (s) => String(s.sessionId) === String(session.sessionId)
        );
        if (exists) return prev;
        return [
          {
            sessionId: session.sessionId,
            title: session.title ?? null,
            createdAt: session.createdAt ?? new Date().toISOString(),
          },
          ...prev,
        ];
      });
      // 메시지 맵 슬롯 보장
      setConsultChatMap((prev) =>
        prev[session.sessionId] ? prev : { ...prev, [session.sessionId]: [] }
      );
      return session;
    } catch (e) {
      console.error('상담별 세션 확보 호출 오류:', e);
      return null;
    }
  };

  const refreshConsultAndFocusLatest = async () => {
    const list = await loadConsultSessions();
    if (list && list.length) {
      const latest = list[0]; // createdAt DESC 정렬 기준
      setActiveTab('상담별');
      setSelected(latest.sessionId);
      await loadChatLogs(latest.sessionId, 'consult');
      return latest;
    }
    return null;
  };

  return (
    <Container>
      <Sidebar>
        <Tabs>
          <Tab active={activeTab === '일반'} onClick={() => setActiveTab('일반')}>
            일반
          </Tab>
          <Tab
            active={activeTab === '상담별'}
            onClick={() => setActiveTab('상담별')}
          >
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
        {showModal && (
          <ChatListModal
            onClose={() => setShowModal(false)}
            onSelect={async (row) => {
              // row.id === callSessionId
              const s = await ensureCallChatSessionFromCall(row.id);
              setShowModal(false);
              if (!s) return;
              setActiveTab('상담별');
              setSelected(s.sessionId);
              await loadChatLogs(s.sessionId, 'consult');
            }}
          />
        )}
        <ChatList>
          {activeTab === '일반' ? (
            <>
              <Section>
                <SectionHeader onClick={() => toggleGroup('today')}>
                  <span>오늘</span>
                  <Chevron open={openGroups.today} />
                </SectionHeader>
                {openGroups.today && (
                  <SectionBody>
                    {groupedGeneral.today.map(({ sessionId, title }) => (
                      <ChatItem
                        key={sessionId}
                        selected={String(selected) === String(sessionId)}
                        onClick={() => setSelected(sessionId)}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {title || `일반 채팅${sessionId}`}
                        </div>
                      </ChatItem>
                    ))}
                  </SectionBody>
                )}
              </Section>

              <Section>
                <SectionHeader onClick={() => toggleGroup('week')}>
                  <span>지난 7일</span>
                  <Chevron open={openGroups.week} />
                </SectionHeader>
                {openGroups.week && (
                  <SectionBody>
                    {groupedGeneral.week.map(({ sessionId, title }) => (
                      <ChatItem
                        key={sessionId}
                        selected={String(selected) === String(sessionId)}
                        onClick={() => setSelected(sessionId)}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {title || `일반 채팅${sessionId}`}
                        </div>
                      </ChatItem>
                    ))}
                  </SectionBody>
                )}
              </Section>

              <Section>
                <SectionHeader onClick={() => toggleGroup('rest')}>
                  <span>이전 대화</span>
                  <Chevron open={openGroups.rest} />
                </SectionHeader>
                {openGroups.rest && (
                  <SectionBody>
                    {groupedGeneral.rest.map(({ sessionId, title }) => (
                      <ChatItem
                        key={sessionId}
                        selected={String(selected) === String(sessionId)}
                        onClick={() => setSelected(sessionId)}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {title || `일반 채팅${sessionId}`}
                        </div>
                      </ChatItem>
                    ))}
                  </SectionBody>
                )}
              </Section>
            </>
          ) : (
            <>
              <Section>
                <SectionHeader onClick={() => toggleGroup('today')}>
                  <span>오늘</span>
                  <Chevron open={openGroups.today} />
                </SectionHeader>
                {openGroups.today && (
                  <SectionBody>
                    {groupedConsult.today.map(({ sessionId, title }) => (
                      <ChatItem
                        key={sessionId}
                        selected={String(selected) === String(sessionId)}
                        onClick={() => setSelected(sessionId)}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {title || `상담 ${sessionId}`}
                        </div>
                      </ChatItem>
                    ))}
                  </SectionBody>
                )}
              </Section>

              <Section>
                <SectionHeader onClick={() => toggleGroup('week')}>
                  <span>지난 7일</span>
                  <Chevron open={openGroups.week} />
                </SectionHeader>
                {openGroups.week && (
                  <SectionBody>
                    {groupedConsult.week.map(({ sessionId, title }) => (
                      <ChatItem
                        key={sessionId}
                        selected={String(selected) === String(sessionId)}
                        onClick={() => setSelected(sessionId)}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {title || `상담 ${sessionId}`}
                        </div>
                      </ChatItem>
                    ))}
                  </SectionBody>
                )}
              </Section>

              <Section>
                <SectionHeader onClick={() => toggleGroup('rest')}>
                  <span>이전 대화</span>
                  <Chevron open={openGroups.rest} />
                </SectionHeader>
                {openGroups.rest && (
                  <SectionBody>
                    {groupedConsult.rest.map(({ sessionId, title }) => (
                      <ChatItem
                        key={sessionId}
                        selected={String(selected) === String(sessionId)}
                        onClick={() => setSelected(sessionId)}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {title || `상담 ${sessionId}`}
                        </div>
                      </ChatItem>
                    ))}
                  </SectionBody>
                )}
              </Section>
            </>
          )}
        </ChatList>
      </Sidebar>

      <ChatArea>
        {selected && messages.length > 0 ? (
          <>
            <ChatHeader>
              <ChatTitle>
                {activeTab === '일반'
                  ? selectedSessionMeta?.title || `일반 채팅 #${selected}`
                  : selectedSessionMeta?.title || `상담 #${selected}`}
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
                  : activeTab === '상담별' && selectedSessionMeta?.createdAt
                  ? new Date(selectedSessionMeta.createdAt).toLocaleString()
                  : ' '}
              </ChatDate>
            </ChatHeader>
            <ChatBody>
              {messages.map((msg, idx) => (
                <ChatBubble key={idx} fromUser={msg.fromUser}>
                  {msg.text}
                </ChatBubble>
              ))}
            </ChatBody>
          </>
        ) : (
          <ChatBody>
            <EmptyMessage>
              {activeTab === '일반' ? (
                <>
                  새로운 채팅을 시작해보세요.
                  <br /> 왼쪽의 '새로운 채팅' 버튼을 누르거나
                  아래 입력창에 질문을 입력하면 자동으로 새 대화가 생성됩니다.
                </>
              ) : (
                <>
                  상담별 세션을 선택하거나 ‘상담 내역 불러오기’를 눌러 목록을 불러오세요.
                </>
              )}
            </EmptyMessage>
          </ChatBody>
        )}

        <InputArea>
          <InputWrapper>
            <Input
              placeholder={
                activeTab === '일반'
                  ? '메시지를 입력하세요'
                  : '상담별 탭은 세션 선택 후 메시지 전송 가능합니다'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
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
