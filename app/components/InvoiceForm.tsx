import React, { FC, use, useEffect, useRef, useState } from 'react';
import { Controller, set, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { API_BASE_URL } from '../../constants/constants';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { v4 as uuidv4, v5 as uuidv5, validate as uuidValidate } from 'uuid';
import { InputTextarea } from 'primereact/inputtextarea';
import { Sidebar } from 'primereact/sidebar';


interface InvoiceFormProps {
  pageType: 'new' | 'edit' | 'approve'
}

interface WBS {
  ID: string,
  TOPIC_NUM: string,
  WBS_ELEMENT: string,
  MATERIAL_NUM: string,
  BOOK_NAME: string,
  CHIEF: string,
  PLANER_NUM: string,
  DEPT_NAME: string,
  DEPT_NUM: string,
  PLANER_NAME: string,
  TYPE: string,
}

const InvoiceForm: FC<InvoiceFormProps> = ({ pageType }) => {
  const toast = useRef(null);
  const router = useRouter();
  const [WBSDialogVisible, setWBSDialogVisible] = React.useState(false);
  const [wbsData, setWbsData] = React.useState([]);
  const [selectedWbs, setSelectedWbs] = useState<WBS>();
  const [invoiceDetail, setInvoiceDetail] = useState<any>({});
  const [msg, setMsg] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [innerUrl, setInnerUrl] = useState('');
  const sid = localStorage.getItem('sid');
  const processInstId = localStorage.getItem('processInstId');
  const taskInstId = localStorage.getItem('taskInstId');
  const [showButton, setShowButton] = useState(false);

  const newUrl = `http://localhost:8088/portal/r/w?&sid=${sid}&cmd=CLIENT_BPM_FORM_TRACK_OPEN&processInstId=${processInstId}&formInfo=`;


  const randomUUID = uuidv4();


  const show = () => {
    toast.current.show({ severity: 'success', summary: '保存成功', detail: getValues('DOCUMENT_NUM') });
  };

  const show1 = () => {
    toast.current.show({ severity: 'success', summary: '修改成功', detail: getValues('DOCUMENT_NUM') });
  };

  const defaultValues = {
    DOCUMENT_NUM: '',
    WBS_ELEMENT: '',
    MATERIAL_NUM: '',
    BOOK_NAME: '',
    OBJECT_NUM: '',
    DEPT_NUM: '',
    DEPT_NAME: '',
    OBJECT_NAME: '',
    CHIEF: '',
    PLANER_NAME: '',
    COMPANY_CODE: '',
    PLANER_NUM: '',
    CREATEUSER: '',
    CREATEDATE: '',
    UPDATEUSER: '',
    UPDATEDATE: '',
    TYPE: 'WBS 元素'
    // Add other default values as needed
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset
  } = useForm({ defaultValues });


  const createInvoice = async (data: object) => {
    const queryParams = Object.entries(data)
      .filter(([key, value]) => value !== "")
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const sid = localStorage.getItem('sid');
    const cmd = 'com.awspaas.user.apps.app20231017165850.createForm'
    const uid = localStorage.getItem('uid');
    const url = `${API_BASE_URL}?&uid=${uid}&cmd=${cmd}&sid=${sid}&${queryParams}`;
    const response = await fetch(url, {
      method: 'POST',
    });

    const result = await response.json();
    console.log(result);
    if (result.result === 'ok') {
      show();
      localStorage.setItem('boid', result.data);
      setTimeout(() => {
        router.push(`/pages/invoice/edit?id=${result.data}`);
      }, 1000)
      getInvoiceDetail();
    }
  }

  const getInvoiceDetail = async () => {
    const sid = localStorage.getItem('sid')
    const cmd = 'com.awspaas.user.apps.app20231017165850.queryFormDetail'
    const boid = localStorage.getItem('boid')
    const res = await fetch(`${API_BASE_URL}?cmd=${cmd}&sid=${sid}&boid=${boid}`)
    const data = await res.json()
    console.log(data)

    setInvoiceDetail(data)
  }


  const updateInvoice = async (data: object) => {
    const queryParams = Object.entries(data)
      .filter(([key, value]) => value !== "")
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const sid = localStorage.getItem('sid');
    const cmd = 'com.awspaas.user.apps.app20231017165850.updateForm'
    const uid = localStorage.getItem('uid');
    const boid = localStorage.getItem('boid');
    const url = `${API_BASE_URL}?${uid}&cmd=${cmd}&sid=${sid}&${queryParams}&ID=${boid}`;
    const response = await fetch(url, {
      method: 'POST',
    });

    const result = await response.json();
    console.log(result);
    if (result.result === 'ok') {
      show1();
    }

  }

  const getWbsData = async () => {
    const sid = localStorage.getItem('sid');
    const cmd = 'com.awspaas.user.apps.app20231017165850.queryWBSList'
    const url = `${API_BASE_URL}?cmd=${cmd}&sid=${sid}`;
    const response = await fetch(url, {
      method: 'POST',
    });

    const result = await response.json();
    console.log(result);
    setWbsData(result);
  }


  const onSubmit1 = (data: object) => {
    // 如果 data 里面有字段是 undefined，那么就去掉这个字段
    Object.keys(data).forEach(key => {
      if (data[key] === undefined) {
        delete data[key];
      }
    });
    console.log(data);

    const newData = {
      ...data,
      TYPE: 'WBS element'
    }

    if (pageType === 'new') {
      createInvoice(newData)
    } else if (pageType === 'edit') {
      // 如果是编辑页面，那么就调用编辑接口
      updateInvoice(newData)
    }
  }

  const handelApprove = async (msg: string, comment: string) => {
    const sid = localStorage.getItem('sid');
    const cmd = 'CLIENT_BPM_FORM_PAGE_P_SAVE_DATA'
    const uid = localStorage.getItem('uid');
    const processInstId = localStorage.getItem('processInstId');
    const taskInstId = localStorage.getItem('taskInstId');
    const openState = 1
    const currentPage = 1
    const formDefId = ''
    const formData = ''
    const boId = ''
    const boDefId = ''
    const oldFormData = ''
    const idCreate = true
    const isTransact = true
    const isValidateForm = comment === '提交' ? true : 'false'
    const isNew = ''
    const commentInfo = comment === '办理' ?
      { "msg": msg, "isSelected": true, "commentId": `${randomUUID}`, "isCommentCreate": true, "hasFiles": false, "setComments": false, "processDefId": "obj_e9a85bafeeba49e2aa079b00ae93eefa" }
      : { "msg": msg, "isSelected": true, "isValidateForm": comment === '提交' ? true : 'false', "commentOption": comment, "commentId": `${randomUUID}`, "isCommentCreate": true, "hasFiles": false, "setComments": false, "processDefId": "obj_e9a85bafeeba49e2aa079b00ae93eefa" }




    const url = `${API_BASE_URL}?cmd=${cmd}&sid=${sid}&processInstId=${processInstId}&taskInstId=${taskInstId}&openState=${openState}&currentPage=${currentPage}&formDefId=${formDefId}&formData=${formData}&boId=${boId}&boDefId=${boDefId}&oldFormData=${oldFormData}&idCreate=${idCreate}&isTransact=${isTransact}&isValidateForm=${isValidateForm}&commentInfo=${JSON.stringify(commentInfo)}&isNew=${isNew}`;

    if (comment === '提交' || comment === '拒绝') {
      const response = await fetch(url, {
        method: 'POST',
      });
      const data = await response.json();
      // router.push('/pages/invoice')
      console.log(data);
      const res = await fetch(`${API_BASE_URL}?sid=${sid}&cmd=CLIENT_BPM_TASK_TRANSACT&processInstId=${processInstId}&taskInstId=${taskInstId}&openState=1&currentPage=1&selectRole=&isBatch=&isVue=true`,
        {
          method: 'POST',
        }
      )
    }
    if (comment === '办理') {
      await fetch(`${API_BASE_URL}?sid=${sid}&cmd=com.awspaas.user.apps.app20231017165850.completeTask&uid=${uid}&taskid=${taskInstId}`, {
        method: 'POST',
      })
    }
    if (comment === '作废') {
      await fetch(`${API_BASE_URL}?sid=${sid}&cmd=CLIENT_BPM_TASK_DEL_TASK&uid=${uid}&taskInstId=${taskInstId}&processInstId=${processInstId}`)
    }

  }

  const getFormErrorMessage = (name: keyof typeof defaultValues) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
  };

  const showWBSDialog = () => {
    setWBSDialogVisible(true);
  }

  const fetchAllShowButton = async () => {
    const res = await fetch(`${API_BASE_URL}?sid=${sid}&cmd=CLIENT_BPM_FORM_MAIN_PAGE_JSON&processInstId=${processInstId}&taskInstId=${taskInstId}&currentPage=1&openState=1&formDefId=&boId=&displayToolbar=true&lang=`)
    const data = await res.json()
    console.log(data); {
      if (data.data.usertaskComment && data.data.usertaskComment.actionOpinions) {
        setShowButton(true)
      }
    }
  }
  useEffect(() => {

    fetchAllShowButton();

    getWbsData()
    if (pageType === 'edit' || pageType === 'approve') {
      const boid = localStorage.getItem('boid');
      const sid = localStorage.getItem('sid');
      const cmd = 'com.awspaas.user.apps.app20231017165850.queryFormDetail'
      const url = `${API_BASE_URL}?cmd=${cmd}&sid=${sid}&boid=${boid}`;
      fetch(url, {
        method: 'POST',
      }).then(res => res.json()).then(data => {
        console.log(data);
        localStorage.setItem('processInstId', data.BINDID);
        reset({
          DOCUMENT_NUM: data.DOCUMENT_NUM,
          OBJECT_NUM: data.OBJECT_NUM,
          OBJECT_NAME: data.OBJECT_NAME,
          MATERIAL_NUM: data.MATERIAL_NUM,
          BOOK_NAME: data.BOOK_NAME,
          CHIEF: data.CHIEF,
          PLANER_NUM: data.PLANER_NUM,
          PLANER_NAME: data.PLANER_NAME,
          DEPT_NUM: data.DEPT_NUM,
          DEPT_NAME: data.DEPT_NAME,
          CREATEDATE: data.CREATEDATE,
          CREATEUSER: data.CREATEUSER,
          UPDATEDATE: data.UPDATEDATE,
          UPDATEUSER: data.UPDATEUSER,
        })
      })
    }
  }, []);

  const formDisabled = pageType === 'approve';


  const startProcess = async () => {
    const sid = localStorage.getItem('sid');
    const cmd = 'com.awspaas.user.apps.app20231017165850.startProcess'
    const uid = localStorage.getItem('uid');
    const boid = localStorage.getItem('boid');
    const processDefId = 'obj_e9a85bafeeba49e2aa079b00ae93eefa'
    const url = `${API_BASE_URL}?uid=${uid}&cmd=${cmd}&sid=${sid}&boid=${boid}&processDefId=${processDefId}`;
    const response = await fetch(url, {
      method: 'POST',
    });

    const result = await response.json();
    console.log(result);
    if (result.result === 'ok') {
      reset();
      // router.push('/pages/invoice');
    }

  }


  return (
    <form onSubmit={handleSubmit(onSubmit1)} className="flex flex-column gap-2">
      <Toast ref={toast} />
      <Panel header="项目信息">
        <div className="p-fluid formgrid grid">
          <div className="field col-12 md:col-span">
            <Controller
              name="DOCUMENT_NUM"
              control={control}
              rules={{ required: '凭证编号 is required.' }}
              disabled={formDisabled}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name}>凭证编号</label>
                  <InputText
                    id={field.name}
                    type="text"
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
          <div className="field col-12 md:col-3">
            <Controller
              name="OBJECT_NUM"
              control={control}
              disabled={formDisabled}

              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name}>WBS 元素</label>
                  <InputText
                    id={field.name}
                    type="text"
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
          <div className="field col-12 md:col-8">
            <Controller
              name="OBJECT_NAME"
              control={control}
              disabled={formDisabled}

              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name}>&nbsp;</label>
                  <InputText
                    id={field.name}
                    type="text"
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
          <div className="field col-12 md:col-1">
            <div className='flex items-center my-4'>
              <label>&nbsp;</label>
              <Button
                disabled={formDisabled}
                icon="pi pi-search" rounded text raised severity="success" aria-label="Search"
                onClick={showWBSDialog}
              />
            </div>
          </div>
          <div className="field col-12 md:col-3">
            <Controller
              name="MATERIAL_NUM"
              control={control}
              disabled={formDisabled}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name}>物料号</label>
                  <InputText
                    id={field.name}
                    type="text"
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
          <div className="field col-12 md:col-3">
            <Controller
              name="DEPT_NUM"
              control={control}
              disabled={formDisabled}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name}>所属部门</label>
                  <InputText
                    id={field.name}
                    type="text"
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
          <div className="field col-12 md:col-6">
            <Controller
              name="DEPT_NAME"
              control={control}
              disabled={formDisabled}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name}>&nbsp;</label>
                  <InputText
                    id={field.name}
                    type="text"
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
          <div className="field col-12 md:col-12">
            <Controller
              name="BOOK_NAME"
              control={control}
              disabled={formDisabled}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name}>书名</label>
                  <InputText
                    id={field.name}
                    type="text"
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
          <div className="field col-12 md:col-9">
            <Controller
              name="CHIEF"
              control={control}
              disabled={formDisabled}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name}>著译者</label>
                  <InputText
                    id={field.name}
                    type="text"
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
          <div className="field col-12 md:col-3">
            <Controller
              name="PLANER_NAME"
              control={control}
              disabled={formDisabled}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name}>策划编辑</label>
                  <InputText
                    id={field.name}
                    type="text"
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
          <div className="field col-12 md:col-3">
            <Controller
              name="CREATEUSER"
              control={control}
              disabled={formDisabled}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name}>创建人</label>
                  <InputText
                    id={field.name}
                    type="text"
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
          <div className="field col-12 md:col-3">
            <Controller
              name="CREATEDATE"
              control={control}
              disabled={formDisabled}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name}>创建日期</label>
                  <InputText
                    id={field.name}
                    type="text"
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
          <div className="field col-12 md:col-3">
            <Controller
              name="UPDATEUSER"
              control={control}
              disabled={formDisabled}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name}>最后修改人</label>
                  <InputText
                    id={field.name}
                    type="text"
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
          <div className="field col-12 md:col-3">
            <Controller
              name="UPDATEDATE"
              control={control}
              disabled={formDisabled}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name}>最后修改日期</label>
                  <InputText
                    id={field.name}
                    type="text"
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
        </div>
      </Panel>
      <Panel header="费用计入">
        <div className="p-fluid formgrid grid">
          <div className="field col-12 md:col-3">
            <Controller
              name="OBJECT_NUM"
              control={control}
              disabled={formDisabled}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name}>WBS 元素</label>
                  <InputText
                    id={field.name}
                    type="text"
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
          <div className="field col-12 md:col-8">
            <Controller
              name="OBJECT_NAME"
              control={control}
              disabled={formDisabled}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name}>&nbsp;</label>
                  <InputText
                    id={field.name}
                    type="text"
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
          <div className="field col-12 md:col-1">
            <div className='flex items-center my-4'>
              <label>&nbsp;</label>
              <Button icon="pi pi-search" rounded text raised severity="success" aria-label="Search" />
            </div>
          </div>
          <div className="field col-12 md:col-4">
            <Controller
              name="COMPANY_CODE"
              control={control}
              disabled={formDisabled}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name}>公司代码</label>
                  <InputText
                    id={field.name}
                    type="text"
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
          <div className="field col-12 md:col-4">
            <Controller
              name="PLANER_NUM"
              control={control}
              disabled={formDisabled}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name}>申请人编号</label>
                  <InputText
                    id={field.name}
                    type="text"
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
          <div className="field col-12 md:col-4">
            <Controller
              name="administrator"
              control={control}
              disabled={formDisabled}
              render={({ field, fieldState }) => (
                <>
                  <label htmlFor={field.name}>管理员</label>
                  <InputText
                    id={field.name}
                    type="text"
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.error })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
        </div>
      </Panel>
      {
        pageType === 'approve' && (
          <Panel header='审批意见'>
            <InputTextarea
              className='w-full'
              value={msg} onChange={(e) => setMsg(e.target.value)}
              rows={5}
            />
          </Panel>
        )

      }
      <div className="field col-12 md-4 flex gap-3 justify-end">
        {pageType === 'approve' && (
          <>
            {showButton ? (
              <>
                <Button
                  onClick={() => {
                    handelApprove(msg, '提交')
                    toast.current.show({ severity: 'success', summary: '提交成功' });
                    setTimeout(() => {
                      router.push('/pages/invoice')
                    }, 1000)
                  }}
                  label="同意" outlined severity="success" icon="pi pi-check" />
                <Button
                  onClick={() => {
                    handelApprove(msg, '拒绝')
                    toast.current.show({ severity: 'danger', summary: '已拒绝' });

                  }}
                  label="拒绝" outlined severity="danger" icon="pi pi-times" />
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    handelApprove('', '办理')
                    toast.current.show({ severity: 'success', summary: '办理成功' });
                  }}
                  label="办理" outlined severity="success" icon="pi pi-check" />
                <Button
                  onClick={() => {
                    toast.current.show({ severity: 'danger', summary: '已作废' });
                    handelApprove(msg, '作废')
                  }}
                  label="作废" outlined severity="danger" icon="pi pi-times" />
              </>
            )}
            <Button
              label="跟踪" outlined severity="info" icon="pi pi-times"
              onClick={() => {
                setSidebarVisible(true)
              }}
            />
          </>
        )}
        {(pageType === 'edit' || pageType === 'new') && (
          <>
            <Button label="保存" onClick={
              handleSubmit(onSubmit1)
            }
              type="submit" severity="info" icon="pi pi-save" />
            <Button label="提交" onClick={() => {
              startProcess()
            }} severity="success" icon="pi pi-check" />
          </>
        )}
      </div>
      <Dialog header="WBS 元素" visible={WBSDialogVisible} style={{ width: '50vw' }} onHide={() => setWBSDialogVisible(false)}>
        <div className='space-y-2'>
          <DataTable
            value={wbsData}
            paginator
            className="p-datatable-gridlines"
            showGridlines
            rows={5}
            dataKey="ID"
            filterDisplay="menu"
            responsiveLayout="scroll"
            emptyMessage="没有数据."
            selection={selectedWbs}
            onSelectionChange={(e) => {
              setSelectedWbs(e.value)
              console.log(e.value);
            }}
          >
            {/* <Column field="name" header="Name" sortable style={{ minWidth: '12rem' }} />
                        <Column header="Country" filterField="country.name" style={{ minWidth: '12rem' }} body={countryBodyTemplate} filter filterPlaceholder="Search by country" filterClear={filterClearTemplate} filterApply={filterApplyTemplate} />
                        <Column
                            header="Agent"
                            filterField="representative"
                            showFilterMatchModes={false}
                            filterMenuStyle={{ width: '14rem' }}
                            style={{ minWidth: '14rem' }}
                            body={representativeBodyTemplate}
                            filter
                            filterElement={representativeFilterTemplate}
                        />
                        <Column header="Date" filterField="date" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate} filter filterElement={dateFilterTemplate} />
                        <Column header="Balance" filterField="balance" dataType="numeric" style={{ minWidth: '10rem' }} body={balanceBodyTemplate} filter filterElement={balanceFilterTemplate} />
                        <Column field="status" header="Status" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
                        <Column field="activity" header="Activity" showFilterMatchModes={false} style={{ minWidth: '12rem' }} body={activityBodyTemplate} filter filterElement={activityFilterTemplate} />
                        <Column field="verified" header="Verified" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={verifiedBodyTemplate} filter filterElement={verifiedFilterTemplate} />
                     */}
            <Column selectionMode="single" exportable={false}></Column>
            <Column field="TOPIC_NUM" header="选题单凭证编号"
              style={{ width: '10rem', minWidth: '10rem' }} />
            <Column field="WBS_ELEMENT" header="WBS元素" style={{ minWidth: '4rem' }} />
            <Column field="MATERIAL_NUM" header="物料号" style={{ minWidth: '4rem' }}></Column>
            <Column field="BOOK_NAME" header="书名" style={{ minWidth: '4rem' }}></Column>
            <Column field="CHIEF" header="主编(著译者)" style={{ minWidth: '4rem' }}></Column>
            <Column field="PLANER_NUM" header="策划编辑" style={{ minWidth: '4rem' }}></Column>
            <Column field="DEPT_NAME" header="所属部门" style={{ minWidth: '4rem' }}></Column>
            {/* <Column sortable field="PLANER_NAME" header="策划编辑" style={{ minWidth: '4rem' }}></Column> */}
          </DataTable>
          <div className='flex justify-end'>
            <Button label="确认" type="submit" severity="success" icon="pi pi-check" onClick={() => {
              setWBSDialogVisible(false);
              reset({
                DOCUMENT_NUM: selectedWbs?.TOPIC_NUM,
                OBJECT_NUM: selectedWbs?.WBS_ELEMENT,
                OBJECT_NAME: selectedWbs?.BOOK_NAME,
                MATERIAL_NUM: selectedWbs?.MATERIAL_NUM,
                BOOK_NAME: selectedWbs?.BOOK_NAME,
                CHIEF: selectedWbs?.CHIEF,
                PLANER_NUM: selectedWbs?.PLANER_NUM,
                PLANER_NAME: selectedWbs?.PLANER_NAME,
                DEPT_NUM: selectedWbs?.DEPT_NUM,
                DEPT_NAME: selectedWbs?.DEPT_NAME,
              })
            }} />
          </div>
        </div>
      </Dialog>
      <Sidebar visible={sidebarVisible} position="right"
        className='w-8'
        onHide={() => setSidebarVisible(false)}>
        <iframe src={newUrl} className='w-full h-full'
        ></iframe>
      </Sidebar>
    </form >
  );
}

export default InvoiceForm;
