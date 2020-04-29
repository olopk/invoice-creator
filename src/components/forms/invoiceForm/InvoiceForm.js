import React, {useState, useEffect} from 'react';
import classes from './InvoiceForm.module.css';
import today from '../../../functions/today';
import {save_invoice} from '../../../api_calls/invoices'
import moment from 'moment';

import createPDF from '../pdfdocForm';

import {
  FileAddOutlined,
  LoadingOutlined,
  LockOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';

import '@ant-design/compatible/assets/index.css';

import { Typography, Input, Select, AutoComplete, Form, InputNumber, Button, DatePicker, Row, Col as Column } from 'antd';

import {fetch_dataByNIP} from '../../../api_calls/customers';

const Col = props =>{
  return <Column align="center" {...props}>{props.children}</Column>
}

const InvoiceForm = (props) => {
    const [invoiceForm] = Form.useForm()
    const {setFieldsValue , getFieldValue, getFieldsValue} = invoiceForm;

    const { Option } = Select;
    const { Text } = Typography;

    const [state, setState] = useState({
      error: '',
      loading: false,
      modalDataId: ''
    });

    let formInitialValues = {
      invoice_nr: '19/2020',
      customer_nip: '84359',
      customer_city: 'Czluchow',
      customer_street: 'Wiejska',
      customer_name: 'Andrzej Albinos',
      order: [
        {
          price: '2',
          product: 'szklanka',
          quantity: '5',
          total_price: '',
          unit: 'szt. '
        }
      ],
      date: moment(today(), 'YYYY-MM-DD')
    }
    
    useEffect(()=>{
      if(props.modalData){
        const {invoice_nr, date, total_price , customer, order} = props.modalData;
        let parsedOrder = order.map(el => {
          return{
            ...el,
            product: el.product.name,
            unit: 'szt.'         
          }
        })
  
        const parsedDate = moment(date, 'YYYY-MM-DD')
   
        setFieldsValue({
          invoice_nr: invoice_nr,
          total_price: total_price,
          date: parsedDate,        
          customer_nip: customer.nip,
          customer_city: customer.city,
          customer_street: customer.street,
          customer_name: customer.name,
          order: parsedOrder
        })
      }

    }, [props.modalData, setFieldsValue])


    const onFinish = async () => {
      setState({...state, loading: true});

      const allValues = getFieldsValue(true)
      const {invoice_nr, total_price, date, customer_nip, customer_city, customer_street, customer_name, order } = allValues;
   
      const invoiceData = {
        invoice_nr: invoice_nr,
        date: date._i,
        total_price: total_price
      }
      const customerData = {
        nip: customer_nip,
        city: customer_city,
        street: customer_street,
        name: customer_name,
      }

      const products = order.map(el => {
        return{
              name: el.product,
              unit: 'szt.',
              quantity: el.quantity,
              price: el.price,
              total_price: el.total_price
        }
      })

      let response;
      if(props.modalData){
        response = await save_invoice(invoiceData, customerData, products, props.modalData._id);
      }else{
        response = await save_invoice(invoiceData, customerData, products);
      }
      props.showNotification(response.status, response.message);

      if(response.status == 'success'){
        createPDF(allValues)
      }
      setState({...state, loading: false});
    }

    const onChange = (element) => {
      setFieldsValue({element})
    }

    const fetchCustomerData = async () =>{
      const nip = getFieldValue('customer_nip').toString()
      const customerData = await fetch_dataByNIP(nip)
      
      const {data} = customerData;

      setFieldsValue({
        customer_name: data.name,
        customer_city: data.city,
        customer_street: data.street
      })
    } 

    const countElementSum = (index) => {
      //TODO i have no idea why this is working as expected...
      const data = getFieldsValue(['order'])

      const price = data.order[index].price;
      const quantity = data.order[index].quantity

      if(price && quantity && !isNaN(price) && !isNaN(quantity)){
        data.order[index].total_price = price * quantity;

        let sum = 0;
        data.order.forEach(el => {
          if(el && el.total_price){
            sum += el.total_price 
          }
        })
        setFieldsValue({'total_price': sum})
      }
    }

    let content = (
    <React.Fragment>
      <section className={classes.mainSection} style={props.style}>
        <Form
          form={invoiceForm}
          onFinish={onFinish}
          onValuesChange={onChange}
          initialValues={formInitialValues}
          >
          <Row>
          <Col className={classes.title_col} span={24}>
              <Text strong>DANE FAKTURY</Text>
            </Col>
          </Row>
          <Row>
            <Col align="center" offset={1} span={5}>
              <Form.Item
                name={'invoice_nr'}
                style={{ width: '100%' }}
                wrapperCol={{ sm: 24 }}
                rules={[{ required: true, message: 'Wpisz numer faktury' }]}
              >
                <Input
                  placeholder="Numer faktury"  
                  prefix={<FileAddOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
              </Form.Item>
            </Col>
            <Col align="right" span={5} offset={7}>
              <Text className={classes.cityName}>Człuchów, </Text>
            </Col>
            <Col span={5}>
              <Form.Item
                name={'date'}
                style={{ width: '100%' }}
                wrapperCol={{ sm: 24 }}
                rules={[{ required: true, message: 'Wybierz datę' }]}
                >
                  <DatePicker
                    format={'YYYY-MM-DD'}
                    style={{ width: '100%' }}
                  /> 
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col className={classes.title_col} span={24}>
              <Text strong>DANE KLIENTA</Text>
            </Col>
          </Row>
          <Row>
            <Col span={5} offset={1}>
              <Form.Item
                name={'customer_nip'}
                style={{ width: '100%' }}
                wrapperCol={{ sm: 24 }}
                rules={[{ required: true, message: 'Wpisz poprawny NIP' }]}
              >
                <InputNumber
                  prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="NIP"
                  style={{width: "100%"}}
                /> 
              </Form.Item>
            </Col>
            <Col span={4} offset={1} align="center">
                <Form.Item>
                  <Button type="primary" block size="small" onClick={fetchCustomerData}>
                    Pobierz dane
                  </Button>
                </Form.Item>
            </Col>
            <Col span={10}  offset={2} align="center">
              <Form.Item
                name={'customer_name'}
                style={{ width: '100%' }}
                wrapperCol={{ sm: 24 }}
                rules={[{ required: true, message: 'Wpisz nazwę klienta.' }]}
                >
                <AutoComplete
                    placeholder="Nazwa klienta"
                    style={{width: '100%'}}
                /> 
              </Form.Item>               
            </Col>
          </Row>
          <Row>
            <Col span={10} offset={1}>
              <Form.Item
                name={'customer_city'}
                style={{ width: '100%' }}
                wrapperCol={{ sm: 24 }}
                rules={[{ required: true, message: 'Wpisz miasto' }]}
                >
                <Input
                  placeholder="Miejscowość"
                /> 
              </Form.Item>
            </Col>
            <Col span={10} offset={2}>
              <Form.Item
                name={'customer_street'}
                style={{ width: '100%' }}
                wrapperCol={{ sm: 24 }}
                rules={[{ required: true, message: 'Wpisz ulicę' }]}
                >
                <Input
                    placeholder="Ulica"
                /> 
              </Form.Item>                
            </Col>
          </Row>
          <Form.List name="order">
            {(fields, {add,remove}) => {
              return(
                <div>
                  <Row>
                    <Col span={24}
                      className={classes.title_col}
                    >
                      <Text strong>TOWARY I USŁUGI</Text>      
                      <PlusCircleOutlined style={{ fontSize: "25px", margin: "0px 15px"}} onClick={()=>add()} />
                    </Col>
                  </Row>
                  {fields.map((field, index) => {
                  return(
                    <Row key={field.key}>
                      <Col span={10} offset={1}>
                        <Form.Item
                          name={[field.name, "product"]}
                          fieldKey={[field.fieldKey, "product"]}
                          style={{ marginBottom: "0px" }}
                          rules={[{ required: true, message: 'Wpisz Nazwę produktu lub usługi' }]}
                          >
                            <AutoComplete
                            placeholder="Nazwa produktu/usługi"
                            />
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item
                          style={{ marginBottom: "0px" }}
                          name={[field.name, "unit"]}
                          fieldKey={[field.fieldKey, "unit"]}
                          
                        >
                            <Select defaultValue="szt. " >
                              <Option value="szt. ">szt .</Option>
                              <Option value="Brak">brak</Option>
                            </Select>
                          {/* <Input
                            // defaultValue='szt.' 
                            placeholder="Jednostka"
                          />  */}
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item
                          name={[field.name, "quantity"]}
                          fieldKey={[field.fieldKey, "quantity"]}
                          style={{ marginBottom: "0px" }}
                          rules={[{ required: true, message: 'Wpisz ilość' }]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder="Ilość"
                            min={1}
                            onChange={() => countElementSum(index)}
                          /> 
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item
                          name={[field.name, "price"]}
                          fieldKey={[field.fieldKey, "price"]}
                          style={{ marginBottom: "0px" }}
                          rules={[{ required: true, message: 'Wpisz cenę' }]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder="Cena jednostkowa"
                            onChange={() => countElementSum(index)}
                          /> 
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item
                          style={{ marginBottom: "0px" }}
                          name={[field.name, "total_price"]}
                          fieldKey={[field.fieldKey, "total_price"]}
                        >
                          <InputNumber
                            disabled
                            style={{ width: '100%' }}
                            placeholder="Cena ostateczna"
                          /> 
                        </Form.Item>
                      </Col>
                      <Col span={1}>
                        {index !== 0 ? (
                          <div className={classes.minusIcon}>
                              <MinusCircleOutlined style={{ fontSize: "24px" }} onClick={() => {remove(field.name)}} />
                            </div>) : null}
                      </Col>
                    </Row>
                  )})}
                  </div>)
                }}
            </Form.List>
            <Row>
              <Col span={2}  offset = {19}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '70px'
                }}>
                  <p style={{height: '100%', margin: 0}}><b>Suma</b></p>
              </Col>
              <Col span={2}>
                <Form.Item
                  style={{ marginBottom: "0px" }}
                  name={'total_price'}
                >
                  <InputNumber
                    style={{ width: '100%', textAlign: 'center' }}
                    disabled
                  /> 
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={22} offset={1} align="center">
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
      <div className={classes.container}>
        {content}
      </div>  
    );
}
export default InvoiceForm;