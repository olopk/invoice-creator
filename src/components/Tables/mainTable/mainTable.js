import React, {Component} from 'react';
import { Table, Input, Button, Icon } from 'antd';
import Highlighter from 'react-highlight-words';
import classes from './mainTable.module.css';

class MainTable extends Component {
  state = {
    searchText: '',
    searchedColumn: '',
    // loading: false,
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  actions = (rowData) =>{
    // console.log(rowData)
    return(
      <span>
        <Icon className={classes.tableIcon} type="edit" onClick={()=>this.props.openModal(this.props.dataType, rowData)}/>
        <Icon className={classes.tableIcon} type="delete" onClick={()=>this.props.delete(rowData.key)}/>
      </span>
    )
  }

  
  render() {
    let table, columns;
    
    if(!this.props.data){
      table = <Icon type="loading" className={classes.loadingIcon}/>;
    }else{
        columns = this.props.columns.map(el => {
        return {
              title: el.title,
              dataIndex: el.dataIndex,
              key: el.dataIndex,
              width: el.width,
              ...this.getColumnSearchProps(el.dataIndex),
            }
      })
      columns.push({
            title: 'Action',
            key: 'action',
            render: (data) => this.actions(data)
          })
      table = <Table columns={columns} dataSource={this.props.data} />;
    }

    return <div className={classes.main}>{table}</div>;
  }
}

export default MainTable; 