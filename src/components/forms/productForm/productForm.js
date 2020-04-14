import React, {useState, useEffect} from 'react';
import classes from './productForm.module.css';

import {save_product} from '../../../api_calls/products'

import { LoadingOutlined } from '@ant-design/icons';

// import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { AutoComplete, InputNumber, Form, Button, Row, Col as Column } from 'antd';

const Col = props =>{
  return <Column align="center" {...props}>{props.children}</Column>
}

const ProductForm = (props) => {
    const [productForm] = Form.useForm()
    const { setFieldsValue, getFieldsValue } = productForm;

    const [state, setState] = useState({
      error: '',
      loading: false
    });

    // name: '',
    // unit: 'szt.',
    // quantity: '',
    // price: ''

    useEffect(()=>{
      if(props.modalData){
        setFieldsValue({...props.modalData})
      }
    }, [props.modalData])

    const save = async () => {
      setState({...state, loading: true});
      
      // const parsedProduct = Object.keys(product)
      // .filter(el => el !== 'key')
      // .reduce((obj, key) => {
      //   obj[key] = product[key]
      //   return obj
      // }, {})

      const productData = getFieldsValue(['name', 'brand', 'model', 'quantity', 'price'])
      console.log(productData)
      let response;
      if(props.modalData){
        response = await save_product(productData, props.modalData._id);
      }else{
        response = await save_product(productData);
      }
      props.showNotification(response.status, response.message);
      setState({...state, loading: false});
    }
    const onChange = (element) => {  
        setFieldsValue({element})
    }     
    
    let content = (
      <React.Fragment>
        <section className={classes.productSection}>
          <h1>Dane produktu</h1>
          <Form className={classes.productForm}
            form={productForm}
            onValuesChange={onChange}
            onFinish={save}
          >
            <Row>
              <Col span={24}>
                <Form.Item
                  style={{ width: '90%' }}
                  wrapperCol={{ sm: 24 }}
                  name='name'
                  >
                    <AutoComplete
                      placeholder="Nazwa"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    style={{ width: '80%' }}
                    wrapperCol={{ sm: 24 }}
                    name='brand'
                    >
                      <AutoComplete
                        placeholder="Marka"
                      />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item                    
                    style={{ width: '80%' }}
                    wrapperCol={{ sm: 24 }}
                    name='model'
                    >
                      <AutoComplete
                        placeholder="Model"
                      />
                  </Form.Item>               
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item
                    style={{ width: '70%' }}
                    wrapperCol={{ sm: 24 }}
                    name='price'
                    >
                      <InputNumber
                        placeholder="Cena"
                        style={{width: "100%"}}
                      />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    style={{ width: '70%' }}
                    wrapperCol={{ sm: 24 }}
                    name='quantity'
                    >
                      <InputNumber
                        placeholder="Nazwa"
                        style={{width: "100%"}}
                      />
                  </Form.Item>               
                </Col>
              </Row>
             <Row>
               <Col span={24}>
                  <Form.Item
                  //  style={{ width: '100%' }}
                   wrapperCol={{ sm: 24 }}
                  >
                    <Button type="primary" htmlType="submit" block>
                      Zapisz
                    </Button>
                  </Form.Item>
               </Col>
             </Row>

          </Form>
        </section>
      </React.Fragment>
    )

    if(state.loading){
      content = <LoadingOutlined className={classes.loadingIcon} />;
    }
    
    return(
        <div className={classes.main}>
          {content}
        </div>
        
      );
    }

export default ProductForm;