import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import './UploadDataSettings.scss';
const { Dragger } = Upload;
const props = {
  name: 'file',
  multiple: false,
  maxCount: 1,
  accept: '.xlsx',
  action: '/api/files/upload/1',
  onChange(info) {
    const { status, response } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }

    if (response && response.code === 400) {
      message.error(`${response.data}`);
      return;
    }

    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
      info.fileList.pop();
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};
const DataSettings = () => {
    return (<div className='data-settings'>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
            <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Dragger>
    </div>)
};
export default DataSettings;