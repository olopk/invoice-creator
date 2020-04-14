import React, {useState, useEffect} from 'react';
import classes from './InvoiceForm.module.css';
import today from '../../../functions/today';
import {save_invoice} from '../../../api_calls/invoices'

import {
  FileAddOutlined,
  LoadingOutlined,
  LockOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';

import '@ant-design/compatible/assets/index.css';

import { Input, AutoComplete, Form, InputNumber, Button, DatePicker, Row, Col as Column } from 'antd';

const Col = props =>{
  return <Column align="center" {...props}>{props.children}</Column>
}

const InvoiceForm = (props) => {

    const [state, setState] = useState({
      error: '',
      loading: false
    });

    // LOCAL STATE AND FUNCTIONS FOR INVOICE
    const [invoice, setInvoice] = useState(
      {
        invoice_nr: '12/2019',
        date: today(),
        total_price: ''
      }
    )

    // LOCAL STATE AND FUNCTIONS FOR CUSTOMER
    const [customer, setCustomer] = useState(
      {
        nip: '',
        city: '',
        street: '',
        name: ''
      }
    )
    // LOCAL STATE AND FUNCTIONS FOR PRODUCTS
    const [products, setProducts] = useState([
      {
        name: '',
        unit: 'szt.',
        quantity: '',
        price: '',
        total_price: ''
      }
    ])

    const addProduct = () =>{
      const allProducts = [...products];
      allProducts.push({name: '',unit: 'szt.',quantity: '',price: '',total_price: ''})
      setProducts([...allProducts])
    }
    
    const delProduct = (id) => {
      const allProducts = [...products];
      allProducts.splice(id,1);
      setProducts([...allProducts])
    }

    useEffect(()=>{
      if(props.modalData){
        console.log(props.modalData)
        const modalData = props.modalData;
        setCustomer(customer =>({...customer, ...modalData.customer}))
        setInvoice(invoice => ({
          ...invoice,
          invoice_nr: modalData.invoice_nr,
          total_price: modalData.total_price,
          date: modalData.date
        }))

        const products = modalData.order.map(el => {
          return{
            name: el.product.name,
            unit: 'szt.',
            quantity: el.quantity,
            price: el.price,
            total_price: el.total_price
          }
        })
        setProducts(products)
      }
    }, [props.modalData])

    const onFinish = async () => {
      setState({...state, loading: true});
      let response;
      if(props.modalData){
        response = await save_invoice(invoice, customer, products, props.modalData._id);
      }else{
        response = await save_invoice(invoice, customer, products);
      }
      props.showNotification(response.status, response.message);
      setState({...state, loading: false});
    }
    // TODO
    // I really dont like this onchange function, need to think about it.

    const onChange = (name, value, index) => {
        // if there is an index, we know it is about Products change.
        if(index > -1){
            const allProducts = [...products];
            const product = {...allProducts[index]};
            product[name] = value;          

            if((name === 'quantity' || name === 'price')&&(!isNaN(product.quantity) && !isNaN(product.price))){
                product.total_price = product.quantity * product.price;                 
              }
              allProducts[index]= product;
              
              setProducts([
                ...allProducts
              ])
              
            //We need to calculate total sum when any quantity or price is changing.
            let sum = 0;
            allProducts.forEach(el => {
              sum += el.total_price
            })
            setInvoice({
              ...invoice,
              total_price: sum
            })

        }else if(name === 'invoice_nr' || name === 'total_price' || name === 'date'){
          setInvoice({
            ...invoice,
            [name]: value
          })         
        }
        else{
          setCustomer({
            ...customer,
            [name]: value
          })
        }
    }


    // let products_list = <Icon type="loading" />;

    //Initial Values for form.
    let initialValues = {
      invoice_nr: invoice.invoice_nr,
      product_name0: products[0].name
    };

    let products_list = products.map((position, index) => {        
        initialValues = {
          ...initialValues,
          // ['product_name'+index]: products[index].name,
          // ['product_quantity'+index]: products[index].quantity,
          // ['product_price'+index]: products[index].price
        }  

        let rem = (
          <div className={classes.minusIcon}>
            <MinusCircleOutlined style={{ fontSize: "24px" }} onClick={()=>delProduct(index)} />
          </div>
        )

        if(index === 0){
          rem = null;
        }

        return (
          <Row key={index}>
            <Col span={11} offset={1}>
              <Form.Item
                name={['product_name', index]}
                style={{ marginBottom: "0px" }}
                rules={[{ required: true, message: 'Wpisz Nazwę produktu lub usługi' }]}
                >
                    <AutoComplete
                    value={products[index].name}
                    placeholder="Nazwa produktu/usługi"
                    onChange={(el) => onChange('name', el, index)}
                    />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item
                style={{ marginBottom: "0px" }}
              >
                  <AutoComplete
                    placeholder="Jednostka"
                    value={products[index].unit}
                    onChange={(el) => onChange('unit', el, index)}
                    /> 
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item
                name={'product_quantity'+index}
                style={{ marginBottom: "0px" }}
                rules={[{ required: true, message: 'Wpisz ilość' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Ilość"
                  min={1}
                  value={products[index].quantity}
                  onChange={(el) => onChange('quantity', el, index)}
                  /> 
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item
                name={'product_price'+index}
                style={{ marginBottom: "0px" }}
                rules={[{ required: true, message: 'Wpisz cenę' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Cena jednostkowa"
                  value={products[index].price}
                  onChange={(el) => onChange('price', el, index)}
                  /> 
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                style={{ marginBottom: "0px" }}
              >
                <InputNumber
                  disabled
                  style={{ width: '100%' }}
                  placeholder="Cena ostateczna"
                  value={products[index].total_price}
                  // onChange={(el) => onChange('total_price', el, index)}
                  /> 
              </Form.Item>
            </Col>
            <Col span={1}>
              {rem}
            </Col>
        </Row>
        )
      })
    // console.log(initialValues)
    let content = (
      <React.Fragment>
        <section>
          <h1>Dane faktury</h1>
          <Form
            name="basic"
            onFinish={onFinish}
            initialValues={initialValues}
          >
            <Row>
              <Col align="center" span={8}>
                <Form.Item
                  name={'invoice_nr'}
                  style={{ width: '80%' }}
                  wrapperCol={{ sm: 24 }}
                  rules={[{ required: true, message: 'Wpisz numer faktury' }]}
                  // onValuesChange={(el) => onChange('invoice_nr', el.target.value)}
                >
                  <Input
                        // defaultValue={invoice.invoice_nr}
                        // value={invoice.invoice_nr}
                        placeholder="Numer faktury"  
                        // onChange={(el) => onChange('invoice_nr', el.target.value)}
                        prefix={<FileAddOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
              <Form.Item
                  name={'date'}
                  style={{ width: '80%' }}
                  wrapperCol={{ sm: 24 }}
                  rules={[{ required: true, message: 'Wybierz datę' }]}
                  >
                    <DatePicker
                      //TODO set the right value for datepicker.

                      // value={invoice.date}
                      // onChange={(moment, el) => onChange('date', el)}
                      format={'YYYY-MM-DD'}
                      style={{ width: '100%' }}
                    /> 
                </Form.Item>
              </Col>
            </Row>
          <h1>Dane kontrahenta</h1>
            <Row>
            <Col span={8}>
              <Form.Item
                name={'customer_nip'}
                style={{ width: '80%' }}
                wrapperCol={{ sm: 24 }}
                rules={[{ required: true, message: 'Wpisz poprawny NIP' }]}
                >
                <InputNumber
                    value={customer.nip}
                    prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="NIP"
                    style={{width: "100%"}}
                    onChange={(el) => onChange('nip', el)}
                /> 
              </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={'customer_city'}
                  style={{ width: '80%' }}
                  wrapperCol={{ sm: 24 }}
                  rules={[{ required: true, message: 'Wpisz miasto' }]}
                  >
                  <AutoComplete
                    value={customer.city}
                    placeholder="Miejscowość"
                    onChange={(el) => onChange('city', el)}
                  /> 
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={'customer_street'}
                  style={{ width: '80%' }}
                  wrapperCol={{ sm: 24 }}
                  rules={[{ required: true, message: 'Wpisz ulicę' }]}
                  >
                  <AutoComplete
                      value={customer.street}
                      placeholder="Ulica"
                      onChange={(el) => onChange('street', el)}
                  /> 
                </Form.Item>                
              </Col>
            </Row>
            <Row>
              <Col span={16} align="center">
              <Form.Item
                name={'customer_name'}
                style={{ width: '90%' }}
                wrapperCol={{ sm: 24 }}
                rules={[{ required: true, message: 'Wpisz nazwę klienta.' }]}
                >
                <AutoComplete
                    value={customer.name}
                    placeholder="Nazwa klienta"
                    style={{width: '100%'}}
                    onChange={(el) => onChange('name', el)}
                /> 
              </Form.Item>               
              </Col>
            </Row>
              <h1>Towary i usługi</h1>      
            {products_list}
            <Row key={'asfasfa'} 
              // style={{display: 'flex',justifyContent: 'flex-end',alignItems: 'center'}}
            >
              <Col span={2}  offset = {19}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <p style={{height: '100%', margin: 0}}><b>Suma</b></p>
                </Col>
                <Col span={2}>
                  <Form.Item
                    style={{ marginBottom: "0px" }}
                  >
                    <InputNumber
                      style={{ width: '100%', textAlign: 'center' }}
                      // placeholder="Suma końcowa"
                      // min={0}
                      disabled
                      value={invoice.total_price}
                    /> 
                  </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={4} offset={10}>
                    <PlusCircleOutlined style={{ fontSize: "22px", margin: '20px 0px 70px 0px' }} onClick={addProduct} />
                </Col>
            </Row>
            <Row>
              <Col span={24} align="center">
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Zapisz i generuj fakturę.
                  </Button>
                </Form.Item>
              </Col>
            </Row>         
          </Form>
        </section>
      </React.Fragment>
    )

    if(state.loading){
      content = <LoadingOutlined className={classes.loadingIcon} />;
    }
    
    return(
        <div className={classes.main}>
          {content}
        </div>
        
      );
    }

export default InvoiceForm;