import axios from '../axiosInstance';
//CUSTOMERS OPERATIONS

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
    .then(result => {return {data: result}})
    .catch(err => {return {error: err}})
}
// SAVE CUSTOMER (NEW & EXISTING)
export const save_customer = (customer, editing) => {
    const graphqlQuery = {
        query: `
                mutation CreateNewCustomer($customer: CustomerInputData!){
                    addCustomer(customerInput: $customer}){message}
                }
        `,
        variables: {
            customer: {...customer},
        }
    }
}

// DELETE CUSTOMER
export const delete_customer = (id) => {
    
}

