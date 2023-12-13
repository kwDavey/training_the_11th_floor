import { Banner, Header, Circlecontent, Buttonsection, Footer, Modal, Button } from '@Components';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import FormElement from 'components/form/form-element';
export default function ViewUser() {
    const router = useRouter();

    const [ShowPopUp, setShowPopUp] = useState(false);
    const [constViewAllCategorys, setConstViewAllCategorys] = useState();
    const [constCategorys, setConstCategorys] = useState();

    const getCategorysToDisplay = async () => {
        setConstCategorys(null);
        setConstViewAllCategorys(null);
        Swal.fire({
            title: 'Loading...',
            showConfirmButton: false,
            toast: true,
            willOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            var tempResponse = (
                await axios({
                    method: 'POST',
                    url: '../../api/firebase/db',
                    data: { MethodName: 'getCategorys' }
                })
            ).data;
            setConstCategorys(tempResponse);
            setConstViewAllCategorys(tempResponse);
            Swal.close();
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Invalid details',
                text: 'Please check your internet connection and try again.',
                showConfirmButton: true,
                confirmButtonText: 'Okay',
                confirmButtonColor: '#DE7E49',
                buttonsStyling: true
            });
        }
    };

    const optionsState = [
        { label: 'All', value: 'All' },
        { label: 'Draft', value: 'Draft' },
        { label: 'Sent', value: 'Sent' }
    ];

    const filter = async (StatusOption) => {
        Swal.fire({
            title: 'Loading...',
            showConfirmButton: false,
            toast: true,
            willOpen: () => {
                Swal.showLoading();
            }
        });
        if (StatusOption == 'Draft') {
            setConstCategorys(constViewAllCategorys.filter((x) => x.TestSendOut == false));
        } else if (StatusOption == 'Sent') {
            setConstCategorys(constViewAllCategorys.filter((x) => x.TestSendOut == true));
        } else {
            setConstCategorys(constViewAllCategorys);
        }

        Swal.close();
    };

    useEffect(() => {
        getCategorysToDisplay();
    }, []);

    const ViewCategoryClicked = (field) => {
        Swal.fire({
            title: 'Loading...',
            showConfirmButton: false,
            toast: true,
            willOpen: () => {
                Swal.showLoading();
            }
        });
        router.push(
            {
                pathname: '/admin/Category/EditCategory',
                query: { CatPK: field.value, label: field.label }
            },
            '/admin/Category/EditCategory'
        );
    };

    return (
        <>
            <div className="size_1-of-1 text-align_center grid grid-wrap" style={{ position: 'relative' }}>
                <div className="grid grid-wrap size_1-of-1 grid_vertical-align-center padding-bottom_large padding-left_large" >
                    <div className="padding-left_large size_1-of-3" style={{ minHeight: '46px' }}></div>
                    <h1 className="margin-around_auto text-color_copper-medium size_1-of-3" >categories</h1>
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
                            router.push('/admin/Category/AddCategory');
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

                {/*  Table */}

                <div id={`TableRow-Headings`} name="tablerow" className="size_1-of-1 padding-left_large">
                    <div className="size_1-of-1 grid grid-wrap padding-bottom_small  text-color_copper-medium" style={{ margin: 'auto' }}>
                        <div className="size_1-of-1" style={{ margin: 'auto' }}>
                            <p className={`text-size_large text-weight_bold `}>Name</p>
                        </div>
                    </div>

                    <div className="size_1-of-1" style={{ height: '1px', background: '#999999', maxWidth: '100%', margin: 'auto' }}></div>
                </div>
                <div className="size_1-of-1 tblHeight padding-left_large">
                    {constCategorys &&
                        constCategorys.map &&
                        constCategorys.map((field, iCount) => {
                            return (
                                <div id={`TableRow-${iCount}`} name="tablerow" key={iCount} className="size_1-of-1 text-color_white" style={{ cursor: 'pointer' }} onClick={() => ViewCategoryClicked(field)}>
                                    <div className="size_1-of-1 grid grid-wrap" style={{ margin: 'auto' }}>
                                        <div className="size_1-of-1 padding-around_small " style={{ margin: 'auto' }}>
                                            <p className={`text-size_medium`}>{field.label}</p>
                                        </div>
                                    </div>
                                    <div className="size_1-of-1" style={{ height: '0.5px', background: '#999999', maxWidth: '100%', margin: 'auto' }}></div>
                                </div>
                            );
                        })}
                </div>
            </div>
            <Modal
                show={ShowPopUp}
                onClose={() => {
                    setShowPopUp(false);
                }}
                Page="ViewTests"
                handelBtnPrimarySubmit={() => ViewTestDetailsRedirect()}
                handelBtnSecondarySubmit={() => SendTestRedirect()}
            >
                <></>
            </Modal>
        </>
    );
}
