import React, { useState } from 'react';
// import 'antd/dist/antd.css';
// import './index.css';
import { AutoComplete, Input } from 'antd';

const Complete = (props) => {
  const [val, setVal] = useState('');
  const [options, setOptions] = useState([]);

  const {data, searchParam, onSelect, placeholder, dataType, disabled} = props;

  const { value , onChange } = props;

  if(value && val !== value){
    setVal(value)
  }
 
  const onValChange = inputValue => {
    setVal(inputValue);
    if (onChange) {
      onChange(inputValue);
    }
  };

  const onSearch = (searchText, data, searchParam) => {
    let opts = [];

    data.forEach(el => {
      if(dataType === 'products' &&
        ((el[searchParam] && el[searchParam].includes(searchText))
        || ( el.brand && el.brand.includes(searchText))
        || (el.model && el.model.includes(searchText)))){
               
          opts.push({value: `${el[searchParam]}${el.brand ? `, ${el.brand}` : ''}${el.model ? `, ${el.model}` : ''}`, el: el})
      }
      else if(el[searchParam] && el[searchParam].includes(searchText)){
        
        opts.push({value: el[searchParam], el: el})
      }
    })

    setOptions(!searchText ? [] : opts );
  };

  return (
      <AutoComplete
        value={val}
        options={options}
        onSelect={(value, object) => onSelect(object)}
        onSearch={(searchText) => onSearch(searchText, data, searchParam)}
        onChange={onValChange}
        disabled={disabled}
        >
        <Input
          placeholder={placeholder}
        />
      </AutoComplete>
  );
};

export default Complete;