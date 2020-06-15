import React, {useState} from 'react';
// import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Button, Checkbox } from 'antd';
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


const LogInForm = (props) =>{
    const [loading, setLoading] = useState(false);

    const [userData, setUserData] = useState({
        email: '',
        password: '',
    })
    
    const onChange = (name, value) => {
        setUserData({
          ...userData,
          [name]: value.target.value
        });
    }

    const onFinish = () => {
        setLoading(true)
        props.logInRequest(userData.email, sha256(userData.password))
        .then(res => {
            setLoading(false)
        })
    };

    let content = (
        <Form className={classes.authForm}
        {...layout}
        name="basic"
        onFinish={onFinish}
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
export default LogInForm;