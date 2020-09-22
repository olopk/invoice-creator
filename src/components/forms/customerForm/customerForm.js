import React, {useState, useEffect} from 'react';
import classes from './customerForm.module.css';
import moment from 'moment';

import {save_customer} from '../../../api_calls/customers';
import validateNip from '../../../functions/nipValidation';

import { LoadingOutlined, LockOutlined, UserAddOutlined, UsergroupAddOutlined, SaveOutlined } from '@ant-design/icons';

// import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { AutoComplete, Input, Typography, DatePicker, Form, Button, Row, Col as Column } from 'antd';

const Col = props =>{
  return <Column {...props}>{props.children}</Column>
}

const CustomerForm = (props) => {
    const [form] = Form.useForm();
    const {setFieldsValue, resetFields} = form;

    const {Text} = Typography;
    const {TextArea} = Input;

    const { modalData } = props;

    const [state, setState] = useState({
      error: '',
      loading: false
    });

    // const [nipValidity, setNipValidity] = useState({value: ''})
    
    useEffect(()=>{
      if(modalData){
        modalData.selldate = moment(modalData.selldate, 'YYYY-MM-DD')
        setFieldsValue({
          ...modalData
        })
      }
    }, [modalData, setFieldsValue])

    // useEffect(() => {
    //   form.validateFields(['nickname']);
    // }, [checkNick]);
    
    // const checkNipValidity = (value) =>{
    //   setNipValidity({
    //     ...validateNip(value),
    //     value
    //   })
    //   console.log(validateNip(value))
    //   console.log((modalData && modalData.hasInvoice) || (nipValidity.value !== ''))
    // }

    const save = async (data, keepOpen) => {
      if(keepOpen){
        const validate = await form.validateFields().catch(err => err)
        if(validate.errorFields) return
      }
      setState({...state, loading: true});
      
      const customerData = form.getFieldsValue(['name', 'nip', 'city', 'street', 'phonenr', 'selldate', 'info'])

      const {nip, city, street, phonenr, selldate, info} = customerData;

      customerData.nip = nip ? nip.toString(): ''
      customerData.city = city ? city : ''
      customerData.street = street ? street : ''
      customerData.phonenr = phonenr ? phonenr : ''
      customerData.selldate = selldate ? selldate.format('YYYY-MM-DD') : ''
      customerData.info = info ? info : ''
      customerData.hasInvoice = modalData && modalData.hasInvoice ? true : false

      let response;
      if(props.modalData){
        response = await save_customer(customerData, modalData._id);
      }else{
        response = await save_customer(customerData);
      }
      props.showNotification(response.status, response.message);

      if(response.status === 'success'){
        props.fetchData('customers')
        resetFields()
        if(props.onClose && !keepOpen){
          props.onClose()
        }
      }

      setState({...state, loading: false});
    }

    const onChange = (element) => {
          form.setFieldsValue({element})
    }

    let content = (
      <React.Fragment>
        <section className={classes.customerSection} style={props.style}>
          <Text strong style={{marginBottom: '20px'}}>DANE KLIENTA</Text>
          <Form
            form={form}
            className={classes.customerForm}
            onValuesChange={onChange}
            onFinish={save}
          >
            <Row>
              <Col span={18}>
                <Text style={{textAlign: 'left', display: 'block'}}>Nazwa</Text>
                <Form.Item
                  style={{ width: '95%' }}
                  wrapperCol={{ sm: 24 }}
                  name="name"
                  rules={[{ required: true, message: 'Wpisz poprawna nazwe klienta' }]}
                  >
                  <AutoComplete
                      placeholder="Nazwa klienta"
                      style={{width: '100%'}}
                  /> 
                </Form.Item>               
              </Col>
              <Col span={6}>
                <Text style={{textAlign: 'left', display: 'block'}}>Nip</Text>
                <Form.Item
                  style={{ width: '100%' }}
                  wrapperCol={{ sm: 24 }}
                  name='nip'
                  rules={[
                    () => ({
                      validator(rule, value){
                        const result = validateNip(value)
                        if(result.validateStatus === 'success'){
                          return Promise.resolve()
                        }else if((!modalData || !modalData.hasInvoice) && result.errorMsg === 'NIP nie może być pusty'){
                          return Promise.resolve()
                        }
                        return Promise.reject(result.errorMsg)
                      }
                    })
                  ]}
                  >
                  <Input
                      prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="NIP"
                      style={{width: "100%"}}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Text style={{textAlign: 'left', display: 'block'}}>Miejscowość</Text>
                <Form.Item
                  style={{ width: '95%' }}
                  wrapperCol={{ sm: 24 }}
                  name='city'
                  rules={[{ required: modalData && modalData.hasInvoice ? true : false, message: 'Wpisz miejscowość' }]}
                  >
                  <AutoComplete
                    placeholder="Miejscowość"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Text style={{textAlign: 'left', display: 'block'}}>Ulica</Text>
                <Form.Item
                  style={{ width: '100%' }}
                  wrapperCol={{ sm: 24 }}
                  name='street'
                  rules={[{ required: modalData && modalData.hasInvoice ? true : false, message: 'Wpisz ulicę' }]}
                  >
                  <AutoComplete
                      placeholder="Ulica"
                  />
                </Form.Item>                
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Text style={{textAlign: 'left', display: 'block'}}>Numer telefonu</Text>
                <Form.Item
                  style={{ width: '95%' }}
                  wrapperCol={{ sm: 24 }}
                  name='phonenr'
                  >
                  <AutoComplete
                    placeholder="Numer telefonu"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Text style={{textAlign: 'left', display: 'block'}}>Data sprzedaży</Text>
                <Form.Item
                  name={'selldate'}
                  style={{ width: '100%' }}
                  wrapperCol={{ sm: 24 }}
                  >
                    <DatePicker
                      format={'YYYY-MM-DD'}
                      style={{ width: '100%' }}
                    /> 
                </Form.Item>             
              </Col>
            </Row>
            <Row>              
              <Col span={24}>
                <Text style={{textAlign: 'left', display: 'block'}}>Informacje dodatkowe</Text>
                <Form.Item
                  name={'info'}
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
           {!modalData ? 
              <Row>
                <Col span={11}>
                  <Form.Item>
                    <Button type="primary" icon={<UserAddOutlined />} htmlType="submit" block>
                        Zapisz
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={11} offset={2}>
                  <Form.Item>
                    <Button type="primary" icon={<UsergroupAddOutlined />} danger block onClick={save.bind(this, null, true)}>
                      Zapisz i dodaj kolejnego
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              :
              <Row>
              <Col span={24}>
                <Form.Item>
                  <Button type="primary" icon={<SaveOutlined/>} htmlType="submit" block>
                      Zapisz
                  </Button>
                </Form.Item>
              </Col>
            </Row> }
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


export default CustomerForm;