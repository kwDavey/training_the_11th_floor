import { Banner, Header, Circlecontent, Buttonsection, Button, Footer, ViewPerUser } from '@Components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { query } from 'firebase/firestore';

export default function ViewResultsPerUser() {
    const router = useRouter();

    const [testDetails, setTestDetails] = useState({});

    const [userDetails, setUserDetails] = useState({});

    const [Query,setQuery] = useState({});

    const getDataForUser = async (query) => {
        var tempResponse2 = (
            await axios({
                method: 'POST',
                url: '/api/firebase/db',
                data: { MethodName: 'GetUserSpecificDetails', InputData: query.UserPK }
            })
        ).data;

        var tempResponse3 = (
            await axios({
                method: 'POST',
                url: '/api/firebase/db',
                data: { MethodName: 'getTestDetailsFromSentCode', TestSentID: query.TestSentID }
            })
        ).data;

        if (tempResponse2 == false || tempResponse3 == false) {
            await Swal.fire({
                icon: 'error',
                title: 'Invalid details',
                text: 'Something went wrong or user has no results yet, please try again later.',
                showConfirmButton: true,
                confirmButtonText: 'Okay',
                confirmButtonColor: '#DE7E49',
                buttonsStyling: true
            });
            router.push({
                pathname: '/admin/Tests/ViewTests'
            });
            return;
        } else {
            Swal.close();
            setTestDetails(tempResponse3);
            setUserDetails(tempResponse2);
        }
    };

    const Close = () => {
        router.push(
            {
                pathname: '/admin/Tests/ViewResults',
                query: router.query
            },
            '/admin/Tests/ViewResults'
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
        if (!router || !router.query || router.query.Version == undefined || router.query.Attempts == undefined || router.query.TestSentID == undefined || router.query.UserPK == undefined) {
            router.push({
                pathname: '/admin/Tests/ViewTests'
            });
        } else {
            getDataForUser(router.query);
        }
    }, []);

    return (
        <>
            <div className="section">
                <div className="section-content grid grid-wrap ">
                    <Header></Header>
                    <div className="size_1-of-1 grid grid-wrap  padding-top_large">
                        <h2 className="size_1-of-1 text-align_center padding-vertical_large text-color_copper-medium">VIEW RESULTS</h2>
                    </div>
                    <div className="grid grid-wrap size_1-of-1 padding-vertical_large ">
                        <h2 className="size_1-of-4 text-size_small text-align_center text-color_copper-medium">
                            User:{' '}
                            <span className="text-size_small text-color_white">
                                {userDetails.FName} {userDetails.LName}
                            </span>
                        </h2>
                        <h2 className="size_1-of-4 text-size_small text-align_center text-color_copper-medium">
                            Test: <span className="text-size_small text-color_white">{testDetails.Name}</span>
                        </h2>
                        <h2 className="size_1-of-4 text-size_small text-align_center text-color_copper-medium">
                            version: <span className="text-size_small text-color_white">{router.query.Version}</span>
                        </h2>
                        <h2 className="size_1-of-4 text-size_small text-align_center text-color_copper-medium">
                            Category: <span className="text-size_small text-color_white">{testDetails.Category}</span>
                        </h2>
                    </div>

                    {typeof showIndex != 'number' && <p className="size_1-of-1 text-size_large padding-bottom_large text-align_center">Please select a attempt of the test you wish to see</p>}
                    <ViewPerUser redirectUrl={'/admin/Tests/ViewTests'} Attempts={router.query.Attempts} TestSentID={router.query.TestSentID} UserPK={router.query.UserPK} />

                    <div className="size_1-of-1 grid" style={{ justifyContent: 'center' }}>
                        <div className="size_1-of-3 padding-horizontal_x-small">
                            <Button size="fill" label="BACK" variant="CopperBackgroundLight" onClick={Close} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
