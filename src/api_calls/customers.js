import axios from 'axios';
//CUSTOMERS OPERATIONS

// GET ALL CUSTOMERS
export const fetch_customers = () => {
    // return axios.get('http://127.0.0.1:8080/customers')
    //         .then(response => {
    //            let data = response.data.map((customer, index) => {
    //                 const date = customer.date;
    //                 const newDate = date.slice(0, date.length - 14);
                
    //                 return {
    //                    ...customer,
    //                    date: newDate,
    //                    key: index
    //                }
    //            })
    //            return data  
    //         })
}

// GET SINGLE CUSTOMER
// export const fetch_customer = (id) => {}

// SAVE CUSTOMER (NEW & EXISTING)
export const save_customer = (customer, products, editing) => {
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
                message: 'customer saved successfully',
                status: 201
            })
        },2000)
    })
}

// DELETE CUSTOME
export const delete_customer = (id) => {
    // even more magic with the DELETE call send to the server
    
}

