import React, { useEffect, useState } from 'react';
import { Tabs, Table} from 'antd';
import { Get } from '@/utils/Ajax';

const onChange = (key) => {
  console.log(key);
};


const DataSettings = React.memo(() => {
  const [data, setData] = useState({});
  const [tabs, setTabs] = useState([]);

  const getContent = (key) => {
    const dataSource = data[key];
    
    data[key].map((item) => {
        for(const el in item) {
          if (item[el] instanceof Array) {
            item[el] = item[el].join(',');
          }
        }
    });

    const columns = [];
    data.headers && data.headers[key].forEach((el, i) => {
      columns.push({ title: el[0], dataIndex: el[1], key: el[1]});
    });
    return (<Table dataSource={dataSource} columns={columns} />);
  }

  useEffect(() => {
   Get('/api/excel/data').then((res) => {
      setData(res.data);
      const resTabs = res.data.tabs;
      const newArr = [];
      for (const item in resTabs) {
        const splitArray = resTabs[item].split('#');
        newArr[splitArray[1]] = {
          title: splitArray[0],
          key: item
        };

      }
      setTabs(newArr);
    });
  }, []);



  return (
    <Tabs
      onChange={onChange}
      type="card"
      items={tabs.map(({key, title}) => {
        return {
          label: `${title}`,
          key,
          children: getContent(key),
        };
      })}
    />
  );
});
export default DataSettings;