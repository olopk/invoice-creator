import React, {useState,useImperativeHandle, forwardRef} from 'react';
import { Modal, Button} from 'antd';

import classes from './confirmModal.module.css';

import {delete_invoice} from '../../api_calls/invoices';
import {delete_receipt} from '../../api_calls/receipts';
import {delete_customer} from '../../api_calls/customers';
import {delete_product} from '../../api_calls/products';

const ConfirmModal = forwardRef((props, ref) => {
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    dataType: null,
    data: 1
  })

  useImperativeHandle(ref, ()=>({
    confirmModalOpen(dataType, data){
      setConfirmModal({
          visible: true,
          dataType: dataType,
          data: data
      })
    }
  }))
  const confirmModalClose = () => {
      setConfirmModal({
          visible: false,
          dataType: null,
          data: 1
      })
  }

  const { onOk } = props
  const {dataType, data, visible} = confirmModal;
  
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
          onOk={onOk.bind(this, array, func, data._id)}
          onCancel={confirmModalClose}
          footer={null}
          bodyStyle={{ padding: '30px' }}
        >
          <p>Czy na pewno chcesz usunąć{msg}</p>
          <Button className={classes.button} type="primary" danger htmlType="submit" block onClick={onOk.bind(this, array, func, data._id)}>
            Usuń
          </Button>
          <Button className={classes.button} type="primary" htmlType="submit" block onClick={confirmModalClose}>
            Anuluj
          </Button>
        </Modal>
    );
  })

export default ConfirmModal;