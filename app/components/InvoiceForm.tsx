import React, { FC, use, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import API_BASE_URL from '../../constants/apiConfig';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

interface InvoiceFormProps {
  pageType: 'new' | 'edit' | 'approve'
  onSubmit: () => void
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
}

const InvoiceForm: FC<InvoiceFormProps> = ({ pageType, onSubmit }) => {
  const toast = useRef(null);
  const router = useRouter();
  const [WBSDialogVisible, setWBSDialogVisible] = React.useState(false);
  const [wbsData, setWbsData] = React.useState([]);
  const [selectedWbs, setSelectedWbs] = useState<WBS>();

  const show = () => {
    toast.current.show({ severity: 'success', summary: '提交成功', detail: getValues('DOCUMENT_NUM') });
  };

  const show1 = () => {
    toast.current.show({ severity: 'success', summary: '更新', detail: getValues('DOCUMENT_NUM') });
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
    TYPE: '',
    CHIEF: '',
    PLANER_NAME: '',
    COMPANY_CODE: '',
    PLANER_NUM: '',
    CREATEUSER: '',
    CREATEDATE: '',
    UPDATEUSER: '',
    UPDATEDATE: '',
    // Add other default values as needed
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset
  } = useForm({ defaultValues });



  // const onSubmited = (data: object) => {
  //   data.DOCUMENT_NUM && show();

  //   reset();
  // };

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
      reset();
      router.push('/pages/invoice');
    }
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

    // 如果是新建页面，那么就调用新建接口
    if (pageType === 'new') {
      createInvoice(data)
    } else if (pageType === 'edit') {
      // 如果是编辑页面，那么就调用编辑接口
      updateInvoice(data)
    }

  }

  const getFormErrorMessage = (name: keyof typeof defaultValues) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
  };

  const showWBSDialog = () => {
    setWBSDialogVisible(true);
  }

  useEffect(() => {
    getWbsData()
    if(pageType === 'edit') {
      const boid = localStorage.getItem('boid');
      const sid = localStorage.getItem('sid');
      const cmd = 'com.awspaas.user.apps.app20231017165850.queryFormDetail'
      const url = `${API_BASE_URL}?cmd=${cmd}&sid=${sid}&boid=${boid}`;
      fetch(url, {
        method: 'POST',
      }).then(res => res.json()).then(data => {
        console.log(data);
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
              <Button icon="pi pi-search" rounded text raised severity="success" aria-label="Search"
                onClick={showWBSDialog}
              />
            </div>
          </div>
          <div className="field col-12 md:col-3">
            <Controller
              name="MATERIAL_NUM"
              control={control}
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
      <div className="field col-12 md-4 flex gap-3 justify-end">
        {pageType === 'approve' && (
          <>
            <Button label="驳回" type="submit" severity="danger" icon="pi pi-times" />
            <Button label="审批" type="submit" severity="success" icon="pi pi-check" />
          </>
        )}
        {(pageType === 'new' || pageType === 'edit') && (
          <>
            <Button label="保存" type="submit" severity="info" icon="pi pi-save" />
            <Button label="提交" type="submit" severity="success" icon="pi pi-check" />
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
    </form>
  );
}

export default InvoiceForm;
