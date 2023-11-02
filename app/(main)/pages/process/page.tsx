'use client'
import { Column } from 'primereact/column';
import { Menubar } from 'primereact/menubar';
import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../../../../constants/constants';
import { DataTable } from 'primereact/datatable';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { useApiStore } from '../../../stores/useApiStore';
import { Todo } from '../../../../types/data';
import { useDataStore } from '../../../stores/useDataStore';

interface TaskTitleMap {
  '待办任务': string
  '待阅任务': string
  '已办任务': string
  '已阅任务': string
}

type TaskTitle = keyof TaskTitleMap

const ProcessPage = () => {
  const { sid, uid, cmd, taskInstId, processInstId, setTaskInstId, setProcessInstId, setBoid } = useApiStore()
  const { todoData, setTodoData } = useDataStore()
  const [taskTitle, setTaskTitle] = useState<TaskTitle>('待办任务')
  const router = useRouter()


  const nestedMenuitems = [
    {
      label: '待办任务',
      icon: 'pi pi-fw pi-file',
      active: true,
      command: () => { setTaskTitle('待办任务') }
    },
    {
      label: '待阅任务',
      icon: 'pi pi-fw pi-pencil',
      command: () => { setTaskTitle('待阅任务') }
    },
    {
      label: '已办任务',
      icon: 'pi pi-fw pi-calendar',
      command: () => { setTaskTitle('已办任务') }
    },
    {
      label: '已阅任务',
      icon: 'pi pi-fw pi-bell',
      command: () => {
        console.log('已阅任务');
        setTaskTitle('已阅任务')
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

  const taskTitleMap: TaskTitleMap = {
    '待办任务': 'queryTodoTask',
    '待阅任务': 'queryToReadTask',
    '已办任务': 'queryAlreadyDoTask',
    '已阅任务': 'queryAlreadyReadTask',
  }

  const taskTypeMap = {
    '待办任务': 'todo',
    '待阅任务': 'read',
    '已办任务': 'done',
    '已阅任务': 'readDone',
  }

  useEffect(() => {
    queryTask(taskTitleMap[taskTitle])
  }, [taskTitle])

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
                      router.push(`/pages/process/task?taskType=${taskTypeMap[taskTitle]}&id=${row.boid} `)
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
