import { Layout } from 'antd';
import LayoutMenu from './Menu';

const { Sider } = Layout;
const SideBar = (props) => {
  const { collapsed } = props;

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        zIndex: 999,
        left: 0,
        top: 0,
        bottom: 0
      }}
    >
      <LayoutMenu />
    </Sider>
  );
};

export default SideBar;
