'use client'
import React, { useEffect } from 'react'
import InvoiceForm from '../../../../components/InvoiceForm'

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
      {/* <Steps className='p-4' model={items} /> */}
      <InvoiceForm pageType='approve'/>
    </div>

  )
}

export default ApproveInvoicePage
