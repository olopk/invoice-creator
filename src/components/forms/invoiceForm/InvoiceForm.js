import React, {useState, useEffect} from 'react';
import classes from './InvoiceForm.module.css';
import today from '../../../functions/today';
import {save_invoice} from '../../../api_calls/invoices'
import validateNip from '../../../functions/nipValidation';
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

import { Typography, Input, Select, Radio, Form, InputNumber, Button, DatePicker, Row, Col as Column } from 'antd';

import Complete from '../formElements/AutoCompleter'

import {fetch_dataByNIP} from '../../../api_calls/customers';

const Col = props =>{
  return <Column align="center" {...props}>{props.children}</Column>
}

const InvoiceForm = (props) => {
    const [invoiceForm] = Form.useForm()
    const { resetFields, setFieldsValue , getFieldValue, getFieldsValue} = invoiceForm;

    const {showNotification, customers} = props;

    const { Option } = Select;
    const { Text } = Typography;
    const { TextArea } = Input;

    const [state, setState] = useState({
      error: '',
      loading: false,
      modalDataId: ''
    });

    const [nipValidity, setNipValidity] = useState({value: ''})

    const checkNipValidity = (value) =>{
      resetFields(['customer_id'])

      setNipValidity({
        ...validateNip(value),
        value
      })
    }

    let formInitialValues = {
      invoice_nr: '19/2020',
      pay_method: 'cash',
      customer_id: '',
      customer_nip: '84359',
      customer_city: 'Czluchow',
      customer_street: 'Wiejska',
      customer_name: 'Andrzej Albinos',
      customer_info: 'Lewe oko -10, prawego oka brak',
      order: [
        {
          price_net: 2,
          product: 'szklanka',
          quantity: 5,
          total_price: '',
          unit: 'szt. ',
          vat: 0
        }
      ],
      date: moment(today(), 'YYYY-MM-DD')
    }
    
    useEffect(()=>{
      if(props.modalData){
        const {invoice_nr, date, total_price, pay_method, customer, order} = props.modalData;
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
          pay_method: pay_method,
          date: parsedDate,
          customer_id: customer._id,        
          customer_nip: customer.nip,
          customer_city: customer.city,
          customer_street: customer.street,
          customer_info: customer.info,
          customer_name: customer.name,
          order: parsedOrder
        })
      }

    }, [props.modalData, setFieldsValue])

    const onSelectCustomer = (data) =>{
      const { el } = data;
      setFieldsValue(
        {
          customer_id: el._id,
          customer_nip: el.nip,
          customer_city: el.city,
          customer_street: el.street,
          customer_info: el.info,
          customer_name: el.name
        }
      )
    }
    const onSelectProduct = (data, index) =>{
      const { el } = data;
      let order = getFieldValue('order');
      order[index] = {
        ...order[index],
        id: el._id,
        price_net: el.price_net,
        product: el.name,
        quantity: el.quantity,
        vat: el.vat,
      }
      setFieldsValue({order: order})
    }
    
    const onFinish = async () => {
      setState({...state, loading: true});

      const allValues = getFieldsValue(true)
      const {invoice_nr, total_price, pay_method, date, customer_id, customer_nip, customer_city, customer_street, customer_info, customer_name, order } = allValues;
   
      const invoiceData = {
        invoice_nr: invoice_nr,
        date: date._i,
        total_price: total_price,
        pay_method: pay_method
      }

      const customerData = {
        _id: customer_id,
        nip: customer_nip.toString(),
        city: customer_city,
        street: customer_street,
        info: customer_info,
        name: customer_name,
      }

      const products = order.map(el => {
        return{
              _id: el.id,
              name: el.product,
              unit: 'szt.',
              quantity: el.quantity,
              price_net: el.price_net,
              price_gross: el.price_net * el.vat,
              vat: el.vat,
              total_price_net: el.total_price_net,
              total_price_gross: el.total_price_gross,
        }
      })

      let response;
      if(props.modalData){
        response = await save_invoice(invoiceData, customerData, products, props.modalData._id);
      }else{
        response = await save_invoice(invoiceData, customerData, products);
      }
      showNotification(response.status, response.message);

      if(response.status === 'success'){
        createPDF(allValues)
      }
      setState({...state, loading: false});
    }

    const onChange = (element) => {
      setFieldsValue({element})
    }

    const onProductNameChange = (value, index) =>{
      const order = getFieldValue('order');
      order[index].id = null;
      setFieldsValue({order: order})
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

      const price = data.order[index].price_net;
      const quantity = data.order[index].quantity;
      const vat = data.order[index].vat;

      if(!isNaN(price) && !isNaN(quantity) && !isNaN(vat)){
        
        const netValue =  price * quantity
        data.order[index].total_price_net = parseFloat(netValue.toFixed(2))

        const grossValue = (price * quantity) + (vat * (price * quantity))/100;

        data.order[index].total_price_gross = parseFloat(grossValue.toFixed(2))

        let sum = 0;
        data.order.forEach(el => {
          if(el && el.total_price_gross){
            sum += el.total_price_gross
          }
        })
        setFieldsValue({'total_price': parseFloat(sum.toFixed(2))})
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
            <Col align="center" offset={1} span={3}>
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
            <Col align="right" offset={1} span={6}>
              <Form.Item
                  name={'pay_method'}
                  style={{ width: '100%' }}
                  wrapperCol={{ sm: 24 }}
                  // rules={[{ required: true, message: 'Wpisz numer faktury' }]}
                >
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="cash">Gotówka</Radio.Button>
                  <Radio.Button value="card">Karta</Radio.Button>
                  <Radio.Button value="transfer" >Przelew</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col align="left" offset={2} span={4}>{props.children}</Col>
            <Col align="right" span={2} offset={1}>
              <Text className={classes.cityName}>Człuchów, </Text>
            </Col>
            <Col span={3}>
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
                validateStatus={nipValidity.validateStatus}
                help={nipValidity.errorMsg}
                // rules={[{ required: true, message: 'Wpisz poprawny NIP' }]}
              >
                {/* <InputNumber
                  prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="NIP"
                  style={{width: "100%"}}
                />  */}
                <Complete
                  data={customers}
                  searchParam='nip'
                  onSelect={onSelectCustomer}
                  placeholder="NIP"
                  onChange={checkNipValidity}
                  value={nipValidity.value}
                />
              </Form.Item>
            </Col>
            <Col span={4} offset={1} align="center">
                <Form.Item>
                  <Button type="primary" block size="small" onClick={fetchCustomerData}
                   disabled={nipValidity.value.length != 10 || nipValidity.validateStatus == 'error' ? true : false}
                   >
                    Pobierz dane z GUS
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
                {/* <AutoComplete
                    placeholder="Nazwa klienta"
                    style={{width: '100%'}}
                />  */}
                 <Complete
                  data={customers}
                  searchParam='name'
                  onSelect={onSelectCustomer}
                  placeholder="Nazwa klienta"
                >
                  
                </Complete>
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
            <Col span={10} offset={1}>
              <Form.Item
                name={'customer_info'}
                style={{ width: '100%' }}
                wrapperCol={{ sm: 24 }}
                // rules={[{ required: false, message: 'Wpisz ulicę' }]}
                >
                <TextArea rows={4}
                    placeholder="Informacja dodatkowa."
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
                            {/* <AutoComplete
                            placeholder="Nazwa produktu/usługi"
                            /> */}
                               <Complete
                                data={props.products}
                                searchParam='name'
                                onSelect={(data) => onSelectProduct(data, index)}
                                onChange={(value) => onProductNameChange(value, index)}
                                // placeholder="NIP"
                              />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Form.Item
                          style={{ marginBottom: "0px" }}
                          name={[field.name, "unit"]}
                          fieldKey={[field.fieldKey, "unit"]}
                          
                        >
                            <Select defaultValue="brak" >
                              <Option value="szt. ">szt .</Option>
                              <Option value="brak">brak</Option>
                            </Select>
                        </Form.Item>
                      </Col>
                      <Col span={2}>
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
                      <Col span={2}>
                        <Form.Item
                          name={[field.name, "price_net"]}
                          fieldKey={[field.fieldKey, "price_net"]}
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
                      <Col span={2}>
                        <Form.Item
                          style={{ marginBottom: "0px" }}
                          name={[field.name, "vat"]}
                          fieldKey={[field.fieldKey, "vat"]}
                        >
                            <Select defaultValue={23} onChange={() => countElementSum(index)}>
                              <Option value={0}>zwol.</Option>
                              <Option value={23}>23%</Option>
                            </Select>
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Form.Item
                          style={{ marginBottom: "0px" }}
                          name={[field.name, "total_price_net"]}
                          fieldKey={[field.fieldKey, "total_price_net"]}
                        >
                          <InputNumber
                            disabled
                            style={{ width: '100%' }}
                            placeholder="Wartość netto"
                          /> 
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Form.Item
                          style={{ marginBottom: "0px" }}
                          name={[field.name, "total_price_gross"]}
                          fieldKey={[field.fieldKey, "total_price_gross"]}
                        >
                          <InputNumber
                            disabled
                            style={{ width: '100%' }}
                            placeholder="Wartość brutto"
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