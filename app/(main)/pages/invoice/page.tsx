'use client';
import { CustomerService } from '../../../../demo/service/CustomerService';
import { ProductService } from '../../../../demo/service/ProductService';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column, ColumnFilterApplyTemplateOptions, ColumnFilterClearTemplateOptions, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { DataTable, DataTableExpandedRows, DataTableFilterMeta, DataTableValue } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';

import React, { useEffect, useRef, useState } from 'react';
import type { Demo } from '../../../../types/types';
import { Dialog } from 'primereact/dialog';

interface Product {
    id: string | null;
    feetype: string;
    objnumber: string;
    objdesc: string;
}



const InvoicePage = () => {

    let emptyProduct: Product = {
        id: null,
        feetype: '',
        objnumber: '',
        objdesc: '',
    };

    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<Product>(emptyProduct);
    const [products, setProducts] = useState<Demo.Product[]>([]);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product>(null as any)
    const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false);
    const toast = useRef<Toast>(null);
    const router = useRouter();



    const clearFilter1 = () => {
        initFilters1();
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };



    const deleteProduct = () => {
        const selectedProductId = selectedProduct!.id;
        let _products = products.filter((val) => val.id !== selectedProductId);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current?.show({ severity: 'success', summary: '成功', detail: '删除成功!', life: 3000 });
        console.log('删除成功');

    };

    const ConfirmDeleteSelected = () => {
        setDeleteProductDialog(true);
    };

    const deleteProductDialogFooter = (
        <div className='space-x-4'>
            <Button type="button" severity="danger" icon="pi pi-times" label="否" outlined onClick={hideDeleteProductDialog} />

            {/* <Button className='bg-white text-lg	p-3 text-green-400 border-1 border-green-400'
            onClick={deleteProduct}
          >
          </Button> */}
            <Button type="button" severity="success" icon="pi pi-check" label="是" outlined onClick={deleteProduct} />

        </div>
    );

    const onGlobalFilterChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                            router.push('/pages/invoice/create/')
                        }} />
                    <Button className="m-1" disabled={!selectedProduct}
                        type="button" severity="warning" icon="pi pi-trash" label="删除" outlined onClick={ConfirmDeleteSelected} />
                    <Button className="m-1" disabled={!selectedProduct}
                        type="button" severity="info" icon="pi pi-filter-slash" label="编辑" outlined
                        onClick={() => {
                            router.push('/pages/invoice/create/')
                        }}
                    />
                    <Button className="m-1" disabled={!selectedProduct}
                        type="button" severity="help" icon="pi pi-filter-slash" label="审批记录" outlined onClick={clearFilter1} />
                </div>
                <span className="p-input-icon-left m-1">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="关键词筛选" />
                </span>
            </div>
        );
    };

    useEffect(() => {
        ProductService.getProductsWithOrdersSmall().then((data) => {
            setLoading(false);
            setProducts(data)
        });

        initFilters1();
    }, []);


    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            'country.name': {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
            },
            balance: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            status: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue1('');
    };




    const header = renderHeader();

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>项目费用单</h5>
                    <Toast ref={toast} />
                    <DataTable
                        value={products}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        dataKey="id"
                        filters={filters1}
                        filterDisplay="menu"
                        loading={loading}
                        responsiveLayout="scroll"
                        emptyMessage="没有数据."
                        header={header}
                        selection={selectedProduct}
                        onSelectionChange={(e) => {
                            setSelectedProduct(e.value)
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
                        <Column sortable field="name" header="费用记录类型"
                            style={{ width: '10rem', minWidth: '10rem' }} />
                        <Column sortable field="name" header="对象号" style={{ minWidth: '4rem' }} />
                        <Column sortable field="name" header="对象描述" style={{ minWidth: '4rem' }}></Column>
                        <Column sortable field="name" header="所属部门" style={{ minWidth: '4rem' }}></Column>
                        <Column sortable field="name" header="书名" style={{ minWidth: '4rem' }}></Column>
                        <Column sortable field="name" header="物料号" style={{ minWidth: '4rem' }}></Column>
                        <Column sortable field="name" header="策划编辑" style={{ minWidth: '4rem' }}></Column>

                    </DataTable>
                </div>

                <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="确认" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                    <div className="confirmation-content flex items-center">
                        {product && (
                            <span>
                                确定要删除选中项 <b>{product.id}</b>吗?
                            </span>
                        )}
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default InvoicePage;
