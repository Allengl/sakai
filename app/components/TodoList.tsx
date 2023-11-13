import React, { FC, useState } from 'react';
import { Message } from 'primereact/message';
import { formatTimestamp } from '../../lib/utils';
import Link from 'next/link';
import { TodayTask } from '../../types/data';
import { useApiStore } from '../stores/useApiStore';
import { API_BASE_URL } from '../../constants/constants';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';

const TodoList: FC<{ todoData: TodayTask[], type: string }> = ({ todoData, type }) => {
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const { sid, uid, cmd, taskInstId, processInstId, setTaskInstId, setProcessInstId, setBoid } = useApiStore()
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(3);
  // Ensure todoData is an array before using array methods
  if (!Array.isArray(todoData)) {
    console.error('todoData is not an array:', todoData);
    return null; // You may choose another fallback behavior
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  const visibleItems = todoData.slice(startIndex, endIndex);


  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
    setRows(event.rows);
    setCurrentPage(event.page + 1);
  };

  return (
    <div>
      {todoData.length === 0 ? (
        <Message severity="info" text="今日无待办事项" />
      ) : (
        // Render the todo list and pagination controls
        <div>
          <ul className="p-0 mx-0 mt-0 mb-4 list-none">
            {visibleItems.map((todo, index) => (
              <Link key={index}
                onClick={async () => {
                  setTaskInstId(todo.id)
                  setProcessInstId(todo.processInstId)
                  setBoid(todo.boid)

                  const baseUrl = API_BASE_URL;
                  const sid = localStorage.getItem('sid')
                  const taskInstId = todo.id
                  const processInstId = todo.processInstId
                  const cmd = 'CLIENT_BPM_FORM_MAIN_PAGE_OPEN'
                  const url = `${baseUrl}?sid=${sid}&cmd=${cmd}&taskInstId=${taskInstId}&processInstId=${processInstId}&openState=1`;
                  const res = await fetch(url, { method: 'POST' })
                }}
                href={`/pages/process/task?taskType=${type}&id=${todo.boid}`}>
                <li className="flex align-items-center py-3 border-bottom-1 surface-border mr-4 mb-4">
                  <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                    <i className="pi pi-info-circle text-xl text-blue-500" />
                  </div>
                  <span className="text-900 line-height-3">
                    {formatTimestamp(todo.beginTime)}
                    <span className="text-700">
                      {' '}
                      {todo.title} for <span className="text-blue-500">{todo.target}</span>
                    </span>
                  </span>
                </li>
              </Link>
            ))}
          </ul>
          <Paginator first={first} rows={3} totalRecords={todoData.length} onPageChange={onPageChange} template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
        </div>
      )}
    </div>
  );
};

export default TodoList;
