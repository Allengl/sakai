'use client'
import React from 'react'
import InvoiceForm from '../../../../components/InvoiceForm'

const EditInvoicePage = () => {
  return (
    <div className='edit'>
      <h5>编辑项目费用单</h5>
      <InvoiceForm pageType='edit' onSubmit={() => { }} />
    </div>

  )
}

export default EditInvoicePage
