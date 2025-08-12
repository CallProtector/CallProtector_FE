import React, { useEffect, useMemo, useState } from 'react';
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

const MoreButton = styled.button`
  padding: 12px 18px;
  border-radius: 12px;
  font-size: 15px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  &:disabled { opacity: .5; cursor: not-allowed; }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #777;
  padding: 28px 0;
`;

function formatDate(s) {
  try { return new Date(s).toLocaleString(); } catch { return s; }
}

/**
 * @param {{ onClose: () => void, onSelect: (session: {id:number, callSessionCode:string, createdAt:string, category:string}) => void }} props
 */
const ChatListModal = ({ onClose, onSelect }) => {
  // 순수 JS로 변경 (타입 표기 제거)
  const [rows, setRows] = useState([]);     // [{id, callSessionCode, createdAt, category}]
  const [selectedId, setSelectedId] = useState(null);
  const [cursorId, setCursorId] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [connectionMsg, setConnectionMsg] = useState(''); // 연동 확인 메시지

  const ABUSE_SESSIONS_API = 'http://localhost:8080/api/call-sessions/abusive';
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
      qs.set('size', String(size ?? DEFAULT_PAGE_SIZE)); // 첫 요청도 size 명시

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

      // 명세 스키마: { isSuccess, code, message, result: { sessions, nextCursorId, hasNext } }
      const result = (data && data.result) || {};
      const sessions = Array.isArray(result.sessions) ? result.sessions : [];
      const next = (result.nextCursorId !== undefined) ? result.nextCursorId : null;
      const nextFlag = !!result.hasNext;

      setRows(prev => (replace ? sessions : [...prev, ...sessions]));
      setCursorId(next);
      setHasNext(nextFlag);

      // 0건이어도 연동 OK 표시
      if ((replace || cursor == null) && sessions.length === 0) {
        setConnectionMsg('✅ API 연동 성공 (데이터 0건) — 인증/경로/스키마 OK');
      } else if (sessions.length > 0) {
        setConnectionMsg('✅ API 연동 성공');
      }

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
    // 첫 페이지 로드
    fetchPage({ replace: true, size: DEFAULT_PAGE_SIZE });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedRow = useMemo(
    () => rows.find(r => r.id === selectedId) || null,
    [rows, selectedId]
  );

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          폭언 상담 리스트
          <CloseButton onClick={onClose}><IoIosClose size={35} /></CloseButton>
        </ModalHeader>

        {connectionMsg && <StatusMsg>{connectionMsg}</StatusMsg>}

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
                  onDoubleClick={() => {
                    setSelectedId(c.id);
                    onSelect && onSelect(c);
                    onClose && onClose();
                  }}
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
              표시할 상담이 없습니다.<br/>
              {connectionMsg || '요청은 정상 처리되었습니다.'}
            </EmptyState>
          )}
          {err && <EmptyState style={{ color: '#c00' }}>{err}</EmptyState>}
        </TableWrapper>

        <Footer>
          {hasNext && (
            <MoreButton
              onClick={() => fetchPage({ cursor: cursorId })}
              disabled={loading}
            >
              더 보기
            </MoreButton>
          )}
          <StartButton
            disabled={!selectedRow}
            onClick={() => {
              if (!selectedRow) return;
              onSelect && onSelect(selectedRow);
              onClose && onClose();
            }}
          >
            상담 시작하기
          </StartButton>
        </Footer>
      </ModalContainer>
    </Overlay>
  );
};

export default ChatListModal;
