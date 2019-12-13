import React from 'react';
import classes from './InvoiceForm.module.css';

import { Form, Icon, Input, Button } from 'antd';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const InvoiceForm = (props) => {

    console.log(props);

    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = props.form;

    // props.form.validateFields();

    // const handleSubmit = e => {
    //     e.preventDefault();
    //     props.form.validateFields((err, values) => {
    //       if (!err) {
    //         console.log('Received values of form: ', values);
    //       }
    //     });
    //   };

    const usernameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');

    const HorizontalLoginForm = (
        <Form layout="inline" onSubmit={this.handleSubmit}>
        <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
            Log in
          </Button>
        </Form.Item>
      </Form>
    );
    const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_login' })(HorizontalLoginForm);
    
    return (
        <div className={classes.main}>{WrappedHorizontalLoginForm}</div>
    )
}

export default InvoiceForm;