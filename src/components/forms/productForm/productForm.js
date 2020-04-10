import React, {useState, useEffect} from 'react';
import classes from './productForm.module.css';

import { Form, Icon, Input, AutoComplete, InputNumber, Button, DatePicker, Row, Col as Column } from 'antd';

// eslint-disable-next-line
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const Col = props =>{
  return <Column align="center" {...props}>{props.children}</Column>
}

const ProductForm = (props) => {
    // eslint-disable-next-line
    const { getFieldDecorator, getFieldsError, setFieldsValue, getFieldError, isFieldTouched } = props.form;

    const [state, setState] = useState({
      error: '',
      loading: false
    });

    // LOCAL STATE AND FUNCTIONS FOR PRODUCTS
    const [product, setProduct] = useState(
      {
        name: '',
        unit: 'szt.',
        quantity: '',
        price: '',
        total_price: ''
      }
    )

    useEffect(()=>{
      if(props.modalData){
        const {modalData} = props;
        setProduct({...product, ...modalData})
      }
    }, [props.modalData])

    // props.form.validateFields();

    // const handleSubmit = e => {
    //     e.preventDefault();
    //     props.form.validateFields((err, values) => {
    //       if (!err) {
    //         console.log('Received values of form: ', values);
    //       }
    //     });
    //   };

    // const openNotification = (status, message) => {
    //   let icon = <SmileOutlined style={{ color: '#108ee9' }} />;
    //   if(status === 'error'){
    //     icon = <ExclamationCircleOutlined style={{ color: '#108ee9' }} />
    //   }
    //   // status === 'error' ? icon = <ExclamationCircleOutlined style={{ color: '#108ee9' }} /> : null;

    //   notification.info({
    //     message: message,
    //     placement: 'bottomLeft',
    //     icon: icon
    //   });
    // };

    const save = async () => {
      setState({...state, loading: true});
      // let response;
      // if(props.modalData){
      //   response = await save_product(product, props.modalData._id);
      // }else{
      //   response = await save_product(product);
      // }
      // props.showNotification(response.status, response.message);
      setState({...state, loading: false});
    }
    const onChange = (name, value) => {  
        props.form.setFieldsValue({
          [name]: value,
        }, setProduct({
          ...product,
          [name]: value,
        }));
    }


    const nameError = isFieldTouched('name') && getFieldError('name');
    const brandError = isFieldTouched('brand') && getFieldError('brand');
    const modelError = isFieldTouched('model') && getFieldError('model');
    const priceError = isFieldTouched('price') && getFieldError('price');
    const quantityError = isFieldTouched('quantity') && getFieldError('quantity');            
    
    let content = (
      <React.Fragment>
        <section className={classes.productSection}>
          <h1>Dane produktu</h1>
          <Form className={classes.productForm}>
            <Row>
              <Col span={24}>
                <Form.Item
                  validateStatus={nameError ? 'error' : ''}
                  help={nameError || ''}
                  style={{ width: '90%' }}
                  wrapperCol={{ sm: 24 }}
                  >
                  {getFieldDecorator(
                    'name',
                    {initialValue: product.name, rules: [{ required: true, message: 'Wpisz nazwę' }],})
                    (<AutoComplete
                    placeholder="Nazwa"
                    onChange={(el) => onChange('name', el)}
                  />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    validateStatus={brandError ? 'error' : ''}
                    help={brandError || ''}
                    style={{ width: '80%' }}
                    wrapperCol={{ sm: 24 }}
                    >
                    {getFieldDecorator(
                      'brand',
                      {initialValue: product.brand, rules: [{ required: false, message: 'Wpisz nazwę' }],})
                      (<AutoComplete
                      placeholder="Marka"
                      onChange={(el) => onChange('brand', el)}
                    />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    validateStatus={modelError ? 'error' : ''}
                    help={modelError || ''}
                    style={{ width: '80%' }}
                    wrapperCol={{ sm: 24 }}
                    >
                    {getFieldDecorator(
                      'model',
                      {initialValue: product.model, rules: [{ required: false, message: 'Wpisz nazwę' }],})
                      (<AutoComplete
                      placeholder="Model"
                      onChange={(el) => onChange('model', el)}
                    />)}
                  </Form.Item>               
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item
                    validateStatus={priceError ? 'error' : ''}
                    help={priceError || ''}
                    style={{ width: '70%' }}
                    wrapperCol={{ sm: 24 }}
                    >
                    {getFieldDecorator(
                      'price',
                      {initialValue: product.price, rules: [{ required: true, message: 'Wpisz cenę' }],})
                      (<InputNumber
                      placeholder="Cena"
                      onChange={(el) => onChange('price', el)}
                      style={{width: "100%"}}
                    />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    validateStatus={quantityError ? 'error' : ''}
                    help={quantityError || ''}
                    style={{ width: '70%' }}
                    wrapperCol={{ sm: 24 }}
                    >
                    {getFieldDecorator(
                      'quantity',
                      {initialValue: product.quantity, rules: [{ required: true, message: 'Wpisz stan magazynowy' }],})
                      (<InputNumber
                      placeholder="Nazwa"
                      onChange={(el) => onChange('quantity', el)}
                      style={{width: "100%"}}
                    />)}
                  </Form.Item>               
                </Col>
              </Row>
             
            {/* <Form.Item>
              <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
              Log in
              </Button>
            </Form.Item> */}
          </Form>
        </section>
      </React.Fragment>
    )

    if(state.loading){
      content = <Icon type="loading" className={classes.loadingIcon}/>;
    }
    
    return(
        <div className={classes.main}>
          {content}
          <Button type="primary" onClick={() => save()}>
            Zapisz
          </Button>
        </div>
        
      );
    }

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_login' })(ProductForm);

export default WrappedHorizontalLoginForm;