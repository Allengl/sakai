import React, { FC, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';

interface InvoiceFormProps {
  pageType: 'new' | 'edit' | 'approve'
  onSubmit: () => void
}


const InvoiceForm: FC<InvoiceFormProps> = ({ pageType, onSubmit }) => {
  const toast = useRef(null);

  const show = () => {
    toast.current.show({ severity: 'success', summary: '提交成功', detail: getValues('value') });
  };

  const defaultValues = {
    value: '',
    voucherNumber: '',
    // Add other default values as needed
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset
  } = useForm({ defaultValues });



  const onSubmited = (data: object) => {
    data.value && show();

    reset();
  };

  const getFormErrorMessage = (name: keyof typeof defaultValues) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
  };

  return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-2">
        <Toast ref={toast} />
        <Panel header="项目信息">
          <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-span">
              <Controller
                name="voucherNumber"
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
                name="wbsElement"
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
            <div className="field col-12 md:col-9">
              <Controller
                name="wbsElement"
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
            <div className="field col-12 md:col-3">
              <Controller
                name="materialNumber"
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
            <div className="field col-12 md:col-9">
              <Controller
                name="bookName"
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
                name="translator"
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
                name="plannerEditor"
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
                name="creator"
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
                name="creationDate"
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
                name="lastModifier"
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
                name="lastModifiedDate"
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
                name="wbsElement2"
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
            <div className="field col-12 md:col-9">
              <Controller
                name="wbsElement"
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
            <div className="field col-12 md:col-4">
              <Controller
                name="companyCode"
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
                name="applicantNumber"
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
      </form>
  );
}

export default InvoiceForm;
