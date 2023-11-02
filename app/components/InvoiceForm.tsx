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
import { Wbs } from '../../types/data';
import { removeUndifinedKeys } from '../../lib/utils';
import { useApiStore } from '../stores/useApiStore';
import { useDataStore } from '../stores/useDataStore';
import { TaskType } from '../(main)/pages/process/task/page';


interface InvoiceFormProps {
  pageType: 'new' | 'edit' | 'approve' | 'task';
  taskType?: TaskType
}

interface Show {
  severity: "success" | "info" | "warn" | "error" | undefined,
  summary: string,
  detail?: React.ReactNode,
  life?: number
}

const InvoiceForm: FC<InvoiceFormProps> = ({ pageType }) => {
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const [WBSDialogVisible, setWBSDialogVisible] = React.useState(false);
  const [selectedWbs, setSelectedWbs] = useState<Wbs>();
  const [invoiceDetail, setInvoiceDetail] = useState<any>({});
  const [msg, setMsg] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const { cmd, uid, sid, boid, processInstId, taskInstId, setCmd, setUid, setSid, setBoid, setProcessInstId, setTaskInstId } = useApiStore();
  const { invoiceData, wbsData, setInvoiceData, setWbsData } = useDataStore();

  const newUrl = `http://localhost:8088/portal/r/w?&sid=${sid}&cmd=CLIENT_BPM_FORM_TRACK_OPEN&processInstId=${processInstId}&formInfo=`;


  const randomUUID = uuidv4();


  const show = () => {
    toast.current?.show({ severity: 'success', summary: '保存成功', detail: getValues('DOCUMENT_NUM') });
  };

  const show1 = ({ severity = 'success', summary = '保存成功', detail, }: Show) => {
    toast.current?.show({ severity, summary, detail });
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

  const getWbsData = async () => {
    const queryWBSListCmd = `${cmd}.queryWBSList`
    const url = `${API_BASE_URL}?cmd=${queryWBSListCmd}&sid=${sid}`;
    const response = await fetch(url, { method: 'POST' });
    const result = await response.json();
    console.log(result);
    setWbsData(result);
  }

  const getInvoiceDetail = async () => {
    const queryFormDetailCmd = `${cmd}.queryFormDetail`
    const res = await fetch(`${API_BASE_URL}?cmd=${queryFormDetailCmd}&sid=${sid}&boid=${boid}`)
    const data = await res.json()
    console.log(data)
    setInvoiceDetail(data)
  }

  const createInvoice = async (data: object) => {
    const queryParams = Object.entries(data)
      .filter(([key, value]) => value !== "")
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const createFormCmd = `${cmd}.createForm`
    const url = `${API_BASE_URL}?&uid=${uid}&cmd=${createFormCmd}&sid=${sid}&${queryParams}`;
    const response = await fetch(url, { method: 'POST' });
    const result = await response.json();
    console.log(result);
    if (result.result === 'ok') {
      show1({ severity: 'success', summary: '创建成功', detail: '即将跳转到编辑页面' });
      localStorage.setItem('boid', result.data);
      setBoid(result.data);
      setTimeout(() => {
        router.push(`/pages/invoice/edit?id=${result.data}`);
      }, 2000)
      getInvoiceDetail();
    }
  }

  const updateInvoice = async (data: object) => {
    const queryParams = Object.entries(data)
      .filter(([key, value]) => value !== "")
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const updateFormCmd = `${cmd}.updateForm`
    const url = `${API_BASE_URL}?uid=${uid}&cmd=${updateFormCmd}&sid=${sid}&${queryParams}&ID=${boid}`;
    const response = await fetch(url, { method: 'POST' });
    const result = await response.json();
    console.log(result);
    if (result.result === 'ok') {
      show1({ severity: 'success', summary: '修改成功' });
    }
  }

  const onSubmit = (data: object) => {
    removeUndifinedKeys(data);
    console.log(data);
    const newData = {
      ...data,
      TYPE: 'WBS element'
    }

    if (pageType === 'new') {
      createInvoice(newData)
    } else if (pageType === 'edit') {
      updateInvoice(newData)
    }
  }

  const handelApprove = async (msg: string, comment: string) => {
    const cmd = 'CLIENT_BPM_FORM_PAGE_P_SAVE_DATA'
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
      const response = await fetch(url, { method: 'POST' });
      // router.push('/pages/invoice')
      const res = await fetch(`${API_BASE_URL}?sid=${sid}&cmd=CLIENT_BPM_TASK_TRANSACT&processInstId=${processInstId}&taskInstId=${taskInstId}&openState=1&currentPage=1&selectRole=&isBatch=&isVue=true`, { method: 'POST' })
      const data = await res.json()
      console.log(data);
      if (data.result === 'ok') {
        if (comment === '提交') {
          show1({ severity: 'success', summary: '提交成功', detail: data.msg });
        }
        if (comment === '拒绝') {
          show1({ severity: 'error', summary: '已拒绝', detail: data.msg });
        }
        setTimeout(() => {
          window.location.reload();
        }, 2000)
      } else {
        show1({ severity: 'error', summary: '提交失败', detail: data.msg });
      }
    }
    if (comment === '办理') {
      const res = await fetch(`${API_BASE_URL}?sid=${sid}&cmd=com.awspaas.user.apps.app20231017165850.completeTask&uid=${uid}&taskid=${taskInstId}`, { method: 'POST' })
      const data = await res.json()
      if (data.result === 'ok') {
        show1({ severity: 'success', summary: '办理成功', detail: data.msg });
        setTimeout(() => {
          window.location.reload();
        }, 2000)
      } else {
        show1({ severity: 'error', summary: '办理失败', detail: data.msg });
      }
    }
    if (comment === '作废') {
      const res = await fetch(`${API_BASE_URL}?sid=${sid}&cmd=CLIENT_BPM_TASK_DEL_TASK&uid=${uid}&taskInstId=${taskInstId}&processInstId=${processInstId}`, { method: 'POST' })
      const data = await res.json()
      if (data.result === 'ok') {
        show1({ severity: 'success', summary: '已作废', detail: data.msg });
        setTimeout(() => {
          window.location.reload();
        }, 2000)
      } else {
        show1({ severity: 'error', summary: '作废失败', detail: data.msg });
      }
    }

  }

  const getFormErrorMessage = (name: keyof typeof defaultValues) => {
    return errors[name] ? <small className="p-error">{errors[name]?.message}</small> : <small className="p-error">&nbsp;</small>;
  };

  const showWBSDialog = () => {
    setWBSDialogVisible(true);
  }

  const fetchAllShowButton = async () => {
    const res = await fetch(`${API_BASE_URL}?sid=${sid}&cmd=CLIENT_BPM_FORM_MAIN_PAGE_JSON&processInstId=${processInstId}&taskInstId=${taskInstId}&currentPage=1&openState=1&formDefId=&boId=&displayToolbar=true&lang=`, {
      method: 'POST',
      cache: 'no-store'
    })
    const data = await res.json()
    console.log(data);
    {
      if (data.data.usertaskComment && data.data.usertaskComment.actionOpinions) {
        setShowButton(true)
      }
      console.log(showButton);

    }
  }


  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (pageType === 'task') {
      fetchAllShowButton();
    }
    if (pageType === 'new' || pageType === 'edit') {
      getWbsData()
    }
    if (pageType === 'edit' || pageType === 'task' || pageType === 'approve') {
      const queryFormDetailCmd = `${cmd}.queryFormDetail`
      const url = `${API_BASE_URL}?cmd=${queryFormDetailCmd}&sid=${sid}&boid=${boid}`;
      fetch(url, { method: 'POST' }).then(res => res.json()).then(data => {
        console.log(data);
        if (data) {
          setInvoiceDetail(data);
          if (pageType === 'approve') {
            setProcessInstId(data.BINDID);
          }
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
        } else {
          show1({ severity: 'error', summary: '获取数据失败', detail: data.msg });
        }

      })
    }
  }, []);

  const formDisabled = pageType === 'approve' || pageType === 'task' ? true : false;


  const startProcess = async () => {
    const startProcessCmd = `${cmd}.startProcess`
    const processDefId = 'obj_e9a85bafeeba49e2aa079b00ae93eefa'
    const url = `${API_BASE_URL}?uid=${uid}&cmd=${startProcessCmd}&sid=${sid}&boid=${boid}&processDefId=${processDefId}`;
    const response = await fetch(url, { method: 'POST' });
    const result = await response.json();
    console.log(result);
    if (result.result === 'ok') {
      reset();
      show1({ severity: 'success', summary: '提交成功', detail: result.msg });
      setTimeout(() => {
        window.location.reload();
      }, 2000)
    }

  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-2">
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
                type='button'
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
              <Button
                onClick={showWBSDialog}
                type='button'
                disabled={formDisabled}
                icon="pi pi-search"
                rounded text raised severity="success"
                aria-label="Search" />
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
              name="PLANER_NAME"
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
        pageType === 'task' && (
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
        {pageType === 'task' && (
          <>
            {showButton ? (
              <>
                <Button
                  type='button'
                  onClick={() => {
                    handelApprove(msg, '提交')
                  }}
                  label="同意" outlined severity="success" icon="pi pi-check" />
                <Button
                  type='button'
                  onClick={() => {
                    handelApprove(msg, '拒绝')
                  }}
                  label="拒绝" outlined severity="danger" icon="pi pi-times" />
              </>
            ) : (
              <>
                <Button
                  type='button'
                  onClick={() => {
                    handelApprove('', '办理')
                  }}
                  label="办理" outlined severity="success" icon="pi pi-check" />
                <Button
                  type='button'
                  onClick={() => {
                    handelApprove(msg, '作废')
                  }}
                  label="作废" outlined severity="danger" icon="pi pi-times" />
              </>
            )}
          </>
        )}
        {(pageType === 'task' || pageType === 'approve') && (
          <Button
            type='button'
            style={{ display: invoiceDetail.STATUS === 'NOSTART' ? 'none' : 'block' }}
            label="跟踪" outlined severity="info" icon="pi pi-angle-double-up"
            onClick={() => {
              setSidebarVisible(true)
            }}
          />
        )}
        {
          (pageType === 'edit' || pageType === 'new') && (
            <>
              <Button
                label="保存"
                disabled={!(pageType === 'new') && invoiceDetail.STATUS !== 'NOSTART'}
                onClick={handleSubmit(onSubmit)}
                type="submit"
                severity="info"
                icon="pi pi-save"
              />
              <Button
                label="提交"
                disabled={!(pageType === 'new') && invoiceDetail.STATUS !== 'NOSTART'}
                onClick={startProcess}
                severity="success"
                icon="pi pi-check"
              />
            </>
          )
        }
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
            onSelectionChange={(e: any) => {
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
            <Button label="确认" className='mt-4' type="submit" severity="success" icon="pi pi-check" onClick={() => {
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
        <iframe src={newUrl} className='w-full h-full' />
      </Sidebar>
    </form >
  );
}

export default InvoiceForm;
