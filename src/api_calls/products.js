import axios from '../axiosInstance';

// GET ALL PRODUCTS
export const fetch_products = () => {
    const graphqlQuery = {
        query: `{ getProducts{ _id name model brand price quantity}}`
    }
    return axios.post('/graphql', JSON.stringify(graphqlQuery))
    .then(response =>{
        const data = response.data.data.getProducts.map((product, index) => {
            return{ ...product, key: index}
        })
        return {data: data}})
    .catch(err => {return {error: err}})
}
// GET SINGLE PRODUCT
export const fetch_single_product = (id) => {
    const graphqlQuery = {
        query: ` 
            query FetchSingleProduct($id: String!){
                getProduct(id: $id){ _id name model brand price quantity}}
        `,
        variables: { id: id }
    }
    return axios.post('/graphql', JSON.stringify(graphqlQuery))
    .then(response => {return {data: response.data.data.getProduct}})
    .catch(err => {return {error: err}})
}
// SAVE CUSTOMER (NEW & EXISTING)
export const save_product = (product, id) => {
    let query;

    if(id){
        query = `
        mutation UpdateProduct($id: String!, $product: ProductInputData!){
            editProduct(id: $id, productInput: $product}){message}
        }`;
    }else{
        query = `
        mutation CreateNewProduct($product: ProductInputData!){
            addProduct(productInput: $product}){message}
        }`;
    }
    const graphqlQuery = {
        query: query,
        variables: {
            id: id,
            product: {...product},
        }
    }
    return axios.post('/graphql', JSON.stringify(graphqlQuery))
            .then(res => {
                const response = id ? res.data.data.editProduct : res.data.data.addProduct;
                return {status: 'success', message: response.message}
            }).catch(err => {
                const error = err.response.data.errors[0];
                return {status: 'error', message: error.message}
            })
}

// DELETE PRODUCT
export const delete_product = (id) => {
    const graphqlQuery = {
        query: ` 
            mutation DeleteProduct($id: String!){
                delProduct(id: $id){ message }}
        `,
        variables: { id: id }
    }
    return axios.post('/graphql', JSON.stringify(graphqlQuery))
    .then(res => {
        const response = res.data.data.delProduct;
        return {status: 'success', message: response.message}
    })
    .catch(err => {
        const error = err.response.data.errors[0];
        return {status: 'error', message: error.message}
    })
}

