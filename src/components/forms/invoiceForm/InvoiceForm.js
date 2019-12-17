import React, {useState} from 'react';
import classes from './InvoiceForm.module.css';
import moment from 'moment';
import today from '../../../functions/today';
import {save_invoice} from '../../../api_calls/api'

import { Form, Icon, Input, AutoComplete, InputNumber, Button, DatePicker, Row, Col, notification } from 'antd';

// eslint-disable-next-line
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const InvoiceForm = (props) => {
    // eslint-disable-next-line
    const { getFieldDecorator, getFieldsError, setFieldsValue, getFieldError, isFieldTouched } = props.form;

    const [state, setState] = useState({
      error: '',
      loading: false
    });

    const [customer, setCustomer] = useState(
      {
        invoice_nr: '12/2019',
        city: 'Człuchów',
        date: today(),
        customer_nip: '333',
        customer_city: 'xxx',
        customer_street: 'yyy',
        customer_name: 'ppp'
      }
    )

    const [products, setProducts] = useState([
      {
        product_name: 'oprawki',
        product_unit: 'szt.',
        product_quantity: '',
        product_unit_price: '',
        product_total_price: ''
      }
    ])
    // props.form.validateFields();

    // const handleSubmit = e => {
    //     e.preventDefault();
    //     props.form.validateFields((err, values) => {
    //       if (!err) {
    //         console.log('Received values of form: ', values);
    //       }
    //     });
    //   };

    const openNotification = (message) => {
      notification.info({
        message: message,
        placement: 'bottomLeft',
        icon: <Icon type="smile" style={{ color: '#108ee9' }} />
      });
    };

    const send = async () => {
      setState({...state, loading: true});
      const response = await save_invoice(customer, products);
      setState({...state, loading: false});
      openNotification(response.message);
    }

    const onChange = (name, value, index) => {
        if(index > -1){
          // props.form.setFieldsValue({
          //   [name]: value,
          // },
          //  () =>
            // {   
            const allProducts = [...products];
            const product = {...allProducts[index]};
            product[name] = value;

            if((name === 'product_quantity' || name === 'product_unit_price')&&(!isNaN(product.product_quantity) && !isNaN(product.product_unit_price))){
                product.product_total_price = product.product_quantity * product.product_unit_price;
            }
            allProducts[index]= product;
            
            setProducts([
            ...allProducts
            ])
          // }
          // );

        }else{
          props.form.setFieldsValue({
            [name]: value,
          }, setCustomer({
            ...customer,
            [name]: value
          }));
        }
    }

    const add = () =>{
      const allProducts = [...products];
      allProducts.push({product_name: '',product_unit: 'szt.',product_quantity: '',product_unit_price: '',product_total_price: ''})
      setProducts([...allProducts])
    }
    const del = (id) => {
      const allProducts = [...products];
      allProducts.splice(id,1);
      setProducts([...allProducts])
    }

    const invoicenrError = isFieldTouched('invoice_nr') && getFieldError('invoice_nr');
    const cityError = isFieldTouched('city') && getFieldError('city');
    const dateError = isFieldTouched('date') && getFieldError('date');
    const customer_nipError = isFieldTouched('customer_nip') && getFieldError('customer_nip');
    const customer_cityError = isFieldTouched('customer_city') && getFieldError('customer_city');
    const customer_streetError = isFieldTouched('customer_street') && getFieldError('customer_street');
    const customer_nameError = isFieldTouched('customer_name') && getFieldError('customer_name');
    

    let products_list = <Icon type="loading" />;

    if(!state.loading){
      products_list = products.map((position, index) => {        
        // const product_nameError = isFieldTouched('product_name') && getFieldError('product_name'); 
        
        let rem = <Icon type="minus-circle" onClick={()=>del(index)}/>;

        if(index === 0){
          rem = null;
        }

        return (
          <Row key={index}>
            <Col span={11}>
              <Form.Item
                // validateStatus={product_nameError ? 'error' : ''}
                // help={product_nameError || ''}
                >
                {/* {getFieldDecorator(
                  nam2,
                  {initialValue: products[index].product_name.value, rules: [{ required: true, message: 'Wpisz poprawna nazwe' }],}) */}
                  {/* ( */}
                    <AutoComplete
                    value={products[index].product_name}
                    placeholder="Nazwa produktu/usługi"
                    onChange={(el) => onChange('product_name', el, index)}
                    />
                    {/* )}  */}
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item>
                  <AutoComplete
                    placeholder="Jednostka"
                    value={products[index].product_unit}
                    onChange={(el) => onChange('product_unit', el, index)}
                    /> 
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item>
                <InputNumber
                  placeholder="Ilość"
                  min={1}
                  value={products[index].product_quantity}
                  onChange={(el) => onChange('product_quantity', el, index)}
                  /> 
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item>
                <InputNumber
                  placeholder="Cena jednostkowa"
                  value={products[index].product_unit_price}
                  onChange={(el) => onChange('product_unit_price', el, index)}
                  /> 
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item>
                <InputNumber
                  disabled
                  placeholder="Cena ostateczna"
                  value={products[index].product_total_price}
                  // onChange={(el) => onChange('product_total_price', el, index)}
                  /> 
              </Form.Item>
            </Col>
            <Col span={1}>
              {rem}
            </Col>
        </Row>
        )
      })
    }
    return(
        <div className={classes.main}>
          <section>
            <h1>Dane</h1>
            <Form layout="inline" onSubmit={()=>null}>
              <Row>
                <Col span={8}>
                  <Form.Item
                    validateStatus={invoicenrError ? 'error' : ''}
                    help={invoicenrError || ''}
                  >
                    {getFieldDecorator(
                      'invoice_nr'
                      ,{initialValue: customer.invoice_nr ,rules: [{ required: true, message: 'Pole nie zostało wypełnione poprawnine' }],})
                      (<Input
                          placeholder="Numer faktury"  
                          onChange={(el) => onChange('invoice_nr', el.target.value)}
                          prefix={<Icon type="file-add" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      />,)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    validateStatus={cityError ? 'error' : ''}
                    help={cityError || ''}
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
                </Col>
                <Col span={8}>
                <Form.Item
                    validateStatus={dateError ? 'error' : ''}
                    help={dateError || ''}
                    >
                    {getFieldDecorator(
                      'date',
                      {initialValue: moment(customer.date, 'DD/MM/YYYY'), rules: [{ required: true, message: 'Wpisz poprawne miasto' }],})
                      (<DatePicker
                        onChange={(el) => onChange('date', el._i)}
                        format={'DD/MM/YYYY'} />)} 
                  </Form.Item>
                </Col>
              </Row>
              <Row>
              <Col span={8}>
                <Form.Item
                  validateStatus={customer_nipError ? 'error' : ''}
                  help={customer_nipError || ''}
                  >
                  {getFieldDecorator(
                    'customer_nip',
                    {initialValue: customer.customer_nip, rules: [{ required: true, message: 'Wpisz poprawny NIP' }],})
                    (<InputNumber
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="NIP"
                      style={{width: "100%"}}
                      onChange={(el) => onChange('customer_nip', el)}
                    />,)} 
                </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    validateStatus={customer_cityError ? 'error' : ''}
                    help={customer_cityError || ''}
                    >
                    {getFieldDecorator(
                      'customer_city',
                      {initialValue: customer.customer_city, rules: [{ required: true, message: 'Wpisz poprawne miasto' }],})
                      (<AutoComplete
                      placeholder="Miejscowość"
                      onChange={(el) => onChange('customer_city', el)}
                      />)} 
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    validateStatus={customer_streetError ? 'error' : ''}
                    help={customer_streetError || ''}
                    >
                    {getFieldDecorator(
                      'customer_street',
                      {initialValue: customer.customer_street, rules: [{ required: true, message: 'Wpisz poprawną ulicę' }],})
                      (<AutoComplete
                        placeholder="Ulica"
                        onChange={(el) => onChange('customer_street', el)}
                      />)} 
                  </Form.Item>                
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                <Form.Item
                  validateStatus={customer_nameError ? 'error' : ''}
                  help={customer_nameError || ''}
                  >
                  {getFieldDecorator(
                    'customer_name',
                    {initialValue: customer.customer_name, rules: [{ required: true, message: 'Wpisz poprawne miasto' }],})
                    (<AutoComplete
                      placeholder="Nazwa kontrahenta"
                      style={{width:"400px"}}
                      onChange={(el) => onChange('customer_name', el)}
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
            </Form>
            <Icon type="plus-circle" onClick={add}/>
          </section>
          <Button type="primary" onClick={() => send()}>
            Zapisz i generuj fakturę.
          </Button>
        </div>
        
      );
    }

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_login' })(InvoiceForm);

export default WrappedHorizontalLoginForm;