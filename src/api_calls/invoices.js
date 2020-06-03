import axios from '../axiosInstance';

// GET ALL INVOICES
export const fetch_invoices = () => {
    const graphqlQuery = {
        query: `{ getInvoices{ _id invoice_nr date total_price pay_method customer{ name nip city street info} order{ product{ name } quantity price_net total_price_net price_gross total_price_gross vat }} }`
    };
    return axios.post('/graphql', JSON.stringify(graphqlQuery))
            .then(response => {
                   let data = response.data.data.getInvoices.map((invoice, index) => {
                    const date = invoice.date.slice(0, 10)
                        return {
                            ...invoice,
                            date: date,
                            key: index
                        }
                    })
               return {data: data}
            }).catch(err => {return {error: err}})
}

// GET SINGLE INVOICE
export const fetch_single_invoice = (id) => {
    const graphqlQuery = {
        query: `
            query fetchInvoice($id: String!){
                getInvoice(id: $id){ _id invoice_nr total_price pay_method date customer{ nip name street city } order{ _id product{ _id name } quantity price_net total_price_net price_gross total_price_gross vat } }
            }
        `,
        variables: {
            id: id
        }
    }
    return axios.post('/graphql', JSON.stringify(graphqlQuery))
            .then(response => {
               let invoice = response.data.data.getInvoice;
               invoice.date = invoice.date.slice(0, 10)
                console.log(invoice)
            //    return {data: data}
            }).catch(err => {return {error: err}})
}

// SAVE INVOICE (NEW & EXISTING)
export const save_invoice = async (invoice, customer, products, id) => {   
    const {invoice_nr, date, total_price, pay_method} = invoice;
    let query;

    if(id){
        query = `
            mutation UpdateInvoice($id: String!, $invoice_nr: String!, $date: String!, $total_price: Float!, $pay_method: String!, $order: [ProductInputData!]!, $customer: CustomerInputData!){
                editInvoice(id: $id, invoiceInput: {
                    invoice_nr: $invoice_nr,
                    date: $date,
                    total_price: $total_price,
                    pay_method: $pay_method
                    order: $order
                    customer: $customer
                }){message}
            }`
    }else{
        query = `
            mutation CreateNewInvoice($invoice_nr: String!, $date: String!, $total_price: Float!, $pay_method: String!, $order: [ProductInputData!]!, $customer: CustomerInputData!){
                addInvoice(invoiceInput: {
                    invoice_nr: $invoice_nr,
                    date: $date,
                    total_price: $total_price,
                    pay_method: $pay_method
                    order: $order
                    customer: $customer
                }){message}
            }`
    }
    
    const graphqlQuery = {
        query: query,
        variables: {
            id: id,
            invoice_nr: invoice_nr,
            date: date,
            total_price: total_price,
            pay_method: pay_method,
            customer: {...customer},
            order: [...products]
        }
    }
    return axios.post('/graphql', JSON.stringify(graphqlQuery))
            .then(res => {
                const response = id ? res.data.data.editInvoice : res.data.data.addInvoice;
                return {status: 'success', message: response.message}
            }).catch(err => {
                const error = err.response.data.errors[0];
                return {status: 'error', message: error.message}
            })
}

// DELETE INVOICE
export const delete_invoice = (id) => {
    const graphqlQuery = {
        query: ` 
            mutation DeleteInvoice($id: String!){
                delInvoice(id: $id){ message }}
        `,
        variables: { id: id }
    }
    return axios.post('/graphql', JSON.stringify(graphqlQuery))
    .then(res => {
        const response = res.data.data.delInvoice;
        return {status: 'success', message: response.message}
    })
    .catch(err => {
        const error = err.response.data.errors[0];
        return {status: 'error', message: error.message}
    })
}

