import { Banner, Header, Circlecontent, Buttonsection, Footer, Button, FormElement } from '@Components';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useEffect, useState, useRef } from 'react';

import MetaTages from '../metaTags/metaTags';

import { WindowSize } from '@Modules';

export default function TakeTest() {
    const device = WindowSize();
    var HeadDetails = new MetaTages().Home;

    const router = useRouter();
    const { slug } = router.query;
    const [UserValidated, setUserValidated] = useState(false);
    const [TestCompleted, setTestCompleted] = useState(false);
    const [CurrentQuestion, setCurrentQuestion] = useState(0);
    const [constQuestionsLeft, setConstQuestionsLeft] = useState();
    const [constUserPK, setConstUserPK] = useState(0);
    const [constTestPKCode, setContTestPKCode] = useState(0);
    const [constTestVersion, setConstTestVersion] = useState(0);
    const [constUserAttempt, setConstUserAttempt] = useState(0);
    const [constDefaultQuestions, setConstDefaultQuestions] = useState(0);
    const [constUserID, setConstUserID] = useState();
    const [constUsersMark, setUsersMark] = useState(0);
    const [MaxAttempts, setConstMaxAttempts] = useState(null);
    const [testData, setTestData] = useState(null);

    useEffect(() => {
        if (!slug) {
            return; // NOTE: router.query might be empty during initial render
        } else {
            try {
                getBasicTestData();
            } catch (err) {
                console.error(err);
            }
        }
    }, [slug]);
    const fields = [{ ref: useRef(), id: 'field_1', label: 'ID / Passport Number', name: 'IDNumber', type: 'id', required: true, variant: 'darkBackground' }];
    const QuestionField = [
        {
            ref: useRef(),
            id: 'field_2',
            label: CurrentQuestion.Question,
            name: 'QuestionField',
            type: CurrentQuestion.Type,
            required: true,
            variant: 'darkBackground',
            options: CurrentQuestion.Options?.map((x) => ({ value: x, label: x }))
            /* {
                    value: 'Female',
                    label: 'Female'
                },
                {
                    value: 'Male',
                    label: 'Male'
                }
            ] */
        }
    ];

    const getBasicTestData = async () => {
        var tempResponse = (
            await axios({
                method: 'POST',
                url: '/api/firebase/db',
                data: { MethodName: 'getBasicTestData', TestID: slug }
            })
        ).data;
        setTestData(tempResponse);
        return tempResponse;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        var valid = fields.reduce((validSoFar, field) => {
            var valid = field.ref.current.reportValidity();
            return validSoFar && valid;
        }, true);

        if (valid) {
            Swal.fire({
                title: 'Loading...',
                showConfirmButton: false,
                toast: true,
                willOpen: () => {
                    Swal.showLoading();
                }
            });

            var UserID = fields[0].ref.current.value;
            //Check if ID exists in firebase collection for that test
            var tempResponse = (
                await axios({
                    method: 'POST',
                    url: '/api/firebase/db',
                    data: { MethodName: 'CheckIfUserCanAccessTest', TestID: slug, UserID }
                })
            ).data;

            if (tempResponse == false) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid details, or test has expired',
                    text: 'Please check your details and try again.',
                    showConfirmButton: true,
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#DE7E49',
                    buttonsStyling: true
                });
            } else {
                if (Number(tempResponse.Attempt) < Number(tempResponse.MaxAttempts)) {

                    setUserValidated(true);
                    setConstTestVersion(tempResponse.TestVersion);
                    setContTestPKCode(tempResponse.TestPKCode);
                    setConstMaxAttempts(Number(tempResponse.MaxAttempts));
                    setConstQuestionsLeft(tempResponse.QuestionsLeft);
                    setConstUserPK(tempResponse.UserPK);
                    setConstUserID(UserID);
                    setConstUserAttempt(tempResponse.Attempt);
                    setConstDefaultQuestions(tempResponse.DefaultQuestions);

                    if (tempResponse.QuestionsLeft == 'None') {
                        getUsersMarks(tempResponse.UserPK);
                    } else {
                        if (tempResponse.Started == false) {
                            ScrambleQuestionNumbers(tempResponse.UserPK, tempResponse.QuestionsLeft, tempResponse.TestVersion, tempResponse.TestPKCode);
                        } else {
                            ShowNextQuestion(tempResponse.QuestionsLeft, tempResponse.TestVersion, tempResponse.TestPKCode);
                        }
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'You have no attempts left.',
                        text: 'You will not be able to take this test again.',
                        showConfirmButton: true,
                        confirmButtonText: 'Okay',
                        confirmButtonColor: '#DE7E49',
                        buttonsStyling: true
                    });
                }
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Missing information.',
                text: 'Please fill in all required details.',
                showConfirmButton: true,
                confirmButtonText: 'Okay',
                confirmButtonColor: '#DE7E49',
                buttonsStyling: true
            });
        }
    };

    const ScrambleQuestionNumbers = async (UserPK, QuestionsLeft, TestVersion, TestPKCode) => {
        // Randomize question numbers and store them in DB
        let tempShuffledQuestions = QuestionsLeft.toString()
            .split(',')
            .sort(() => 0.5 - Math.random());

        //Save question in DB
        var tempRepsonse = (
            await axios({
                method: 'POST',
                url: '/api/firebase/db',
                data: { MethodName: 'SaveShuffledQuestionsForUser', TestID: slug, UserID: UserPK, ShuffledQuestions: tempShuffledQuestions.join(',') }
            })
        ).data;
        if (tempRepsonse == true) {
            //then
            QuestionsLeft = tempShuffledQuestions.join(',');
            setConstQuestionsLeft(QuestionsLeft);
            ShowNextQuestion(QuestionsLeft, TestVersion, TestPKCode);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Missing information.An error occurred',
                text: 'Please check your internet connection and try again.',
                showConfirmButton: true,
                confirmButtonText: 'Okay',
                confirmButtonColor: '#DE7E49',
                buttonsStyling: true
            });
        }
    };

    const ShowNextQuestion = async (QuestionsLeft, TestVersion, TestPKCode) => {
        var NextQuestionNumber;
        NextQuestionNumber = QuestionsLeft.toString().split(',')[0];

        //Get Question from DB
        var tempGetQuestionResponse = (
            await axios({
                method: 'POST',
                url: '/api/firebase/db',
                data: { MethodName: 'getQuestion', TestPKCode, UserPK: constUserPK, TestVersion, NextQuestionNumber }
            })
        ).data;
        if (tempGetQuestionResponse == false) {
            Swal.fire({
                icon: 'error',
                title: 'Missing information.An error occurred',
                text: 'Please check your internet connection and try again.',
                showConfirmButton: true,
                confirmButtonText: 'Okay',
                confirmButtonColor: '#DE7E49',
                buttonsStyling: true
            });
        } else {

            if (tempGetQuestionResponse.Active == false) {
                UpdateUserQuestionsRemaining(); //Skip the inactive questions -- Work on more as a backup
            } else {
                //Display Question
                setCurrentQuestion({ QuestionNumber: NextQuestionNumber, ...tempGetQuestionResponse });

                Swal.close();
            }
        }
    };

    const SaveQuestionResponse = async (e) => {
        e.preventDefault();
        var valid = false;
        var Answer = '';
        if (CurrentQuestion.Type == 'radio-button') {
            document.getElementsByName('QuestionField').forEach((element) => {
                if (element.checked == true) {
                    valid = true;
                    Answer = element.value;
                }
            });
        }

        if (valid) {
            Swal.fire({
                title: 'Loading...',
                showConfirmButton: false,
                toast: true,
                willOpen: () => {
                    Swal.showLoading();
                }
            });

            //Mark Question
            var Correct = Answer == CurrentQuestion.CorrectAnswer;
            //Save Users response and mark
            var tempSavedUserAnswerResponse = (
                await axios({
                    method: 'POST',
                    url: '/api/firebase/db',
                    data: {
                        MethodName: 'SaveUsersAnswer',
                        TestPKCode: slug,
                        UserPK: constUserPK,
                        QuestionNumber: CurrentQuestion.QuestionNumber,
                        constUserAttempt,
                        Answer,
                        Correct
                    }
                })
            ).data;
            if (tempSavedUserAnswerResponse == false) {
                Swal.fire({
                    icon: 'error',
                    title: 'Cant Save',
                    text: 'Please check your internet connection and try again.',
                    showConfirmButton: true,
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#DE7E49',
                    buttonsStyling: true
                });
            } else {
                //Update DB with remaining questions for the user
                UpdateUserQuestionsRemaining();
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Missing information.',
                text: 'Please fill in all required details.',
                showConfirmButton: true,
                confirmButtonText: 'Okay',
                confirmButtonColor: '#DE7E49',
                buttonsStyling: true
            });
        }
    };

    const Logout = () => {
        Swal.fire({
            title: `Confirm exit`,
            text: 'All your questions will be saved, except for the current question.',
            icon: 'none',
            showConfirmButton: true,
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                setUserValidated(false);
                setTestCompleted(false);
                setCurrentQuestion(0);
                setConstQuestionsLeft();
                setConstUserPK(0);
                setContTestPKCode(0);
                setConstTestVersion(0);
                setConstUserAttempt(0);
                setConstDefaultQuestions(0);
            }
        });
    };

    const UpdateUserQuestionsRemaining = async () => {
        var QuestionsLeft = 'None';
        if (constQuestionsLeft.indexOf(',') != -1) {
            QuestionsLeft = constQuestionsLeft.slice(constQuestionsLeft.indexOf(',') + 1); //Remove current question
        }

        setConstQuestionsLeft(QuestionsLeft);

        //Update the DB, to reflect the updated list of questions the user needs to do
        var tempSavedUserAnswerResponse = (
            await axios({
                method: 'POST',
                url: '/api/firebase/db',
                data: {
                    MethodName: 'dbUpdateUserQuestionsRemaining',
                    TestPKCode: slug,
                    UserPK: constUserPK,
                    QuestionsLeft
                }
            })
        ).data;
        if (tempSavedUserAnswerResponse == false) {
            Swal.fire({
                icon: 'error',
                title: 'Missing information.An error occurred',
                text: 'Please check your internet connection and try again.',
                showConfirmButton: true,
                confirmButtonText: 'Okay',
                confirmButtonColor: '#DE7E49',
                buttonsStyling: true
            });
        } else {
            //Check to see if there are more questions left

            if (QuestionsLeft != 'None') {
                //Then show next question
                ShowNextQuestion(QuestionsLeft, constTestVersion, constTestPKCode);
            } else {
                //Mark users test as completed
                getUsersMarks(constUserPK);
            }
        }
    };

    const TryQuestionsAgain = async (e) => {
        Swal.fire({
            title: 'Loading...',
            showConfirmButton: false,
            toast: true,
            willOpen: () => {
                Swal.showLoading();
            }
        });
        //Check if ID exists in firebase collection for that test
        var tempResponse = (
            await axios({
                method: 'POST',
                url: '/api/firebase/db',
                data: { MethodName: 'CheckIfUserCanAccessTest', TestID: slug, UserID: constUserID }
            })
        ).data;
        if (Number(tempResponse.Attempt) < Number(tempResponse.MaxAttempts)) {
            e.preventDefault();
            setCurrentQuestion([]);
            setConstUserAttempt(Number(constUserAttempt) + 1);

            //Reset Questions and display the first one
            ScrambleQuestionNumbers(constUserPK, constDefaultQuestions, constTestVersion, constTestPKCode);
            setTestCompleted(false);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'You have no attempts left.',
                text: 'You will not be able to take this test again.',
                showConfirmButton: true,
                confirmButtonText: 'Okay',
                confirmButtonColor: '#DE7E49',
                buttonsStyling: true
            });
        }
    };

    const getUsersMarks = async (UserPK) => {
        var tempSavedUserAnswerResponse = (
            await axios({
                method: 'POST',
                url: '/api/firebase/db',
                data: { MethodName: 'dbGetUsersTotalMarks', TestPKCode: slug, UserPK }
            })
        ).data;
        if (tempSavedUserAnswerResponse == false) {
            Swal.fire({
                icon: 'error',
                title: 'Missing information.An error occurred',
                text: 'Please check your internet connection and try again.',
                showConfirmButton: true,
                confirmButtonText: 'Okay',
                confirmButtonColor: '#DE7E49',
                buttonsStyling: true
            });
        } else {
            //Check to see if there are more questions left
            setUsersMark((tempSavedUserAnswerResponse.TotalMarks / tempSavedUserAnswerResponse.Questions.split(',').length) * 100);

            setTestCompleted(true);

            Swal.close();
        }
    };

    return (
        <>
            <Head>
                {/* <!-- HTML Meta Tags --> */}
                <title>{HeadDetails.title}</title>
                <meta name="description" content={HeadDetails.description} />

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemProp="name" content={HeadDetails.title} />
                <meta itemProp="description" content={HeadDetails.description} />
                <meta itemProp="image" content={HeadDetails.image} />

                {/* <!-- Facebook Meta Tags --> */}
                <meta property="og:url" content={HeadDetails.url} />
                <meta property="og:type" content={HeadDetails.website} />
                <meta property="og:title" content={HeadDetails.title} />
                <meta property="og:description" content={HeadDetails.description} />
                <meta property="og:image" content={HeadDetails.image} />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name="twitter:card" content={HeadDetails.cardSize} />
                <meta name="twitter:title" content={HeadDetails.title} />
                <meta name="twitter:description" content={HeadDetails.description} />
                <meta name="twitter:image" content={HeadDetails.image} />

                {/* <!-- Favicons --> */}
                <link rel="icon" href="/favicon-48x48.ico" />
                <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
                <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            </Head>
            <div className="grid" style={{ height: '100%', justifyContent: 'center' }}>
                <div className="section section-content" style={{ height: '100%', padding: '0' }}>
                    {!TestCompleted && (
                        <>
                            {!UserValidated && (
                                <div className="grid" style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <div className="grid grid-wrap grid_align-center text-color_copper-dark margin-around_small" style={{ maxWidth: '600px', outline: '1px solid', padding: '30px' }}>
                                        <img src="/logo.png" style={{ maxHeight: '200px' }} />
                                        <h1 className="padding-top_medium size_1-of-1 text-align_center">Staff Assessment Portal</h1>
                                        <h2 className="padding-top_medium size_1-of-1 text-align_center padding-bottom_xx-large">Login</h2>
                                        <form
                                            autoComplete="off"
                                            onSubmit={(ev) => {
                                                ev.preventDefault();
                                            }}
                                        >
                                            {fields.map((field, iCount) => {
                                                return (
                                                    <div key={field.id} className="size_1-of-1  padding-around_x-small">
                                                        <FormElement ref={field.ref} {...field} />
                                                    </div>
                                                );
                                            })}
                                        </form>

                                        <div className="size_1-of-1 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
                                            <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="Login" size="medium" onClick={(e) => handleSubmit(e)}></Button>
                                            <div className="padding-top_xx-large text-size_small text-align_center padding-horizontal_large" style={{ opacity: '0.9' }}>
                                                Note, once you have logged in, your test will begin or continue where you last left off
                                            </div>
                                        </div>

                                        {(testData && (
                                            <div className="padding-top_large grid grid-wrap padding-large-horizontal_large text-align_center">
                                                <div className=" size_1-of-1 padding-top_large grid">
                                                    <p className="size_1-of-1">Test Name: {testData.Name}</p>
                                                </div>
                                                <div className=" size_1-of-1 padding-top_large grid">
                                                    <p className="size_1-of-1">
                                                        Expires:{' '}
                                                        {(() => {
                                                            if (testData) {
                                                                const D = new Date(testData.Exp.seconds * 1000);
                                                                const Exp = D.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
                                                                if (D.toDateString() == new Date().toDateString()) {
                                                                    if (D < new Date()) {
                                                                        return (
                                                                            <span className="text-size_x-large" style={{ color: 'red' }}>
                                                                                Expired
                                                                            </span>
                                                                        );
                                                                    } else {
                                                                        return (
                                                                            <span className="text-size_x-large" style={{ color: 'red' }}>
                                                                                {Exp}
                                                                            </span>
                                                                        );
                                                                    }
                                                                } else if (D < new Date()) {
                                                                    return (
                                                                        <span className="text-size_x-large" style={{ color: 'red' }}>
                                                                            Expired
                                                                        </span>
                                                                    );
                                                                }
                                                                return <span className="text-size_x-large">{Exp}</span>;
                                                            }
                                                        })()}
                                                    </p>
                                                </div>
                                                <div className=" size_1-of-1 padding-top_large grid">
                                                    <p className="size_1-of-1">
                                                        At:{' '}
                                                        {(() => {
                                                            if (testData) {
                                                                const D = new Date(testData.Exp.seconds * 1000);
                                                                const Exp = D.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
                                                                if (D.toDateString() == new Date().toDateString()) {
                                                                    if (D < new Date()) {
                                                                        return (
                                                                            <span className="text-size_x-large" style={{ color: 'red' }}>
                                                                                Expired
                                                                            </span>
                                                                        );
                                                                    } else {
                                                                        return (
                                                                            <span className="text-size_x-large" style={{ color: 'red' }}>
                                                                                {D.getHours() + ':' + D.getMinutes()}
                                                                            </span>
                                                                        );
                                                                    }
                                                                } else if (D < new Date()) {
                                                                    return (
                                                                        <span className="text-size_x-large" style={{ color: 'red' }}>
                                                                            Expired
                                                                        </span>
                                                                    );
                                                                }
                                                                return <span className="text-size_x-large">{D.getHours() + ':' + D.getMinutes()}</span>;
                                                            }
                                                        })()}
                                                    </p>
                                                </div>
                                                <div className="size_1-of-1  padding-top_large grid">
                                                    <p className="size_1-of-1">Attempts: {testData.Attempts}</p>
                                                </div>
                                            </div>
                                        )) || (
                                            <div className="padding-top_large padding-large-horizontal_large  grid grid-wrap text-align_center">
                                                <div className="size_1-of-1  padding-top_large grid">
                                                    <p className="size_1-of-1">Name: Loading...</p>
                                                </div>
                                                <div className="size_1-of-1  padding-top_large grid">
                                                    <p className="size_1-of-1">Expires: Loading...</p>
                                                </div>
                                                <div className="size_1-of-1  padding-top_large grid">
                                                    <p className="size_1-of-1">Attempts: Loading...</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {UserValidated && (
                                <div className="size_1-of-1 padding-around_large grid grid_vertical">
                                    <div className="size_1-of-1 grid grid-wrap " style={{ maxHeight: '150px', justifyContent: 'center' }}>
                                        <div className="size_1-of-1 text-align_center grid grid_align-spread grid_vertical-align-center">
                                            <p className="text-size_xxx-large text-align_center size_1-of-1">{testData.Name}</p>
                                            <div className="grid" onClick={Logout}>
                                                <svg className="SvgStroke margin-vertical_auto" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                                                    <g id="Interface / Log_Out">
                                                        <path
                                                            id="Vector"
                                                            d="M12 15L15 12M15 12L12 9M15 12H4M9 7.24859V7.2002C9 6.08009 9 5.51962 9.21799 5.0918C9.40973 4.71547 9.71547 4.40973 10.0918 4.21799C10.5196 4 11.0801 4 12.2002 4H16.8002C17.9203 4 18.4796 4 18.9074 4.21799C19.2837 4.40973 19.5905 4.71547 19.7822 5.0918C20 5.5192 20 6.07899 20 7.19691V16.8036C20 17.9215 20 18.4805 19.7822 18.9079C19.5905 19.2842 19.2837 19.5905 18.9074 19.7822C18.48 20 17.921 20 16.8031 20H12.1969C11.079 20 10.5192 20 10.0918 19.7822C9.71547 19.5905 9.40973 19.2839 9.21799 18.9076C9 18.4798 9 17.9201 9 16.8V16.75"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </g>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="size_1-of-1 text-align_center padding-top_large padding-large-right_x-large padding-medium-right_x-large">
                                            Question : {constDefaultQuestions.split(',').length - (constQuestionsLeft.split(',').length || 1) + 1} / {constDefaultQuestions.split(',').length}
                                        </div>
                                    </div>

                                    <div className="size_1-of-1 grid" style={{ justifyContent: 'center', alignItems: 'center', height: 'calc(100% - 250px)' }}>
                                        <div style={{ width: '1000px', maxWidth: '100%' }}>
                                            <div className="size_1-of-1 text-align_center text-color_copper-medium padding-bottom_medium ">
                                                <h2 className="size_1-of-1 text-size_xx-large">Question {constDefaultQuestions.split(',').length - (constQuestionsLeft.split(',').length || 1) + 1}</h2>
                                            </div>

                                            <div className="size_1-of-1 padding-around_x-small">
                                                <FormElement ref={QuestionField[0].ref} {...QuestionField[0]} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="size_1-of-1 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
                                        <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="Next" size="medium" onClick={(e) => SaveQuestionResponse(e)}></Button>
                                        <h4 className="padding-bottom_large padding-top_large ">
                                            Attempt {Number(constUserAttempt) + 1} out of {Number(MaxAttempts)}
                                        </h4>
                                        <div className="size_1-of-1 text-align_center large-size_1-of-3 ">You can close the tab to exit assessment</div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {TestCompleted && (
                        <div className="size_1-of-1">
                            <div className="grid size_1-of-1">
                                <svg className="SvgStroke margin-left_auto margin-top_x-large margin-right_large" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none" onClick={Logout}>
                                    <g id="Interface / Log_Out">
                                        <path
                                            id="Vector"
                                            d="M12 15L15 12M15 12L12 9M15 12H4M9 7.24859V7.2002C9 6.08009 9 5.51962 9.21799 5.0918C9.40973 4.71547 9.71547 4.40973 10.0918 4.21799C10.5196 4 11.0801 4 12.2002 4H16.8002C17.9203 4 18.4796 4 18.9074 4.21799C19.2837 4.40973 19.5905 4.71547 19.7822 5.0918C20 5.5192 20 6.07899 20 7.19691V16.8036C20 17.9215 20 18.4805 19.7822 18.9079C19.5905 19.2842 19.2837 19.5905 18.9074 19.7822C18.48 20 17.921 20 16.8031 20H12.1969C11.079 20 10.5192 20 10.0918 19.7822C9.71547 19.5905 9.40973 19.2839 9.21799 18.9076C9 18.4798 9 17.9201 9 16.8V16.75"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </g>
                                </svg>
                            </div>
                            <div className="grid grid-wrap" style={{ height: 'calc(100% - 240px)' }}>
                                <div className="size_1-of-1 text-align_center text-color_copper-medium  grid grid-wrap grid_vertical grid_vertical-align-center grid_align-center">
                                    <h1 className="padding-bottom_large">Assessment completed</h1>
                                    <h4 className="padding-bottom_large">
                                        Attempts completed: {Number(constUserAttempt) + 1} out of {Number(MaxAttempts)}
                                    </h4>

                                    {constUsersMark >= 85 && <p className="text-color_green">Your last score was: {Math.round(constUsersMark)}%</p>}

                                    {constUsersMark < 85 && <p className="text-color_red">Your last score was: {Math.round(constUsersMark)}%</p>}
                                </div>
                            </div>
                            {Number(constUserAttempt) + 1 < Number(MaxAttempts) && (
                                <div className="size_1-of-1 grid grid_vertical grid-wrap grid_vertical-align-center padding-top_medium">
                                    <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="Try Again" size="medium" onClick={(e) => TryQuestionsAgain(e)}></Button>
                                </div>
                            )}

                            <div className="size_1-of-1 text-align_center padding-top_xx-large">You can close the tab to exit assessment</div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
