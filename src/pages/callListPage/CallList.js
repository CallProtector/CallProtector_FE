// import React, { useEffect, useMemo, useState } from "react";
// import { useTable } from "react-table";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./CallList.css";

// const API_BASE_URL = process.env.REACT_APP_API_URL;

// // UI ↔ API 매핑
// const UI_TO_API_CATEGORY = {
//   전체: undefined,
//   욕설: "verbalAbuse",
//   성희롱: "sexualHarass",
//   협박: "threat",
// };
// const API_TO_UI_CATEGORY = {
//   verbalAbuse: "욕설",
//   sexualHarass: "성희롱",
//   threat: "협박",
// };

// // YYYY-MM-DD HH:mm:ss
// const formatDate = (value) => {
//   if (!value) return "-";
//   const d = value instanceof Date ? value : new Date(value);
//   if (Number.isNaN(d.getTime())) return String(value);

//   const pad = (n) => String(n).padStart(2, "0");
//   const yyyy = d.getFullYear();
//   const mm = pad(d.getMonth() + 1);
//   const dd = pad(d.getDate());
//   const HH = pad(d.getHours());
//   const MM = pad(d.getMinutes());
//   const SS = pad(d.getSeconds());
//   return `${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS}`;
// };

// // 하이라이트
// const escapeRegExp = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// const HighlightText = ({ text = "", highlight }) => {
//   if (!highlight) return <span>{text}</span>;
//   const safe = escapeRegExp(highlight);
//   const parts = text.split(new RegExp(`(${safe})`, "gi"));
//   return (
//     <span>
//       {parts.map((part, i) =>
//         part.toLowerCase() === highlight.toLowerCase() ? (
//           <mark key={i} className="highlight">
//             {part}
//           </mark>
//         ) : (
//           <span key={i}>{part}</span>
//         )
//       )}
//     </span>
//   );
// };

// // 유니코드 안전 15자 자르기
// const charSlice = (s = "", n = 15) => [...String(s)].slice(0, n).join("");

// // 스니펫 빌더(표시용): 없으면 "-" / 키워드가 스니펫에 없으면 "키워드 스니펫"
// const buildDisplayText = (snippet = "", term = "") => {
//   const s = charSlice(snippet, 15);
//   if (!term) return s || "-";
//   if (!s) return term; // 서버 스니펫이 비었을 때는 키워드만이라도 보여주기
//   return s.toLowerCase().includes(term.toLowerCase()) ? s : `${term} ${s}`;
// };

// // 검색/스니펫 진단 로그
// const logSearchDiagnostics = (term, list) => {
//   console.groupCollapsed(
//     `%c[검색진단] "${term || "(빈 검색어)"}" → ${list.length}건`,
//     "color:#2a7;font-weight:600;"
//   );
//   list.forEach((s, i) => {
//     const raw = s?.matchedScript ?? "";
//     const display = buildDisplayText(raw, term);
//     console.table([
//       {
//         i: i + 1,
//         id: s?.id,
//         callSessionCode: s?.callSessionCode,
//         rawSnippet: raw,
//         displaySnippet: display,
//         displayLen: [...display].length,
//       },
//     ]);
//   });
//   console.groupEnd();
// };

// const CallList = () => {
//   const navigate = useNavigate();

//   const [category, setCategory] = useState("전체");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortOrder, setSortOrder] = useState("latest"); // latest | oldest
//   const [size] = useState(10);

//   // 데이터 & 페이지네이션
//   const [sessions, setSessions] = useState([]);
//   const [nextCursorId, setNextCursorId] = useState(null);
//   const [hasNext, setHasNext] = useState(false);
//   const [cursorId, setCursorId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const categories = ["전체", "욕설", "성희롱", "협박"];

//   const orderParam = sortOrder === "latest" ? "desc" : "asc";
//   const apiCategory = UI_TO_API_CATEGORY[category];

//   const fetchList = async (cursor = null) => {
//     const token = localStorage.getItem("accessToken");

//     const params = {
//       keyword: searchTerm || undefined,
//       category: apiCategory,
//       order: orderParam,
//       cursorId: cursor ?? undefined,
//       size,
//     };

//     console.groupCollapsed(
//       `%c[CallList] fetchList → cursor:${cursor ?? "null"}`,
//       "color:#6b5b95"
//     );
//     console.debug("▶ params", params);
//     if (!token) {
//       console.warn("⚠️ accessToken이 없습니다. Authorization 헤더 확인 필요");
//     }

//     setLoading(true);
//     try {
//       const { data } = await axios.get(`${API_BASE_URL}/api/call-sessions`, {
//         params,
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const r = data?.result || {};
//       const list = Array.isArray(r.sessions) ? r.sessions : [];

//       // ✅ 키워드/스니펫 진단
//       logSearchDiagnostics(searchTerm, list);

//       console.debug("✅ success meta", {
//         count: list.length,
//         hasNext: r.hasNext,
//         nextCursorId: r.nextCursorId,
//       });
//       console.table(
//         list.map(
//           ({
//             id,
//             callSessionCode,
//             callerNumber,
//             createdAt,
//             category,
//             matchedScript,
//           }) => ({
//             id,
//             callSessionCode,
//             callerNumber,
//             createdAt,
//             category,
//             matchedScript,
//           })
//         )
//       );

//       setSessions(list);
//       setNextCursorId(r.nextCursorId ?? null);
//       setHasNext(Boolean(r.hasNext));
//       setCursorId(cursor ?? null);
//     } catch (e) {
//       const status = e?.response?.status;
//       const body = e?.response?.data;
//       console.error("🛑 [fetchList] 실패", { status, body, error: e });
//       setSessions([]);
//       setNextCursorId(null);
//       setHasNext(false);
//     } finally {
//       setLoading(false);
//       console.groupEnd();
//     }
//   };

//   // 최초 & 탭/정렬 변경 시
//   useEffect(() => {
//     console.log(
//       `🔄 필터 변경 감지 → category:${category} (api:${
//         apiCategory ?? "-"
//       }) / sort:${sortOrder}(${orderParam})`
//     );
//     fetchList(null);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [category, sortOrder]);

//   const data = useMemo(
//     () =>
//       sessions.map((s, idx) => ({
//         no: idx + 1,
//         category: API_TO_UI_CATEGORY[s.category] || s.category || "-",
//         phone: s.callerNumber ?? "-",
//         id: s.id,
//         consultCode: s.callSessionCode ?? "-",
//         date: formatDate(s.createdAt ?? "-"),
//         // 원본 스니펫 그대로 담아두고, Cell에서 15자/하이라이트 처리
//         searchResult: s.matchedScript ?? "",
//       })),
//     [sessions]
//   );

//   const columns = useMemo(
//     () => [
//       { Header: "No", accessor: "no" },
//       { Header: "카테고리", accessor: "category" },
//       { Header: "발신번호", accessor: "phone" },
//       { Header: "상담코드", accessor: "consultCode" },
//       { Header: "시간", accessor: "date" },
//       {
//         Header: "검색 결과",
//         accessor: "searchResult",
//         Cell: ({ value }) => {
//           const display = buildDisplayText(value, searchTerm);
//           return <HighlightText text={display} highlight={searchTerm} />;
//         },
//       },
//     ],
//     [searchTerm] // 🔑 검색어 바뀌면 하이라이트 재계산
//   );

//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
//     useTable({ columns, data });

//   const gotoDetail = (row) => {
//     const id = row.original.id;
//     if (!id) {
//       console.warn("⚠️ 상세 이동 불가: id 없음", row.original);
//       return;
//     }
//     console.log("➡️ gotoDetail", {
//       id,
//       consultCode: row.original.consultCode,
//     });
//     navigate(`/sessions/${id}`);
//   };

//   return (
//     <div className="call-list-container">
//       <h2 className="title">상담내역</h2>

//       <div className="top-bar">
//         {/* 카테고리 탭 */}
//         <div className="tabs">
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               className={`tab-button ${category === cat ? "active" : ""}`}
//               onClick={() => {
//                 console.log(
//                   `🧭 카테고리 탭 클릭 → ${cat} (api:${
//                     UI_TO_API_CATEGORY[cat] ?? "-"
//                   })`
//                 );
//                 setCategory(cat);
//               }}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         {/* 검색 */}
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="상담 중 사용한 단어를 입력해주세요."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 console.log("🔎 검색(Enter)", {
//                   searchTerm,
//                   category,
//                   sortOrder,
//                 });
//                 fetchList(null);
//               }
//             }}
//           />
//           <button
//             className="search-btn"
//             onClick={() => {
//               console.log("🔎 검색(버튼)", { searchTerm, category, sortOrder });
//               fetchList(null);
//             }}
//           >
//             검색하기
//           </button>
//         </div>
//       </div>

//       {/* 결과 개수 & 정렬 */}
//       <div className="search-meta-bar">
//         {/* <span className="result-count">
//           검색 결과 <strong>{sessions.length}</strong>개
//         </span> */}
//         <div className="sort-wrapper">
//           <span className="sort-label">정렬 기준</span>
//           <select
//             className="sort-select"
//             value={sortOrder}
//             onChange={(e) => {
//               const v = e.target.value;
//               console.log("↕️ 정렬 변경", { before: sortOrder, after: v });
//               setSortOrder(v);
//             }}
//           >
//             <option value="latest">최신순</option>
//             <option value="oldest">오래된순</option>
//           </select>
//         </div>
//       </div>

//       {/* 로딩/테이블 */}
//       {loading ? (
//         <div className="loading">불러오는 중...</div>
//       ) : (
//         <table {...getTableProps()} className="call-table">
//           <thead>
//             {headerGroups.map((hg) => (
//               <tr {...hg.getHeaderGroupProps()} key={hg.id}>
//                 {hg.headers.map((col) => (
//                   <th {...col.getHeaderProps()} key={col.id}>
//                     {col.render("Header")}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody {...getTableBodyProps()}>
//             {rows.length === 0 ? (
//               <tr>
//                 <td colSpan={columns.length} style={{ textAlign: "center" }}>
//                   결과가 없습니다.
//                 </td>
//               </tr>
//             ) : (
//               rows.map((row) => {
//                 prepareRow(row);
//                 return (
//                   <tr
//                     {...row.getRowProps()}
//                     key={row.id}
//                     className="clickable-row"
//                     onClick={() => gotoDetail(row)}
//                   >
//                     {row.cells.map((cell) => (
//                       <td {...cell.getCellProps()} key={cell.column.id}>
//                         {cell.render("Cell")}
//                       </td>
//                     ))}
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       )}

//       {/* 커서 페이지네이션 */}
//       <div className="pagination">
//         <button
//           onClick={() => {
//             console.log("⏮️ 처음으로");
//             fetchList(null);
//           }}
//           disabled={loading}
//           aria-label="첫 페이지"
//         >
//           처음
//         </button>
//         <button
//           onClick={() => {
//             console.log("⏭️ 다음 페이지", { nextCursorId, hasNext });
//             fetchList(nextCursorId);
//           }}
//           disabled={!hasNext || loading}
//           aria-label="다음 페이지"
//         >
//           다음
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CallList;

// CallList.jsx
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

// YYYY-MM-DD HH:mm:ss
const formatDate = (value) => {
  if (!value) return "-";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);

  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const HH = pad(d.getHours());
  const MM = pad(d.getMinutes());
  const SS = pad(d.getSeconds());
  return `${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS}`;
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

// 스니펫 빌더(표시용)
const buildDisplayText = (snippet = "", term = "") => {
  const s = charSlice(snippet, 15);
  if (!term) return s || "-";
  if (!s) return term; // 서버 스니펫이 비었을 때는 키워드만이라도
  return s.toLowerCase().includes(term.toLowerCase()) ? s : `${term} ${s}`;
};

// 검색/스니펫 진단 로그
const logSearchDiagnostics = (term, list) => {
  console.groupCollapsed(
    `%c[검색진단] "${term || "(빈 검색어)"}" → ${list.length}건`,
    "color:#2a7;font-weight:600;"
  );
  list.forEach((s, i) => {
    const raw = s?.matchedScript ?? "";
    const display = buildDisplayText(raw, term);
    console.table([
      {
        i: i + 1,
        id: s?.id,
        callSessionCode: s?.callSessionCode,
        rawSnippet: raw,
        displaySnippet: display,
        displayLen: [...display].length,
      },
    ]);
  });
  console.groupEnd();
};

const CallList = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("latest"); // latest | oldest
  const [size] = useState(10);

  // 데이터 & 페이지네이션
  const [sessions, setSessions] = useState([]);
  const [nextCursorId, setNextCursorId] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);

  // 페이지/커서 관리 (Prev/Next 전용)
  const [page, setPage] = useState(1); // 현재 페이지(1부터)
  const [cursorStack, setCursorStack] = useState([null]); // 각 페이지의 cursor 기록

  const categories = ["전체", "욕설", "성희롱", "협박"];
  const orderParam = sortOrder === "latest" ? "desc" : "asc";
  const apiCategory = UI_TO_API_CATEGORY[category];

  // 공용 fetch
  const fetchList = async ({ cursor = null, mode = "reset" } = {}) => {
    const token = localStorage.getItem("accessToken");
    const params = {
      keyword: searchTerm || undefined,
      category: apiCategory,
      order: orderParam,
      cursorId: cursor ?? undefined,
      size,
    };

    console.groupCollapsed(
      `%c[CallList] fetchList → cursor:${cursor ?? "null"} / mode:${mode}`,
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

      // 진단 로그
      logSearchDiagnostics(searchTerm, list);

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
        setCursorStack([null]); // 첫 페이지는 cursor=null
      } else if (mode === "next") {
        setPage((p) => p + 1);
        setCursorStack((prev) => [...prev, cursor]);
      } else if (mode === "prev") {
        setPage((p) => Math.max(1, p - 1));
        setCursorStack((prev) => prev.slice(0, -1));
      }
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

  // 최초 & 탭/정렬 변경 시 첫 페이지부터
  useEffect(() => {
    console.log(
      `🔄 필터 변경 → category:${category} (api:${
        apiCategory ?? "-"
      }) / sort:${sortOrder}(${orderParam})`
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
        searchResult: s.matchedScript ?? "",
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
        Cell: ({ value }) => {
          const display = buildDisplayText(value, searchTerm);
          return <HighlightText text={display} highlight={searchTerm} />;
        },
      },
    ],
    [searchTerm]
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                console.log("🔎 검색(Enter)", {
                  searchTerm,
                  category,
                  sortOrder,
                });
                fetchList({ cursor: null, mode: "reset" });
              }
            }}
          />
          <button
            className="search-btn"
            onClick={() => {
              console.log("🔎 검색(버튼)", { searchTerm, category, sortOrder });
              fetchList({ cursor: null, mode: "reset" });
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
            if (canPrev) fetchList({ cursor: prevCursor, mode: "prev" });
          }}
          disabled={loading || !canPrev}
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
