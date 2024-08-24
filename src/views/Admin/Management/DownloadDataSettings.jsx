import React from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import './DownloadDataSettings.scss';
import { Get } from '@/utils/Ajax';

const handleDownload = (type) => {
    Get(`/api/files/download/${type}`, { 
        fileStream: true
    }).then(res => {
        const url = window.URL.createObjectURL(res);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${type == 1 ? '游戏配置' : '礼物总表'}`.xlsx);
        document.body.appendChild(link);
        link.click();
    });
};
const DownloadDataSettings = () => (
    <div className='download-data-settings'>
        <Button icon={<DownloadOutlined />} onClick={() => {handleDownload(1)}}>下载游戏配置</Button>
        <Button icon={<DownloadOutlined />} onClick={() => {handleDownload(2)}}>下载礼物总表</Button>
    </div>
);

export default DownloadDataSettings;