import { Banner, Header, Circlecontent, Buttonsection, Footer, FormElement, Button } from '@Components';
import Head from 'next/head';
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Groups() {
    const Router = useRouter();
    const [GroupData, setGroupData] = useState(null);

    const getGroups = async () => {
        Swal.fire({
            title: 'Loading...',
            showConfirmButton: false,
            toast: true,
            willOpen: () => {
                Swal.showLoading();
            }
        });

        var Groups = (
            await axios({
                method: 'POST',
                url: '../../api/firebase/db',
                data: { MethodName: 'getAllGroups' }
            })
        ).data;
        setGroupData(Groups);
        Swal.close();
    };

    useEffect(() => {
        Swal.fire({
            title: 'Loading...',
            showConfirmButton: false,
            toast: true,
            willOpen: () => {
                Swal.showLoading();
            }
        });
        getGroups();
    }, []);

    const ViewGroupClicked = (key) => {
        Swal.fire({
            title: 'Loading...',
            showConfirmButton: false,
            toast: true,
            willOpen: () => {
                Swal.showLoading();
            }
        });
        Router.push(
            {
                pathname: '/admin/groups/EditGroup/',
                query: { Name: GroupData[key].Name, id: GroupData[key].id }
            },
            '/admin/groups/EditGroup/'
        );
    };

    return (
        <>
            {/* <Header></Header> */}
            <div className="size_1-of-1 text-align_center grid grid-wrap">
                <div className="grid grid-wrap size_1-of-1 grid_vertical-align-center padding-bottom_large  padding-left_large">
                    <div className="padding-left_large size_1-of-3" style={{ minHeight: '46px' }}></div>
                    <h1 className="margin-around_auto text-color_copper-medium size_1-of-3">groups</h1>
                    <div
                        className="size_1-of-3 grid"
                        onClick={() => {
                            Swal.fire({
                                title: 'Loading...',
                                showConfirmButton: false,
                                toast: true,
                                willOpen: () => {
                                    Swal.showLoading();
                                }
                            });
                            Router.push('/admin/groups/AddGroup');
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <svg className="Svg margin-left_auto" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 48 48">
                            <path d="M24,48A24,24,0,1,1,48,24,24,24,0,0,1,24,48ZM24,1A23,23,0,1,0,47,24,23,23,0,0,0,24,1Z" />
                            <path d="M31.5,24.5h-15a0.5,0.5,0,0,1,0-1h15A0.5,0.5,0,0,1,31.5,24.5Z" />
                            <path d="M24,32a0.5,0.5,0,0,1-.5-0.5v-15a0.5,0.5,0,0,1,1,0v15A0.5,0.5,0,0,1,24,32Z" />
                            <rect width="30" height="30" fill="none" />
                        </svg>
                    </div>
                </div>

                <div id={`TableRow-Headings`} name="tablerow" className="size_1-of-1 padding-left_large">
                    <div className="size_1-of-1 grid grid-wrap padding-bottom_small text-color_copper-medium" style={{ margin: 'auto' }}>
                        <div className="size_1-of-3" style={{ margin: 'auto' }}>
                            <p className={`text-size_large text-weight_bold `}>Name</p>
                        </div>

                        <div className="size_1-of-3 padding-around_xx-small" style={{ margin: 'auto' }}>
                            <p className={`text-size_large text-weight_bold `}>Staff amount</p>
                        </div>
                    </div>

                    <div className="size_1-of-1" style={{ height: '1px', background: '#999999', maxWidth: '100%', margin: 'auto' }}></div>
                </div>
                <div className="size_1-of-1 tblHeight padding-left_large">
                    {GroupData &&
                        Object.keys(GroupData).map((key, index) => {
                            return (
                                <div key={index}>
                                    <div id={`TableRow-${index}`} name="tablerow" key={index} className="size_1-of-1 text-color_white" style={{ cursor: 'pointer' }} onClick={(e) => ViewGroupClicked(key)}>
                                        <div className="size_1-of-1 grid grid-wrap" style={{ margin: 'auto' }}>
                                            <div className="size_1-of-3 padding-vertical_small" style={{ margin: 'auto' }}>
                                                <p className={`text-size_medium`}>{GroupData[key].Name}</p>
                                            </div>

                                            <div className="size_1-of-3 padding-vertical_small" style={{ margin: 'auto' }}>
                                                <p className={`text-size_medium`}>{GroupData[key].Amount}</p>
                                            </div>
                                        </div>
                                        <div className="size_1-of-1" style={{ height: '0.5px', background: '#999999', maxWidth: '100%', margin: 'auto' }}></div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
}
