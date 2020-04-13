import React, {useState} from 'react';
// import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Button, Checkbox } from 'antd';
import classes from './authForm.module.css';

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
    // onClick={()=> props.logInRequest(userData.email, userData.password)}

    const onFinish = values => {
        props.logInRequest(values.email, values.password)
      };
    
    // const onFinishFailed = errorInfo => {
    //     console.log('Failed:', errorInfo);
    // };
    

      return (
        <div className={classes.authBox}>
            <Form className={classes.authForm}
            {...layout}
            name="basic"
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
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

            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                <Checkbox>Zapamiętaj mnie</Checkbox>
            </Form.Item>

            <Form.Item>
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
export default LogInForm;