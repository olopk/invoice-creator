import axios from 'axios';
//INVOICES OPERATIONS

// GET ALL INVOICES
export const fetch_invoices = () => {
    return axios.get('http://127.0.0.1:8080/invoices')
            .then(response => {
               let data = response.data.map((invoice, index) => {
                    const date = invoice.date;
                    const newDate = date.slice(0, date.length - 14);
                
                    return {
                       ...invoice,
                       date: newDate,
                       key: index
                   }
               })
               return data  
            })
}

// GET SINGLE INVOICE
// export const fetch_invoice = (id) => {}

// SAVE INVOICE (NEW & EXISTING)
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

// DELETE INVOICE
export const delete_invoice = (id) => {
    // even more magic with the DELETE call send to the server
    
}

