import React, {useState} from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import classes from './authForm.module.css';
import ShowNotification from '../../NotificationSnackbar/Notification';

import {logIn} from'../../../api_calls/auth';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};
const tailLayout = {
    wrapperCol: { offset: 5, span: 19 },
};


const LogInForm = (props) =>{
    const [userData, setUserData] = useState({
        email: '',
        password: 'elo',
    })
    
    const onChange = (name, value) => {
        setUserData({
          ...userData,
          [name]: value.target.value
        });
    }

    const LogInRequest = async (email, password) =>{
        console.log(email, password)
        const result = await logIn(email, password);
    
        ShowNotification(result.status, result.message)
    }
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
                <Input 
                   onChange={(el) => onChange('email', el)}
                />
            </Form.Item>
        
            <Form.Item
                label="Hasło"
                name="password"
                rules={[{ required: true, message: 'Wpisz hasło' }]}
            >
                <Input.Password
                   onChange={(el) => onChange('password', el)}
                />
            </Form.Item>
        
            <Form.Item {...tailLayout} name="remember">
                <Checkbox>Zapamiętaj mnie</Checkbox>
                <Button type="primary" htmlType="submit" className={classes.button} onClick={()=> LogInRequest(userData.email, userData.password)}>
                Zaloguj się
                </Button>
            </Form.Item>
        
            <Form.Item {...tailLayout}>
            </Form.Item>
            </Form>
        </div>
      );

}
export default LogInForm;