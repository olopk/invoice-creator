import React, {useState, useEffect} from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import { Layout } from 'antd';

import MainModal from './Modals/mainModal';
import NavBar from '../components/Navigation/NavBar';
import MainTable from './Tables/mainTable/mainTable';
import InvoiceForm from './forms/invoiceForm/InvoiceForm';
import LoginForm from './forms/authForm/loginForm';
import SigninForm from './forms/authForm/signInForm';
import ShowNotification from '../components/NotificationSnackbar/Notification';

import {fetch_invoices, delete_invoice} from '../api_calls/invoices';
import {fetch_customers, delete_customer} from '../api_calls/customers';
import {fetch_products, delete_product} from '../api_calls/products';
import {getUser, logIn, signIn} from '../api_calls/auth';

// import classes from './MainLayout.module.css';

const { Header, Content, Footer} = Layout;

const MainLayout = (props) => {
    const [state, setState] = useState({
        invoices: null,
        customers: null,
        products: null,
        loggedIn: false,
        userData: null,
        loading: false,
        modalVisible: false,
        modalData: null,
        modalDataType: null,
        modalWidth: null,
        errors: []
    })
    //AUTH OPERATIONS
    const signInRequest = async (userData) =>{
        const result = await signIn(userData);
        if(result.status === 'success'){
            //TODO redirect to loginpage
        }
        ShowNotification(result.status, result.message)
    }
    const logInRequest = async (email, password) => {
        const result = await logIn(email, password)
        if(result.status === 'success'){
            const fetchEverything = await fetchAll();
            setState({
                ...state,
                loggedIn: true,
                userData: result.userData,
                loading: false,
                ...fetchEverything
            })
        }
        ShowNotification(result.status, result.message)
    }
    const logOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration")
        setState({
            invoices: null,
            customers: null,
            products: null,
            loggedIn: false,
            userData: null,
            loading: false,
            modalVisible: false,
            modalData: null,
            modalDataType: null,
            modalWidth: null,
            errors: []
        })
    }

    //MODAL OPERATIONS
    const modalHandleOpen = (modalDataType, modalData) => {
        let modalWidth;
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

    //ASYNC FUNCTION FOR FETCHING ALL THE DATA.
    const fetchAll = async() =>{
        const allFetchedData = {};
            allFetchedData.invoices = await fetch_invoices();
            allFetchedData.customers = await fetch_customers();
            allFetchedData.products = await fetch_products();
            
            let returnObject = {}
            for(let el in allFetchedData){
                if(allFetchedData[el].error){
                    const errorMessage = el+': '+allFetchedData[el].error.message
                    ShowNotification('error', errorMessage)
                }else{
                    returnObject = {
                        ...returnObject,
                        [el]: allFetchedData[el].data
                    }
                }
            }
            return returnObject
    }
    // ------------------------------------------------------------

    useEffect(()=>{
        let newState = {errors: []};
        const loginCheck = async () =>{
            const token = localStorage.getItem("token");
            const tokenExpiration = localStorage.getItem("tokenExpiration");
            if(!token || !tokenExpiration){
                 logOut()
            }else{
                const date = new Date();
                const currentTime = date.getTime();
                if(currentTime > tokenExpiration){
                 logOut()
                }else{
                    const data = await getUser(token);
                    if(data.status === 'success'){
                        newState = {
                            ...newState,
                            loggedIn: true,
                            userData: data.userData,
                            loading: false
                        }
                    }
                    ShowNotification(data.status, data.message)

                    //fetch all the data after successfull login.
                    const fetchEverything = await fetchAll();
                    newState = {...newState, ...fetchEverything};

                    setState(state => ({...state, ...newState}))
                }
            }
        }
        loginCheck()
    }, [])

    useEffect(()=>{
        let timeout;
        if(state.loggedIn === true){
            const date = new Date();
            const currentTime = date.getTime();
            const validTime = localStorage.getItem("tokenExpiration") - currentTime;
            timeout = setTimeout(() =>{
                ShowNotification('error', "Sesja wygasła, zaloguj sie ponownie")
                logOut()
            }, validTime)}
        return () => {
            clearTimeout(timeout)
        }
    }, [state.loggedIn])
    
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

    let switchRoutes = (
        <Switch>
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
            {/* <Route component={loginForm}/> */}
            <Route render={()=>(
                <InvoiceForm
                    showNotification={ShowNotification}
                />
            )
            }/>
        </Switch>
    );
    if(!state.loggedIn){
        switchRoutes = (
            <Switch>
                <Route path="/login" render={()=>(
                    <LoginForm
                        logInRequest={logInRequest}
                    />
                )} />
                <Route path="/signin" render={()=>(
                    <SigninForm
                        signInRequest={signInRequest}
                    />
                )} />
                <Route path="/" render={()=>(
                    <LoginForm logInRequest={logInRequest}/>
                )} />
            </Switch>
        )
    }

    return(
        <BrowserRouter>
            <Layout>
                <Header style={{padding: 0}}>
                     <NavBar loggedIn={state.loggedIn} logOut={logOut}/>
                </Header>
                    <Content>
                            <MainModal
                                visible={state.modalVisible}
                                loading={state.loading}
                                onCancel={modalHandleCancel}
                                modalDataType={state.modalDataType}
                                modalData={state.modalData}
                                modalWidth={state.modalWidth}
                            />
                           {switchRoutes}
                    </Content>
                <Footer>Facebook</Footer>
            </Layout>
        </BrowserRouter>
    )
}

export default MainLayout;