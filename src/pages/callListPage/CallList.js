import React, { useState } from "react";
import { useTable } from "react-table";
import "./CallList.css";

const CallList = () => {
  const [category, setCategory] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");

  const categories = ["전체", "폭언", "성희롱"];

  const data = React.useMemo(
    () => [
      {
        no: 1,
        category: "폭언",
        phone: "010-1234-5678",
        consultId: "D250405-01",
        date: "2023-07-10 20:04:23",
      },
      {
        no: 2,
        category: "성희롱",
        phone: "010-5678-1234",
        consultId: "D250405-02",
        date: "2023-07-11 14:30:12",
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      { Header: "No", accessor: "no" },
      { Header: "카테고리", accessor: "category" },
      { Header: "발신번호", accessor: "phone" },
      {
        Header: "상담번호",
        accessor: "consultId",
      },
      { Header: "시간", accessor: "date" },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <>
      <nav className="placeholder-nav">네브바 자리</nav>
      <div className="call-list-container">
        <h2 className="title">상담기록</h2>

        {/* 검색창 + 검색 버튼 */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="상담 중 사용한 단어를 입력해주세요."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn">검색하기</button>
        </div>

        {/* 카테고리 + 정렬 옵션 */}
        <div className="top-bar">
          {/*카테고리 탭*/}
          <div className="tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`tab-button ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/*정렬 옵션*/}
          <div className="sort-options">
            <span
              className={sortOrder === "latest" ? "selected" : ""}
              onClick={() => setSortOrder("latest")}
            >
              최신순
            </span>
            <span
              className={sortOrder === "oldest" ? "selected" : ""}
              onClick={() => setSortOrder("oldest")}
            >
              오래된 순
            </span>
          </div>
        </div>

        {/* 테이블 */}
        <table {...getTableProps()} className="call-table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* 페이지네이션 자리 */}
        <div className="pagination">
          <button>{"<"}</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>{">"}</button>
        </div>
      </div>
    </>
  );
};

export default CallList;
