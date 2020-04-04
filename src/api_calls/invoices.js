import axios from '../axiosInstance';
// import axios from 'axios';

//INVOICES OPERATIONS
// GET ALL INVOICES

export const fetch_invoices = () => {
    const graphqlQuery = {
        query: `{ getInvoices{ _id invoice_nr date total_price customer{ name nip city street } order{ product{ name } quantity price total_price }} }`
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
                getInvoice(id: $id){ _id invoice_nr total_price date customer{ nip name street city } order{ _id product{ _id name } price quantity total_price } }
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
    const {invoice_nr, date, total_price} = invoice;
    
    let query;
    if(id){
        query = `
            mutation UpdateInvoice($id: String!, $invoice_nr: String!, $date: String!, $total_price: Float!, $order: [ProductInputData!]!, $customer: CustomerInputData!){
                editInvoice(id: $id, invoiceInput: {
                    invoice_nr: $invoice_nr,
                    date: $date,
                    total_price: $total_price,
                    order: $order
                    customer: $customer
                }){message}
            }`
    }else{
        query = `
            mutation CreateNewInvoice($invoice_nr: String!, $date: String!, $total_price: Float!, $order: [ProductInputData!]!, $customer: CustomerInputData!){
                addInvoice(invoiceInput: {
                    invoice_nr: $invoice_nr,
                    date: $date,
                    total_price: $total_price,
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
            customer: {...customer},
            order: [...products]
        }
    }
    const result = await axios.post('/graphql', JSON.stringify(graphqlQuery))
                        .then(res => {
                            const response = id ? res.data.data.editInvoice : res.data.data.addInvoice;
                            return {status: 'success', message: response.message}
                        }).catch(err => {
                            const error = err.response.data.errors[0];
                            return {status: 'error', message: error.message}
                        })

    return result
}

// DELETE INVOICE
export const delete_invoice = (id) => {
    // even more magic with the DELETE call send to the server
    
}

