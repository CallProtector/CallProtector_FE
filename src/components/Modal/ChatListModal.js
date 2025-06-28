import React, { useState } from 'react';
import styled from 'styled-components';
import { IoIosClose } from "react-icons/io";

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
  margin-bottom: 20px;
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
const TableWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 350px; 
  margin-bottom: 25px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
  font-size: 16px;
`;

const TableHead = styled.thead`
  border-bottom: 1px solid #ddd;
`;

const TableRow = styled.tr``;

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

  input[type="checkbox"] {
    accent-color: #7a5af8;  
    width: 14px;
    height: 14px;
  }
`;

const StartButton = styled.button`
  align-self: center;
  padding: 12px 24px;
  border-radius: 15px;
  font-size: 17px;
  font-weight: bold;
  color: white;
  background-color: #5C24AF;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #6946e7;
  }
`;

const ChatListModal = ({ onClose }) => {

    const [selectedRow, setSelectedRow] = useState(null);

    const consultations = [...Array(20)].map((_, idx) => ({
        id: `D250405-0${idx + 1}`,
        title: "신용카드 결제수단 변경",
        date: `2025.04.${25 - idx}`,
    }));

    return (
        <Overlay onClick={onClose}>
            <ModalContainer onClick={e => e.stopPropagation()}>
                <ModalHeader>
                    폭언 상담 리스트
                    <CloseButton onClick={onClose}><IoIosClose size={35} /></CloseButton>
                </ModalHeader>
                <TableWrapper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeader></TableHeader>
                                <TableHeader>상담번호</TableHeader>
                                <TableHeader>제목</TableHeader>
                                <TableHeader>날짜</TableHeader>
                            </TableRow>
                        </TableHead>
                        <tbody>
                            {consultations.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            checked={selectedRow === c.id}
                                            onChange={() => setSelectedRow(c.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{c.id}</TableCell>
                                    <TableCell>{c.title}</TableCell>
                                    <TableCell>{c.date}</TableCell>
                                </TableRow>
                            ))}
                        </tbody>
                    </Table>
                </TableWrapper>

                <StartButton
                    disabled={!selectedRow}
                    onClick={() => {
                        if (selectedRow) {
                            alert(`${selectedRow}에 대한 맞춤 상담 시작!`);
                            onClose();
                        }
                    }}
                >상담 시작하기</StartButton>
            </ModalContainer>
        </Overlay>
    );
};

export default ChatListModal;
