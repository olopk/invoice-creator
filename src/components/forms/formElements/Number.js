import React from 'react';
import { InputNumber } from 'antd';

const Number = (props) =>{
  return (
    <InputNumber  
       style={{ width: '100%' }}
       defaultValue={props.value}
       placeholder={props.placeholder}
      //  onChange={props.onChange}
    />
  )
}

export default Number;