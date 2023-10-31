'use client'
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Menubar } from 'primereact/menubar';
import React, { useEffect } from 'react'
import API_BASE_URL from '../../../../constants/apiConfig';
import { DataTable } from 'primereact/datatable';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';


const ProcessPage = () => {
  const [todoData, setTodoData] = React.useState([])
  const [taskTitle, setTaskTitle] = React.useState('待办任务')
  const router = useRouter()


  const nestedMenuitems = [
    {
      label: '待办任务',
      icon: 'pi pi-fw pi-file',
      active: true,
      command: () => {
        console.log('待办任务');
        setTaskTitle('待办任务')
      }

    },
    {
      label: '待阅任务',
      icon: 'pi pi-fw pi-pencil',
      command: () => {
        console.log('待阅任务');
        setTaskTitle('待阅任务')
      }
    },
    {
      label: '已办任务',
      icon: 'pi pi-fw pi-calendar',
      command: () => {
        console.log('已办任务');
        setTaskTitle('已办任务')
      }
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


  const queryTask = async (type:
    'queryTodoTask'
    | 'queryToReadTask'
    | 'queryAlreadyDoTask'
    | 'queryAlreadyReadTask'
  ) => {
    const sid = localStorage.getItem('sid')
    const cmd = `com.awspaas.user.apps.app20231017165850.${type}`
    const url = `${API_BASE_URL}?sid=${sid}&cmd=${cmd}`;

    const res = await fetch(url, {
      method: 'POST',
    })

    const data = await res.json()
    console.log(data);
    setTodoData(data)
  }

  const taskTitleMap = {
    '待办任务': 'queryTodoTask',
    '待阅任务': 'queryToReadTask',
    '已办任务': 'queryAlreadyDoTask',
    '已阅任务': 'queryAlreadyReadTask',
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
                    onClick={()=>{
                      console.log(row)
                      localStorage.setItem('taskInstId', row.id)
                      localStorage.setItem('processInstId', row.processInstId)
                      router.push(`/pages/invoice/approve?targetRoleId=${row.targetRoleId}`)
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
