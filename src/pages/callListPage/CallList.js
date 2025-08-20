import React, { useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CallList.css";

const API_BASE_URL = process.env.REACT_APP_API_URL;

// UI ↔ API 매핑
const UI_TO_API_CATEGORY = {
  전체: undefined,
  욕설: "verbalAbuse",
  성희롱: "sexualHarass",
  협박: "threat",
};
const API_TO_UI_CATEGORY = {
  verbalAbuse: "욕설",
  sexualHarass: "성희롱",
  threat: "협박",
};

// YYYY-MM-DD HH:mm:ss (KST 고정)
const formatDate = (value) => {
  if (!value) return "-";

  // 공통: KST 파츠 → 문자열 조립
  const toKstYmdHms = (dateObj) => {
    const parts = new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(dateObj);
    const get = (t) => parts.find((p) => p.type === t)?.value ?? "";
    return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get(
      "minute"
    )}:${get("second")}`;
  };

  // 1) 타임존 없는 ISO → UTC로 간주해 파싱
  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T/.test(value) &&
    !/[Z+-]\d{2}:?\d{2}$/.test(value)
  ) {
    const m = value.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?$/
    );
    if (m) {
      const [, y, M, d, h, min, s, frac] = m;
      const ms = frac ? Math.floor(Number(`0.${frac}`) * 1000) : 0;
      const dUTC = new Date(Date.UTC(+y, +M - 1, +d, +h, +min, +s, ms));
      return toKstYmdHms(dUTC); // ← formatToParts로 조립
    }
  }

  // 2) 그 외(Z/오프셋 포함, Date/epoch 등)
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return toKstYmdHms(d); // ← 동일 로직 사용
};

// ── 하이라이트 유틸 ─────────────────────────────────────────────
const escapeRegExp = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const HighlightText = ({ text = "", highlight }) => {
  if (!highlight) return <span>{text}</span>;
  const safe = escapeRegExp(highlight);
  const parts = text.split(new RegExp(`(${safe})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i} className="highlight">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

// 유니코드 안전 15자 자르기
const charSlice = (s = "", n = 15) => [...String(s)].slice(0, n).join("");

const buildSnippetForDisplay = (snippet = "") =>
  charSlice(snippet || "", 15) || "-";

// 검색/스니펫 진단 로그(확정 키워드로만)
const logSearchDiagnostics = (term, list) => {
  console.groupCollapsed(
    `%c[검색진단] 확정 키워드="${term || "(없음)"}" → ${list.length}건`,
    "color:#2a7;font-weight:600;"
  );
  list.forEach((s, i) => {
    const raw = s?.matchedScript ?? "";
    const display = buildSnippetForDisplay(raw);
    console.table([
      {
        i: i + 1,
        id: s?.id,
        code: s?.callSessionCode,
        rawSnippet: raw,
        displaySnippet: display,
        includesKeyword: term
          ? raw.toLowerCase().includes(term.toLowerCase())
          : null,
      },
    ]);
  });
  console.groupEnd();
};

const CallList = () => {
  const navigate = useNavigate();

  // 🔑 입력 중인 값 vs 확정된(검색 수행에 쓸) 키워드 분리
  const [inputTerm, setInputTerm] = useState(""); // 인풋창 타이핑 값
  const [keyword, setKeyword] = useState(""); // 검색 버튼/Enter로 확정된 값

  const [category, setCategory] = useState("전체");
  const [sortOrder, setSortOrder] = useState("latest"); // latest | oldest
  const [size] = useState(10);

  // 데이터 & 페이지네이션
  const [sessions, setSessions] = useState([]);
  const [nextCursorId, setNextCursorId] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);

  // Prev/Next 전용 커서/페이지 스택
  const [page, setPage] = useState(1);
  const [cursorStack, setCursorStack] = useState([null]); // 각 페이지의 cursor 기록

  const categories = ["전체", "욕설", "성희롱", "협박"];
  const orderParam = sortOrder === "latest" ? "desc" : "asc";
  const apiCategory = UI_TO_API_CATEGORY[category];

  // 공용 fetch (확정 키워드만 사용)
  const fetchList = async ({
    cursor = null,
    mode = "reset",
    term = null, // 전달되면 이걸 우선 사용 (버튼/Enter에서 넘김)
  } = {}) => {
    const token = localStorage.getItem("accessToken");
    const effectiveKeyword = term ?? keyword ?? "";

    const params = {
      keyword: effectiveKeyword || undefined,
      category: apiCategory,
      order: orderParam,
      cursorId: cursor ?? undefined,
      size,
    };

    console.groupCollapsed(
      `%c[CallList] fetchList → cursor:${
        cursor ?? "null"
      } / mode:${mode} / keyword:"${effectiveKeyword || ""}"`,
      "color:#6b5b95"
    );
    console.debug("▶ params", params);
    if (!token)
      console.warn("⚠️ accessToken 없음: Authorization 헤더 확인 필요");

    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/call-sessions`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      const r = data?.result || {};
      const list = Array.isArray(r.sessions) ? r.sessions : [];

      // 확정 키워드로 진단
      logSearchDiagnostics(effectiveKeyword, list);

      console.debug("✅ success meta", {
        count: list.length,
        hasNext: r.hasNext,
        nextCursorId: r.nextCursorId,
      });
      console.table(
        list.map(
          ({
            id,
            callSessionCode,
            callerNumber,
            createdAt,
            category,
            matchedScript,
          }) => ({
            id,
            callSessionCode,
            callerNumber,
            createdAt,
            category,
            matchedScript,
          })
        )
      );

      setSessions(list);
      setNextCursorId(r.nextCursorId ?? null);
      setHasNext(Boolean(r.hasNext));

      // 페이지/커서 갱신
      if (mode === "reset") {
        setPage(1);
        setCursorStack([null]);
      } else if (mode === "next") {
        setPage((p) => p + 1);
        setCursorStack((prev) => [...prev, cursor]);
      } else if (mode === "prev") {
        setPage((p) => Math.max(1, p - 1));
        setCursorStack((prev) => prev.slice(0, -1));
      }

      // 버튼/Enter에서 term을 넘겨받아 검색했다면, 그 값을 확정 키워드로 저장
      if (term !== null) setKeyword(term);
    } catch (e) {
      const status = e?.response?.status;
      const body = e?.response?.data;
      console.error("🛑 [fetchList] 실패", { status, body, error: e });
      setSessions([]);
      setNextCursorId(null);
      setHasNext(false);
      if (mode === "reset") {
        setPage(1);
        setCursorStack([null]);
      }
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  // 최초 & 탭/정렬 변경 시: 현재 확정 키워드로 다시 조회
  useEffect(() => {
    console.log(
      `🔄 필터 변경 → category:${category} (api:${
        apiCategory ?? "-"
      }) / sort:${sortOrder}(${orderParam}) / keyword:"${keyword}"`
    );
    fetchList({ cursor: null, mode: "reset" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sortOrder]);

  // 표 데이터 (No는 누적 번호)
  const data = useMemo(
    () =>
      sessions.map((s, idx) => ({
        no: (page - 1) * size + idx + 1,
        category: API_TO_UI_CATEGORY[s.category] || s.category || "-",
        phone: s.callerNumber ?? "-",
        id: s.id,
        consultCode: s.callSessionCode ?? "-",
        date: formatDate(s.createdAt ?? "-"),
        // 서버 스니펫 그대로 (최대 15자) — 검색어를 앞에 덧붙이지 않음
        searchResult: buildSnippetForDisplay(s.matchedScript),
      })),
    [sessions, page, size]
  );

  const columns = useMemo(
    () => [
      { Header: "No", accessor: "no" },
      { Header: "카테고리", accessor: "category" },
      { Header: "발신번호", accessor: "phone" },
      { Header: "상담코드", accessor: "consultCode" },
      { Header: "시간", accessor: "date" },
      {
        Header: "검색 결과",
        accessor: "searchResult",
        // 하이라이트는 "확정된 키워드"만 사용
        Cell: ({ value }) => <HighlightText text={value} highlight={keyword} />,
      },
    ],
    [keyword]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const gotoDetail = (row) => {
    const id = row.original.id;
    if (!id) {
      console.warn("⚠️ 상세 이동 불가: id 없음", row.original);
      return;
    }
    console.log("➡️ gotoDetail", { id, consultCode: row.original.consultCode });
    navigate(`/sessions/${id}`);
  };

  // Prev/Next 상태
  const canPrev = page > 1;
  const prevCursor =
    canPrev && cursorStack.length >= 2
      ? cursorStack[cursorStack.length - 2]
      : null;

  return (
    <div className="call-list-container">
      <h2 className="title">상담내역</h2>

      <div className="top-bar">
        {/* 카테고리 탭 */}
        <div className="tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab-button ${category === cat ? "active" : ""}`}
              onClick={() => {
                console.log(
                  `🧭 카테고리 탭 클릭 → ${cat} (api:${
                    UI_TO_API_CATEGORY[cat] ?? "-"
                  })`
                );
                setCategory(cat);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 검색 */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="상담 중 사용한 단어를 입력해주세요."
            value={inputTerm}
            onChange={(e) => setInputTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                console.log("🔎 검색(Enter): 확정 키워드 적용", {
                  inputTerm,
                  category,
                  sortOrder,
                });
                // 입력값으로 "확정 검색"
                fetchList({ cursor: null, mode: "reset", term: inputTerm });
              }
            }}
          />
          <button
            className="search-btn"
            onClick={() => {
              console.log("🔎 검색(버튼): 확정 키워드 적용", {
                inputTerm,
                category,
                sortOrder,
              });
              fetchList({ cursor: null, mode: "reset", term: inputTerm });
            }}
          >
            검색하기
          </button>
        </div>
      </div>

      {/* 결과 개수 & 정렬 */}
      <div className="search-meta-bar">
        <div className="sort-wrapper">
          <span className="sort-label">정렬 기준</span>
          <select
            className="sort-select"
            value={sortOrder}
            onChange={(e) => {
              const v = e.target.value;
              console.log("↕️ 정렬 변경", { before: sortOrder, after: v });
              setSortOrder(v);
            }}
          >
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
          </select>
        </div>
      </div>

      {/* 로딩/테이블 */}
      {loading ? (
        <div className="loading">불러오는 중...</div>
      ) : (
        <table {...getTableProps()} className="call-table">
          <thead>
            {headerGroups.map((hg) => (
              <tr {...hg.getHeaderGroupProps()}>
                {hg.headers.map((col) => (
                  <th {...col.getHeaderProps()}>{col.render("Header")}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center" }}>
                  결과가 없습니다.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps({
                      className: "clickable-row",
                      onClick: () => gotoDetail(row),
                    })}
                  >
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}

      {/* 페이지네이션: 이전 / 다음 */}
      <div className="pagination">
        <button
          onClick={() => {
            console.log("◀️ 이전 페이지", { prevCursor, page, cursorStack });
            if (page > 1) fetchList({ cursor: prevCursor, mode: "prev" });
          }}
          disabled={loading || page <= 1}
          aria-label="이전 페이지"
        >
          이전
        </button>
        <button
          onClick={() => {
            console.log("⏭️ 다음 페이지", {
              nextCursorId,
              hasNext,
              page,
              cursorStack,
            });
            fetchList({ cursor: nextCursorId, mode: "next" });
          }}
          disabled={!hasNext || loading}
          aria-label="다음 페이지"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default CallList;
