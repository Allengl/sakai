'use client'
import React from 'react'
import InvoiceForm from '../../../../components/InvoiceForm'

const NewInvoicePage = () => {
  return (
    <div className='card'>
      <h5>新建项目费用单</h5>
      <InvoiceForm pageType='new' onSubmit={() => { }} />
    </div>

  )
}

export default NewInvoicePage
