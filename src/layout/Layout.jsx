
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
const { Content } = Layout;
import SideBar from './components/SideBar';

const LayoutMain = () => {
    return (<>
        <Layout className="layout">
            <SideBar />
            <Content style={{ marginLeft: '200px'}}>
                <Outlet />
            </Content>
        </Layout>
    </>);
}

export default LayoutMain;