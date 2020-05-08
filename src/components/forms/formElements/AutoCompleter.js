import React, { useState } from 'react';
// import 'antd/dist/antd.css';
// import './index.css';
import { AutoComplete } from 'antd';

const Complete = (props) => {
  const [val, setVal] = useState('');
  const [options, setOptions] = useState([]);

  const {data, searchParam, onSelect} = props;

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
      if(el[searchParam].includes(searchText)){
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
        // placeholder="control mode"
      />
  );
};

export default Complete;