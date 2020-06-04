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
    const [confirmModal, setConfirmModal] = useState({
        visible: false,
        dataType: null,
        data: null
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
                modalWidth = 1080;
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
            modalVisible: false,
            modalData: null
        })
    }
    //MODAL OPERATIONS
    const confirmModalOpen = (dataType, data) => {
        setConfirmModal({
            ...state,
            visible: true,
            dataType: dataType,
            data: data
        })
    }
    const confirmModalClose = () => {
        setConfirmModal({
            ...state,
            visible: false,
            dataType: null,
            data: null
        })
    }
    // ------------------------------------------------------------
    // REMOVING ELEMENT
    // args -> (array, delReqApiFunc, id)
    const removeTableRow = async (array, func, id) => {
        const callUpdate = () => {
            const updated = state[array].filter(el => el._id !== id);
            setState({...state, [array]: updated})
        }
        const request = await func(id);
        setConfirmModal({
            ...state,
            visible: false,
            dataType: null,
            data: null
        })
        ShowNotification(request.status, request.message, callUpdate)
    }
    // ------------------------------------------------------------
    //ASYNC FUNCTION FOR FETCHING ALL THE DATA.
    const fetchAll = async() =>{
        const allFetchedData = {};
        allFetchedData.invoices = await fetch_invoices();
        allFetchedData.receipts = await fetch_receipts();
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
        console.log(returnObject)
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
             onCancel={modalHandleCancel}
             showNotification={ShowNotification}
             confirmModalOpen={confirmModalOpen}
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
                            {title: 'Nazwa Kontrahenta',dataIndex: 'customer.name', width: '35%'},
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
                            {title: 'Nazwa kontrahenta', dataIndex: 'name', width: '30%'},
                            {title: 'NIP', dataIndex: 'nip', width: '10%'},
                            {title: 'Miasto',dataIndex: 'city', width: '30%'},
                            {title: 'Ulica',dataIndex: 'street', width: '20%'}
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
                            {title: 'Cena',dataIndex: 'price', width: '15%'}
                        ]}
                />
            )}/>
            {/* <Route component={loginForm}/> */}
            <Route render={()=>(
                // <InvoiceForm
                // />
                <NewDocument
                    showNotification={ShowNotification}
                    customers={state.customers}
                    products={state.products}
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
                            <MainModal
                                visible={state.modalVisible}
                                loading={state.loading}
                                onCancel={modalHandleCancel}
                                modalDataType={state.modalDataType}
                                modalData={state.modalData}
                                modalWidth={state.modalWidth}
                                customers={state.customers}
                                products={state.products}
                            />
                            <ConfirmModal
                                visible={confirmModal.visible}
                                dataType={confirmModal.dataType}
                                data={confirmModal.data}
                                onOk={removeTableRow}
                                onClose={confirmModalClose}
                            />
                           {switchRoutes}
                    </Content>
            </Layout>
        </BrowserRouter>
    )
}

export default MainLayout;