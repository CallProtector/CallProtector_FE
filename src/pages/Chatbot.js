import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiSend, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';
import ChatListModal from '../components/Modal/ChatListModal';
import botAvatar from '../assets/images/bot-avatar.png';
import { useNavigate, useSearchParams } from 'react-router-dom';

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

const ChatBubbleContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  justify-content: ${({ fromUser }) => (fromUser ? 'flex-end' : 'flex-start')};
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 50%;
  margin-right: 10px;
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

  ${({ loading }) =>
    loading &&
    `
    display: flex;
    align-items: center;
    color: #888;
  `}
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

const typingAnimation = keyframes`
  0% { content: '응답중'; }
  25% { content: '응답중.'; }
  50% { content: '응답중..'; }
  75% { content: '응답중...'; }
  100% { content: '응답중....'; }
`;

const LoadingDots = styled.span`
  &::after {
    display: inline-block;
    animation: ${typingAnimation} 1s infinite steps(1);
    content: '';
  }
`;




const Chatbot = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabFromUrl = searchParams.get("tab");
  const sessionIdFromUrl = searchParams.get("sessionId");
  const API_BASE_URL = process.env.REACT_APP_API_URL;
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


  // === 시간 파서 유틸 ===
  const parseServerTime = (ts) => {
    if (!ts) return null;
    // 이미 Z나 +09:00 같은 오프셋이 있으면 그대로 처리
    if (/[zZ]$/.test(ts) || /[+-]\d{2}:\d{2}$/.test(ts)) {
      return new Date(ts);
    }
    // naive datetime → UTC로 간주
    return new Date(`${ts}Z`);
  };

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
      const dt = parseServerTime(s.lastUserQuestionAt || s.startTime);
      if (isToday(dt)) g.today.push(s);
      else if (isWithin7Days(dt)) g.week.push(s);
      else g.rest.push(s);
    }
    const sortFn = (a, b) =>
      new Date(b.lastUserQuestionAt || b.startTime) -
      new Date(a.lastUserQuestionAt || a.startTime);
    g.today.sort(sortFn);
    g.week.sort(sortFn);
    g.rest.sort(sortFn);
    return g;
  }, [generalChatSessions]);


  // 상담별 세션 그룹핑
  const groupedConsult = React.useMemo(() => {
    const g = { today: [], week: [], rest: [] };
    for (const s of consultChatSessions) {
      const dt = parseServerTime(s.lastUserQuestionAt || s.createdAt);
      if (isToday(dt)) g.today.push(s);
      else if (isWithin7Days(dt)) g.week.push(s);
      else g.rest.push(s);
    }
    const sortFn = (a, b) =>
      new Date(b.lastUserQuestionAt || b.createdAt) -
      new Date(a.lastUserQuestionAt || a.createdAt);
    g.today.sort(sortFn);
    g.week.sort(sortFn);
    g.rest.sort(sortFn);
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
      const res = await fetch(`${API_BASE_URL}/api/chat-sessions/list`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      const data = await res.json();

      if (res.ok && data.isSuccess && Array.isArray(data.result)) {
        const list = data.result || [];
        setGeneralChatSessions(
          list.map(s => ({
            ...s,
            lastUserQuestionAt: parseServerTime(s.lastUserQuestionAt)?.toISOString()
          }))
        );

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
        `${API_BASE_URL}/api/call-chat-sessions/list`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      const data = await res.json();

      if (res.ok && data.isSuccess && Array.isArray(data.result)) {
        const list = data.result || [];

        setConsultChatSessions(
          list.map(s => ({
            ...s,
            lastUserQuestionAt: parseServerTime(s.lastUserQuestionAt)?.toISOString()
          }))
        );

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
        url = `${API_BASE_URL}/api/chat-log/session/${sessionId}`;
      } else {
        url = `${API_BASE_URL}/api/call-chat-log/session/${sessionId}`;
      }

      const res = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const logs = (which === 'consult')
        ? data.result?.logs || []
        : data.result || [];

      if (res.ok && data.isSuccess && Array.isArray(logs)) {
        const sortedLogs = [...logs].sort(
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

        // 👉 상담별이면 consultChatSessions에 callSessionId를 병합
        if (which === 'consult' && data.result?.callSessionId) {
          setConsultChatSessions((prev) =>
            prev.map((s) =>
              String(s.sessionId) === String(sessionId)
                ? { ...s, callSessionId: data.result.callSessionId }
                : s
            )
          );
        }
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

    const res = await fetch(`${API_BASE_URL}/api/chat-sessions`, {
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

  useEffect(() => {
    if (!selected) return;

    // 여기서만 로딩 여부 판단
    const map = activeTab === '일반' ? generalChatMap : consultChatMap;
    if (!Array.isArray(map[selected]) || map[selected].length === 0) {
      const isNumeric = /^\d+$/.test(String(selected));
      if (isNumeric) {
        loadChatLogs(selected, activeTab === '일반' ? 'general' : 'consult');
      }
    }
    // map 제거 → 불필요 재호출 방지
  }, [selected, activeTab]);


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
    const which = activeTab === '일반' ? 'general' : 'consult';
    const eventSource = new EventSource(url);
    let buffer = '';

    const replaceLoadingWith = (text) => {
      setCurrentChatMap((prev) => {
        const msgs = prev[sessionId] || [];
        const idx = msgs.findIndex((m) => m.loading);
        if (idx !== -1) {
          const updated = [...msgs];
          updated[idx] = { fromUser: false, text };
          return { ...prev, [sessionId]: updated };
        }
        return prev;
      });
    };

    // 제목 이벤트 즉시 반영
    eventSource.addEventListener('title', (ev) => {
      try {
        const payload = JSON.parse(ev.data); // { sessionId, title }
        const sid = payload?.sessionId ?? sessionId;
        const title = payload?.title;
        applySessionTitle(which, sid, title);
      } catch (e) {
      }
    });

    // 메시지 스트림 처리
    eventSource.addEventListener('message', (event) => {
      const chunk = event.data;

      if (chunk === '[END]') {
        try {
          buffer = buffer.trim();
          const jsonStart = buffer.indexOf('{');
          const jsonEnd = buffer.lastIndexOf('}') + 1;
          const parsed = JSON.parse(buffer.substring(jsonStart, jsonEnd).trim());
          if (parsed.answer) {
            replaceLoadingWith(formatBotMessage(parsed.answer, parsed.sourcePages));
          } else {
            replaceLoadingWith('[⚠️ 응답 형식 없음]');
          }
        } catch (e) {
          replaceLoadingWith('[⚠️ 응답 파싱 실패]');
        }
        eventSource.close();
        return;
      }

      if (chunk.startsWith('[JSON]')) {
        buffer = chunk.replace('[JSON]', '').trim();
      }
    });

    eventSource.onerror = () => {
      replaceLoadingWith('[⛔ 연결 실패]');
      eventSource.close();
    };
  };


  // 메시지 전송
  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;

    const token = localStorage.getItem('accessToken');
    let sessionId;
    if (activeTab === '일반') {
      sessionId = await ensureSessionId();
    } else {
      if (!selected) {
        alert('상담별 탭에서는 세션을 선택한 뒤 메시지를 전송하세요.');
        return;
      }
      sessionId = selected;
    }

    const userMessage = { fromUser: true, text };
    const loadingMessage = { fromUser: false, loading: true }; // 로딩 말풍선

    setCurrentChatMap((prev) => ({
      ...prev,
      [sessionId]: [...(prev[sessionId] || []), userMessage, loadingMessage],
    }));

    setInputText('');
    setTempSessionId(null);
    const now = new Date().toISOString();
    if (activeTab === '일반') {
      setGeneralChatSessions((prev) => {
        const updated = prev.map((s) =>
          String(s.sessionId) === String(sessionId)
            ? { ...s, lastUserQuestionAt: now }
            : s
        );
        return [...updated].sort(
          (a, b) =>
            new Date(b.lastUserQuestionAt || b.startTime) -
            new Date(a.lastUserQuestionAt || a.startTime)
        );
      });
    } else {
      setConsultChatSessions((prev) => {
        const updated = prev.map((s) =>
          String(s.sessionId) === String(sessionId)
            ? { ...s, lastUserQuestionAt: now }
            : s
        );
        return [...updated].sort(
          (a, b) =>
            new Date(b.lastUserQuestionAt || b.createdAt) -
            new Date(a.lastUserQuestionAt || a.createdAt)
        );
      });
    }

    try {
      const encoded = encodeURIComponent(text);
      const url =
        activeTab === '일반'
          ? `${API_BASE_URL}/api/chat/stream?sessionId=${sessionId}&question=${encoded}&token=${token}`
          : `${API_BASE_URL}/api/call-chat/stream?callChatSessionId=${sessionId}&question=${encoded}&token=${token}`;

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
      const url = `${API_BASE_URL}/api/call-chat-sessions/by-call-session?callSessionId=${encodeURIComponent(
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
      const session = data.result;

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

      setConsultChatMap((prev) =>
        prev[session.sessionId] ? prev : { ...prev, [session.sessionId]: [] }
      );
      return session;
    } catch (e) {
      console.error('상담별 세션 확보 호출 오류:', e);
      return null;
    }
  };

  const renderWithBold = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }
      return <span key={idx}>{part}</span>;
    });
  };


  const refreshConsultAndFocusLatest = async () => {
    const list = await loadConsultSessions();
    if (list && list.length) {
      const latest = list[0];
      setActiveTab('상담별');
      setSelected(latest.sessionId);
      await loadChatLogs(latest.sessionId, 'consult');
      return latest;
    }
    return null;
  };

  const chatBodyRef = React.useRef(null);


  React.useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const applySessionTitle = (which, sessionId, title) => {
    if (!sessionId || !title) return;

    if (which === 'general') {
      setGeneralChatSessions(prev =>
        prev.map(s =>
          String(s.sessionId) === String(sessionId) ? { ...s, title } : s
        )
      );
    } else {
      setConsultChatSessions(prev =>
        prev.map(s =>
          String(s.sessionId) === String(sessionId) ? { ...s, title } : s
        )
      );
    }
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
            onSelect={async () => {
              await refreshConsultAndFocusLatest();
              setShowModal(false);
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
                  onClick={() => {
                    if (activeTab !== '상담별') return;

                    const callSessionId = selectedSessionMeta?.callSessionId;

                    if (callSessionId) {
                      navigate(`/sessions/${callSessionId}`);
                    } else {
                      alert("통화 세션 ID가 없습니다. 먼저 대화 로그를 불러와주세요.");
                    }
                  }}
                >
                  통화 내용 보기
                </CallLogButton>
              </ChatTitle>
              <ChatDate>
                {activeTab === '일반' && selectedSessionMeta?.startTime
                  ? parseServerTime(selectedSessionMeta.startTime)?.toLocaleString()
                  : activeTab === '상담별' && selectedSessionMeta?.createdAt
                    ? parseServerTime(selectedSessionMeta.createdAt)?.toLocaleString()
                    : ' '}
              </ChatDate>
            </ChatHeader>
            <ChatBody ref={chatBodyRef}>
              {messages.map((msg, idx) => (
                <ChatBubbleContainer key={idx} fromUser={msg.fromUser}>
                  {!msg.fromUser && (
                    <ProfileImage src={botAvatar} alt="Bot Avatar" />
                  )}
                  <ChatBubble fromUser={msg.fromUser} loading={msg.loading}>
                    {msg.loading ? <LoadingDots /> : renderWithBold(msg.text)}
                  </ChatBubble>

                </ChatBubbleContainer>
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
    </Container >
  );
};

export default Chatbot;
