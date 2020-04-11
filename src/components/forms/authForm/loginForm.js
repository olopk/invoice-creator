import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import classes from './authForm.module.css';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};
const tailLayout = {
    wrapperCol: { offset: 5, span: 19 },
};


const authForm = (props) =>{
      return (
        <div className={classes.authBox}>
            <Form className={classes.authForm}
            {...layout}
            name="basic"
            >
            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Wpisz email' }]}
            >
                <Input />
            </Form.Item>
        
            <Form.Item
                label="Hasło"
                name="password"
                rules={[{ required: true, message: 'Wpisz hasło' }]}
            >
                <Input.Password />
            </Form.Item>
        
            <Form.Item {...tailLayout} name="remember">
                <Checkbox>Zapamiętaj mnie</Checkbox>
                <Button type="primary" htmlType="submit" className={classes.button}>
                Zaloguj się
                </Button>
            </Form.Item>
        
            <Form.Item {...tailLayout}>
            </Form.Item>
            </Form>
        </div>
      );

}
export default authForm;