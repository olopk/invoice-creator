import React, {useState} from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import { Layout } from 'antd';
import NavBar from '../components/Navigation/NavBar';
import InvoiceForm from './forms/invoiceForm/InvoiceForm';
import InvoicesTable from './Tables/InvoicesTable/InvoicesTable';
import {fetch_invoices} from '../api_calls/api';

import classes from './MainLayout.module.css';

const { Header, Content, Footer} = Layout;

const MainLayout = (props) => {

    const [state, setState] = useState({
        invoices: null
    })

    const save_invoices = async () => {
        const response = await fetch_invoices();
        setState({invoices: response.data});
    }
    
    const update_invoice = () => {
        //some magic   
    }
    const delete_invoice = (id) => {
        const updatedInvoices = state.invoices.filter(el => el.key !== id);
        setState({invoices: updatedInvoices})
    }


    if(!state.invoices){
        save_invoices()
    }  
    return(
        <BrowserRouter>
            <Layout>
                <Header style={{padding: 0}}> <NavBar/> </Header>
                    <Content>
                            <Switch>
                                <Route path="/invoice-form" component={InvoiceForm} />
                                <Route path="/invoices-list"
                                    render={()=> (
                                        <InvoicesTable 
                                            data={state.invoices}
                                            delete_invoice={delete_invoice}
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