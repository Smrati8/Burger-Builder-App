import React from 'react';
import NavigationItems from '../NavigationItems/NavigationItems';
// import Logo from '../../Logo/Logo';
import classes from './SideDrawer.module.css';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Auxiliary from '../../../hoc/Auxiliary';

const sideDrawer = (props) => {
    let attachedClasses = [classes.SideDrawer, classes.Close];
    if(props.open) {
        attachedClasses = [classes.SideDrawer, classes.Open];
    }
    return(
        <Auxiliary>
            <Backdrop 
                show={props.open} 
                clicked = {props.closed}
                 />
            <div className = {attachedClasses.join(' ')}>
            {/* <Logo height = "11%"></Logo> */}
                <nav>
                    <NavigationItems></NavigationItems>
                </nav>
            </div>
        </Auxiliary>
        
    );
}

export default sideDrawer;