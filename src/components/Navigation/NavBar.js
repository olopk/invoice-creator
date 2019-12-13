import React, { useState } from 'react';
import { Menu, Icon } from 'antd';

import classes from './NavBar.module.css';

// const { SubMenu } = Menu;

const NavBar = () => {
    
    const [current, setCurrent] = useState('mail');
    
    const handleClick = e => {
        console.log('click', e);
        setCurrent(e.key);
    };

    return( 
        <Menu onClick={handleClick} selectedKeys={current} mode="horizontal" className={classes.menu}>
            <Menu.Item key="add-invoice">
                <Icon type="file-add" />
                Dodaj Fakturę
            </Menu.Item>
            <Menu.Item key="invoices">
                <Icon type="folder-open" />
                Faktury
            </Menu.Item>
            <Menu.Item key="idcard">
                <Icon type="idcard" />
                Kontrahenci
            </Menu.Item>
            <Menu.Item key="read">
                <Icon type="read" />
                Produkty i Usługi
            </Menu.Item>
            <Menu.Item key="setting">
                <Icon type="setting" />
                Ustawienia
            </Menu.Item>
            <Menu.Item key="logout">
                <Icon type="logout" />
                Wyloguj się
            </Menu.Item>
            {/* <SubMenu
                title={
                    <span className="submenu-title-wrapper">
                    <Icon type="setting" />
                    Navigation Three - Submenu
                    </span>
                }
            >
                    <Menu.Item key="setting:1">Option 1</Menu.Item>
                    <Menu.Item key="setting:2">Option 2</Menu.Item>
            </SubMenu> */}
        </Menu>
    )
}

export default NavBar;