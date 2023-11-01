'use client'
import React, { useEffect } from 'react'
import InvoiceForm from '../../../../components/InvoiceForm'

const ApproveInvoicePage = () => {

  return (
    <div className='card'>
      <h5>审批记录</h5>
      <InvoiceForm pageType='approve' />
    </div>

  )
}

export default ApproveInvoicePage
