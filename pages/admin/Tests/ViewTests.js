import { Banner, Header, Circlecontent, Buttonsection, Footer, Modal, Button } from '@Components';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useRouter } from 'next/router';
import FormElement from 'components/form/form-element';
export default function ViewUser() {
    const router = useRouter();

    const [ShowPopUp, setShowPopUp] = useState(false);

    const [constViewAllTests, setConstViewAllTests] = useState();
    const [constViewTests, setConstViewTests] = useState();

    const SendTestRedirect = (iCount) => {
        const SelectedTestToSend = constViewTests[iCount];

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
                pathname: '/admin/Tests/SendTest',
                query: { TestPK: SelectedTestToSend.TestPK, TestVersion: SelectedTestToSend.LatestVersion, ActiveQuestions: SelectedTestToSend.ActiveQuestions, TestName: SelectedTestToSend.Name }
            },
            '/admin/Tests/SendTest'
        );
    };

    const ViewTestDetailsRedirect = (iCount) => {
        const SelectedTestToSend = constViewTests[iCount];

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
                pathname: '/admin/Tests/ViewTestDetails',
                query: { CatPK: SelectedTestToSend.CatPK, Category: SelectedTestToSend.Category, TestPK: SelectedTestToSend.TestPK, TestVersion: SelectedTestToSend.LatestVersion, ActiveQuestions: SelectedTestToSend.ActiveQuestions, TestName: SelectedTestToSend.Name }
            },
            '/admin/Tests/ViewTestDetails'
        );
    };

    const getTestsToDisplay = async () => {
        setConstViewTests(null);
        setConstViewAllTests(null);

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
                    data: { MethodName: 'GetAllTestsToDisplay' }
                })
            ).data;

            setConstViewTests(tempResponse);
            setConstViewAllTests(tempResponse);

            var GetCategory = await axios({
                method: 'POST',
                url: '/api/firebase/db',
                data: { MethodName: 'getCategorys' }
            });

            setoptionsCategories([
                {
                    value: 'All',
                    label: 'All'
                },
                ...GetCategory.data
            ]);
            Swal.close();
        } catch (err) {
            console.error(err);
            Swal.close();
        }
    };

    const optionsState = [
        { label: 'All', value: 'All' },
        { label: 'Draft', value: 'Draft' },
        { label: 'Sent', value: 'Sent' }
    ];

    const [optionsCategories, setoptionsCategories] = useState([
        {
            value: 'All',
            label: 'All'
        },
    ]);

    const filterByStatus = async (StatusOption) => {
        Swal.fire({
            title: 'Loading...',
            showConfirmButton: false,
            toast: true,
            willOpen: () => {
                Swal.showLoading();
            }
        });
        if (StatusOption == 'Draft') {
            setConstViewTests(constViewAllTests.filter((x) => x.TestSendOut == false));
        } else if (StatusOption == 'Sent') {
            setConstViewTests(constViewAllTests.filter((x) => x.TestSendOut == true));
        } else {
            setConstViewTests(constViewAllTests);
        }

        Swal.close();
    };

    const filterByCategory = async (CategoryOption) => {
        Swal.fire({
            title: 'Loading...',
            showConfirmButton: false,
            toast: true,
            willOpen: () => {
                Swal.showLoading();
            }
        });
        if (CategoryOption == 'All') {
            setConstViewTests(constViewAllTests);
        } else {
            setConstViewTests(constViewAllTests.filter((x) => x.CatPK == CategoryOption));
        }

        Swal.close();
    };

    const ViewResults = (constEditTestDetails) => {
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
                pathname: '/admin/Tests/ViewResults',
                query: { Category: constEditTestDetails.Category, TestPK: constEditTestDetails.TestPK, TestVersion: constEditTestDetails.LatestVersion, ActiveQuestions: constEditTestDetails.ActiveQuestions }
            },
            '/admin/Tests/ViewResults'
        );
    };

    useEffect(() => {
        getTestsToDisplay();
    }, []);

    return (
        <>
            <div className="section">
                <div className="section-content grid grid-wrap">
                    <Header></Header>

                    <div className="size_1-of-1 text-align_center  grid grid-wrap">
                        <div className="grid grid-wrap size_1-of-1 grid_vertical-align-center padding-vertical_large">
                            <div className="size_1-of-1 grid padding-horizontal_xx-small">
                                <div className="size_1-of-3" style={{ minHeight: '46px' }}>
                                    <style jsx global>{`
                                        select {
                                            margin-left: 0px !important;
                                        }
                                    `}</style>
                                    <div className="grid grid-wrap">
                                        <div className="padding-medium-right_large padding-large-right_large size_1-of-1 medium-size_1-of-2">
                                            <FormElement
                                                onChange={(value) => {
                                                    filterByStatus(value);
                                                }}
                                                id="UserField_6"
                                                label="Status"
                                                name="Status"
                                                type="select"
                                                variant="darkBackground"
                                                options={optionsState}
                                                value=""
                                            ></FormElement>
                                        </div>

                                        <div className="padding-small-top_large padding-medium-left_large padding-large-left_large  size_1-of-1 medium-size_1-of-2">
                                            <FormElement
                                                onChange={(value) => {
                                                    filterByCategory(value);
                                                }}
                                                id="UserField_7"
                                                label="Category"
                                                name="Category"
                                                type="select"
                                                variant="darkBackground"
                                                options={optionsCategories}
                                                value="All"
                                            ></FormElement>
                                        </div>
                                    </div>
                                </div>
                                <h1 className="margin-around_auto text-color_copper-medium">tests</h1>

                                <div
                                    className="size_1-of-3  grid"
                                    onClick={() => {
                                        Swal.fire({
                                            title: 'Loading...',
                                            showConfirmButton: false,
                                            toast: true,
                                            willOpen: () => {
                                                Swal.showLoading();
                                            }
                                        });
                                        router.push('/admin/Tests/AddTest');
                                    }}
                                    style={{ cursor: 'pointer', marginTop: '-0.2rem' }}
                                >
                                    <svg className="Svg  margin-left_auto margin-vertical_auto" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 48 48">
                                        <path d="M24,48A24,24,0,1,1,48,24,24,24,0,0,1,24,48ZM24,1A23,23,0,1,0,47,24,23,23,0,0,0,24,1Z" />
                                        <path d="M31.5,24.5h-15a0.5,0.5,0,0,1,0-1h15A0.5,0.5,0,0,1,31.5,24.5Z" />
                                        <path d="M24,32a0.5,0.5,0,0,1-.5-0.5v-15a0.5,0.5,0,0,1,1,0v15A0.5,0.5,0,0,1,24,32Z" />
                                        <rect width="30" height="30" fill="none" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/*  Table */}

                        <div id={`TableRow-Headings`} name="tablerow" className="size_1-of-1 ">
                            <div className="size_1-of-1 grid grid-wrap padding-bottom_small  text-color_copper-medium" style={{ margin: 'auto' }}>
                                <div className="size_1-of-6" style={{ margin: 'auto' }}>
                                    <p className={`text-size_large text-weight_bold `}>Name</p>
                                </div>
                                <div className="size_1-of-6" style={{ margin: 'auto' }}>
                                    <p className={`text-size_large text-weight_bold `}>Category</p>
                                </div>

                                <div className="size_1-of-6 padding-around_xx-small" style={{ margin: 'auto' }}>
                                    <p className={`text-size_large text-weight_bold `}>Status</p>
                                </div>
                                <div className="size_1-of-6" style={{ margin: 'auto' }}>
                                    <p className={`text-size_large text-weight_bold `}>Latest version</p>
                                </div>
                                <div className="size_2-of-6" style={{ margin: 'auto' }}>
                                    <p className={`text-size_large text-weight_bold `}>Options</p>
                                </div>
                            </div>

                            <div className="size_1-of-1" style={{ height: '1px', background: '#999999', maxWidth: '100%', margin: 'auto' }}></div>
                        </div>

                        <div className="size_1-of-1 tblHeight">
                            {constViewTests &&
                                constViewTests.map &&
                                constViewTests.map((field, iCount) => {
                                    return (
                                        <div id={`TableRow-${iCount}`} name="tablerow" key={iCount} className="size_1-of-1 text-color_white">
                                            <div className="size_1-of-1 grid grid-wrap" style={{ margin: 'auto' }}>
                                                <div className="size_1-of-6 padding-around_small" style={{ margin: 'auto' }}>
                                                    <p className={`text-size_medium`}>{field.Name}</p>
                                                </div>
                                                <div className="size_1-of-6 padding-around_small" style={{ margin: 'auto' }}>
                                                    <p className={`text-size_medium`}>{field.Category}</p>
                                                </div>

                                                <div className="size_1-of-6 padding-around_small" style={{ margin: 'auto' }}>
                                                    <p className={`text-size_medium`}>{field.TestSendOut == true ? 'Sent' : 'Draft'}</p>
                                                </div>
                                                <div className="size_1-of-6 padding-around_small" style={{ margin: 'auto' }}>
                                                    <p className={`text-size_medium`}>{field.LatestVersion}</p>
                                                </div>
                                                <div className="size_2-of-6 padding-around_small" style={{ margin: 'auto' }}>
                                                    <div className="grid grid-wrap">
                                                        <div className="size_1-of-3 padding-horizontal_x-small">
                                                            <Button
                                                                size="xsmall"
                                                                label="view"
                                                                variant="CopperBackgroundLight"
                                                                onClick={() => {
                                                                    ViewTestDetailsRedirect(iCount);
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="size_1-of-3 padding-horizontal_x-small">
                                                            <Button
                                                                size="xsmall"
                                                                label="send"
                                                                variant="CopperBackgroundLight"
                                                                onClick={() => {
                                                                    SendTestRedirect(iCount);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="size_1-of-3 padding-horizontal_x-small">
                                                            <Button
                                                                size="xsmall"
                                                                label="results"
                                                                variant="CopperBackgroundLight"
                                                                onClick={() => {
                                                                    ViewResults(field);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="size_1-of-1" style={{ height: '0.5px', background: '#999999', maxWidth: '100%', margin: 'auto' }}></div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
