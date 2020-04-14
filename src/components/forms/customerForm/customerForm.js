import React, {useState, useEffect} from 'react';
import classes from './customerForm.module.css';

import {save_customer} from '../../../api_calls/customers'

import { LoadingOutlined, LockOutlined } from '@ant-design/icons';

// import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { AutoComplete, InputNumber, Form, Button, Row, Col as Column } from 'antd';
const Col = props =>{
  return <Column {...props}>{props.children}</Column>
}

const CustomerForm = (props) => {
    const [form] = Form.useForm();

    const [state, setState] = useState({
      error: '',
      loading: false
    });

    useEffect(()=>{
      if(props.modalData){
        form.setFieldsValue({
          ...props.modalData
        })
      }
    }, [props.modalData])

    const save = async () => {
      setState({...state, loading: true});
      
      const customerData = form.getFieldsValue(['name', 'nip', 'city', 'street'])
      let response;
      if(props.modalData){
        response = await save_customer(customerData, props.modalData._id);
      }else{
        response = await save_customer(customerData);
      }
      props.showNotification(response.status, response.message);
      setState({...state, loading: false});
    }

    const onChange = (element) => {
          form.setFieldsValue({element})
    }

    let content = (
      <React.Fragment>
        <section className={classes.customerSection}>
          <h1>Dane kontrahenta</h1>
          <Form
            form={form}
            className={classes.customerForm}
            // initialValues={{}}
            onValuesChange={onChange}
            onFinish={save}
          >
            <Row>
              <Col span={18}>
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
              <Form.Item
                style={{ width: '90%' }}
                wrapperCol={{ sm: 24 }}
                name='nip'
                rules={[{ required: true, message: 'Wpisz poprawny NIP' }]}
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
                <Form.Item
                  style={{ width: '95%' }}
                  wrapperCol={{ sm: 24 }}
                  name='city'
                  rules={[{ required: true, message: 'Wpisz miejscowość' }]}
                  >
                  <AutoComplete
                    placeholder="Miejscowość"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  style={{ width: '95%' }}
                  wrapperCol={{ sm: 24 }}
                  name='street'
                  rules={[{ required: true, message: 'Wpisz ulicę' }]}
                  >
                  <AutoComplete
                      placeholder="Ulica"
                  />
                </Form.Item>                
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  style={{ width: '97%' }}
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