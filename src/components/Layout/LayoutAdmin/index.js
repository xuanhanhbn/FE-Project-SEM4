import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './layouts.css';
import { sideBarList } from './constants';
import { useMutation } from '@tanstack/react-query';
import { logoutApi } from './callApi';
import useAuthStore from '~/store/zustand';
import { shallow } from 'zustand/shallow';
import { signOut } from 'firebase/auth';
import { notify } from '~/utils/common';
import { auth } from '~/firebase';
import defaultAvatar from '~/assets/images/avatar/default-avatar.jpg';

function LayoutAdmin({ children }) {
    const navigation = useNavigate();
    const [isHiddenClass, setisHiddenClass] = useState(false);
    const [isHiddenMenu, setisHiddenMenu] = useState(false);
    const { userData, setUserData, cleanup } = useAuthStore(
        (state) => ({
            userData: state.userData || '',
            setUserData: state.setUserData,
            cleanup: state.cleanup,
        }),
        shallow,
    );

    // render sidebar item
    const RENDER_TAB_ITEMS = (item) => {
        if (item.type === 'TAB_ITEM') {
            // if (item.tabName === 'Dashboard') {
            //     if (userData?.role === 'PARTNER') {
            //         return null;
            //     }
            if (item.tabName === 'Partner') {
                return (
                    <li id="admin_sidebar_item" key={item.id} className="mt-0.5 w-full">
                        <NavLink
                            className={({ isActive }) => (isActive ? 'tab_active shadow-md tab_item' : 'tab_item')}
                            to={
                                userData?.role === 'PARTNER'
                                    ? `/admin/partner/detail/${userData?.partnerId}`
                                    : '/admin/partner'
                            }
                        >
                            <div className="tab_item_icon">{item.tabIcon}</div>
                            <span className={isHiddenClass ? 'hidden' : ''}>{item.tabName}</span>
                        </NavLink>
                    </li>
                );
            }
            return (
                <li id="admin_sidebar_item" key={item.id} className="mt-0.5 w-full">
                    <NavLink
                        className={({ isActive }) => (isActive ? 'tab_active shadow-md tab_item' : 'tab_item')}
                        to={item.path}
                        onClick={() => setisHiddenClass(false)}
                    >
                        <div className="tab_item_icon">{item.tabIcon}</div>
                        <span className={isHiddenClass ? 'hidden' : ''}>{item.tabName}</span>
                    </NavLink>
                </li>
            );
        }
        // }

        if (item.type === 'TABTITLE') {
            return (
                <li id="admin_sidebar_tab_title" key={item.id} className={isHiddenClass ? 'hidden' : 'w-full mt-4'}>
                    <h6 className="sidebar_tab_title">{item.tabName}</h6>
                </li>
            );
        }
        return (
            <li id="admin_sidebar_item" key={item.id} className="mt-0.5 w-full">
                <NavLink
                    className={({ isActive }) => (isActive ? 'tab_active shadow-md tab_item' : 'tab_item')}
                    to={item.path}
                    onClick={item.id === 7 ? () => hiddenTabName() : () => setisHiddenClass(false)}
                >
                    <div className="tab_item_icon">{item.tabIcon}</div>
                    <span className={isHiddenClass ? 'hidden' : ''}>{item.tabName}</span>
                </NavLink>
            </li>
        );
    };

    const hiddenTabName = () => {
        setisHiddenClass(true);
    };

    const handleSignOut = () => {
        signOut(auth);
        mutationLogout();
    };

    const { mutate: mutationLogout } = useMutation({
        mutationFn: logoutApi,
        onSuccess: (data) => {
            if ((data && data?.status === 200) || data?.status === '200') {
                localStorage.removeItem('loginPage');
                localStorage.removeItem('globalStore');
                setUserData(null);
                signOut(auth);
                navigation('/');
                return notify('Logout Success', 'success');
            }
            return notify(data?.response?.data, 'error');
        },
    });

    return (
        <div id="adminLayout">
            <div className="fixed top-0 z-50 flex items-center justify-end w-full h-20 bg-white shadow-lg px-7">
                <div className="mr-3">
                    <img
                        src={userData?.avatarUrl ? userData?.avatarUrl?.url : defaultAvatar}
                        className="w-10 h-10 rounded-full"
                        alt="admin_logo"
                    />
                </div>
                <div>
                    <div className="flex items-center justify-between h-full ">
                        <div
                            onClick={() => setisHiddenMenu((prev) => !prev)}
                            className="flex items-center font-medium bg-transparent border-none shadow-none cursor-pointer"
                        >
                            {userData?.displayName}
                            {!isHiddenMenu ? (
                                <i className="mt-1 ml-1 text-gray-500 fa-regular fa-angle-down"></i>
                            ) : (
                                <i className="mt-1 ml-1 text-gray-500 fa-regular fa-angle-up"></i>
                            )}
                        </div>
                        {isHiddenMenu && (
                            <div className="min-w-[18.75rem] absolute top-20 flex flex-col right-7 bg-white shadow-2xl">
                                <div className="flex items-center px-6 py-5 m-2 rounded-lg pointer-events-none bg-gray-102">
                                    <img
                                        src={userData?.avatarUrl ? userData?.avatarUrl?.url : defaultAvatar}
                                        className="w-8 mr-4 rounded-full"
                                        alt="admin_logo"
                                    />
                                    <div>
                                        <div className="text-sm font-medium text-black">{userData?.displayName}</div>
                                        <span className="text-sm font-normal leading-6 text-gray-500">
                                            {userData?.email}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col pb-4 text-gray-103">
                                    <Link
                                        to="/admin/dashboard"
                                        onClick={() => setisHiddenMenu((prev) => !prev)}
                                        className="w-full px-6 py-2 my-px text-sm transition-all duration-300 ease-in-out hover:pl-9 hover:bg-item-200 delay-0 hover:text-item-100"
                                    >
                                        <i className="mr-4 text-lg fa-duotone fa-chart-simple "></i>
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/admin/message"
                                        onClick={() => setisHiddenMenu((prev) => !prev)}
                                        className="w-full px-6 py-2 my-px text-sm transition-all duration-300 ease-in-out hover:pl-9 hover:bg-item-200 delay-0 hover:text-item-100"
                                    >
                                        <i className="mr-4 text-lg fa-duotone fa-credit-card"></i>
                                        Message
                                    </Link>
                                    <Link
                                        to="/admin/program"
                                        onClick={() => setisHiddenMenu((prev) => !prev)}
                                        className="w-full px-6 py-2 my-px text-sm transition-all duration-300 ease-in-out hover:pl-9 hover:bg-item-200 delay-0 hover:text-item-100"
                                    >
                                        <i className="mr-4 text-lg fa-duotone fa-diagram-project"></i>
                                        Program
                                    </Link>
                                    {/* <Link
                                        to="/admin/partner/detail"
                                        onClick={() => setisHiddenMenu((prev) => !prev)}
                                        className="w-full px-6 py-2 my-px text-sm transition-all duration-300 ease-in-out hover:pl-9 hover:bg-item-200 delay-0 hover:text-item-100"
                                    >
                                        <i className="mr-4 text-lg fa-light fa-user"></i>
                                        Profile
                                    </Link> */}
                                </div>
                                <Link
                                    to=""
                                    onClick={() => handleSignOut()}
                                    className="flex items-center justify-center px-4 py-5 text-sm font-medium text-center bg-gray-102 text-gray-103 "
                                >
                                    <i className="mr-2 fa-solid fa-arrow-right-from-bracket"></i> Sign Out
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <aside className={isHiddenClass ? 'm-0 admin_sidebar' : 'admin_sidebar my-4 ml-4'}>
                {/* <div className="h-[5rem]">
                    <Link className="admin_logo" to="/admin">
                        <img src={logo} className="admin_logo_img" alt="" />
                        <span className={isHiddenClass ? 'hidden' : 'admin_logo_name'}> Tên tổ chức</span>
                    </Link>
                </div> */}

                {/* <hr className="admin_sidebar_line" /> */}

                <div className="mt-24 admin_sidebar_list">
                    <ul className="flex flex-col pl-0 mb-0">
                        {sideBarList
                            .filter((route) => {
                                if (route.role) {
                                    // Lọc ra những route có role trùng với các role trong parseRole
                                    return route.role.some((role) => [userData?.role].includes(role));
                                }
                                // Nếu route không có role, không lọc
                                return true;
                            })
                            .map((data) => RENDER_TAB_ITEMS(data))}
                    </ul>
                </div>
            </aside>
            <main className={isHiddenClass ? 'admin_container xl:ml-[6.5rem]' : 'admin_container xl:ml-[17.125rem]'}>
                <div className="mt-24">{children}</div>
            </main>
        </div>
    );
}

export default LayoutAdmin;
