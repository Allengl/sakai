'use client'
import { Column } from 'primereact/column';
import { Menubar } from 'primereact/menubar';
import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../../../../constants/constants';
import { DataTable } from 'primereact/datatable';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApiStore } from '../../../stores/useApiStore';
import { useDataStore } from '../../../stores/useDataStore';
import { formatTimestamp } from '../../../../lib/utils';
import { Todo } from '../../../../types/data';

interface TaskMap {
  'todo': string
  'read': string
  'done': string
  'readDone': string
  [key: string]: string; // 添加字符串索引签名
}

interface AllTaskData {
  todoData: Todo[],
  readData: Todo[],
  doneData: Todo[],
  readDoneData: Todo[],
  todoWithReadState0: {
    data: Todo[],
    length: number,
  },
  readWithReadState0: {
    data: Todo[],
    length: number,
  },
  doneWithReadState0: {
    data: Todo[],
    length: number,
  },
  readDoneWithReadState0: {
    data: Todo[],
    length: number,
  },
}

const ProcessPage = () => {
  const { sid, uid, cmd, taskInstId, processInstId, setTaskInstId, setProcessInstId, setBoid } = useApiStore()
  const { todoData, setTodoData } = useDataStore()
  const [taskTitle, setTaskTitle] = useState<string>('待办任务')
  const searchParams = useSearchParams()
  const router = useRouter()
  const params = searchParams.get('taskType')
  const [allTaskData, setAllTaskData] = useState<AllTaskData>({
    todoData: [],
    readData: [],
    doneData: [],
    readDoneData: [],
    todoWithReadState0: {
      data: [],
      length: 0,
    },
    readWithReadState0: {
      data: [],
      length: 0,
    },
    doneWithReadState0: {
      data: [],
      length: 0,
    },
    readDoneWithReadState0: {
      data: [],
      length: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todoData = await queryTask('queryTodoTask');
        const readData = await queryTask('queryToReadTask');
        const doneData = await queryTask('queryAlreadyDoTask');
        const readDoneData = await queryTask('queryAlreadyReadTask');

        const filterByReadState = (dataArray: Todo[], readState: number) => {
          const filteredArray = dataArray.filter((item: Todo) => item.readState === readState);
          return {
            data: filteredArray,
            length: filteredArray.length,
          };
        };

        const todoWithReadState0 = filterByReadState(todoData, 0);
        const readWithReadState0 = filterByReadState(readData, 0);
        const doneWithReadState0 = filterByReadState(doneData, 0);
        const readDoneWithReadState0 = filterByReadState(readDoneData, 0);

        console.log(todoWithReadState0, readWithReadState0, doneWithReadState0, readDoneWithReadState0);


        setAllTaskData({
          todoData,
          readData,
          doneData,
          readDoneData,
          todoWithReadState0,
          readWithReadState0,
          doneWithReadState0,
          readDoneWithReadState0,
        });
      } catch (error) {
        router.push('/auth/error');
        // 处理错误，可能显示错误信息给用户
      }
    };

    fetchData();
  }, []);


  const todoStyle = {
    fontWeight: 'bold',
    backgroundColor: '#f6f8fa', // 修改为黄色背景
    borderRadius: '8px', // 修改为更大的圆角
    color: '#63a9ea', // 修改为黑色字体
    textColor: '#63a9ea', // 修改为黑色字体
    // 添加其他样式属性...
  };

  const nestedMenuitems = [
    {
      label: `待办任务 ${allTaskData?.todoWithReadState0.length === 0 ? '\u00A0\u00A0\u00A0' : allTaskData?.todoWithReadState0.length}`,
      icon: 'pi pi-fw pi-file',
      command: () => {
        router.push('/pages/process?taskType=todo')
      },
      style: params === 'todo' ? todoStyle : {
        margin: '0 0 1px 1px'
      }
    },
    {
      label: `待阅任务 ${allTaskData?.readWithReadState0.length === 0 ? '\u00A0\u00A0\u00A0' : allTaskData?.readWithReadState0.length}`,
      icon: 'pi pi-fw pi-pencil',
      command: () => {
        router.push('/pages/process?taskType=read')
      },
      style: params === 'read' ? todoStyle : {
        margin: '0 0 1px 1px',
      }
    },
    {
      label: `已办任务 ${allTaskData?.doneWithReadState0.length === 0 ? '\u00A0\u00A0\u00A0' : allTaskData?.doneWithReadState0.length}`,
      icon: 'pi pi-fw pi-calendar',
      command: () => {
        router.push('/pages/process?taskType=done')
      },
      style: params === 'done' ? todoStyle : {
        margin: '0 0 1px 1px'
      }
    },
    {
      label: `已阅任务 ${allTaskData?.readDoneWithReadState0.length === 0 ? '\u00A0\u00A0\u00A0' : allTaskData?.readDoneWithReadState0.length}`,
      icon: 'pi pi-fw pi-bell',
      command: () => {
        router.push('/pages/process?taskType=readDone')
      },
      style: params === 'readDone' ? todoStyle : {
        margin: '0 0 1px 1px'
      }
    }
  ];


  const queryTask = async (type: string) => {
    const queryTaskCmd = `${cmd}.${type}`
    const url = `${API_BASE_URL}?sid=${sid}&cmd=${queryTaskCmd}&uid=${uid}`;
    const res = await fetch(url, { method: 'POST' })
    const data = await res.json()
    return data
  }

  const taskMap: TaskMap = {
    'todo': 'queryTodoTask',
    'read': 'queryToReadTask',
    'done': 'queryAlreadyDoTask',
    'readDone': 'queryAlreadyReadTask',
  }

  const taskTitleMap: TaskMap = {
    'todo': '待办任务',
    'read': '待阅任务',
    'done': '已办任务',
    'readDone': '已阅任务'
  }


 


  useEffect(() => {
    console.log(params);
    
    const fetchData = async () => {
      try {
        if (params) {
          setTaskTitle(taskTitleMap[params]);
          const res = await queryTask(taskMap[params]);
          console.log(res);
          setTodoData(res);
        } else {
          router.push('/pages/process?taskType=todo');
        }
      } catch (error) {
        router.push('/auth/error');
      }
    };

    fetchData();
  }, [taskTitle, searchParams])

  return (
    <div>
      <div className="card">
        <h5>流程中心</h5>
        <Menubar model={nestedMenuitems} />
        <Panel className='mt-4' header={taskTitle}>
          <DataTable
            value={todoData}
            paginator
            className="p-datatable-gridlines"
            showGridlines
            rows={5}
            rowsPerPageOptions={[5, 10, 20]}
            dataKey="id"
            filterDisplay="menu"
            responsiveLayout="scroll"
            emptyMessage={()=>(
              <span
                style={{
                  display: 'flex',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',                  
                }}
              >暂无数据</span>
            )}
            footer={`共 ${todoData.length} 条`}
          // selection={selectedWbs}
          // onSelectionChange={(e) => {
          //   setSelectedWbs(e.value)
          //   console.log(e.value);
          // }}
          >
            <Column field="target" header="来自"
              style={{ width: '10rem', minWidth: '10rem' }}
              body={(rowData) => (
                <div style={{
                  fontWeight: rowData.readState === 1 ? 'normal' : 'bold',
                }} >
                  <div>{rowData.target}</div>
                </div>
              )}
            />
            <Column field="title" header="标题" style={{ minWidth: '4rem' }}
              body={(rowData) => (
                <div style={{
                  fontWeight: rowData.readState === 1 ? 'normal' : 'bold',
                }} >
                  <div>{rowData.title}</div>
                </div>
              )}
            />
            <Column field="activityType" header="类型" style={{ minWidth: '4rem' }}
              body={(rowData) => (
                <div style={{
                  fontWeight: rowData.readState === 1 ? 'normal' : 'bold',
                }} >
                  <div>{rowData.activityType}</div>
                </div>
              )}
            ></Column>
            <Column
              field="beginTime"
              header="时间"
              body={
                (rowData) => (
                  <div style={{
                    fontWeight: rowData.readState === 1 ? 'normal' : 'bold',
                  }} >
                    <div>{formatTimestamp(rowData.beginTime)}</div>
                  </div>
                )
              }
              style={{ minWidth: '4rem' }}
            ></Column>
            <Column field="remindTimes" header="期限" style={{ minWidth: '4rem' }}
              body={(rowData) => (
                <div style={{
                  fontWeight: rowData.readState === 1 ? 'normal' : 'bold',
                }} >
                  <div>{rowData.remindTimes}</div>
                </div>
              )}
            ></Column>
            <Column
              header="查看"
              style={{ width: '15%' }}
              body={(row) => (
                <>
                  <Button
                    onClick={async () => {
                      console.log(row)
                      setTaskInstId(row.id)
                      setProcessInstId(row.processInstId)
                      setBoid(row.boid)

                      const baseUrl = API_BASE_URL;
                      const sid = localStorage.getItem('sid')
                      const taskInstId = row.id
                      const processInstId = row.processInstId
                      const cmd = 'CLIENT_BPM_FORM_MAIN_PAGE_OPEN'
                      const url = `${baseUrl}?sid=${sid}&cmd=${cmd}&taskInstId=${taskInstId}&processInstId=${processInstId}&openState=1`;
                      const res = await fetch(url, { method: 'POST' })

                      if (params !== null && taskMap[params]) {
                        router.push(`/pages/process/task?taskType=${params}&id=${row.boid}`)
                      }
                    }}
                    icon="pi pi-search" text
                  />
                </>
              )}
            />
          </DataTable>
        </Panel>
      </div>
    </div>
  )
}

export default ProcessPage
