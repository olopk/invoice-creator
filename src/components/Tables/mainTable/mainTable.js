import React, {Component} from 'react';
import { DeleteOutlined, EditOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { Table, Input, Button } from 'antd';
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
          icon={<SearchOutlined />}
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
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
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
    return (
      <span>
        <EditOutlined
          className={classes.tableIcon}
          onClick={this.props.openModal.bind(this, this.props.dataType, rowData)} />
        <DeleteOutlined
          className={classes.tableIcon}
          // onClick={()=>this.props.delete(rowData._id)}
          onClick={this.props.confirmModalOpen.bind(this, this.props.dataType, rowData)}
        />
      </span>
    );
  }

  
  render() {
    let table, columns;

    const {dataType} = this.props;
    
    if(!this.props.data){
      table = <LoadingOutlined className={classes.loadingIcon} />;
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
      table = (
      <React.Fragment>
        <Table columns={columns} dataSource={this.props.data} />
        {dataType === 'product' || dataType === 'customer' ?
          <Button type="primary" htmlType="submit" block onClick={this.props.openModal.bind(this, dataType, null)}>Dodaj {dataType === 'customer' ? 'nowego klienta' : 'nowy produkt'}</Button>
          : null}
      </React.Fragment>
      );
    }

    return <div className={classes.main}>{table}</div>;
  }
}

export default MainTable; 