import React, {useState} from 'react';
// import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import classes from './authForm.module.css';
import sha256 from 'sha256';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};
const tailLayout = {
    wrapperCol: { offset: 5, span: 19 },
};

const SignInForm = (props) =>{
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
    })
    
    const onChange = (name, value) => {
        setUserData({
          ...userData,
          [name]: value.target.value
        });
    }

    const onFinish = () =>{
       setLoading(true)
       props.signInRequest({
           ...userData,
           password: sha256(userData.password)
       })
       .then(res => {
        setLoading(false)
       })
    }

    let content = (
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
            <Button type="primary" htmlType="submit" className={classes.button} onClick={onFinish}>
            Zarejestruj się
            </Button>
        </Form.Item>
    
        <Form.Item {...tailLayout}>
        </Form.Item>
        </Form>
    )

    if(loading){
        content = <LoadingOutlined className={classes.loadingIcon} />
    }

      return (
        <div className={classes.authBox}>
          {content}
        </div>
      );

}
export default SignInForm;