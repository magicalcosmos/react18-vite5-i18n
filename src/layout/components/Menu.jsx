
import { Menu } from 'antd';
import { menu } from '@/config/menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 用于国际化
import * as Icons from '@ant-design/icons';

const MenuMain = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    
    const path = location.pathname;

    const menuList = menu;

    /**
     *
     * @param param
     * @returns 动态创建antd图标
     */
    const IconComponent = ({ iconName }) => {
        const Component = Icons[iconName];
        if (!Component) {
            return null;
        }
        return <Component />;
    };

    /**
     *
     * @param menuList
     * @param parentId
     * @returns 将平级的数组转换成菜单树
     */
    const convertTreeMenu = (menuList, parentId = null) => {
        const tree = [];
        menuList.forEach(item => {
            if (item.parentId === parentId && !item.isHide) {
                const child = convertTreeMenu(menuList, item.id);
                const node = {
                    key: item.id,
                    label: t(item.title),
                    icon: item.icon ? <IconComponent iconName={item.icon} /> : null,
                    roles: item.roles,
                    children: child?.length ? child : null
                };
                tree.push(node);
            }
        });
        return tree;
    };

    const handleClick = ({ key }) => {
        const route = menuList.find(item => item.id === key);
        if (!route?.path) return;
    
        const { target, path } = route;
        if (target) {
          // TODO hash模式跳转方式
          const { origin, pathname } = window.location;
          const fullPath = origin + pathname + '#' + path;
          window.open(fullPath);
        } else {
          navigate(path);
        }
      };

    const items = convertTreeMenu(menuList);
    return (
        <Menu
            mode="inline"
            items={items}
            onClick={handleClick}
        />
    );
};

export default MenuMain;