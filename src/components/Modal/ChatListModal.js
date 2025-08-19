import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { IoIosClose } from 'react-icons/io';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  width: 700px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  position: relative;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const StatusMsg = styled.div`
  text-align: center;
  color: #2e7d32;
  margin: 0 0 10px 0;
  font-size: 14px;
`;

const ErrorMsg = styled.div`
  text-align: center;
  color: #c00;
  margin: 0 0 10px 0;
  font-size: 14px;
`;

const TableWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 350px;
  margin-bottom: 25px;

  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.15); border-radius: 4px; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
  font-size: 16px;
`;

const TableHead = styled.thead`
  border-bottom: 1px solid #ddd;
`;

const TableRow = styled.tr`
  &:hover td { background: #fafafa; }
`;

const TableHeader = styled.th`
  text-align: center;
  font-size: 17px;
  padding: 10px 0;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
`;

const TableCell = styled.td`
  text-align: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  transition: background .15s ease;

  input[type="checkbox"] {
    accent-color: #7a5af8;
    width: 14px;
    height: 14px;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const StartButton = styled.button`
  padding: 12px 24px;
  border-radius: 15px;
  font-size: 17px;
  font-weight: bold;
  color: white;
  background-color: #5C24AF;
  border: none;
  cursor: pointer;
  &:disabled { opacity: .5; cursor: not-allowed; }
  &:hover:not(:disabled) { background-color: #6946e7; }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #777;
  padding: 28px 0;
`;

function formatDate(s) {
  try { return new Date(s).toLocaleString(); } catch { return s; }
}

const ChatListModal = ({ onClose, onSelect }) => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [cursorId, setCursorId] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [connectionMsg, setConnectionMsg] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeMsg, setAnalyzeMsg] = useState('');

  const ABUSE_SESSIONS_API = `${API_BASE_URL}/api/call-sessions/abusive`;
  const ANALYZE_API_BASE = `${API_BASE_URL}/api/chatbot/analyze`;
  const DEFAULT_PAGE_SIZE = 5;

  const fetchPage = async ({ cursor, size, replace = false } = {}) => {
    if (loading) return;

    const tokenRaw = localStorage.getItem('accessToken');
    const token = tokenRaw ? tokenRaw.replace(/^"+|"+$/g, '') : null;
    if (!token) {
      setErr('인증이 필요합니다.');
      setConnectionMsg('');
      return;
    }

    setLoading(true);
    setErr('');

    try {
      const qs = new URLSearchParams();
      if (cursor !== null && cursor !== undefined) qs.set('cursorId', String(cursor));
      qs.set('size', String(size ?? DEFAULT_PAGE_SIZE));

      const url = `${ABUSE_SESSIONS_API}?${qs.toString()}`;

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (res.status === 401) {
        setErr('인증이 필요합니다.');
        setConnectionMsg('');
        return;
      }

      const text = await res.text();
      let data = {};
      try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }

      if (!res.ok) {
        setErr((data && (data.message || data.error)) || `조회 실패 (status ${res.status})`);
        setConnectionMsg('');
        return;
      }

      const result = (data && data.result) || {};
      const sessions = Array.isArray(result.sessions) ? result.sessions : [];
      const next = (result.nextCursorId !== undefined) ? result.nextCursorId : null;
      const nextFlag = !!result.hasNext;

      setRows(prev => (replace ? sessions : [...prev, ...sessions]));
      setCursorId(next);
      setHasNext(nextFlag);

      if (replace && sessions.length > 0 && selectedId == null) {
        setSelectedId(sessions[0].id);
      }
    } catch (e) {
      setErr('네트워크 오류가 발생했습니다.');
      setConnectionMsg('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage({ replace: true, size: DEFAULT_PAGE_SIZE });
  }, []);

  const selectedRow = useMemo(
    () => rows.find(r => r.id === selectedId) || null,
    [rows, selectedId]
  );

  // 무한 스크롤 감지
  const observerRef = useRef(null);
  useEffect(() => {
    if (!hasNext) return;
    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        fetchPage({ cursor: cursorId });
      }
    }, { threshold: 1.0 });

    const sentinel = document.querySelector('#scrollSentinel');
    if (sentinel) observer.observe(sentinel);

    observerRef.current = observer;

    return () => observer.disconnect();
  }, [cursorId, hasNext, loading]);

  const notifiedRef = useRef(false);

  const DotTicker = ({ running = true, interval = 450 }) => {
    const [idx, setIdx] = React.useState(0);
    const frames = React.useMemo(() => ["", ".", "..", "..."], []);
    React.useEffect(() => {
      if (!running) return;
      const t = setInterval(() => setIdx(i => (i + 1) % frames.length), interval);
      return () => clearInterval(t);
    }, [running, interval]);
    return <span>{frames[idx]}</span>;
  };

  const startAnalyze = () => {
    if (!selectedRow) return;

    const tokenRaw = localStorage.getItem('accessToken');
    const token = tokenRaw ? tokenRaw.replace(/^"+|"+$/g, '') : null;
    if (!token) {
      setErr('인증이 필요합니다.');
      return;
    }

    setAnalyzing(true);
    setAnalyzeMsg('분석을 시작합니다');
    setErr('');

    const url = `${ANALYZE_API_BASE}/${encodeURIComponent(selectedRow.id)}?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);
    let buffer = '';
    let ended = false;

    es.onmessage = (ev) => {
      const chunk = ev.data || '';
      if (!chunk.startsWith('[JSON]') && chunk !== '[END]') {
        return;
      }

      if (chunk.startsWith('[JSON]')) {
        buffer += chunk.replace('[JSON]', '').trim();
        return;
      }

      if (chunk === '[END]') {
        ended = true;
        try {
          const jsonStart = buffer.indexOf('{');
          const jsonEnd = buffer.lastIndexOf('}') + 1;
          const jsonStr = jsonStart >= 0 ? buffer.substring(jsonStart, jsonEnd) : '{}';
          const data = JSON.parse(jsonStr || '{}');

          if (!data.errorCode && (data.message === 'SUCCESS' || !data.message)) {
            setAnalyzeMsg('');     // 로그는 남기지 않음(원하면 유지)
            setAnalyzing(false);
            es.close();
            onSelect && onSelect(selectedRow);
            onClose && onClose();
            // if (!notifiedRef.current) {
            //   notifiedRef.current = true;
            //   // UI 전환이 먼저 반영된 뒤 얼럿 표시
            //   setTimeout(() => { alert('분석이 완료되었습니다.'); }, 0);
            // }
            return;
          }
          setErr(data.message || '분석 결과 처리 중 오류');
        } catch (e) {
          setErr('분석 응답 파싱 실패');
        } finally {
          setAnalyzing(false);
          es.close();
        }
      }
    };

    es.onerror = () => {
      if (!ended) {
        setErr('SSE 연결 오류가 발생했습니다.');
        setAnalyzing(false);
      }
      es.close();
    };
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          폭언 상담 리스트
          <CloseButton onClick={onClose}><IoIosClose size={35} /></CloseButton>
        </ModalHeader>

        {connectionMsg && <StatusMsg>{connectionMsg}</StatusMsg>}
        {analyzeMsg && (
             <StatusMsg>
                 {analyzeMsg}
                 <DotTicker running={analyzing} />
               </StatusMsg>
           )}        {err && <ErrorMsg>{err}</ErrorMsg>}

        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader></TableHeader>
                <TableHeader>상담번호</TableHeader>
                <TableHeader>유형</TableHeader>
                <TableHeader>날짜</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {rows.map((c) => (
                <TableRow
                  key={c.id}
                  onDoubleClick={() => setSelectedId(c.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedId === c.id}
                      onChange={() => setSelectedId(c.id)}
                    />
                  </TableCell>
                  <TableCell title={c.callSessionCode}>{c.callSessionCode}</TableCell>
                  <TableCell>{c.category}</TableCell>
                  <TableCell>{formatDate(c.createdAt)}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>

          {loading && <EmptyState>불러오는 중…</EmptyState>}
          {!loading && rows.length === 0 && !err && (
            <EmptyState>
              표시할 상담이 없습니다.<br />
              {connectionMsg || '요청은 정상 처리되었습니다.'}
            </EmptyState>
          )}
          {hasNext && <div id="scrollSentinel" style={{ height: '20px' }} />}
        </TableWrapper>

        <Footer>
          <StartButton
            disabled={!selectedRow || analyzing}
            onClick={startAnalyze}
            title={!selectedRow ? '항목을 선택하세요' : '이 상담 분석 시작'}
          >
            {analyzing ? '분석 중' : '상담 시작하기'}
          </StartButton>
        </Footer>
      </ModalContainer>
    </Overlay>
  );
};

export default ChatListModal;
