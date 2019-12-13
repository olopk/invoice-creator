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
    return (
        <AutoComplete
          value={value}
          dataSource={dataSource}
          style={{ width: 200 }}
          onSelect={onSelect}
          onSearch={onSearch}
          onChange={onChange}
          placeholder="NIP"
        />
    )
}
export default AutoCompleter;