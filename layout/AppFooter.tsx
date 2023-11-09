/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';
import { ASSETS_BASE_PATH } from '../constants/constants';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const baseUrl = ASSETS_BASE_PATH;


    return (
        <div className="layout-footer">
            <img src={`${baseUrl}/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Logo" height="20" className="mr-2" />
            by
            <span className="font-medium ml-2">HAND Enterprise Solutions LTD.</span>
        </div>
    );
};

export default AppFooter;
