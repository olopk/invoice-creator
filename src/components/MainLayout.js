import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import { Layout } from 'antd';
import NavBar from '../components/Navigation/NavBar';
import InvoiceForm from './forms/invoiceForm/InvoiceForm';

const { Header, Content, Footer} = Layout;

const MainLayout = (props) => {
    return(
        <BrowserRouter>
            <Layout>
                <Header> <NavBar/> </Header>
                    <Content>
                            <Switch>
                                <Route path="/invoice-form" component={InvoiceForm}/>
                            </Switch>
                    </Content>
                <Footer>Facebook</Footer>
            </Layout>
        </BrowserRouter>
    )
}

export default MainLayout;