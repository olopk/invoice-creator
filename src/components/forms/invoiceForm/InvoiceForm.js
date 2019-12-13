import React from 'react';
import classes from './InvoiceForm.module.css';
import moment from 'moment';
import AutoCompleter from '../formElements/AutoCompleter';

import { Form, Icon, Input, Button, DatePicker } from 'antd';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const InvoiceForm = (props) => {

    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = props.form;

    // props.form.validateFields();

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
      };

    const usernameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');     
  
    return(
        <Form layout="inline" onSubmit={handleSubmit} className={classes.main}>
          <Form.Item
            validateStatus={usernameError ? 'error' : ''}
            help={usernameError || ''}
          >
            {getFieldDecorator('username', {rules: [{ required: true, message: 'Please input your username!' }],})(<Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Numer faktury"
            />,)}
          </Form.Item>
          <Form.Item
            validateStatus={passwordError ? 'error' : ''}
            help={passwordError || ''}
          >
          {getFieldDecorator('password', {rules: [{ required: true, message: 'Please input your Password!' }],})(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Miejsce"
            />,)}
          </Form.Item>
        
          <Form.Item> 
            <DatePicker defaultValue={moment('01/01/2015', 'DD/MM/YYYY')} format={'DD/MM/YYYY'} />
          </Form.Item>

          <Form.Item>
            <AutoCompleter/>
          </Form.Item>
        
        
        
          {/* <Form.Item>
            <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
              Log in
            </Button>
          </Form.Item> */}
        </Form>
      );
    }

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_login' })(InvoiceForm);

export default WrappedHorizontalLoginForm;