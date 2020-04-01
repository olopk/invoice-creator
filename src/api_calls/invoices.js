import axios from '../axiosInstance';
// import axios from 'axios';

//INVOICES OPERATIONS
// GET ALL INVOICES
export const fetch_invoices = () => {
    const graphqlQuery = {
        query: `{ getInvoices{ _id invoice_nr date total_price customer{ name } } }`
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
// export const fetch_invoice = (id) => {}

// SAVE INVOICE (NEW & EXISTING)
export const save_invoice = async (invoice, customer, products, editing) => {
    // eslint-disable-next-line
    const sentData = {
        invoice_nr: invoice.invoice_nr,
        date: invoice.date,
        total_price: invoice.total_price,
        customer: {
            ...customer
        },
        order: [...products]
    }

    // console.log(sentData)

    // const graphqlQuery = {
    //     query: `
    //         {
    //             mutation addInvoice(invoiceInput:{
    //                 invoice_nr: ${invoice.invoice_nr}
    //                 date: ${invoice.date}
    //                 total_price: ${invoice.total_price}
    //                 order: ${[...products]}
    //                 customer: ${{...customer}}
    //               }){message}
    //         }
    //     `
    // }
    const graphqlQuery = {
        query: `
            {
                mutation CreateNewInvoice($invoiceInput: ){
                    addInvoice($invoiceInput:{
                        invoice_nr: "4221",
                        date: "2024-08-01",
                        total_price: 0,
                        order: [{ name: "kubek" price: 12 total_price: 24 quantity: 2}]
                        customer: {name: "Olek Wojas" nip: 84400 city: "Czw" street:"Piastowskie"}
                      })
                  }
            }
        `,
        variables: {
            
        }
    }
    console.log(graphqlQuery)
    const result = await axios.post('/graphql', JSON.stringify(graphqlQuery))
                        .then(res => {
                            return {status: 'success', message: res.data.message}
                        }).catch(err => {
                            console.log(err)
                            return {status: 'error', message: err.response.data.message}
                        })

    return result
}

// DELETE INVOICE
export const delete_invoice = (id) => {
    // even more magic with the DELETE call send to the server
    
}

