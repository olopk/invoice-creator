import React, {useState, useEffect} from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import { Layout } from 'antd';
import NavBar from '../components/Navigation/NavBar';
import InvoiceForm from './forms/invoiceForm/InvoiceForm';
import MainTable from './Tables/mainTable/mainTable';
import {fetch_invoices, fetch_single_invoice} from '../api_calls/invoices';
import {fetch_customers, fetch_single_customer} from '../api_calls/customers';

import { Modal, Button } from 'antd';
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
        loading: false,
        modalVisible: false,
        modalData: null,
        modalDataType: null
    })
    //MODAL OPERATIONS
    const modalHandleOpen = (modalDataType, modalData) => {
        setState({
            ...state,
            modalVisible: true,
            modalDataType: modalDataType,
            modalData: modalData
        })
    }
    const modalHandleCancel = () => {
        setState({
            ...state,
            modalVisible: false
        })
    }
    const modalHandleSave = () => {
        setState({
            ...state,
            modalVisible: false
        })
    }
    // ------------------------------------------------------------
    // INVOICES OPERATIONS 
    const get_single_invoice = async (id) => {
        const data = await fetch_single_invoice(id);
        if(data.error){
            ShowNotification('error', data.error.message)
        }else{
            setState({singleInvoice: data.data});
        }
    }
    const update_invoice = () => {
        //some magic   
    }
    const delete_invoice = (id) => {
        const updatedInvoices = state.invoices.filter(el => el.key !== id);
        setState({...state, invoices: updatedInvoices})
    }
    // ------------------------------------------------------------
     // CUSTOMERS OPERATIONS 
    const get_single_customer = async (id) => {
        const data = await fetch_single_customer(id);
        if(data.error){
            ShowNotification('error', data.error.message)
        }else{
            setState({singleCustomer: data.data});
        }
    }
    const update_customer = () => {
        //some magic
    }
    const delete_customer = (id) => {
        const updatedCustomers = state.customers.filter(el => el.key !== id);
        setState({...state, customers: updatedCustomers})
    }
    // ------------------------------------------------------------

    useEffect(()=>{
        const fetchAllData = async function(){
            const allFetchedData = {};
            let newState = {};
            allFetchedData.invoices = await fetch_invoices();
            // allFetchedData.customers = await fetch_customers();
                        
            for(let el in allFetchedData){
                if(el.error){
                    ShowNotification('error', el.error.message)
                }else{
                    newState = {
                        ...newState,
                        [el]: allFetchedData[el].data
                    }
                }
            }
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
                                            delete={delete_invoice}
                                        />
                                    )}
                                    />
                                <Route path="/customers-list" render={()=> (
                                        <Table 
                                            data={state.customers}
                                            columns={[
                                                {title: 'Nazwa kontrahenta', dataIndex: 'name', width: '30%'},
                                                {title: 'NIP', dataIndex: 'nip', width: '10%'},
                                                {title: 'Miasto',dataIndex: 'city', width: '30%'},
                                                {title: 'Ulica',dataIndex: 'street', width: '20%'}
                                            ]}
                                            delete={delete_customer}
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