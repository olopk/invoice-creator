export const save_invoice = (customer, products) => {
    // eslint-disable-next-line
    const sentData = {
        customer: {
            ...customer
        },
        products: {
            ...products
        }
    }
    // some magic with the POST sending to the server.
    return new Promise(resolve =>{
        setTimeout(()=>{
            resolve({
                message: 'Invoice saved successfully',
                status: 201
            })
        },2000)
    })
}

export const fetch_invoices = () => {
        // some magic with the GET sending to the server.
        setTimeout(()=>{
            return{
                status: 200,
                data: {
                    //some data here.
                }
            }
        },2000)
}