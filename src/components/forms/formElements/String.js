import React from 'react';
import { Input } from 'antd';

const String = (props) => {
    return (
        <Input 
            placeholder={props.placeholder}
            prefix={props.prefix}
            onChange={props.onChange}
            
        />
    )
}

export default String;