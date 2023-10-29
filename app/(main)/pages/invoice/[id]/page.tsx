'use client'
import React, { useEffect } from 'react'
import InvoiceForm from '../../../../components/InvoiceForm'
import API_BASE_URL from '../../../../../constants/apiConfig'

const EditInvoicePage = ({ params }: { params: { id: string } }) => {

const getInvoiceDetail = async () => {
    const sid = localStorage.getItem('sid')
    const cmd = 'com.awspaas.user.apps.app20231017165850.queryFormDetail'
    const boid = params.id

    // const res = await fetch(`${API_BASE_URL}?cmd=${cmd}&sid=${sid}&boid=${boid}`)
    // const data = await res.json()
    // console.log(data)
    localStorage.setItem('boid', boid)
  }

  useEffect(() => {
    getInvoiceDetail()
  }, [])


  return (
    <div className='edit'>
      <h5>编辑项目费用单: {params.id}</h5>
      <InvoiceForm pageType='edit' onSubmit={() => { }} />
    </div>

  )
}

export default EditInvoicePage
