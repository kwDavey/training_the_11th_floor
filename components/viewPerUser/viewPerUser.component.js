import { use, useState } from 'react';
import { Banner, Header, Circlecontent, Buttonsection, Button, Footer } from '@Components';
import axios from 'axios';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
export default function ViewPerUser({ TestSentID, UserPK, grow }) {
    const router = useRouter();

    const [testDetails, setTestDetails] = useState();

    const getData = async () => {
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
                data: { MethodName: 'GetUserSpecificTestDetails', TestSentID, UserPK }
            })
        ).data;
        if (tempResponse == false) {
            setShowIndex(null);
            Swal.close();
        } else {
            Swal.close();
            setTestDetails(tempResponse);
        }
    };

    useEffect(() => {
        setTestDetails(null);
        setShowIndex(null);
        getData();
    }, [TestSentID]);

    const [showIndex, setShowIndex] = useState(null);

    return (
        <>
            <div className="size_1-of-1 text-align_center grid grid-wrap">
                <div className="size_1-of-1">
                    {(testDetails &&
                        testDetails.length &&
                        testDetails.map &&
                        testDetails.map((field, iMainCounter) => {
                            let CorrectCount = 0;
                            field.forEach((element) => {
                                if (element.Correct) {
                                    CorrectCount++;
                                }
                            });
                            let percentage = Math.round((CorrectCount / field.length) * 100);
                            return (
                                <div key={iMainCounter + '-Test'}>
                                    <div className={'size_1-of-1 grid grid-wrap ' + (showIndex != iMainCounter ? 'padding-bottom_small' : '')}>
                                        <Button ID="myBtn" variant={'CopperBackgroundLight' + (showIndex == iMainCounter ? 'Active' : '')} type="button" label={'Attempt ' + (iMainCounter + 1) + ' (' + percentage + '%)'} onClick={(e) => setShowIndex(iMainCounter)}></Button>
                                    </div>
                                    {showIndex == iMainCounter && (
                                        <div className="size_1-of-1 growVertically">
                                            <div id={`TableRow-Headings`} name="tablerow" className="size_1-of-1 text-color_copper-medium padding-top_large">
                                                <div className="size_1-of-1 grid grid-wrap padding-bottom_small" style={{ margin: 'auto' }}>
                                                    <div className="size_1-of-3" style={{ margin: 'auto' }}>
                                                        <p className={`text-size_large text-weight_bold `}>Question Number</p>
                                                    </div>

                                                    <div className="size_1-of-3 padding-around_xx-small" style={{ margin: 'auto' }}>
                                                        <p className={`text-size_large text-weight_bold `}>Answer</p>
                                                    </div>
                                                    <div className="size_1-of-3" style={{ margin: 'auto' }}>
                                                        <p className={`text-size_large text-weight_bold `}>Correct</p>
                                                    </div>
                                                </div>

                                                <div className="size_1-of-1" style={{ height: '2px', background: '#FFFFFF', maxWidth: '100%', margin: 'auto' }}></div>
                                            </div>

                                            <div className="tblHeight padding-bottom_large" style={{ minHeight: '100px' }}>
                                                {field &&
                                                    field.map &&
                                                    field.map((field, iCount) => {
                                                        return (
                                                            <div id={`TableRow-${iCount}`} name="tablerow" key={iCount} className="size_1-of-1" /* style={{ cursor: 'pointer' }} onClick={(e) => ViewTestClicked(iCount)} */>
                                                                <div className="size_1-of-1 grid grid-wrap" style={{ margin: 'auto' }}>
                                                                    <div className="size_1-of-3 padding-around_small" style={{ margin: 'auto' }}>
                                                                        <p className={`text-size_medium`}>{field.QuestionNumber}</p>
                                                                    </div>

                                                                    <div className="size_1-of-3 padding-around_small" style={{ margin: 'auto' }}>
                                                                        <p className={`text-size_medium`}>{field.UsersAnswer}</p>
                                                                    </div>
                                                                    <div className="size_1-of-3 padding-around_small" style={{ margin: 'auto' }}>
                                                                        {field.Correct == true && <p className="text-size_medium text-color_green">Correct</p>}
                                                                        {field.Correct == false && <p className="text-size_medium text-color_red">Incorrect</p>}
                                                                    </div>
                                                                </div>

                                                                <div className="size_1-of-1" style={{ height: '1px', background: '#FFFFFF', maxWidth: '100%', margin: 'auto' }}></div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        }))||(<div className='padding-vertical_large padding-top_medium'>
                            No attempts have been taken, but the test has been sent out to user.
                        </div>)}
                </div>
            </div>
        </>
    );
}
