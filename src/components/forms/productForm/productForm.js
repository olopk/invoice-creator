import React, {useState, useEffect} from 'react';
import classes from './productForm.module.css';

import {save_product} from '../../../api_calls/products'

import { LoadingOutlined, PlusCircleOutlined, SaveOutlined } from '@ant-design/icons';

import '@ant-design/compatible/assets/index.css';

import { AutoComplete, Select, Typography,InputNumber, Form, Button, Row, Col as Column } from 'antd';

const Col = props =>{
  return <Column align="center" {...props}>{props.children}</Column>
}

const ProductForm = (props) => {
    const [productForm] = Form.useForm()
    const { setFieldsValue, getFieldsValue, resetFields } = productForm;
    const { Option } = Select;

    const [state, setState] = useState({
      error: '',
      loading: false
    });

    const {Text} = Typography;

    const {modalData} = props;

    useEffect(()=>{
      if(modalData){
        setFieldsValue({...modalData})
      }
    }, [modalData, setFieldsValue])

    const save = async (data, keepOpen) => {
      if(keepOpen){
        const validate = await productForm.validateFields().catch(err => err)
        if(validate.errorFields) return
      }
      setState({...state, loading: true});
      
      const productData = getFieldsValue(['name', 'brand', 'model', 'quantity', 'vat','price_net','price_gross'])
    
      let response;
      if(modalData){
        response = await save_product(productData, modalData._id);
      }else{
        response = await save_product(productData);
      }
      props.showNotification(response.status, response.message);

      if(response.status === 'success'){
        props.fetchData('products')
        resetFields()
        if(props.onClose && !keepOpen){
          props.onClose()
        }
      }

      setState({...state, loading: false});
    }
    const onChange = (element) => {  
        setFieldsValue({element})
    }

    const countElementSum = () => {
      //TODO i have no idea why this is working as expected...
      const data = getFieldsValue(['price_gross', 'vat'])

      const { price_gross, vat } = data;

      if(price_gross && vat > -1 && !isNaN(price_gross) && !isNaN(vat)){
        
        const netValue = (price_gross*100)/(100+vat);
        setFieldsValue({'price_net': parseFloat(netValue.toFixed(2))})
      }else{
        setFieldsValue({'price_net': 0})
      }
    }
    
    let content = (
      <React.Fragment>
        <section className={classes.productSection} style={props.style}>
          <Text strong style={{marginBottom: '20px'}}>DANE PRODUKTU</Text>
          <Form className={classes.productForm}
            form={productForm}
            onValuesChange={onChange}
            onFinish={save}
            // initialValues={formInitialValues}
          >
            <Row>
              <Col span={24}>
                <Text style={{textAlign: 'left', display: 'block'}}>Nazwa</Text>
                <Form.Item
                  style={{ width: '100%' }}
                  wrapperCol={{ sm: 24 }}
                  name='name'
                  rules={[{ required: true, message: 'Nazwa produktu jest wymagana' }]}
                  >
                    <AutoComplete
                      placeholder="Nazwa"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                <Text style={{textAlign: 'left', display: 'block'}}>Marka</Text>
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
                <Text style={{textAlign: 'left', display: 'block'}}>Model</Text>
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
                  <Text style={{textAlign: 'left', display: 'block'}}>Stan mag.</Text>
                  <Form.Item
                    style={{ width: '100%' }}
                    wrapperCol={{ sm: 24 }}
                    name='quantity'
                    rules={[{ required: true, message: 'Stan magazynowy jest wymagany' }]}
                    >
                      <InputNumber
                        placeholder="Stan magazynowy"
                        style={{width: "100%"}}
                      />
                  </Form.Item>               
                </Col>
                <Col span={4} offset={1}>
                  <Text style={{textAlign: 'left', display: 'block'}}>Stawka VAT</Text>
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
                        <Option value={0}>zw.</Option>
                        <Option value={8}>8%</Option>
                        <Option value={23}>23%</Option>
                      </Select>
                  </Form.Item>               
                </Col>
                <Col span={6} offset={2}>
                  <Text style={{textAlign: 'left', display: 'block'}}>Cena brutto</Text>
                  <Form.Item
                    style={{ width: '100%' }}
                    wrapperCol={{ sm: 24 }}
                    name='price_gross'
                    rules={[{ required: true, message: 'Cena jest wymagana' }]}
                    >
                      <InputNumber
                        onChange={countElementSum}
                        placeholder="Cena brutto"
                        style={{width: "100%"}}
                      />
                  </Form.Item>
                </Col>
                <Col span={6} offset={1}>
                  <Text style={{textAlign: 'left', display: 'block'}}>Cena netto</Text>
                  <Form.Item
                    style={{ width: '100%' }}
                    wrapperCol={{ sm: 24 }}
                    name='price_net'
                    >
                      <InputNumber
                        // onChange={countElementSum}
                        disabled
                        placeholder="Cena netto"
                        style={{width: "100%"}}
                      />
                  </Form.Item>               
                </Col>
              </Row>
              {!modalData ? 
              <Row>
                <Col span={11}>
                  <Form.Item>
                    <Button type="primary" icon={<SaveOutlined />} htmlType="submit" block>
                        Zapisz
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={11} offset={2}>
                  <Form.Item>
                    <Button type="primary" icon={<PlusCircleOutlined />} danger block onClick={save.bind(this, null, true)}>
                      Zapisz i dodaj następny
                    </Button>
                  </Form.Item>
                </Col>
              </Row> :
              <Row>
              <Col span={24}>
                <Form.Item>
                  <Button type="primary" icon={<SaveOutlined/>} htmlType="submit" block>
                      Zapisz
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            }

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