import React from 'react';
import { Modal } from 'antd';

import ShowNotification from '../NotificationSnackbar/Notification';
import InvoiceForm from '../forms/invoiceForm/InvoiceForm';
import ReceiptForm from '../forms/receiptForm/receiptForm';
import CustomerForm from '../forms/customerForm/customerForm';
import ProductForm from '../forms/productForm/productForm';

const MainModal = (props) => {
  const {modalDataType, modalData} = props;
  let modalContent;
  if(modalDataType === 'invoice'){
    modalContent = (
      <InvoiceForm
          style={{width: '100%'}}
          modalData={modalData}
          showNotification={ShowNotification}
          customers={props.customers}
          products={props.products}
          onClose={props.onCancel}
          fetchData={props.fetchData}
      />
    )
  }
  else if(modalDataType === 'receipt'){
    modalContent = (
      <ReceiptForm
          style={{width: '100%'}}
          modalData={modalData}
          showNotification={ShowNotification}
          customers={props.customers}
          products={props.products}
          onClose={props.onCancel}
          fetchData={props.fetchData}
      />
    )
  }
  else if(modalDataType === 'customer'){
    modalContent = (
      <CustomerForm
          modalData={modalData}
          showNotification={ShowNotification}
          customers={props.customers}
          onClose={props.onCancel}
          fetchData={props.fetchData}
      />
    )
  }
  else if(modalDataType === 'product'){
    modalContent = (
      <ProductForm
          modalData={modalData}
          showNotification={ShowNotification}
          products={props.products}
          onClose={props.onCancel}
          fetchData={props.fetchData}
      />
    )
  }

  return(
  <Modal
      width={props.modalWidth}
      centered={true}
      onCancel={props.onCancel}
      visible={props.visible}
      footer={null}
      bodyStyle={{ padding: '0' }}
  >
      {modalContent}
  </Modal>
)} 

export default MainModal;