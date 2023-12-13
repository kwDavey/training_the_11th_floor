import { Banner, Header, Circlecontent, Buttonsection, Footer, Button } from '@Components';
import { WindowSize } from '@Modules';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Router from 'next/router';
import Swal from 'sweetalert2';

import axios from 'axios';
import FormElement from 'components/form/form-element';

export default function ViewUser() {
    const [constViewUsers, setConstViewUsers] = useState();
    const [OGviewUsers, setOGviewUsers] = useState();

    const ViewUserClicked = (RowPosition) => {
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
                pathname: '/admin/Users/EditUser',
                query: { UserPK: constViewUsers[RowPosition].UserPK }
            },
            '/admin/Users/EditUser'
        );
    };

    const getUsersToDisplay = async () => {
        setConstViewUsers(null);
        Swal.fire({
            title: 'Loading...',
            showConfirmButton: false,
            toast: true,
            willOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            var tempResponse = await axios({
                method: 'POST',
                url: '../../api/firebase/db',
                data: { MethodName: 'GetAllUsersToDisplay' }
            });
            setOGviewUsers(tempResponse.data);
            setConstViewUsers(tempResponse.data);

            Swal.close();
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Invalid details',
                text: 'Please check your details and try again.',
                showConfirmButton: true,
                confirmButtonText: 'Okay',
                confirmButtonColor: '#DE7E49',
                buttonsStyling: true
            });
        }
    };

    const [optionsState, setOptionsState] = useState([]);
    const getGroups = async () => {
        try {
            let response = (
                await axios({
                    method: 'POST',
                    url: '../../api/firebase/db',
                    data: { MethodName: 'getAllGroups' }
                })
            ).data;
            let result = [
                {
                    label: 'All',
                    value: 'all'
                }
            ];
            for (let item in response) {
                result.push({
                    label: response[item].Name,
                    value: response[item].id
                });
            }
            setOptionsState(result);
        } catch (Err) {
            console.error(Err);
        }
    };

    const filter = async (groupPK) => {
        if (groupPK != 'all') {
            let newState = [];
            for (let option in OGviewUsers) {
                if (OGviewUsers[option].GroupPK == groupPK) {
                    newState.push(OGviewUsers[option]);
                }
            }
            setConstViewUsers(newState);
        } else {
            setConstViewUsers(OGviewUsers);
        }
    };

    const showResults = (data) => {
        Router.push(
            {
                pathname: '/admin/Users/viewResults',
                query: { UserPK: data.UserPK }
            },
            '/admin/Users/viewResults'
        );
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
        getUsersToDisplay();
    }, []);

    return (
        <>
            {/* <Header></Header> */}
            <div className="size_1-of-1 text-align_center grid grid-wrap">
                <div className="grid grid-wrap size_1-of-1 grid_vertical-align-center padding-bottom_large padding-left_large">
                    <div className="size_1-of-3" style={{ minHeight: '46px' }}>
                        <style jsx global>{`
                            select {
                                margin-left: 0px !important;
                            }
                        `}</style>
                        <FormElement
                            onChange={(value) => {
                                filter(value);
                            }}
                            id="UserField_6"
                            name="Group"
                            type="select"
                            label=""
                            variant="darkBackground"
                            options={optionsState}
                            value=""
                        ></FormElement>
                    </div>

                    <h1 className="margin-around_auto text-color_copper-medium size_1-of-3">users</h1>

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
                            Router.push('/admin/Users/AddUser');
                        }}
                        style={{ cursor: 'pointer', marginTop: '-0.2rem' }}
                    >
                        <svg className="SvgStroke  margin-left_auto" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                            <circle cx="10" cy="6" r="4" strokeWidth="1.5" />
                            <path d="M21 10H19M19 10H17M19 10L19 8M19 10L19 12" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M17.9975 18C18 17.8358 18 17.669 18 17.5C18 15.0147 14.4183 13 10 13C5.58172 13 2 15.0147 2 17.5C2 19.9853 2 22 10 22C12.231 22 13.8398 21.8433 15 21.5634" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>

                {/*  Table */}
                <div id={`TableRow-Headings`} name="tablerow" className="size_1-of-1 padding-left_large">
                    <div className="size_1-of-1 grid grid-wrap padding-bottom_small text-color_copper-medium ">
                        <div className="size_1-of-4">
                            <p className={`text-size_large text-weight_bold `}>Full Name</p>
                        </div>
                        <div className="size_1-of-4 padding-around_xx-small">
                            <p className={`text-size_large text-weight_bold `}>Cell</p>
                        </div>
                        <div className="size_1-of-4">
                            <p className={`text-size_large text-weight_bold `}>Group</p>
                        </div>
                    </div>

                    <div className="size_1-of-1" style={{ height: '1px', background: '#999999', maxWidth: '100%' }}></div>
                </div>

                <div className="size_1-of-1 tblHeight padding-left_large">
                    {constViewUsers &&
                        constViewUsers.map &&
                        constViewUsers.map((field, iCount) => {
                            return (
                                <div id={`TableRow-${iCount}`} name="tablerow" key={iCount} className="size_1-of-1 text-color_white" style={{ cursor: 'pointer' }}>
                                    <div className="size_1-of-1 grid grid-wrap">
                                        <div className="size_1-of-4 padding-around_small">
                                            <p className={`text-size_medium`}>{field.FName + ' ' + field.LName}</p>
                                        </div>
                                        <div className="size_1-of-4 padding-around_small">
                                            <p className={`text-size_medium`}>{field.Cell}</p>
                                        </div>
                                        <div className="size_1-of-4 padding-around_small">
                                            <p className={`text-size_medium`}>{field.Group}</p>
                                        </div>
                                        <div className="size_1-of-4 grid">
                                            <div className="size_1-of-1 margin-vertical_auto margin-right_small">
                                                <Button size="xsmall" label="Edit" variant="CopperBackgroundLight" onClick={(e) => ViewUserClicked(iCount)} />
                                            </div>
                                            <div className="size_1-of-1 margin-vertical_auto ">
                                                <Button
                                                    size="xsmall"
                                                    label="Results"
                                                    variant="CopperBackgroundLight"
                                                    onClick={() => {
                                                        showResults(field);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="size_1-of-1" style={{ height: '0.5px', background: '#999999', maxWidth: '100%', margin: 'auto' }}></div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
}
