import React, {useState} from 'react';
import { Modal, Button } from 'antd';

const ConfirmModal = (props) => {
  const [visible, setVisible] = useState(false);

  const handleOk = e => {
    //TODO, sent request, clear data and hide modal.
  };

  const handleCancel = e => {
    //TODO, clear data and hide modal.
  };
 
  return (
        <Modal
          title="Basic Modal"
          visible={props.visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>Czy na pewno chcesz usunąć </p>
        </Modal>
    );
  }

export default ConfirmModal;