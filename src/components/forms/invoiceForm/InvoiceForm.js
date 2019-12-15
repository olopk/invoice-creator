import React, {useState} from 'react';
import classes from './InvoiceForm.module.css';
import moment from 'moment';
import today from '../../../functions/today';

import { Form, Icon, Input, AutoComplete, InputNumber, Button, DatePicker, Row, Col } from 'antd';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const InvoiceForm = (props) => {
    const { getFieldDecorator, getFieldsError, setFieldsValue, getFieldError, isFieldTouched } = props.form;

    const [state, setState] = useState(
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
        product_name: '',
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

    const onChange = (name, value) => {
        console.log(value)
        props.form.setFieldsValue({
          [name]: value,
        }, setState({
          ...state,
          [name]: value
        }));
    }


    const invoicenrError = isFieldTouched('invoice_nr') && getFieldError('invoice_nr');
    const cityError = isFieldTouched('city') && getFieldError('city');
    const dateError = isFieldTouched('date') && getFieldError('date');
    const customer_nipError = isFieldTouched('customer_nip') && getFieldError('customer_nip');
    const customer_streetError = isFieldTouched('customer_city') && getFieldError('customer_city');
    const customer_cityError = isFieldTouched('customer_street') && getFieldError('customer_street');
    const customer_nameError = isFieldTouched('customer_name') && getFieldError('customer_name');
  

    let products_list = products.map((position, index) => {
      
      return (
        <Row>
          <Col span={13}>
            <Form.Item
              validateStatus={customer_nameError ? 'error' : ''}
              help={customer_nameError || ''}
              >
              {getFieldDecorator(
                'product_name',
                {initialValue: products.product_name, rules: [{ required: true, message: 'Wpisz poprawna nazwe' }],})
                (<AutoComplete
                  placeholder="Nazwa kontrahenta"
                  onChange={(el) => onChange('customer_name', el)}
                  />)} 
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item
              validateStatus={customer_nameError ? 'error' : ''}
              help={customer_nameError || ''}
              >
              {getFieldDecorator(
                'customer_name',
                {initialValue: state.customer_name, rules: [{ required: true, message: 'Wpisz poprawne miasto' }],})
                (<AutoComplete
                  placeholder="Nazwa kontrahenta"
                  onChange={(el) => onChange('customer_name', el)}
                  />)} 
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item
              validateStatus={customer_nameError ? 'error' : ''}
              help={customer_nameError || ''}
              >
              {getFieldDecorator(
                'customer_name',
                {initialValue: state.customer_name, rules: [{ required: true, message: 'Wpisz poprawne miasto' }],})
                (<AutoComplete
                  placeholder="Nazwa kontrahenta"
                  onChange={(el) => onChange('customer_name', el)}
                  />)} 
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item
              validateStatus={customer_nameError ? 'error' : ''}
              help={customer_nameError || ''}
              >
              {getFieldDecorator(
                'customer_name',
                {initialValue: state.customer_name, rules: [{ required: true, message: 'Wpisz poprawne miasto' }],})
                (<AutoComplete
                  placeholder="Nazwa kontrahenta"
                  onChange={(el) => onChange('customer_name', el)}
                  />)} 
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              validateStatus={customer_nameError ? 'error' : ''}
              help={customer_nameError || ''}
              >
              {getFieldDecorator(
                'customer_name',
                {initialValue: state.customer_name, rules: [{ required: true, message: 'Wpisz poprawne miasto' }],})
                (<AutoComplete
                  placeholder="Nazwa kontrahenta"

                  onChange={(el) => onChange('customer_name', el)}
                  />)} 
            </Form.Item>
          </Col>
      </Row>
      )
    })

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
                      ,{initialValue: state.invoice_nr ,rules: [{ required: true, message: 'Pole nie zostało wypełnione poprawnine' }],})
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
                      {initialValue: state.city, rules: [{ required: true, message: 'Wpisz poprawne miasto' }],})
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
                      {initialValue: moment(state.date, 'DD/MM/YYYY'), rules: [{ required: true, message: 'Wpisz poprawne miasto' }],})
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
                    {initialValue: state.customer_nip, rules: [{ required: true, message: 'Wpisz poprawny NIP' }],})
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
                      {initialValue: state.customer_city, rules: [{ required: true, message: 'Wpisz poprawne miasto' }],})
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
                      {initialValue: state.customer_street, rules: [{ required: true, message: 'Wpisz poprawną ulicę' }],})
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
                    {initialValue: state.customer_name, rules: [{ required: true, message: 'Wpisz poprawne miasto' }],})
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
          </section>
        </div>
        
      );
    }

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_login' })(InvoiceForm);

export default WrappedHorizontalLoginForm;