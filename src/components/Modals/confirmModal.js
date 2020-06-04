import React from 'react';
import { Modal, Button} from 'antd';

import {delete_invoice} from '../../api_calls/invoices';
import {delete_receipt} from '../../api_calls/receipts';
import {delete_customer} from '../../api_calls/customers';
import {delete_product} from '../../api_calls/products';

const ConfirmModal = (props) => {
  const { dataType, visible, onClose, onOk, data} = props
  
  let msg, array, func;

  switch(dataType){
      case 'product':
        msg = ` produkt ${data.name}`
        array = 'products'
        func = delete_product
        break;
      case 'customer':
        msg = ` klienta ${data.name}`
        array = 'customers'
        func = delete_customer
        break;
      case 'invoice':
        msg = ` fakturę nr ${data.invoice_nr}`
        array = 'invoices'
        func = delete_invoice
        break;
      case 'receipt':
        msg = ` paragon nr ${data.receipt_nr}`
        array = 'receipts'
        func = delete_receipt
        break;
      default:
        msg = ``
        array = ''
        func = null
  }


  return (
        <Modal
          visible={visible}
          onOk={()=>onOk(array, func, data._id)}
        //   onCancel={onCancel}
          footer={null}
        //   bodyStyle={{ padding: '0' }}
        >
          <p>Czy na pewno chcesz usunąć{msg}</p>
          <Button type="primary" htmlType="submit" block onClick={()=>onOk(array, func, data._id)}>
            Usuń
          </Button>
          <Button type="secondary" htmlType="submit" block onClick={onClose}>
            Anuluj
          </Button>
        </Modal>
    );
  }

export default ConfirmModal;