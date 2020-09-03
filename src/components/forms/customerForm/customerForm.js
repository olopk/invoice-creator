import React, {useState, useEffect} from 'react';
import classes from './customerForm.module.css';

import {save_customer} from '../../../api_calls/customers'

import { LoadingOutlined, LockOutlined } from '@ant-design/icons';

// import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { AutoComplete, Input, Typography, InputNumber, Form, Button, Row, Col as Column } from 'antd';

const Col = props =>{
  return <Column {...props}>{props.children}</Column>
}

const CustomerForm = (props) => {
    const [form] = Form.useForm();
    const {setFieldsValue} = form;

    const {Text} = Typography;
    const {TextArea} = Input;

    const { modalData } = props;

    const [state, setState] = useState({
      error: '',
      loading: false
    });

    useEffect(()=>{
      if(modalData){
        setFieldsValue({
          ...modalData
        })
      }
    }, [modalData, setFieldsValue])

    const save = async () => {
      setState({...state, loading: true});
      
      const customerData = form.getFieldsValue(['name', 'nip', 'city', 'street', 'info'])

      const {nip, city, street, info} = customerData;

      customerData.nip = nip ? nip.toString(): ''
      customerData.city = city ? city : ''
      customerData.street = street ? street : ''
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
        if(props.onClose){
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
                  rules={[{ required: modalData && modalData.hasInvoice ? true : false , message: 'Wpisz poprawny NIP' }]}
                  >
                  <InputNumber
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
            <Row>
              <Col span={24}>
                <Form.Item
                  style={{ width: '100%' }}
                  wrapperCol={{ sm: 24 }}
                >
                  <Button type="primary" htmlType="submit" block>
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
        <div className={classes.main}>
          {content}
        </div>
      );
    }


export default CustomerForm;