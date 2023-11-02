'use client'
import React from 'react'
import InvoiceForm from '../../../../components/InvoiceForm'
import { useSearchParams } from 'next/navigation'

export type TaskType = 'todo' | 'read' | 'done' | 'readDone';


const EditInvoicePage = () => {
  const params = useSearchParams()

  const taskType = params.get('taskType') as TaskType

  return (
    <div className='edit'>
      <h5>审批项目费用单</h5>
      <InvoiceForm pageType='task' taskType={taskType} />
    </div>

  )
}

export default EditInvoicePage
