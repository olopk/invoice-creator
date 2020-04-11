import React, {useState} from 'react';
import { Form, Input, Button } from 'antd';
import classes from './authForm.module.css';

import {signIn as signInQuery} from'../../../api_calls/auth';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};
const tailLayout = {
    wrapperCol: { offset: 5, span: 19 },
};

const authForm = (props) =>{
    // const [userData, setUserData] = useState({
    //     name: '',
    //     surname: '',
    //     email: '',
    //     password: '',
    // })
     const [customer, setCustomer] = useState(
      {
        _id: '',
        nip: '',
        city: '',
        street: '',
        name: ''
      }
    )
    const signIn = (userdata) =>{
    
    }
      return (
        <div className={classes.authBox}>
            <Form className={classes.authForm}
            {...layout}
            name="basic"
            >
            <Form.Item
                label="Imię"
                name="name"
                rules={[{ required: true, message: 'Wpisz imię' }]}
            >
                <Input />
            </Form.Item>
        
            <Form.Item
                label="Nazwisko"
                name="surname"
                rules={[{ required: true, message: 'Wpisz nazwisko' }]}
            >
                <Input />
            </Form.Item>
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
                <Button type="primary" htmlType="submit" className={classes.button} onClick={() => signIn()}>
                Zarejestruj się
                </Button>
            </Form.Item>
        
            <Form.Item {...tailLayout}>
            </Form.Item>
            </Form>
        </div>
      );

}
export default authForm;