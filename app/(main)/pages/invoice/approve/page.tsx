'use client'
import React, { useEffect } from 'react'
import InvoiceForm from '../../../../components/InvoiceForm'
import { Steps } from 'primereact/steps'
import API_BASE_URL from '../../../../../constants/apiConfig';




const getInvoiceDetail = async () => {
  const sid = localStorage.getItem('sid')
  const cmd = 'com.awspaas.user.apps.app20231017165850.queryFormDetail'
  const boid = localStorage.getItem('boid')
  const res = await fetch(`${API_BASE_URL}?cmd=${cmd}&sid=${sid}&boid=${boid}`)
  const data = await res.json()
  console.log(data)

}


const ApproveInvoicePage = () => {
  const [data, setData] = React.useState({})

  useEffect(() => {
    setData(getInvoiceDetail())
  }, [])

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
      <InvoiceForm pageType='approve'
        data={data}
      />
    </div>

  )
}

export default ApproveInvoicePage
