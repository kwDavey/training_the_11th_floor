import { Banner, Header, Circlecontent, Buttonsection, Footer, Button } from '@Components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { query } from 'firebase/firestore';
export default function ViewUser() {
    const router = useRouter();
    const [constViewUsersForTest, setConstViewUsersForTest] = useState();
    const [SelectedTestToSend, setSelectedTestToSend] = useState({});
    const [UserValidated, setUserValidated] = useState(false);
    const [testDetails, setTestDetails] = useState({});

    const getAllUsersWhoTookSpecificTest = async (TestDetails) => {
        Swal.fire({
            title: 'Loading...',
            showConfirmButton: false,
            toast: true,
            willOpen: () => {
                Swal.showLoading();
            }
        });

        var tempResponse = (
            await axios({
                method: 'POST',
                url: '/api/firebase/db',
                data: { MethodName: 'getAllUsersWhoTookSpecificTest', TestDetails: TestDetails }
            })
        ).data;

        setTestDetails(
            (
                await axios({
                    method: 'POST',
                    url: '/api/firebase/db',
                    data: { MethodName: 'getBasicTestDataFromPK', TestID: TestDetails.TestPK }
                })
            ).data
        );

        if (tempResponse == false) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid details',
                text: 'Something went wrong, please try again later.',
                showConfirmButton: true,
                confirmButtonText: 'Okay',
                confirmButtonColor: '#DE7E49',
                buttonsStyling: true
            });
            router.push(
                {
                    pathname: '/admin/Tests/'
                },
                '/admin/Tests/'
            );
            return;
        } else {
            Swal.close();
            //Show details about test
            setSelectedTestToSend(TestDetails);
            setConstViewUsersForTest(tempResponse);
        }
    };

    const ViewUserSpecificTestClicked = (SelectedTestDetails, RowUsersDetails) => {
        Swal.fire({
            title: 'Please select an option below',

            showConfirmButton: true,
            showCloseButton: true,
            showDenyButton: false,
            showCancelButton: true,

            confirmButtonText: 'View attempts',
            confirmButtonColor: '#022720'
        }).then(async (result) => {
            if (result.isConfirmed) {
                //Show edit test page
                Swal.fire({
                    title: 'Loading...',
                    showConfirmButton: false,
                    toast: true,
                    willOpen: () => {
                        Swal.showLoading();
                    }
                });

                //Redirect
                //TestDetails.Attempts, SelectedTestDetails.TestSentID, TestDetails.UserPK
                router.push(
                    {
                        pathname: '/admin/Tests/ViewResultsPerUser',
                        query: { Version: SelectedTestDetails.TestDetails.Version, Attempts: RowUsersDetails.Attempts, TestSentID: SelectedTestDetails.TestDetails.TestSentID, UserPK: RowUsersDetails.UserPK, ...router.query }
                    },
                    '/admin/Tests/ViewResultsPerUser'
                );
            }
        });
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
        if (!router || !router.query || router.query.TestPK == undefined) {
            router.push({
                pathname: '/admin/Tests/ViewTests'
            });
        } else {
            getAllUsersWhoTookSpecificTest(router.query);
        }
    }, []);

    return (
        <>
            <div className="section">
                <div className="section-content grid grid-wrap">
                    <Header></Header>
                    <div className="size_1-of-1 grid grid-wrap  padding-top_large padding-bottom_large" style={{ position: 'relative' }}>
                        <h2 className="size_1-of-1 text-align_center padding-vertical_large text-color_copper-medium ">
                            VIEW RESULTS : <span className="text-size_xx-large text-color_white">{testDetails.Name}</span>
                        </h2>
                    </div>
                    <div className="size_1-of-1 text-align_center grid grid-wrap">
                        <div className="size_1-of-1">
                            {constViewUsersForTest &&
                                constViewUsersForTest.map &&
                                constViewUsersForTest.map((field, iMainCounter) => {
                                    return (
                                        <div key={iMainCounter + '-Test'} className="padding-bottom_xx-large">
                                            <div className="size_1-of-1 grid grid-wrap padding-bottom_large text-align_left grid_align-center">
                                                <p className={`text-size_large text-weight_bold size_1-of-1 medium-size_1-of-3 padding-top_none`}>Category: {field.TestDetails.CategoryName}</p>
                                                <p className={`text-size_large text-weight_bold size_1-of-1 medium-size_1-of-3 padding-top_none`}>Version: {field.TestDetails.Version}</p>
                                                <p className={`text-size_large text-weight_bold size_1-of-1 medium-size_1-of-3 padding-top_none`}>Max attempts: {field.TestDetails.MaxAttempts}</p>
                                            </div>
                                            <div className="size_1-of-1 grid grid-wrap padding-bottom_large text-align_left grid_align-center">
                                                <p className={`text-size_large text-weight_bold size_1-of-1 medium-size_1-of-3 padding-top_none`}>Sent: {field.TestDetails.SentDate}</p>
                                                <p className={`text-size_large text-weight_bold size_1-of-1 medium-size_1-of-3 padding-top_none`}>Expiry: {field.TestDetails.ExpiryDate}</p>
                                                <p className={`text-size_large text-weight_bold size_1-of-1 medium-size_1-of-3 padding-top_none`}>Send: {field.Results.length} staff</p>
                                            </div>

                                            <div className="size_1-of-1 grid grid-wrap padding-bottom_large text-align_left grid_align-center">
                                                <p className={`text-size_large text-weight_bold size_1-of-1 medium-size_1-of-3 padding-top_none`}>Completed: {field.Results.filter((x) => x.Attempts != 0).length} staff</p>
                                                <p className={`text-size_large text-weight_bold size_1-of-1 medium-size_1-of-3 padding-top_none`}>Incomplete: {field.Results.filter((x) => x.Attempts == 0).length} staff</p>
                                                <p className={`text-size_large text-weight_bold size_1-of-1 medium-size_1-of-3 padding-top_none`}>
                                                    Average:{' '}
                                                    {Math.round(
                                                        field.Results.reduce((accumulator, currentValue) => {
                                                            return accumulator + currentValue.Percentage;
                                                        }, 0) / field.Results.length
                                                    )}
                                                    %
                                                </p>
                                            </div>
                                            {/*  Table */}
                                            <div id={`TableRow-Headings`} name="tablerow" className="size_1-of-1">
                                                <div className="size_1-of-1 grid grid-wrap padding-bottom_small text-color_copper-medium text-align_left" style={{ margin: 'auto' }}>
                                                    <div className="size_1-of-3" style={{ margin: 'auto' }}>
                                                        <p className={`text-size_large text-weight_bold `}>Name</p>
                                                    </div>

                                                    <div className="size_1-of-3 padding-around_xx-small" style={{ margin: 'auto' }}>
                                                        <p className={`text-size_large text-weight_bold `}>Attempts</p>
                                                    </div>
                                                    <div className="size_1-of-3" style={{ margin: 'auto' }}>
                                                        <p className={`text-size_large text-weight_bold `}>Result</p>
                                                    </div>
                                                </div>

                                                <div className="size_1-of-1" style={{ height: '1px', background: '#FFFFFF', maxWidth: '100%', margin: 'auto' }}></div>
                                            </div>

                                            <div className="tblHeight" style={{ minHeight: '100px' }}>
                                                {field.Results &&
                                                    field.Results.map &&
                                                    field.Results.map((fieldSub, iCount) => {
                                                        return (
                                                            <div id={`TableRow-${iCount}`} name="tablerow" key={iCount} className="size_1-of-1 text-align_left" style={{ cursor: 'pointer' }} onClick={(e) => ViewUserSpecificTestClicked(field, fieldSub)}>
                                                                <div className="size_1-of-1 grid grid-wrap" style={{ margin: 'auto' }}>
                                                                    <div className="size_1-of-3 padding-around_small" style={{ margin: 'auto' }}>
                                                                        <p className={`text-size_medium`}>
                                                                            {fieldSub.FName} {fieldSub.LName}
                                                                        </p>
                                                                    </div>

                                                                    <div className="size_1-of-3 padding-around_small" style={{ margin: 'auto' }}>
                                                                        <p className={`text-size_medium`}>{fieldSub.Attempts}</p>
                                                                    </div>
                                                                    <div className="size_1-of-3 padding-around_small" style={{ margin: 'auto' }}>
                                                                        {(fieldSub.Completed && (
                                                                            <>
                                                                                <p className={"text-size_medium text-color_"+(fieldSub.Percentage >= 85? "green":"red")}>{Math.round(fieldSub.Percentage)}%</p>

                                                                            </>
                                                                        )) || ( fieldSub.Started && <>
                                                                            STARTED / PENDING FINISH
                                                                        </>) || <>
                                                                            PENDING START
                                                                        </>}
                                                                    </div>
                                                                </div>

                                                                <div className="size_1-of-1" style={{ height: '0.5px', background: '#FFFFFF', maxWidth: '100%', margin: 'auto' }}></div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                        <div className="size_1-of-1 grid">
                            <div className="margin-around_auto" style={{ width: '150px' }}>
                                <Button
                                    onClick={() => {
                                        router.push('/admin/Tests/ViewTests');
                                    }}
                                    label="back"
                                    size="fill"
                                    variant="CopperBackgroundLight"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
