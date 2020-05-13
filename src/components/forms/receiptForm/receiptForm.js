import React, {useState, useEffect} from 'react';
import classes from './receiptForm.module.css';
import today from '../../../functions/today';
import {save_receipt} from '../../../api_calls/receipts'
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

import { Typography, Input, Select, Form, InputNumber, Button, DatePicker, Row, Col as Column } from 'antd';

import Complete from '../formElements/AutoCompleter'

const Col = props =>{
  return <Column align="center" {...props}>{props.children}</Column>
}

const ReceiptForm = (props) => {
    const [receiptForm] = Form.useForm()
    const {setFieldsValue , getFieldValue, getFieldsValue} = receiptForm;

    const {showNotification, customers} = props;

    const { Option } = Select;
    const { Text } = Typography;
    const { TextArea } = Input;

    const [state, setState] = useState({
      error: '',
      loading: false,
      modalDataId: ''
    });

    let formInitialValues = {
      receipt_nr: '12',
      customer_city: 'Chojnice',
      customer_street: 'Człuchowska',
      customer_name: 'Roman Abramowicz',
      customer_info: 'Prawe oko +6',
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
        const {receipt_nr, date, total_price , customer, order} = props.modalData;
        let parsedOrder = order.map(el => {
          return{
            ...el,
            product: el.product.name,
            unit: 'szt.'         
          }
        })
  
        const parsedDate = moment(date, 'YYYY-MM-DD')
   
        setFieldsValue({
          receipt_nr: receipt_nr,
          total_price: total_price,
          date: parsedDate,        
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
          customer_city: el.city,
          customer_street: el.street,
          customer_info: el.info,
          customer_name: el.name
        }
      )

      // const order = getFieldValue('order');
    }
    const onSelectProduct = (data, index) =>{
      const { el } = data;
      
      let order = getFieldValue('order');
      order[index] = {
        ...order[index],
        price_net: el.price_net,
        product: el.product,
        quantity: el.quantity,
        vat: el.vat,
      }
      setFieldsValue({order: order})
    }
    
    const onFinish = async () => {
      setState({...state, loading: true});

      const allValues = getFieldsValue(true)
      const {receipt_nr, total_price, date, customer_city, customer_street, customer_info, customer_name, order } = allValues;
   
      const receiptData = {
        receipt_nr: receipt_nr,
        date: date._i,
        total_price: total_price
      }
      const customerData = {
        city: customer_city,
        street: customer_street,
        info: customer_info,
        name: customer_name,
      }

      const products = order.map(el => {
        return{
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
        response = await save_receipt(receiptData, customerData, products, props.modalData._id);
      }else{
        response = await save_receipt(receiptData, customerData, products);
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
          form={receiptForm}
          onFinish={onFinish}
          onValuesChange={onChange}
          initialValues={formInitialValues}
          >
          <Row>
            <Col className={classes.title_col} span={24}>
                <Text strong>PARAGON</Text>
            </Col>
          </Row>
          <Row>
            <Col align="center" offset={1} span={5}>
              <Form.Item
                name={'receipt_nr'}
                style={{ width: '100%' }}
                wrapperCol={{ sm: 24 }}
                rules={[{ required: true, message: 'Wpisz numer dokumentu' }]}
              >
                <Input
                  placeholder="Numer paragonu"  
                  prefix={<FileAddOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
              </Form.Item>
            </Col>
            <Col align="center" offset={1} span={4}>{props.children}</Col>
            <Col align="right" span={5} offset={2}>
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
              <Text strong>DANE KLIENTA (NIE SĄ OBOWIĄZKOWE)</Text>
            </Col>
          </Row>
          <Row>
             <Col span={10}  offset={1} align="center">
              <Form.Item
                name={'customer_name'}
                style={{ width: '100%' }}
                wrapperCol={{ sm: 24 }}
                // rules={[{ required: true, message: 'Wpisz nazwę klienta.' }]}
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
            <Col span={10} offset={2}>
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
export default ReceiptForm;