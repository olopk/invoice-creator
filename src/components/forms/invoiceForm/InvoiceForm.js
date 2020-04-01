import React, {useState} from 'react';
import classes from './InvoiceForm.module.css';
import moment from 'moment';
import today from '../../../functions/today';
import {save_invoice} from '../../../api_calls/invoices'

import { Form, Icon, Input, AutoComplete, InputNumber, Button, DatePicker, Row, Col as Column } from 'antd';

// eslint-disable-next-line
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const Col = props =>{
  return <Column align="center" {...props}>{props.children}</Column>
}

const InvoiceForm = (props) => {
    // eslint-disable-next-line
    const { getFieldDecorator, getFieldsError, setFieldsValue, getFieldError, isFieldTouched } = props.form;

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
        nip: '333',
        city: 'xxx',
        street: 'yyy',
        name: 'ppp'
      }
    )
    // LOCAL STATE AND FUNCTIONS FOR PRODUCTS
    const [products, setProducts] = useState([
      {
        name: 'oprawki',
        unit: 'szt.',
        quantity: '',
        unit_price: '',
        total_price: ''
      }
    ])

    const addProduct = () =>{
      const allProducts = [...products];
      allProducts.push({name: '',unit: 'szt.',quantity: '',unit_price: '',total_price: ''})
      setProducts([...allProducts])
    }
    const delProduct = (id) => {
      const allProducts = [...products];
      allProducts.splice(id,1);
      setProducts([...allProducts])
    }

    // props.form.validateFields();

    // const handleSubmit = e => {
    //     e.preventDefault();
    //     props.form.validateFields((err, values) => {
    //       if (!err) {
    //         console.log('Received values of form: ', values);
    //       }
    //     });
    //   };

    // const openNotification = (status, message) => {
    //   let icon = <SmileOutlined style={{ color: '#108ee9' }} />;
    //   if(status === 'error'){
    //     icon = <ExclamationCircleOutlined style={{ color: '#108ee9' }} />
    //   }
    //   // status === 'error' ? icon = <ExclamationCircleOutlined style={{ color: '#108ee9' }} /> : null;

    //   notification.info({
    //     message: message,
    //     placement: 'bottomLeft',
    //     icon: icon
    //   });
    // };

    const send = async () => {
      setState({...state, loading: true});
      const response = await save_invoice(invoice, customer, products);
      console.log(response)
      props.showNotification(response.status, response.message);
      setState({...state, loading: false});
    }
    // TODO
    // I really dont like this onchange function, need to think about it.

    const onChange = (name, value, index) => {
        // if there is an index, we know it is about Products change.
        console.log('its me')
        console.log(value)
        if(index > -1){
          // props.form.setFieldsValue({
          //   [name]: value,
          // },
          //  () =>
            // {   
            const allProducts = [...products];
            const product = {...allProducts[index]};
            product[name] = value;          

            if((name === 'quantity' || name === 'unit_price')&&(!isNaN(product.quantity) && !isNaN(product.unit_price))){
                product.total_price = product.quantity * product.unit_price;
                
                
              }
              allProducts[index]= product;
              
              setProducts([
                ...allProducts
              ])
              
            //We need to calculate total sum when any quantity or unit_price is changing.
            let sum = 0;
            allProducts.forEach(el => {
              sum += el.total_price
            })
            setInvoice({
              ...invoice,
              total_price: sum
            })
          // }
          // );

        }else if(name === 'invoice_nr' || name === 'total_price' || name === 'date'){
          props.form.setFieldsValue({
            [name]: value,
          }, setInvoice({
            ...invoice,
            [name]: value
          }));         
        }
        else{
          props.form.setFieldsValue({
            [name]: value,
          }, setCustomer({
            ...customer,
            [name]: value
          }));
        }
    }


    const invoicenrError = isFieldTouched('invoice_nr') && getFieldError('invoice_nr');
    const dateError = isFieldTouched('date') && getFieldError('date');
    const nipError = isFieldTouched('nip') && getFieldError('nip');
    const cityError = isFieldTouched('city') && getFieldError('city');
    const streetError = isFieldTouched('street') && getFieldError('street');
    const nameError = isFieldTouched('name') && getFieldError('name');
    

    // let products_list = <Icon type="loading" />;

    let products_list = products.map((position, index) => {        
        // const nameError = isFieldTouched('name') && getFieldError('name'); 
        
        let rem = (
          <div className={classes.minusIcon}>
            <Icon type="minus-circle" style={{ fontSize: "24px" }} onClick={()=>delProduct(index)}/>
          </div>
        )

        if(index === 0){
          rem = null;
        }

        return (
          <Row key={index} 
            // style={{
            //   display: 'flex',
            //   justifyContent: 'flex-end',
            //   alignItems: 'center'
            // }}
          >
            <Col span={11} offset={1}>
              <Form.Item
                style={{ marginBottom: "0px" }}
                // validateStatus={nameError ? 'error' : ''}
                // help={nameError || ''}
                >
                {/* {getFieldDecorator(
                  nam2,
                  {initialValue: products[index].name.value, rules: [{ required: true, message: 'Wpisz poprawna nazwe' }],}) */}
                  {/* ( */}
                    <AutoComplete
                    value={products[index].name}
                    placeholder="Nazwa produktu/usługi"
                    onChange={(el) => onChange('name', el, index)}
                    />
                    {/* )}  */}
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
                style={{ marginBottom: "0px" }}
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
                style={{ marginBottom: "0px" }}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Cena jednostkowa"
                  value={products[index].unit_price}
                  onChange={(el) => onChange('unit_price', el, index)}
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
    
    let content = (
      <React.Fragment>
        <section>
          <h1>Dane faktury</h1>
          <Form layout="inline" onSubmit={()=>null}>
            <Row>
              <Col align="center" span={8}>
                <Form.Item
                  validateStatus={invoicenrError ? 'error' : ''}
                  help={invoicenrError || ''}
                  style={{ width: '80%' }}
                  wrapperCol={{ sm: 24 }}
                >
                  {getFieldDecorator(
                    'invoice_nr'
                    ,{initialValue: invoice.invoice_nr ,rules: [{ required: true, message: 'Pole nie zostało wypełnione poprawnine' }],})
                    (<Input
                        placeholder="Numer faktury"  
                        onChange={(el) => onChange('invoice_nr', el.target.value)}
                        prefix={<Icon type="file-add" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />,)}
                </Form.Item>
              </Col>
              {/* <Col span={8}>
                <Form.Item
                  validateStatus={cityError ? 'error' : ''}
                  help={cityError || ''}
                  style={{ width: '80%' }}
                  wrapperCol={{ sm: 24 }}
                  >
                  {getFieldDecorator(
                    'city',
                    {initialValue: customer.city, rules: [{ required: true, message: 'Wpisz poprawne miasto' }],})
                    (<Input
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="Miasto"
                      onChange={(el) => onChange('city', el.target.value)}
                    />,)} 
                </Form.Item>
              </Col> */}
              <Col span={8}>
              <Form.Item
                  validateStatus={dateError ? 'error' : ''}
                  help={dateError || ''}
                  style={{ width: '80%' }}
                  wrapperCol={{ sm: 24 }}
                  >
                  {getFieldDecorator(
                    'date',
                    {initialValue: moment(invoice.date, 'YYYY-MM-DD'), rules: [{ required: true, message: 'Wpisz poprawne miasto' }],})
                    (<DatePicker
                      onChange={(moment, el) => onChange('date', el)}
                      format={'YYYY-MM-DD'}
                      style={{ width: '100%' }} />)} 
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </section>
        <section>
          <h1>Dane kontrahenta</h1>
          <Form>
            <Row>
            <Col span={8}>
              <Form.Item
                validateStatus={nipError ? 'error' : ''}
                help={nipError || ''}
                style={{ width: '80%' }}
                wrapperCol={{ sm: 24 }}
                >
                {getFieldDecorator(
                  'nip',
                  {initialValue: customer.nip, rules: [{ required: true, message: 'Wpisz poprawny NIP' }],})
                  (<InputNumber
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="NIP"
                    style={{width: "100%"}}
                    onChange={(el) => onChange('nip', el)}
                  />,)} 
              </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  validateStatus={cityError ? 'error' : ''}
                  help={cityError || ''}
                  style={{ width: '80%' }}
                  wrapperCol={{ sm: 24 }}
                  >
                  {getFieldDecorator(
                    'city',
                    {initialValue: customer.city, rules: [{ required: true, message: 'Wpisz poprawne miasto' }],})
                    (<AutoComplete
                    placeholder="Miejscowość"
                    onChange={(el) => onChange('city', el)}
                    />)} 
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  validateStatus={streetError ? 'error' : ''}
                  help={streetError || ''}
                  style={{ width: '80%' }}
                  wrapperCol={{ sm: 24 }}
                  >
                  {getFieldDecorator(
                    'street',
                    {initialValue: customer.street, rules: [{ required: true, message: 'Wpisz poprawną ulicę' }],})
                    (<AutoComplete
                      placeholder="Ulica"
                      onChange={(el) => onChange('street', el)}
                    />)} 
                </Form.Item>                
              </Col>
            </Row>
            <Row>
              <Col span={16} align="center">
              <Form.Item
                validateStatus={nameError ? 'error' : ''}
                help={nameError || ''}
                style={{ width: '90%' }}
                wrapperCol={{ sm: 24 }}
                >
                {getFieldDecorator(
                  'name',
                  {initialValue: customer.name, rules: [{ required: true, message: 'Wpisz poprawne miasto' }],})
                  (<AutoComplete
                    placeholder="Nazwa kontrahenta"
                    style={{width: '100%'}}
                    onChange={(el) => onChange('name', el)}
                    />)} 
              </Form.Item>               
              </Col>
            </Row>
            {/* <Form.Item>
              <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
              Log in
              </Button>
            </Form.Item> */}
          </Form>
        </section>
        <section>
          <h1>Towary i usługi</h1>
          <Form>
            {products_list}
            <Row key={'asfasfa'} 
              // style={{display: 'flex',justifyContent: 'flex-end',alignItems: 'center'}}
            >
              <div style={{
                display: 'flex',
                // justifyContent: 'center',
                alignItems: 'center'
              }}>
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
              </div>
            </Row>         
          </Form>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Icon type="plus-circle" style={{ fontSize: "22px", marginTop: '15px' }} onClick={addProduct}/>
          </div>
        </section>
      </React.Fragment>
    )

    if(state.loading){
      content = <Icon type="loading" className={classes.loadingIcon}/>;
    }
    
    return(
        <div className={classes.main}>
          {content}
          <Button type="primary" onClick={() => send()}>
            Zapisz i generuj fakturę.
          </Button>
        </div>
        
      );
    }

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_login' })(InvoiceForm);

export default WrappedHorizontalLoginForm;