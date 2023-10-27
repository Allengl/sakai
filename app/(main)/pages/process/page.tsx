'use client'
import { InputText } from 'primereact/inputtext';
import { Menubar } from 'primereact/menubar';
import React from 'react'

const nestedMenuitems = [
  {
    label: '待办任务',
    icon: 'pi pi-fw pi-file',
    active: true,
  },
  {
    label: '待阅任务',
    icon: 'pi pi-fw pi-pencil',
  },
  {
    label: '已办任务',
    icon: 'pi pi-fw pi-calendar',
  },
  {
    label: '已阅任务',
    icon: 'pi pi-fw pi-bell',
  }
];


// const menubarEndTemplate = () => {
//   return (
//     <span className="p-input-icon-left">
//       <i className="pi pi-search" />
//       <InputText type="text" placeholder="Search" />
//     </span>
//   );
// };

const ProcessPage = () => {
  return (
    <div>
      <div className="card">
        <h5>流程中心</h5>
        <Menubar model={nestedMenuitems}></Menubar>
      </div>
    </div>
  )
}

export default ProcessPage
