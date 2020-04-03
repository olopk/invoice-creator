import React from 'react';
import { Modal, Button } from 'antd';

import ShowNotification from '../NotificationSnackbar/Notification';
import InvoiceForm from '../forms/invoiceForm/InvoiceForm';

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

  return(
  <Modal
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