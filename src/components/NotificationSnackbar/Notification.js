import React from 'react';
import {notification} from 'antd';
import { SmileOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const ShowNotification = (status, message) => {
    let icon = <SmileOutlined style={{ color: '#108ee9' }} />;
    if(status === 'error'){
      icon = <ExclamationCircleOutlined style={{ color: '#108ee9' }} />
    }

    notification.info({
      message: message,
      placement: 'bottomLeft',
      icon: icon
    });
  };

  export default ShowNotification;