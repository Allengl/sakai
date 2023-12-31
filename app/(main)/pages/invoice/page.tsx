'use client';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column, ColumnFilterApplyTemplateOptions, ColumnFilterClearTemplateOptions, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { API_BASE_URL } from '../../../../constants/constants';
import { Tag } from 'primereact/tag';
import { useApiStore } from '../../../stores/useApiStore';
import { useDataStore } from '../../../stores/useDataStore';
import { Invoice } from '../../../../types/data';
import { type } from 'os';


const InvoicePage = () => {
    let emptyProduct: Invoice = {
        DOCUMENT_NUM: "",
        STATUS: "",
        OBJECT_NUM: "",
        DEPT_NAME: "",
        MATERIAL_NUM: "",
        OBJECT_NAME: "",
        BOOK_NAME: "",
        ID: "",
        TYPE: "",
        PLANER_NAME: ""
    };

    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<Invoice>(emptyProduct);
    const [globalFilterValue, setGlobalFilterValue1] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Invoice>(null as any)
    const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false);
    const { cmd, uid, sid, boid, setCmd, setBoid } = useApiStore();
    const { invoiceData, setInvoiceData } = useDataStore();
    const [statuses] = useState<string[]>(['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK']);
    const toast = useRef<Toast>(null);
    const router = useRouter();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        getInvoice();
        initFilters();
        setLoading(false);
    }, [])


    const getInvoice = async () => {
        const queryFormListCmd = `${cmd}.queryFormList`
        const res = await fetch(`${API_BASE_URL}?uid=${uid}&cmd=${queryFormListCmd}&sid=${sid}`, { method: 'POST' })
        const data = await res.json()
        console.log(data);
        setLoading(false);
        setInvoiceData(data)

    }

    const hideDeleteInvoiceDialog = () => {
        setDeleteProductDialog(false);
    };

    const deleteInvoice = async () => {
        const removeFormCmd = `${cmd}.removeForm`
        const boid = selectedProduct!.ID
        const res = await fetch(`${API_BASE_URL}?cmd=${removeFormCmd}&sid=${sid}&boid=${boid}`, { method: 'POST' })
        const data = await res.json()
        console.log(data);
        toast.current?.show({ severity: 'success', summary: '成功', detail: '删除成功!', life: 3000 });

    }


    const deleteProduct = () => {
        const selectedProductId = selectedProduct!.ID;
        let _invoiceData = invoiceData.filter((val) => val.ID !== selectedProductId);
        setInvoiceData(_invoiceData);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        setSelectedProduct(null as any)
        deleteInvoice();
    };


    const ConfirmDeleteSelected = () => {
        setBoid(selectedProduct?.ID)
        setDeleteProductDialog(true);
    };

    const deleteProductDialogFooter = (
        <div className='space-x-4'>
            <Button type="button" severity="danger" icon="pi pi-times" label="否" outlined onClick={hideDeleteInvoiceDialog} />
            <Button type="button" severity="success" icon="pi pi-check" label="是" outlined onClick={deleteProduct} />

        </div>
    );

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        (_filters1['global'] as any).value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <div className="space-x-2">
                    <Button className="m-1" type="button" severity="success" icon="pi pi-plus" label="新增" outlined
                        onClick={() => {
                            router.push('/pages/invoice/new/')
                        }} />
                    <Button className="m-1" disabled={!selectedProduct
                        || selectedProduct.STATUS !== 'NOSTART'
                    }
                        type="button" severity="warning" icon="pi pi-trash" label="删除" outlined
                        onClick={ConfirmDeleteSelected} />
                    <Button className="m-1" disabled={!selectedProduct}
                        type="button" severity="info" icon="pi pi-file" label="编辑" outlined
                        onClick={() => {
                            console.log(selectedProduct);
                            setBoid(selectedProduct?.ID)
                            router.push(`/pages/invoice/edit?id=${selectedProduct?.ID}`)
                        }}
                    />
                    <Button className="m-1" disabled={!selectedProduct}
                        type="button" severity="help" icon="pi pi-file-edit" label="审批记录" outlined onClick={
                            () => {
                                setBoid(selectedProduct?.ID)
                                router.push(`/pages/invoice/approve?id=${selectedProduct?.ID}`)
                            }
                        } />
                </div>
                <span className="p-input-icon-left m-1">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="关键词筛选" />
                </span>
            </div>
        );
    };



    const initFilters = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            TYPE: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            OBJECT_NUM: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            OBJECT_NAME: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            DEPT_NAME: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            BOOK_NAME: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            MATERIAL_NUM: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            STATUS: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
        });
        setGlobalFilterValue1('');
    };


    const getSeverity = (value: string) => {
        switch (value) {
            case 'active':
                return 'success';

            case 'NOSTART':
                return 'warning';

            case 'terminate':
                return 'danger';

            case 'INSTOCK':
                return 'info';

            default:
                return null;
        }
    };

    const statusBodyTemplate = (rowData: Invoice) => {
        return <Tag value={rowData.STATUS} severity={getSeverity(rowData.STATUS)}></Tag>;
    };


    const header = renderHeader();

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>项目费用单</h5>
                    <Toast ref={toast} />
                    <DataTable
                        value={invoiceData}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        dataKey="ID"
                        filters={filters1}
                        filterDisplay="menu"
                        loading={loading}
                        responsiveLayout="scroll"
                        emptyMessage="没有数据..."
                        header={header}
                        selection={selectedProduct}
                        onSelectionChange={(e) => {
                            setSelectedProduct(e.value)
                            console.log(e.value);
                        }}
                        footer={`共 ${invoiceData.length} 条`}
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
                        <Column sortable field="TYPE" header="费用记录类型"
                            style={{ width: '10rem', minWidth: '10rem' }} />
                        <Column sortable field="OBJECT_NUM" header="对象号" style={{ minWidth: '4rem' }} />
                        <Column sortable field="OBJECT_NAME" header="对象描述" style={{ minWidth: '4rem' }}></Column>
                        <Column sortable field="DEPT_NAME" header="所属部门" style={{ minWidth: '4rem' }}></Column>
                        <Column sortable field="BOOK_NAME" header="书名" style={{ minWidth: '4rem' }}></Column>
                        <Column sortable field="MATERIAL_NUM" header="物料号" style={{ minWidth: '4rem' }}></Column>
                        {/* <Column sortable field="PLANER_NAME" header="策划编辑" style={{ minWidth: '4rem' }}></Column> */}
                        <Column field="STATUS" header="状态" body={statusBodyTemplate} style={{ width: '10%' }}></Column>

                    </DataTable>
                </div>

                <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="确认" modal footer={deleteProductDialogFooter} onHide={hideDeleteInvoiceDialog}>
                    <div className="confirmation-content flex items-center">
                        {product && (
                            <span>
                                确定要删除选中项吗?
                            </span>
                        )}
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default InvoicePage;
