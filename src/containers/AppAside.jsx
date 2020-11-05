import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Icon } from 'antd'
import CustomMenu from '@/components/CustomMenu'
import {connect} from 'react-redux';

const { Sider } = Layout

const AppAside = props => {
    let { menuToggle, menu } = props
    return (
        <Sider className='aside' collapsed={menuToggle}>
                        <br/>
            <div className='logo'>
                <a rel='noopener noreferrer' href='http://116.62.45.222:5000/' target='_blank'>
                    <Icon type='home' style={{ fontSize: '3.8rem', color: '#fff' }} />
                </a>
            </div>            <br/>
            <CustomMenu menu={menu}></CustomMenu>

        </Sider>
        
    )
}

AppAside.propTypes = {
    menuToggle: PropTypes.bool,
    menu: PropTypes.array.isRequired
}

export default 
connect(state => ({menuToggle : state.menuToggle.menuToggle}))(AppAside)
