import { type } from 'os';
import { useState, useEffect } from 'react';


import { Button,Header,ViewPerUser } from '@Components';

import Swal from 'sweetalert2';

import axios from 'axios';

import { useRouter } from 'next/router';

export default function ViewResults() {
    const openTests = async (Mkey) => {
        await setActiveTestName(null);
        await setActiveTestName(Mkey);
        await setShowIndex(null);
    };

    const [userPK, setUserPK] = useState(null);

    const Router = useRouter();

    const getUserData = async (done) => {
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
                    data: { MethodName: 'GetUserSpecificDetails', InputData: Router.query.UserPK }
                })
            ).data;

            setUserPK(tempResponse.UserPK);
            setOGData(tempResponse);
            Swal.close();

            if (typeof done == 'function') {
                done();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const loadTests = () => {
        Swal.fire({
            title: 'Loading...',
            showConfirmButton: false,
            toast: true,
            willOpen: () => {
                Swal.showLoading();
            }
        });
        axios({
            method: 'POST',
            url: '../../api/firebase/db',
            data: { MethodName: 'getTestsTakenByUser', UserPK: Router.query.UserPK }
        }).then((result) => {
            Swal.close();
            setTestData(result.data);
        });
    };

    useEffect(() => {
        getUserData(loadTests);
    }, []);

    const [showIndex, setShowIndex] = useState(null);

    const [OGData, setOGData] = useState({});

    const [testData, setTestData] = useState([]);

    const [activeTestName, setActiveTestName] = useState(null);

    const [activeTestPK, setActiveTestPK] = useState('');

    const closeTests = () => {
        Router.push(
            {
                pathname: '/admin/Admin',
                query: { tab: 'users' }
            },
            '/admin/Admin'
        );
    };

    return (
        <>
            <>
                <div className="section">
                    <div className="section-content grid grid-wrap">
                        <Header activeTab="Admin"></Header>
                        <div className="size_1-of-1 text-align_center text-color_copper-medium grid grid-wrap  padding-top_large">
                            <h2 className="size_1-of-1 text-align_center padding-vertical_large">
                                {OGData.FName} {OGData.LName}&apos;s test results
                            </h2>
                        </div>
                        <div className="size_1-of-1 grid">
                            <div className="size_1-of-4">
                                {testData &&
                                    Object.keys(testData).map((Mkey, index) => {
                                        const item = testData[Mkey];
                                        return (
                                            <div className="padding-bottom_small padding-right_small" key={'nav-' + Mkey} onClick={() => openTests(Mkey)}>
                                                <Button label={Mkey} variant={'CopperBackgroundLight' + (activeTestName == Mkey ? 'Active' : '')} type="button" size="fill" className="size_1-of-1 text-align_center" />
                                            </div>
                                        );
                                    })}
                            </div>
                            <div className="size_1-of-1">
                                {(activeTestName && (
                                    <>
                                        <div className="size_1-of-1 flex flex-wrap">
                                            {testData[activeTestName].map((item, index) => {
                                                return (
                                                    <div key={'mandal-btn-' + index}>
                                                        <div
                                                            onClick={() => {
                                                                setShowIndex(index);
                                                                setActiveTestPK(testData[activeTestName][index].id);
                                                            }}
                                                            className={'size_1-of-1' + index > 0 ? 'padding-vertical_small' : 'padding-bottom_small'}
                                                            style={{ height: '60px' }}
                                                        >
                                                            <Button size="fill" variant={'CopperBackgroundDark' + (showIndex == index ? 'Active' : '')} label={new Date(item.date.seconds * 1000).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' }) + ' V' + item.version} />
                                                        </div>

                                                        {showIndex == index && (
                                                            <div className="size_1-of-1 padding-horizontal_small">
                                                                <ViewPerUser grow="true" redirectUrl={'http://localhost:3000/admin/Users/'} TestSentID={activeTestPK} UserPK={OGData.UserPK} />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                )) || (
                                    <>
                                    {(Object.keys(testData).length && <>
                                        <div className="size_1-of-1" style={{ display: 'flex', height: '100%' }}>
                                            <div className="margin-around_auto" style={{ position: 'relative', left: '-12.5%' }}>
                                                Please select a test
                                            </div>
                                        </div>
                                    </>)||(<>
                                        <div className="size_1-of-1" style={{ display: 'flex', height: '100%' }}>
                                            <div className="margin-around_auto" style={{ position: 'relative', left: '-12.5%' }}>
                                                {OGData.FName} {OGData.LName} has no test results.
                                            </div>
                                        </div>
                                    
                                    </>)}
      
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="size_1-of-1 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
                            <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="back" size="medium" onClick={closeTests}></Button>
                        </div>
                    </div>
                </div>
            </>
        </>
    );
}
