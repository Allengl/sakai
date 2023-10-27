'use client'
import React from 'react'
import InvoiceForm from '../../../../components/InvoiceForm'
import { Steps } from 'primereact/steps'

const ApproveInvoicePage = () => {

  const items = [
    {
      label: '已提交'
    },
    {
      label: '审批中'
    },
    {
      label: '已驳回'
    },
    {
      label: '已通过'
    }
  ];


  return (
    <div className='card'>
      <h5>审批记录</h5>
      <Steps className='p-4' model={items} />
      <InvoiceForm pageType='approve' onSubmit={() => { }} />
    </div>

  )
}

export default ApproveInvoicePage
