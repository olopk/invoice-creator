import React, {useState, useImperativeHandle, forwardRef} from 'react';
import { Modal } from 'antd';

import ShowNotification from '../NotificationSnackbar/Notification';
import InvoiceForm from '../forms/invoiceForm/InvoiceForm';
import ReceiptForm from '../forms/receiptForm/receiptForm';
import CustomerForm from '../forms/customerForm/customerForm';
import ProductForm from '../forms/productForm/productForm';

const MainModal = forwardRef((props, ref) => {
  // const {modalDataType, modalData} = props;

  const [mainModal, setMainModal] = useState({
    visible: false,
    dataType: null,
    data: null,
    width: null
  })
  useImperativeHandle(ref, ()=>(
    {
      modalHandleOpen(modalDataType, modalData){
        
        let modalWidth;
        switch(modalDataType){
            case 'invoice':
                modalWidth = 1080;
                break;
            case 'receipt':
                modalWidth = 1080;
                break;
            default:
                modalWidth = 800;
        }
        setMainModal({
            ...mainModal,
            visible: true,
            dataType: modalDataType,
            data: modalData,
            width: modalWidth
        })
      }
    }
  ))
  // const modalHandleOpen = (modalDataType, modalData) => {
  //   let modalWidth;
  //   switch(modalDataType){
  //       case 'invoice':
  //           modalWidth = 1080;
  //           break;
  //       case 'receipt':
  //           modalWidth = 1080;
  //           break;
  //       default:
  //           modalWidth = 800;
  //   }
  //   setMainModal({
  //       ...mainModal,
  //       visible: true,
  //       dataType: modalDataType,
  //       data: modalData,
  //       width: modalWidth
  //   })
  // }
  const modalHandleCancel = () => {
      setMainModal({
          ...mainModal,
          visible: false,
          data: null
      })
  }
 
  let modalContent;
  if(mainModal.dataType === 'invoice'){
    modalContent = (
      <InvoiceForm
          style={{width: '100%'}}
          modalData={mainModal.data}
          showNotification={ShowNotification}
          customers={props.customers}
          products={props.products}
          onClose={props.modalHandleCancel}
          fetchData={props.fetchData}
      />
    )
  }
  else if(mainModal.dataType === 'receipt'){
    modalContent = (
      <ReceiptForm
          style={{width: '100%'}}
          modalData={mainModal.data}
          showNotification={ShowNotification}
          customers={props.customers}
          products={props.products}
          onClose={props.modalHandleCancel}
          fetchData={props.fetchData}
      />
    )
  }
  else if(mainModal.dataType === 'customer'){
    modalContent = (
      <CustomerForm
          modalData={mainModal.data}
          showNotification={ShowNotification}
          customers={props.customers}
          onClose={props.modalHandleCancel}
          fetchData={props.fetchData}
      />
    )
  }
  else if(mainModal.dataType === 'product'){
    modalContent = (
      <ProductForm
          modalData={mainModal.data}
          showNotification={ShowNotification}
          products={props.products}
          onClose={props.modalHandleCancel}
          fetchData={props.fetchData}
      />
    )
  }

  return(
  <Modal
      width={mainModal.width}
      centered={true}
      onCancel={modalHandleCancel}
      visible={mainModal.visible}
      footer={null}
      bodyStyle={{ padding: '0' }}
  >
      {modalContent}
  </Modal>
)})

export default MainModal;