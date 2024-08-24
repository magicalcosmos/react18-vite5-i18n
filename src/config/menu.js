import * as Icons from '@ant-design/icons';

export const menu = [
  // 1、首页
  {
    id: '1',
    title: '首页',
    path: '/management',
    roles: ['admin', 'test'],
    icon: 'HomeOutlined',
    parentId: null
  },
  {
    id: '2',
    title: '数据配置',
    path: '/management',
    roles: ['admin', 'test'],
    icon: 'DatabaseOutlined',
    parentId: null
  },
  {
    id: '21',
    title: '上传礼物总表',
    path: '/data/uploadGiftInventory',
    roles: ['admin', 'test'],
    parentId: '2'
  },
  {
    id: '22',
    title: '上传礼物总表icons',
    path: '/data/uploadGiftInventoryIcons',
    roles: ['admin', 'test'],
    parentId: '2'
  },
  {
    id: '23',
    title: '上传游戏配置',
    path: '/data/uploadDataSettings',
    roles: ['admin', 'test'],
    parentId: '2'
  },
  {
    id: '24',
    title: '数据配置信息',
    path: '/data/DataSettings',
    roles: ['admin', 'test'],
    parentId: '2'
  },
  {
    id: '25',
    title: '下载数据',
    path: '/data/downloadDataSettings',
    roles: ['admin', 'test'],
    parentId: '2'
  }
];
