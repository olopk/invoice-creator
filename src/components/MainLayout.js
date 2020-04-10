import React, {useState, useEffect} from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import { Layout } from 'antd';
import NavBar from '../components/Navigation/NavBar';
import InvoiceForm from './forms/invoiceForm/InvoiceForm';
import MainTable from './Tables/mainTable/mainTable';
import {fetch_invoices, delete_invoice} from '../api_calls/invoices';
import {fetch_customers, delete_customer} from '../api_calls/customers';
import {fetch_products, delete_product} from '../api_calls/products';

import MainModal from './Modals/mainModal';

import ShowNotification from '../components/NotificationSnackbar/Notification';
// import classes from './MainLayout.module.css';

const { Header, Content, Footer} = Layout;

const MainLayout = (props) => {
    const [state, setState] = useState({
        invoices: null,
        singleInvoice: null,
        customers: null,
        singleCustomer: null,
        products: null,
        singleCustomer: null,
        loading: false,
        modalVisible: false,
        modalData: null,
        modalDataType: null,
        modalWidth: null,
        errors: []
    })
    //MODAL OPERATIONS
    const modalHandleOpen = (modalDataType, modalData) => {
        let modalWidth;
        console.log(modalDataType)
        switch(modalDataType){
            case 'invoice':
                modalWidth = 1280;
                break;
            case 'customer':
                modalWidth = 700;
                break;
            default:
                modalWidth = 800;
        }
        setState({
            ...state,
            modalVisible: true,
            modalDataType: modalDataType,
            modalData: modalData,
            modalWidth: modalWidth
        })
    }
    const modalHandleCancel = () => {
        setState({
            ...state,
            modalVisible: false
        })
    }
    // ------------------------------------------------------------
    // INVOICES OPERATIONS 
    // const get_single_invoice = async (id) => {
    //     const data = await fetch_single_invoice(id);
    //     if(data.error){
    //         ShowNotification('error', data.error.message)
    //     }else{
    //         setState({...state, singleInvoice: data.data});
    //     }
    // }
    const invoice_remove = async (id) => {
        const callUpdate = () => {
            const updatedInvoices = state.invoices.filter(el => el._id !== id);
            setState({...state, invoices: updatedInvoices})
        }
        const request = await delete_invoice(id);
        ShowNotification(request.status, request.message, callUpdate)
    }
    // ------------------------------------------------------------
     // CUSTOMERS OPERATIONS 
    // const get_single_customer = async (id) => {
    //     const data = await fetch_single_customer(id);
    //     if(data.error){
    //         ShowNotification('error', data.error.message)
    //     }else{
    //         setState({...state, singleCustomer: data.data});
    //     }
    // }
    const customer_remove = async (id) => {
        const callUpdate = () => {
            const updatedCustomers = state.customers.filter(el => el._id !== id);
            setState({...state, customers: updatedCustomers})
        }
        const request = await delete_customer(id);
        ShowNotification(request.status, request.message, callUpdate)
    }
    // ------------------------------------------------------------
    // PRODUCTS OPERATIONS 
    const product_remove = async (id) => {
        const callUpdate = () =>{
            const updatedProducts = state.products.filter(el => el._id !== id);
            setState({...state, products: updatedProducts})
        }
        const request = await delete_product(id)
        ShowNotification(request.status, request.message, callUpdate)
    }
    // ------------------------------------------------------------


    useEffect(()=>{
        const fetchAllData = async function(){
            const allFetchedData = {};
            let newState = {errors: []};
            allFetchedData.invoices = await fetch_invoices();
            allFetchedData.customers = await fetch_customers();
            allFetchedData.products = await fetch_products();
                        
            for(let el in allFetchedData){
                if(allFetchedData[el].error){
                    const errorMessage = el+': '+allFetchedData[el].error.message
                    ShowNotification('error', errorMessage)
                    // const newErrors = [...newState.errors];
                    // newErrors.push({[el]: allFetchedData[el].error.message});
                    // newState = {
                    //     ...newState,
                    //     errors: newErrors
                    // }
                }else{
                    newState = {
                        ...newState,
                        [el]: allFetchedData[el].data
                    }
                }
            }
            console.log(newState)
            setState({...state, ...newState});
        }
        fetchAllData()
    }, [])
    
    // All tables will get some equal props, so there is a new draft.
    const Table = (props) => {
        return(
            <MainTable
             openModal={modalHandleOpen}
             showNotification={ShowNotification}
             onCancel={modalHandleCancel}
             errors={state.errors}
             {...props}/>
        )
    }

    return(
        <BrowserRouter>
            <Layout>
                <Header style={{padding: 0}}> <NavBar/> </Header>
                    <Content>

                            {/* <Modal
                                title="Basic Modal"
                                visible={state.modalVisible}
                                onOk={modalHandleSave}
                                onCancel={modalHandleCancel}
                                footer={[
                                    <Button key="back" onClick={modalHandleCancel}>
                                    Anuluj
                                    </Button>,
                                    <Button key="submit" type="primary" loading={state.loading} onClick={modalHandleSave}>
                                    Zapisz
                                    </Button>,
                                ]}
                            >
                                {state.modalContent}
                            </Modal> */}
                            <MainModal
                                visible={state.modalVisible}
                                loading={state.loading}
                                onCancel={modalHandleCancel}
                                modalDataType={state.modalDataType}
                                modalData={state.modalData}
                                modalWidth={state.modalWidth}
                            />
                            <Switch>
                                <Route path="/invoice-form" render={()=>(
                                    <InvoiceForm
                                        showNotification={ShowNotification}
                                    />
                                )} />
                                <Route path="/invoices-list"
                                 render={()=> (
                                        <Table
                                            dataType='invoice' 
                                            data={state.invoices}
                                            columns={[
                                                {title: 'Nr Faktury', dataIndex: 'invoice_nr', width: '20%'},
                                                {title: 'Data', dataIndex: 'date', width: '15%'},
                                                {title: 'Nazwa Kontrahenta',dataIndex: 'customer.name', width: '35%'},
                                                {title: 'Wartość Faktury',dataIndex: 'total_price', width: '20%'}
                                            ]}
                                            delete={invoice_remove}
                                        />
                                    )}
                                    />
                                <Route path="/customers-list" render={()=> (
                                        <Table
                                            dataType='customer' 
                                            data={state.customers}
                                            columns={[
                                                {title: 'Nazwa kontrahenta', dataIndex: 'name', width: '30%'},
                                                {title: 'NIP', dataIndex: 'nip', width: '10%'},
                                                {title: 'Miasto',dataIndex: 'city', width: '30%'},
                                                {title: 'Ulica',dataIndex: 'street', width: '20%'}
                                            ]}
                                            delete={customer_remove}
                                    />
                                )}/>
                                <Route path="/products-list" render={()=> (
                                        <Table
                                            dataType='product' 
                                            data={state.products}
                                            columns={[
                                                {title: 'Nazwa', dataIndex: 'name', width: '25%'},
                                                {title: 'Marka', dataIndex: 'brand', width: '15%'},
                                                {title: 'Model',dataIndex: 'model', width: '15%'},
                                                {title: 'Stan magazynowy',dataIndex: 'quantity', width: '20%'},
                                                {title: 'Cena',dataIndex: 'price', width: '15%'}
                                            ]}
                                            delete={product_remove}
                                    />
                                )}/>
                                <Route component={InvoiceForm}/>
                            </Switch>
                    </Content>
                <Footer>Facebook</Footer>
            </Layout>
        </BrowserRouter>
    )
}

export default MainLayout;