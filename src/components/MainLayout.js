import React, {useState, useEffect} from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import { Layout } from 'antd';
import NavBar from '../components/Navigation/NavBar';
import InvoiceForm from './forms/invoiceForm/InvoiceForm';
import InvoicesTable from './Tables/mainTable/mainTable';
import {fetch_invoices} from '../api_calls/invoices';

import { Modal, Button } from 'antd';
// import classes from './MainLayout.module.css';

const { Header, Content, Footer} = Layout;

const MainLayout = (props) => {
    const [state, setState] = useState({
        invoices: null,
        loading: false,
        modalVisible: false,
        modalContent: null
    })
    //MODAL OPERATIONS
    const modalHandleOpen = (modalContent) => {
        setState({
            ...state,
            modalVisible: true,
            modalContent: modalContent
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
    const save_invoices = async () => {
        const data = await fetch_invoices();
        setState({invoices: data});
    }
    
    const update_invoice = () => {
        //some magic   
    }
    const delete_invoice = (id) => {
        const updatedInvoices = state.invoices.filter(el => el.key !== id);
        setState({invoices: updatedInvoices})
    }
    // ------------------------------------------------------------

    useEffect(() => {
        save_invoices()
    }, [])
    
    // All tables will get some equal props, so there is a new draft.
    const Table = (props) => <InvoicesTable openModal={modalHandleOpen} {...props}/>

    return(
        <BrowserRouter>
            <Layout>
                <Header style={{padding: 0}}> <NavBar/> </Header>
                    <Content>
                            <Modal
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
                            </Modal>
                            <Switch>
                                <Route path="/invoice-form" component={InvoiceForm} />
                                <Route path="/invoices-list"
                                    render={()=> (
                                        <Table 
                                            data={state.invoices}
                                            columns={[
                                                {title: 'Nr Faktury', dataIndex: 'invoice_nr', width: '20%'},
                                                {title: 'Data', dataIndex: 'date', width: '15%'},
                                                {title: 'Nazwa Kontrahenta',dataIndex: 'customer.name', width: '35%'},
                                                {title: 'Wartość Faktury',dataIndex: 'total_price', width: '20%'}
                                            ]}
                                            delete={delete_invoice}
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