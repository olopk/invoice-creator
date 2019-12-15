import React, {useState} from 'react';

import { AutoComplete } from 'antd';

function onSelect(value) {
  console.log('onSelect', value);
}

const AutoCompleter = (props) => {
    
    const [value, setValue] = useState('');
    const [dataSource, setDataSource] = useState([]);

    const onSearch = searchText => {
      setDataSource(!searchText ? [] : [searchText, searchText.repeat(2), searchText.repeat(3)])
    };

    const onChange = value => {
      setValue(value);
    };

    const width = props.width
    return (
        <AutoComplete
          value={props.value}
          dataSource={dataSource}
          style={{ width: width }}
          onSelect={onSelect}
          onSearch={onSearch}
          onChange={onChange}
          placeholder={props.placeholder}
        />
    )
}
export default AutoCompleter;