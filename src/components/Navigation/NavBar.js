import React, { useState } from 'react';

import {
    FileAddOutlined,
    FolderOpenOutlined,
    IdcardOutlined,
    LoginOutlined,
    LogoutOutlined,
    ReadOutlined,
    SettingOutlined,
} from '@ant-design/icons';

import { Menu } from 'antd';
import {Link} from 'react-router-dom';

import classes from './NavBar.module.css';

// const { SubMenu } = Menu;

const NavBar = (props) => {
    
    const [current, setCurrent] = useState('add-invoice');
    
    const handleClick = e => {
        setCurrent(e.key);
    };


    let menu = (
        <Menu onClick={handleClick} selectedKeys={current} mode="horizontal" className={classes.menu}>
            <Menu.Item key="login">
                <Link to="/login">
                    <LoginOutlined />
                    Zaloguj się
                </Link>
            </Menu.Item>
            <Menu.Item key="signin">
                <Link to="/signin">
                    <LoginOutlined />
                    Zarejestruj się
                </Link>
            </Menu.Item>
        </Menu>
    )
    
    if(props.loggedIn){
        menu = (
            <Menu onClick={handleClick} selectedKeys={current} mode="horizontal" className={classes.menu}>
                 <Menu.Item key="add-invoice">
                     <Link to="/invoice-form">
                         <FileAddOutlined />
                         Nowy Dokument
                     </Link>
                 </Menu.Item>
                 <Menu.Item key="invoices">
                     <Link to="/invoices-list">                
                         <FolderOpenOutlined />
                         Faktury
                     </Link>
                 </Menu.Item>
                 <Menu.Item key="idcard">
                     <Link to="/customers-list">                
                         <IdcardOutlined />
                         Kontrahenci
                     </Link>
                 </Menu.Item>
                 <Menu.Item key="read">
                     <Link to="/products-list">                
                         <ReadOutlined />
                         Produkty i Usługi
                     </Link>
                 </Menu.Item>
                 {/* <Menu.Item key="shop">
                     <Icon type="shop" />
                     Magazyn produktów
                 </Menu.Item> */}
                 <Menu.Item key="setting">
                     <SettingOutlined />
                     Ustawienia
                 </Menu.Item>
                 {/* <a onClick={()=>props.logOut()}> */}
                    <Menu.Item key="logout" onClick={()=>props.logOut()}>
                        <LogoutOutlined />
                        Wyloguj się
                    </Menu.Item>
                {/* </a> */}
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

    return menu
}

export default NavBar;