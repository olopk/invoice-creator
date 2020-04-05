import React from 'react';
import { Modal, Button } from 'antd';

import ShowNotification from '../NotificationSnackbar/Notification';
import InvoiceForm from '../forms/invoiceForm/InvoiceForm';
import CustomerForm from '../forms/customerForm/customerForm';
import ProductForm from '../forms/productForm/productForm';

const MainModal = (props) => {
  const {modalDataType, modalData} = props;
  let modalContent;
  if(modalDataType === 'invoice'){
    modalContent = (
      <InvoiceForm
          modalData={modalData}
          showNotification={ShowNotification}
      />
    )
  }
  else if(modalDataType === 'customer'){
    modalContent = (
      <CustomerForm
          modalData={modalData}
          showNotification={ShowNotification}
      />
    )
  }
  else if(modalDataType === 'product'){
    modalContent = (
      <ProductForm
          modalData={modalData}
          showNotification={ShowNotification}
      />
    )
  }

  return(
  <Modal
      width={props.modalWidth}
      centered={true}
      // title="Basic Modal"
      // onOk={props.onOk}
      onCancel={props.onCancel}
      visible={props.visible}
      footer={[
          <Button key="back" onClick={props.onCancel}>
          Anuluj
          </Button>,
          <Button key="submit" type="primary" loading={props.loading} onClick={()=> {return true} }>
          Zapisz
          </Button>,
      ]}
  >
      {modalContent}
  </Modal>
)} 

export default MainModal;