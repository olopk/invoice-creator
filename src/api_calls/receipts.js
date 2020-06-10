import axios from '../axiosInstance';

// GET ALL RECEIPTS
export const fetch_receipts = () => {
    const graphqlQuery = {
        query: `{ getReceipts{ _id receipt_nr date total_price pay_method customer{ _id name city street info} order{ product{ _id name } quantity price_net total_price_net price_gross total_price_gross vat }} }`
    };
    return axios.post('/graphql', JSON.stringify(graphqlQuery))
            .then(response => {
                   let data = response.data.data.getReceipts.map((receipt, index) => {
                    const date = receipt.date.slice(0, 10)
                        return {
                        ...receipt,
                        date: date,
                        key: index
                        }
                    })
               return {data: data}
            }).catch(err => {return {error: err}})
}

// SAVE RECEIPT (NEW & EXISTING)
export const save_receipt = async (receipt, customer, products, id) => {   
    const {receipt_nr, date, total_price, pay_method} = receipt;
    let query;

    if(id){
        query = `
            mutation UpdateReceipt($id: String!, $receipt_nr: String!, $date: String!, $total_price: Float!, $pay_method: String! , $order: [ProductInputData!]!, $customer: CustomerInputData!){
                editReceipt(id: $id, receiptInput: {
                    receipt_nr: $receipt_nr,
                    date: $date,
                    total_price: $total_price,
                    pay_method: $pay_method
                    order: $order
                    customer: $customer
                }){message}
            }`
    }else{
        query = `
            mutation CreateNewReceipt($receipt_nr: String!, $date: String!, $total_price: Float!, $pay_method: String!, $order: [ProductInputData!]!, $customer: CustomerInputData!){
                addReceipt(receiptInput: {
                    receipt_nr: $receipt_nr,
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
            receipt_nr: receipt_nr,
            date: date,
            total_price: total_price,
            pay_method: pay_method,
            customer: {...customer},
            order: [...products]
        }
    }
    return axios.post('/graphql', JSON.stringify(graphqlQuery))
            .then(res => {
                const response = id ? res.data.data.editReceipt : res.data.data.addReceipt;
                return {status: 'success', message: response.message}
            }).catch(err => {
                const error = err.response.data.errors[0];
                return {status: 'error', message: error.message}
            })
}

// DELETE RECEIPT
export const delete_receipt = (id) => {
    const graphqlQuery = {
        query: ` 
            mutation DeleteReceipt($id: String!){
                delReceipt(id: $id){ message }}
        `,
        variables: { id: id }
    }
    return axios.post('/graphql', JSON.stringify(graphqlQuery))
    .then(res => {
        const response = res.data.data.delReceipt;
        return {status: 'success', message: response.message}
    })
    .catch(err => {
        const error = err.response.data.errors[0];
        return {status: 'error', message: error.message}
    })
}

