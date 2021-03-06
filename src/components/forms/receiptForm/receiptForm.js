import React, {useState, useRef, useEffect} from 'react';
import classes from './receiptForm.module.css';
import today from '../../../functions/today';
import {save_receipt} from '../../../api_calls/receipts'
import moment from 'moment';

import createPDF from '../pdfdocForm';

import {
  FileAddOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  SaveOutlined
} from '@ant-design/icons';

import '@ant-design/compatible/assets/index.css';

import { Typography, Input, Select, Radio, Form, InputNumber, Button, DatePicker, Row, Col as Column } from 'antd';

import Complete from '../formElements/AutoCompleter'

const Col = props =>{
  return <Column align="center" {...props}>{props.children}</Column>
}

const ReceiptForm = (props) => {
    const [receiptForm] = Form.useForm()
    const {setFieldsValue , resetFields, getFieldValue, getFieldsValue} = receiptForm;

    const productRef = useRef();
    const custInfoRef = useRef();

    const {showNotification, customers, lastReceiptNr} = props;

    const { Option } = Select;
    const { Text } = Typography;
    const { TextArea } = Input;

    const [state, setState] = useState({
      error: '',
      loading: false,
      modalDataId: ''
    });

    let formInitialValues = {
      receipt_nr: lastReceiptNr ? (parseInt(lastReceiptNr)+1).toString() : '',
      pay_method: 'card',
      customer_city: '',
      customer_street: '',
      customer_name: '',
      customer_info: '',
      customer_phonenr: '',
      order: [
        {
          // price_net: 0,
          product: '',
          // quantity: 0,
          total_price: '',
          unit: 'szt. ',
          vat: 0
        }
      ],
      date: moment(today(), 'YYYY-MM-DD')
    }
    
    useEffect(()=>{
      if(props.modalData){
        const {receipt_nr, date, total_price, pay_method , customer, order} = props.modalData;
        let parsedOrder = order.map(el => {
          return{
            ...el,
            id: el.product._id,
            product: el.product.name,
            unit: 'szt.'         
          }
        })
  
        const parsedDate = moment(date, 'YYYY-MM-DD')
   
        setFieldsValue({
          receipt_nr: receipt_nr,
          total_price: total_price,
          pay_method: pay_method,
          date: parsedDate,        
          customer_id: customer._id,
          customer_city: customer.city,
          customer_street: customer.street,
          customer_info: customer.info,
          customer_name: customer.name,
          customer_phonenr: customer.phonenr,
          order: parsedOrder
        })
      }

    }, [props.modalData, setFieldsValue])

    const onSelectCustomer = (data) =>{
      const { el } = data;

      setFieldsValue(
        {
          customer_id: el._id,
          customer_city: el.city,
          customer_street: el.street,
          customer_info: el.info,
          customer_name: el.name,
          customer_phonenr: el.phonenr
        }
      )
      custInfoRef.current.focus()

      // const order = getFieldValue('order');
    }
    const onSelectProduct = (data, index) =>{
      const { el } = data;
      
      let order = getFieldValue('order');
      order[index] = {
        ...order[index],
        id: el._id,
        price_gross: el.price_gross,
        product: `${el.name}${el.brand ? `, ${el.brand}` : ''}${el.model ? `, ${el.model}` : ''}`,
        quantity: 1,
        unit: 'szt.',
        vat: el.vat,
        total_price_net: el.price_net,
        total_price_gross: el.price_gross 
      }
      setFieldsValue({order: order})
      countTotalSum(order)
      productRef.current.focus()
    }
    
    const onFinish = async (data, saveOnly) => {
      if(saveOnly){
        const validate = await receiptForm.validateFields().catch(err => err)
        if(validate.errorFields) return
      }
      setState({...state, loading: true});

      const allValues = getFieldsValue(true)
      const {receipt_nr, total_price, pay_method, date, customer_id, customer_city, customer_phonenr, customer_street, customer_info, customer_name, order } = allValues;
   
      const receiptData = {
        receipt_nr: receipt_nr,
        date: date._i,
        total_price: total_price,
        pay_method: pay_method
      }
      const customerData = {
        _id: customer_id,
        city: customer_city,
        street: customer_street,
        info: customer_info,
        name: customer_name,
        phonenr: customer_phonenr,
        selldate: date._i
      }

      const products = order.map(el => {
        const priceNet = (el.price_gross*100)/(100+el.vat)
        return{
              _id: el.id,
              name: el.product,
              unit: 'szt.',
              quantity: el.quantity,
              price_net: priceNet,
              price_gross: el.price_gross,
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
        props.fetchData('receipts')
        if(!saveOnly){
          createPDF(allValues)
        }
        resetFields()
        setFieldsValue({receipt_nr: +receipt_nr+1})
        if(props.onClose){
          props.onClose()
        }
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

    const countElementSum = (index) => {
      //TODO i have no idea why this is working as expected...
      const data = getFieldsValue(['order'])

      const price = data.order[index].price_gross;
      const quantity = data.order[index].quantity;
      const vat = data.order[index].vat;

      if(!isNaN(price) && !isNaN(quantity) && !isNaN(vat)){
        
        const grossValue =  price * quantity
        data.order[index].total_price_gross = parseFloat(grossValue.toFixed(2))

        const netValue = ((price * quantity)*100)/(100 + vat);

        data.order[index].total_price_net = parseFloat(netValue.toFixed(2))

        countTotalSum(data.order)
      }
    }

    const countTotalSum = (order) =>{
      // const data = getFieldsValue(['order'])
        let sum = 0;
        order.forEach(el => {
          if(el && el.total_price_gross){
            sum += el.total_price_gross
          }
        })
        setFieldsValue({'total_price': parseFloat(sum.toFixed(2))})
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
            <Col align="center" offset={1} span={3}>
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
                  <Radio.Button value="transfer" disabled>Przelew</Radio.Button>
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
              <Text strong>DANE KLIENTA (NIE SĄ OBOWIĄZKOWE)</Text>
            </Col>
          </Row>
          <Row>
             <Col span={10}  offset={1} align="center">
              <Form.Item
                name={'customer_name'}
                style={{ width: '100%' }}
                wrapperCol={{ sm: 24 }}
                >
                 <Complete
                  data={customers}
                  searchParam='name'
                  onSelect={onSelectCustomer}
                  placeholder="Nazwa klienta"
                  onChange={()=>resetFields(['customer_id'])}
                >
                </Complete>
              </Form.Item>               
              <Form.Item
                name={'customer_city'}
                style={{ width: '100%' }}
                wrapperCol={{ sm: 24 }}
                >
                <Input
                  placeholder="Miejscowość"
                /> 
              </Form.Item>
              <Form.Item
                name={'customer_street'}
                style={{ width: '100%' }}
                wrapperCol={{ sm: 24 }}
                >
                <Input
                    placeholder="Ulica"
                /> 
              </Form.Item>
              <Form.Item
                style={{ width: '100%' }}
                wrapperCol={{ sm: 24 }}
                name='customer_phonenr'
                >
                <Input
                  placeholder="Numer telefonu"
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
                    ref={custInfoRef}
                /> 
              </Form.Item>                
            </Col>
          </Row>
          <Form.List name="order">
            {(fields, {add,remove}) => {
              return(
                <div>
                 <Row>
                    <Col span={13}
                      className={classes.title_col__products}
                    >
                      <Text strong>TOWARY I USŁUGI</Text>      
                    </Col>
                    <Col span={1}>
                      <PlusCircleOutlined style={{ fontSize: "25px", margin: "0px 15px"}} onClick={add} />
                    </Col>
                    <Col span={2} offset={1}>cena brutto</Col>
                    <Col span={2} offset={2}>razem netto</Col>
                    <Col span={2}>razem brutto</Col>
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
                            /> */}
                               <Complete
                                placeholder="Nazwa produktu/usługi"
                                data={props.products}
                                searchParam='name'
                                dataType='products'
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
                            <Select >
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
                            ref={productRef}
                            onChange={() => countElementSum(index)}
                          /> 
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Form.Item
                          name={[field.name, "price_gross"]}
                          fieldKey={[field.fieldKey, "price_gross"]}
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
                            <Select onChange={() => countElementSum(index)}>
                              <Option value={0}>zw.</Option>
                              <Option value={8}>8%</Option>
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
                  marginBottom: '45px'
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
              <Col span={10} offset={1} align="center">
                <Form.Item>
                  <Button type="primary" icon={<FileAddOutlined />} htmlType="submit" block>
                    Zapisz i drukuj PDF
                  </Button>
                </Form.Item>
              </Col>
              <Col span={10} offset={2} align="center">
                <Form.Item>
                  <Button type="primary" icon={<SaveOutlined/>} danger block onClick={onFinish.bind(this, null, true)}>
                    Zapisz
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