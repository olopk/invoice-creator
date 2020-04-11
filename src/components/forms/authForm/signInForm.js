import React, {useState} from 'react';
import { Form, Input, Button } from 'antd';
import classes from './authForm.module.css';
import ShowNotification from '../../NotificationSnackbar/Notification';

import {signIn} from'../../../api_calls/auth';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};
const tailLayout = {
    wrapperCol: { offset: 5, span: 19 },
};

const SignInForm = (props) =>{
    const [userData, setUserData] = useState({
        name: '',
        surname: 'Cos tam',
        email: '',
        password: 'elo',
    })
    
    const onChange = (name, value) => {
        setUserData({
          ...userData,
          [name]: value.target.value
        });
    }

    const signInRequest = async (data) =>{
        const result = await signIn(data);
        ShowNotification(result.status, result.message)
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
                <Input 
                    value={userData.name}
                    onChange={(el) => onChange('name', el)}
                />
            </Form.Item>
        
            <Form.Item
                label="Nazwisko"
                name="surname"
                rules={[{ required: true, message: 'Wpisz nazwisko' }]}
                >
                <Input 
                    value={userData.surname}
                    onChange={(el) => onChange('surname', el)}
                />
            </Form.Item>
            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Wpisz email' }]}
                >
                <Input
                    value={userData.email}
                    onChange={(el) => onChange('email', el)}
                />
            </Form.Item>
        
            <Form.Item
                label="Hasło"
                name="password"
                rules={[{ required: true, message: 'Wpisz hasło' }]}
                >
                <Input.Password 
                    value={userData.password}
                    onChange={(el) => onChange('password', el)}
                />
            </Form.Item>
        
            <Form.Item {...tailLayout} name="remember">
                <Button type="primary" htmlType="submit" className={classes.button} onClick={() => signInRequest(userData)}>
                Zarejestruj się
                </Button>
            </Form.Item>
        
            <Form.Item {...tailLayout}>
            </Form.Item>
            </Form>
        </div>
      );

}
export default SignInForm;