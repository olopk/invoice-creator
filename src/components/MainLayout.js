import React, {useState, useEffect} from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import { Layout } from 'antd';

import classes from './MainLayout.module.css'

import MainModal from './Modals/mainModal';
import ConfirmModal from './Modals/confirmModal';

import NavBar from '../components/Navigation/NavBar';
import MainTable from './Tables/mainTable/mainTable';

import NewDocument from './newDocument/newDocument';

import LoginForm from './forms/authForm/loginForm';
import SigninForm from './forms/authForm/signInForm';
import ShowNotification from '../components/NotificationSnackbar/Notification';

import {fetch_invoices} from '../api_calls/invoices';
import {fetch_receipts} from '../api_calls/receipts';
import {fetch_customers} from '../api_calls/customers';
import {fetch_products} from '../api_calls/products';
import {getUser, logIn, signIn} from '../api_calls/auth';

// import classes from './MainLayout.module.css';

const { Header, Content } = Layout;

const MainLayout = (props) => {
    const [state, setState] = useState({
        invoices: null,
        customers: null,
        products: null,
        loggedIn: false,
        userData: null,
        loading: false,
        errors: []
    })
    // const [mainModal, setMainModal] = useState({
    //     visible: false,
    //     dataType: null,
    //     data: null,
    //     width: null
    // })
    // const [confirmModal, setConfirmModal] = useState({
    //     visible: false,
    //     dataType: null,
    //     data: null
    // })
    //AUTH OPERATIONS
    const signInRequest = async (userData) =>{
        const result = await signIn(userData);
        if(result.status === 'success'){
            //TODO redirect to loginpage
        }
        ShowNotification(result.status, result.message)
        return Promise.resolve()
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
        return Promise.resolve()
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
            errors: []
        })
    }

    //MAIN MODAL OPERATIONS
    // const modalHandleOpen = (modalDataType, modalData) => {
    //     let modalWidth;
    //     switch(modalDataType){
    //         case 'invoice':
    //             modalWidth = 1080;
    //             break;
    //         case 'receipt':
    //             modalWidth = 1080;
    //             break;
    //         default:
    //             modalWidth = 800;
    //     }
    //     setMainModal({
    //         ...mainModal,
    //         visible: true,
    //         dataType: modalDataType,
    //         data: modalData,
    //         width: modalWidth
    //     })
    // }
    // const modalHandleCancel = () => {
    //     setMainModal({
    //         ...mainModal,
    //         visible: false,
    //         data: null
    //     })
    // }
    //CONFIRM MODAL OPERATIONS
    // const confirmModalOpen = (dataType, data) => {
    //     setConfirmModal({
    //         ...state,
    //         visible: true,
    //         dataType: dataType,
    //         data: data
    //     })
    // }
    // const confirmModalClose = () => {
    //     setConfirmModal({
    //         ...state,
    //         visible: false,
    //         dataType: null,
    //         data: null
    //     })
    // }
    // ------------------------------------------------------------
    // REMOVING ELEMENT
    // args -> (array, delReqApiFunc, id)
    const removeTableRow = async (array, func, id) => {
        const callUpdate = () => {
            const updated = state[array].filter(el => el._id !== id);
            setState({...state, [array]: updated})
        }
        const request = await func(id);
        // setConfirmModal({
        //     ...state,
        //     visible: false,
        //     dataType: null,
        //     data: null
        // })
        ShowNotification(request.status, request.message, callUpdate)
    }
    // ------------------------------------------------------------
    //ASYNC FUNCTION FOR FETCHING ALL THE DATA.
    const fetchAll = async(trigger) =>{
        const allFetchedData = {};

        if(!trigger || trigger !== 'products'){
            allFetchedData.customers = await fetch_customers();
        }
        if(!trigger || trigger !== 'customers'){
            allFetchedData.products = await fetch_products();
        }
        if(!trigger || (trigger !== 'products' && trigger !== 'customers')){
            allFetchedData.invoices = await fetch_invoices();
            allFetchedData.receipts = await fetch_receipts();
        }
        
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
        if(trigger){
            setState({...state, ...returnObject})
            return
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
                    // TODO fetchAll is not returning a promise so "await" is useless here.
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
            }, validTime)
        }
        return () => {
            clearTimeout(timeout)
        }
    }, [state.loggedIn])
    
    // All tables will get some equal props, so there is a new draft.
    const Table = (props) => {
        return(
            <MainTable
                // showNotification={ShowNotification}
                loading={state.loading}
                customers={state.customers}
                products={state.products}
                fetchData={fetchAll}
                onOk={removeTableRow}
                errors={state.errors}
                {...props}
            />
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
                            {title: 'Nazwa Kontrahenta',dataIndex: ['customer', 'name'], width: '35%'},
                            {title: 'Wartość Faktury',dataIndex: 'total_price', width: '20%'}
                        ]}
                    />
                )}
                />
            <Route path="/receipts-list"
            render={()=> (
                    <Table
                        dataType='receipt' 
                        data={state.receipts}
                        columns={[
                            {title: 'Nr Paragonu', dataIndex: 'receipt_nr', width: '20%'},
                            {title: 'Data', dataIndex: 'date', width: '15%'},
                            {title: 'Nazwa Kontrahenta',dataIndex: ['customer', 'name'], width: '35%'},
                            {title: 'Wartość Paragonu',dataIndex: 'total_price', width: '20%'}
                        ]}
                    />
                )}
                />
            <Route path="/customers-list" render={()=> (
                    <Table
                        dataType='customer' 
                        data={state.customers}
                        columns={[
                            {title: 'Nazwa kontrahenta', dataIndex: 'name', width: '40%'},
                            {title: 'NIP', dataIndex: 'nip', width: '10%'},
                            {title: 'Numer telefonu',dataIndex: 'phonenr', width: '20%'},
                            {title: 'Data sprzedaży',dataIndex: 'selldate', width: '20%'}
                        ]}
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
                            {title: 'Cena',dataIndex: 'price_gross', width: '15%'}
                        ]}
                />
            )}/>
            {/* <Route component={loginForm}/> */}
            <Route render={()=>(
                <NewDocument
                    showNotification={ShowNotification}
                    customers={state.customers}
                    products={state.products}
                    fetchData={fetchAll}
                    lastInvoiceNr={state.invoices && state.invoices.length > 0 ? state.invoices[state.invoices.length -1].invoice_nr : null}
                    lastReceiptNr={state.receipts && state.receipts.length > 0 ? state.receipts[state.receipts.length -1].receipt_nr : null}
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
            <Layout className={classes.mainSection}> 
                <Header style={{padding: 0}}>
                     <NavBar loggedIn={state.loggedIn} logOut={logOut}/>
                </Header>
                    <Content>
                            {/* <MainModal
                                loading={state.loading}
                                customers={state.customers}
                                products={state.products}
                                fetchData={fetchAll}
                                onOk={removeTableRow}
                            /> */}
                            {/* <ConfirmModal
                            /> */}
                           {switchRoutes}
                    </Content>
            </Layout>
        </BrowserRouter>
    )
}
export default MainLayout;