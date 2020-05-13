import React, {useState} from 'react';

import InvoiceForm from '../forms/invoiceForm/InvoiceForm';
import ReceiptForm from '../forms/receiptForm/receiptForm';

import { Radio } from 'antd';

const NewDocument = props => {
    
    const [DocType, setDocType] = useState('invoice')

    const radioGroup = (
        <Radio.Group onChange={(e) => setDocType(e.target.value)} value={DocType} buttonStyle="solid">
            <Radio.Button value="receipt">Paragon</Radio.Button>
            <Radio.Button value="invoice">Faktura</Radio.Button>
        </Radio.Group>
    )
    return DocType === 'receipt' ?  <ReceiptForm {...props} children={radioGroup}/> : <InvoiceForm {...props} children={radioGroup}/>
}

export default NewDocument;