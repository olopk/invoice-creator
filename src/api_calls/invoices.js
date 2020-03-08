//INVOICES OPERATIONS

export const fetch_invoices = () => {
        // some magic with the GET sending to the server.
        return new Promise(resolve => {
            setTimeout(()=>{
                resolve({
                    status: 200,
                    data: [
                        {
                          key: '1',
                          invoice_nr: '1/2019',
                          date: '12/12/2019',
                          customer_name: 'Andrzej Kowalski',
                          product_total_price: '129'
                        },
                        {
                          key: '2',
                          invoice_nr: '2/2019',
                          date: '12/12/2019',
                          customer_name: 'Andrzej Kowalski',
                          product_total_price: '489'
                        },
                        {
                          key: '3',
                          invoice_nr: '3/2019',
                          date: '12/12/2019',
                          customer_name: 'Andrzej Kowalski',
                          product_total_price: '329'
                        },
                        {
                          key: '4',
                          invoice_nr: '4/2019',
                          date: '12/12/2019',
                          customer_name: 'Andrzej Kowalski',
                          product_total_price: '99'
                        },
                      ]
                })
            },2000)
        })
}
export const save_invoice = (customer, products, editing) => {
    // eslint-disable-next-line
    const sentData = {
        customer: {
            ...customer
        },
        products: {
            ...products
        }
    }
    // we change a bit the method when editing the record in the DB. so we check if we editing.
    if(editing){
        //do smth
    }else{
        //do smth
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

export const delete_invoice = (id) => {
    // even more magic with the DELETE call send to the server
    
}

// CUSTOMERS

export const delete_customer = (id) => {
    // even more magic with the DELETE call send to the server
}

