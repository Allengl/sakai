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

interface TaskMap {
  'todo': string
  'read': string
  'done': string
  'readDone': string
  [key: string]: string; // 添加字符串索引签名
}


const ProcessPage = () => {
  const { sid, uid, cmd, taskInstId, processInstId, setTaskInstId, setProcessInstId, setBoid } = useApiStore()
  const { todoData, setTodoData } = useDataStore()
  const [taskTitle, setTaskTitle] = useState<string>('待办任务')
  const searchParams = useSearchParams()
  const router = useRouter()
  const params = searchParams.get('taskType')

  const nestedMenuitems = [
    {
      label: '待办任务',
      icon: 'pi pi-fw pi-file',
      active: true,
      command: () => {
        router.push('/pages/process?taskType=todo')
      }
    },
    {
      label: '待阅任务',
      icon: 'pi pi-fw pi-pencil',
      command: () => {
        router.push('/pages/process?taskType=read')
      }
    },
    {
      label: '已办任务',
      icon: 'pi pi-fw pi-calendar',
      command: () => {
        router.push('/pages/process?taskType=done')
      }
    },
    {
      label: '已阅任务',
      icon: 'pi pi-fw pi-bell',
      command: () => {
        router.push('/pages/process?taskType=readDone')
      }
    }
  ];


  const queryTask = async (type: string) => {
    const queryTaskCmd = `${cmd}.${type}`
    const url = `${API_BASE_URL}?sid=${sid}&cmd=${queryTaskCmd}&uid=${uid}`;
    const res = await fetch(url, { method: 'POST' })
    const data = await res.json()
    console.log(data);
    setTodoData(data)
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
    if (params) {
      setTaskTitle(taskTitleMap[params])
      queryTask(taskMap[params])
    } else {
      router.push('/pages/process?taskType=todo')
    }
  }, [taskTitle, searchParams])

  return (
    <div>
      <div className="card">
        <h5>流程中心</h5>
        <Menubar model={nestedMenuitems}
        ></Menubar>
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
            emptyMessage="没有数据."
          // selection={selectedWbs}
          // onSelectionChange={(e) => {
          //   setSelectedWbs(e.value)
          //   console.log(e.value);
          // }}
          >
            <Column field="target" header="来自"
              style={{ width: '10rem', minWidth: '10rem' }} />
            <Column field="title" header="标题" style={{ minWidth: '4rem' }} />
            <Column field="activityType" header="类型" style={{ minWidth: '4rem' }}></Column>
            <Column field="beginTime" header="时间" style={{ minWidth: '4rem' }}></Column>
            <Column field="remindTimes" header="期限" style={{ minWidth: '4rem' }}></Column>
            <Column
              header="查看"
              style={{ width: '15%' }}
              body={(row) => (
                <>
                  <Button
                    onClick={() => {
                      console.log(row)
                      setTaskInstId(row.id)
                      setProcessInstId(row.processInstId)
                      setBoid(row.boid)
                      if (params !== null && taskMap[params]) {
                        router.push(`/pages/process/task?taskType=${taskMap[params]}&id=${row.boid} `)
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
