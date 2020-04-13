import React, { useState } from 'react';
import { Menu, Icon } from 'antd';
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
                    <Icon type="login" />
                    Zaloguj się
                </Link>
            </Menu.Item>
            <Menu.Item key="signin">
                <Link to="/signin">
                    <Icon type="login" />
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
                         <Icon type="file-add" />
                         Dodaj Fakturę
                     </Link>
                 </Menu.Item>
                 <Menu.Item key="invoices">
                     <Link to="/invoices-list">                
                         <Icon type="folder-open" />
                         Faktury
                     </Link>
                 </Menu.Item>
                 <Menu.Item key="idcard">
                     <Link to="/customers-list">                
                         <Icon type="idcard" />
                         Kontrahenci
                     </Link>
                 </Menu.Item>
                 <Menu.Item key="read">
                     <Link to="/products-list">                
                         <Icon type="read" />
                         Produkty i Usługi
                     </Link>
                 </Menu.Item>
                 {/* <Menu.Item key="shop">
                     <Icon type="shop" />
                     Magazyn produktów
                 </Menu.Item> */}
                 <Menu.Item key="setting">
                     <Icon type="setting" />
                     Ustawienia
                 </Menu.Item>
                 {/* <a onClick={()=>props.logOut()}> */}
                    <Menu.Item key="logout" onClick={()=>props.logOut()}>
                        <Icon type="logout" />
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