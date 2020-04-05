import React, {useState, useEffect} from 'react';
import classes from './customerForm.module.css';

import { Form, Icon, Input, AutoComplete, InputNumber, Button, DatePicker, Row, Col as Column } from 'antd';

// eslint-disable-next-line
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const Col = props =>{
  return <Column {...props}>{props.children}</Column>
}

const CustomerForm = (props) => {
    // eslint-disable-next-line
    const { getFieldDecorator, getFieldsError, setFieldsValue, getFieldError, isFieldTouched } = props.form;

    const [state, setState] = useState({
      error: '',
      loading: false
    });

    // LOCAL STATE AND FUNCTIONS FOR CUSTOMER
    const [customer, setCustomer] = useState(
      {
        _id: '',
        nip: '',
        city: '',
        street: '',
        name: ''
      }
    )
    useEffect(()=>{
      if(props.modalData){
        const {modalData} = props;
        console.log(modalData)
        setCustomer({...customer, ...modalData})
      }
    }, [props.modalData])

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

    const save = async () => {
      setState({...state, loading: true});
      // let response;
      // if(props.modalData){
      //   response = await save_invoice(invoice, customer, products, props.modalData._id);
      // }else{
      //   response = await save_invoice(invoice, customer, products);
      // }
      // props.showNotification(response.status, response.message);
      setState({...state, loading: false});
    }
    // TODO
    // I really dont like this onchange function, need to think about it.

    const onChange = (name, value) => {
          props.form.setFieldsValue({
            [name]: value,
          }, setCustomer({
            ...customer,
            [name]: value
          }));
    }

    const nipError = isFieldTouched('nip') && getFieldError('nip');
    const cityError = isFieldTouched('city') && getFieldError('city');
    const streetError = isFieldTouched('street') && getFieldError('street');
    const nameError = isFieldTouched('name') && getFieldError('name');
        
    let content = (
      <React.Fragment>
        <section className={classes.customerSection}>
          <h1>Dane kontrahenta</h1>
          <Form className={classes.customerForm}>
            <Row>
              <Col span={18}>
              <Form.Item
                validateStatus={nameError ? 'error' : ''}
                help={nameError || ''}
                style={{ width: '95%' }}
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
            <Col span={6}>
              <Form.Item
                validateStatus={nipError ? 'error' : ''}
                help={nipError || ''}
                style={{ width: '90%' }}
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
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  validateStatus={cityError ? 'error' : ''}
                  help={cityError || ''}
                  style={{ width: '95%' }}
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
              <Col span={12}>
                <Form.Item
                  validateStatus={streetError ? 'error' : ''}
                  help={streetError || ''}
                  style={{ width: '95%' }}
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
            {/* <Form.Item>
              <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
              Log in
              </Button>
            </Form.Item> */}
          </Form>
        </section>
      </React.Fragment>
    )

    if(state.loading){
      content = <Icon type="loading" className={classes.loadingIcon}/>;
    }
    
    return(
        <div className={classes.main}>
          {content}
          <Button type="primary" onClick={() => save()}>
            Zapisz.
          </Button>
        </div>
        
      );
    }

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_login' })(CustomerForm);

export default WrappedHorizontalLoginForm;