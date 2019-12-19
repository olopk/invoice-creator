import React, {Component} from 'react';
import { Table, Input, Button, Icon, Divider } from 'antd';
import Highlighter from 'react-highlight-words';
import classes from './InvoicesTable.module.css';

class InvoicesTable extends Component {
  state = {
    searchText: '',
    searchedColumn: '',
    loading: false
  };

  // fetchData = async () =>{
  //   this.setState({loading: true});
  //   const response = await fetch_invoices();
  //   if(response.status === 200){
  //     console.log(response);
  //     this.setState({data: response.data, loading: false})
  //   }else{
  //     return
  //   }
  // }

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
        <a>EDYTUJ</a>
        <Divider type="vertical" />
        <Icon className={classes.tableIcon} type="delete" onClick={()=>this.props.delete_invoice(rowData.key)}/>
      </span>
    )
  }

  render() {   
    console.log(this.props)
    const columns = [
      {
        title: 'Nr Faktury',
        dataIndex: 'invoice_nr',
        key: 'invoice_nr',
        width: '20%',
        ...this.getColumnSearchProps('invoice_nr'),
      },
      {
        title: 'Data',
        dataIndex: 'date',
        key: 'date',
        width: '20%',
        ...this.getColumnSearchProps('date'),
      },
      {
        title: 'Nazwa Kontrahenta',
        dataIndex: 'customer_name',
        key: 'customer_name',
        width: '30%',
        ...this.getColumnSearchProps('customer_name'),
      },
      {
        title: 'Wartość Faktury',
        dataIndex: 'product_total_price',
        key: 'product_total_price',
        width: '20%',
        ...this.getColumnSearchProps('product_total_price'),
      },
      {
        title: 'Action',
        key: 'action',
        render: (data) => this.actions(data)
      }
    ];

    let table = null;
    
    if(!this.props.data){
      table = <Icon type="loading" className={classes.loadingIcon}/>;
    }else{
      table = <Table columns={columns} dataSource={this.props.data} />;
    }

    return <div className={classes.main}>{table}</div>;
  }
}

export default InvoicesTable; 