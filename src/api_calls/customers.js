import axios from '../axiosInstance';

// GET ALL CUSTOMERS
export const fetch_customers = () => {
    const graphqlQuery = {
        query: `{ getCustomers{ _id name nip city street }}`
    }
    return axios.post('/graphql', JSON.stringify(graphqlQuery))
    .then(response =>{
        const data = response.data.data.getCustomers.map((customer, index) => {
            return{ ...customer, key: index}
        })
        return {data: data}})
    .catch(err => {return {error: err}})
}
// GET SINGLE CUSTOMER
export const fetch_single_customer = (id) => {
    const graphqlQuery = {
        query: ` 
            query FetchSingleCustomer($id: String!){
                getCustomer(id: $id){ _id name nip city street }}
        `,
        variables: { id: id }
    }
    return axios.post('/graphql', JSON.stringify(graphqlQuery))
    .then(response => {return {data: response.data.data.getCustomer}})
    .catch(err => {return {error: err}})
}
// SAVE CUSTOMER (NEW & EXISTING)
export const save_customer = (customer, id) => {
    let query;

    if(id){
        query = `
        mutation UpdateCustomer($id: String!, $customer: CustomerInputData!){
            editCustomer(id: $id, customerInput: $customer}){message}
        }`;
    }else{
        query = `
        mutation CreateNewCustomer($customer: CustomerInputData!){
            addCustomer(customerInput: $customer}){message}
        }`;
    }
    const graphqlQuery = {
        query: query,
        variables: {
            id: id,
            customer: {...customer},
        }
    }
    return axios.post('/graphql', JSON.stringify(graphqlQuery))
            .then(res => {
                const response = id ? res.data.data.editCustomer : res.data.data.addCustomer;
                return {status: 'success', message: response.message}
            }).catch(err => {
                const error = err.response.data.errors[0];
                return {status: 'error', message: error.message}
            })
}

// DELETE CUSTOMER
export const delete_customer = (id) => {
    
}

