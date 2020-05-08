import React, {useState, useEffect} from 'react';
import classes from './productForm.module.css';

import {save_product} from '../../../api_calls/products'

import { LoadingOutlined } from '@ant-design/icons';

import '@ant-design/compatible/assets/index.css';

import { AutoComplete, Select, Typography,InputNumber, Form, Button, Row, Col as Column } from 'antd';

const Col = props =>{
  return <Column align="center" {...props}>{props.children}</Column>
}

const ProductForm = (props) => {
    const [productForm] = Form.useForm()
    const { setFieldsValue, getFieldsValue } = productForm;
    const { Option } = Select;

    const [state, setState] = useState({
      error: '',
      loading: false
    });

    const {Text} = Typography;

    // let formInitialValues = {}

    // if(props.modalData){
    //   formInitialValues = {...props.modalData}
    // }

    useEffect(()=>{
      if(props.modalData){
        console.log(props.modalData)
        setFieldsValue({...props.modalData})
      }
    }, [props.modalData, setFieldsValue])

    const save = async () => {
      setState({...state, loading: true});
      
      // const parsedProduct = Object.keys(product)
      // .filter(el => el !== 'key')
      // .reduce((obj, key) => {
      //   obj[key] = product[key]
      //   return obj
      // }, {})

      const productData = getFieldsValue(['name', 'brand', 'model', 'quantity', 'vat','price_net','price_gross'])
    
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

    const countElementSum = () => {
      //TODO i have no idea why this is working as expected...
      const data = getFieldsValue(['price_net', 'vat'])

      const { price_net, vat } = data;

      if(price_net && vat && !isNaN(price_net) && !isNaN(vat)){
        
        const grossValue = price_net + ((vat * price_net)/100);

        setFieldsValue({'price_gross': parseFloat(grossValue.toFixed(2))})
      }
    }
    
    let content = (
      <React.Fragment>
        <section className={classes.productSection} style={props.style}>
          <Text strong style={{marginBottom: '20px'}}>DANE KLIENTA</Text>
          <Form className={classes.productForm}
            form={productForm}
            onValuesChange={onChange}
            onFinish={save}
            // initialValues={formInitialValues}
          >
            <Row>
              <Col span={24}>
                <Form.Item
                  style={{ width: '100%' }}
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
                <Col span={11}>
                  <Form.Item
                    style={{ width: '100%' }}
                    wrapperCol={{ sm: 24 }}
                    name='brand'
                    >
                      <AutoComplete
                        placeholder="Marka"
                      />
                  </Form.Item>
                </Col>
                <Col span={11} offset={2}>
                  <Form.Item                    
                    style={{ width: '100%' }}
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
                <Col span={4}>
                  <Form.Item
                    style={{ width: '100%' }}
                    wrapperCol={{ sm: 24 }}
                    name='quantity'
                    >
                      <InputNumber
                        placeholder="Stan magazynowy"
                        style={{width: "100%"}}
                      />
                  </Form.Item>               
                </Col>
                <Col span={4} offset={1}>
                  <Form.Item
                    style={{ width: '100%' }}
                    wrapperCol={{ sm: 24 }}
                    name='vat'
                    >
                      {/* <InputNumber
                        placeholder="Stawka VAT"
                        style={{width: "100%"}}
                      /> */}
                      <Select onChange={countElementSum}>
                        <Option value={0}>zwol.</Option>
                        <Option value={23}>23%</Option>
                      </Select>
                  </Form.Item>               
                </Col>
                <Col span={6} offset={2}>
                  <Form.Item
                    style={{ width: '100%' }}
                    wrapperCol={{ sm: 24 }}
                    name='price_net'
                    >
                      <InputNumber
                        onChange={countElementSum}
                        placeholder="Cena netto"
                        style={{width: "100%"}}
                      />
                  </Form.Item>
                </Col>
                <Col span={6} offset={1}>
                  <Form.Item
                    style={{ width: '100%' }}
                    wrapperCol={{ sm: 24 }}
                    name='price_gross'
                    >
                      <InputNumber
                        // onChange={countElementSum}
                        disabled
                        placeholder="Cena brutto"
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