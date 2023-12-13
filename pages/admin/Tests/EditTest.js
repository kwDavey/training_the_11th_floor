import { Banner, Header, Circlecontent, Buttonsection, Footer, FormElement, Button } from '@Components';
import { WindowSize } from '@Modules';
import Head from 'next/head';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

import Swal from 'sweetalert2';
import axios from 'axios';
import { useSession } from 'next-auth/react';
export default function ViewUser() {
    const device = WindowSize();
    const { data: session, status } = useSession();
    const router = useRouter();
    const [TestQuestionFields, setTestQuestionFields] = useState([]);
    const [OpenNewQuestion, setOpenNewQuestion] = useState(false);
    const [SavedTestQuestionFields, setSavedTestQuestionFields] = useState([]);
    const [constEditTestDetails, setConstEditTestDetails] = useState();
    const [TestFields, setTestFields] = useState([]);

    useEffect(() => {
        Swal.fire({
            title: 'Loading...',
            showConfirmButton: false,
            toast: true,
            willOpen: () => {
                Swal.showLoading();
            }
        });
        if (!router || !router.query || router.query.TestPK == undefined || router.query.TestVersion == undefined || router.query.Category == undefined) {
            router.push({
                pathname: '/admin/Tests/ViewTests'
            });
        } else {
            GetDetailsToEditTest({ TestPK: router.query.TestPK, LatestVersion: router.query.TestVersion, Category: router.query.Category, Name: router.query.Name, CurrentVersion: router.query.CurrentVersion });
        }
    }, []);

    const GetDetailsToEditTest = async (TestDetailsToView) => {
        Swal.fire({
            title: 'Loading...',
            showConfirmButton: false,
            toast: true,
            willOpen: () => {
                Swal.showLoading();
            }
        });
        var tempVersion = TestDetailsToView.LatestVersion;
        TestDetailsToView.LatestVersion = TestDetailsToView.CurrentVersion;
        try {
            var tempResponse = (
                await axios({
                    method: 'POST',
                    url: '../../api/firebase/db',
                    data: { MethodName: 'GetAllDetailOfTestToEdit', InputData: TestDetailsToView }
                })
            ).data;


            TestDetailsToView.LatestVersion = tempVersion;

            var tempQuestions = [];
            tempResponse.forEach((element, iCounter) => {
                tempQuestions.push({ ref: React.createRef(), id: 'TestQuestionFieldsField_' + iCounter, label: element.Question, name: 'TestNewQuestion' + iCounter, type: element.Type, required: true, variant: 'darkBackground', options: element.Options, value: element.CorrectAnswer });
            });
            let optionsres = await axios({
                method: 'POST',
                url: '../../api/firebase/db',
                data: { MethodName: 'getCategorys' }
            });
            setSavedTestQuestionFields([...tempQuestions]);

            let PK;

            for(let i of optionsres.data){
                if(i.label == router.query.Category){
                    PK = i.value
                }
            }


            await setTestFields([
                {
                    ref: React.createRef(),
                    id: 'field_1',
                    label: 'Name',
                    name: 'Name',
                    type: 'text',
                    required: true,
                    variant: 'darkBackground',
                    value: TestDetailsToView.Name
                },
                {
                    ref: React.createRef(),
                    id: 'Cat-options',
                    label: 'Category',
                    name: 'Category',
                    type: 'select',
                    required: true,
                    variant: 'darkBackground',
                    value: PK,
                    options: [{
                        label:"please select",
                        value:'-1'
                    }, ...optionsres.data]
                }
            ]);
            setConstEditTestDetails(TestDetailsToView);
            Swal.close();
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Invalid details',
                text: 'Something went wrong, please try again later.',
                showConfirmButton: true,
                confirmButtonText: 'Okay',
                confirmButtonColor: '#DE7E49',
                buttonsStyling: true
            });
        }
    };

    const AddQuestion = (e) => {
        setOpenNewQuestion(true);
        if (e == 'RadioButton') {
            //enter amount of options
            setTestQuestionFields([
                { id: 'TestNewQuestionFieldsField_1', label: 'Question', name: 'Question', type: 'text', required: true, variant: 'darkBackground' },
                { id: 'TestNewQuestionFieldsField_2_option1', label: 'Option1', name: 'TestNewQuestion_options', type: 'text', required: true, variant: 'darkBackground' }
            ]);
        } else if (e == 'CheckBox') {
            //enter amount of options
        } else if (e == 'Input') {
        }
    };

    const AddOption = async (e) => {
        let tempQuestions = TestQuestionFields;
        tempQuestions.push({ id: 'TestNewQuestionFieldsField_2_option' + TestQuestionFields.length, label: 'Option ' + TestQuestionFields.length, name: 'TestNewQuestion_options', type: 'text', required: true, variant: 'darkBackground' });
        await setTestQuestionFields([...tempQuestions]);
        document.getElementsByName('TestNewQuestion_options')[document.getElementsByName('TestNewQuestion_options').length - 1].focus();
    };

    const RemoveOption = async (e) => {
        console.log(TestQuestionFields.length);
        if (TestQuestionFields.length > 1) {
            let tempQuestions = TestQuestionFields.slice(0, TestQuestionFields.length - 1);
            await setTestQuestionFields([...tempQuestions]);
            document.getElementsByName('TestNewQuestion_options')[document.getElementsByName('TestNewQuestion_options').length - 1].focus();
        }
    };

    const SaveQuestion = (e) => {
        var valid = true;

        if (TestQuestionFields.length < 1) {
            valid = false;
        }

        if (document.getElementById('TestNewQuestionFieldsField_1').value.length < 1) {
            valid = false;
        }

        document.getElementsByName('TestNewQuestion_options').forEach((element) => {
            if (element.value.length < 1) {
                valid = false;
            }
        });

        if (valid) {
            setOpenNewQuestion(false);
            setTestQuestionFields([]);
            let tempQuestions = SavedTestQuestionFields;
            //Validate Options
            var tempOptions = [];
            document.getElementsByName('TestNewQuestion_options').forEach((element) => {
                tempOptions.push({
                    value: element.value,
                    label: element.value
                });
            });
            tempQuestions.push({ ref: React.createRef(), id: 'TestNewQuestionFieldsField_2' + SavedTestQuestionFields.length, label: document.getElementById('TestNewQuestionFieldsField_1').value, name: 'TestNewQuestion' + SavedTestQuestionFields.length, type: 'radio-button', required: true, variant: 'darkBackground', options: tempOptions });

            setSavedTestQuestionFields([...tempQuestions]);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Missing information.',
                text: 'The question needs a minimum of 1 answer',
                showConfirmButton: true,
                confirmButtonText: 'Okay',
                confirmButtonColor: '#DE7E49',
                buttonsStyling: true
            });
        }
    };

    const SaveTest = async (e) => {
        e.preventDefault();

        var valid = SavedTestQuestionFields.reduce((validSoFar, field) => {
            var valid = field.ref.current.value != ''; //Validate the radio buttons
            return validSoFar && valid;
        }, true);

        if (TestFields[1].ref.current.value == '-1') {
            //Dropdown value wasnt changed
            valid = false;
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

            //Add test to DB and notify user of the addition
            var tempDBData = [];
            SavedTestQuestionFields.forEach((element) => {
                let tempOptions = [];
                element.options.forEach((element) => {
                    tempOptions.push(element.value);
                });
                tempDBData.push({
                    Active: true,
                    ['Manual-Answer']: false,
                    Type: 'radio-button',

                    Question: element.label,
                    ['Correct-Answer']: element.ref.current.value,
                    Options: tempOptions
                });
            });

            var ExtraTestDetails = {
                Name: TestFields[0].ref.current.value,
                Category: TestFields[1].ref.current.value,
                CatPK: router.query.CatPK,
                CreatedBy: session.token.id,
                NewVersion: Number(constEditTestDetails.LatestVersion) + 1,
                TestPK: constEditTestDetails.TestPK
            };

            try {
                await axios({
                    method: 'POST',
                    url: '../../api/firebase/db',
                    data: { MethodName: 'EditCurrentTest', InputData: tempDBData, ExtraTestDetails: ExtraTestDetails }
                });
                Swal.close();
                Swal.fire({
                    title: `Test has been updated and new version added`,
                    icon: 'success',
                    timer: '2000',
                    showConfirmButton: false
                }).then(() => {
                    router.push({
                        pathname: '/admin/Tests/ViewTests'
                    });
                });
            } catch (err) {
                console.error(err);
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Missing information.',
                text: 'Please select a correct answer for all questions',
                showConfirmButton: true,
                confirmButtonText: 'Okay',
                confirmButtonColor: '#DE7E49',
                buttonsStyling: true
            });
        }
    };

    const RemoveQuestion = (iQuestionNumber) => {
        let tempQuestions = SavedTestQuestionFields;
        tempQuestions.splice(iQuestionNumber, 1);
        setSavedTestQuestionFields([...tempQuestions]);
    };

    return (
        <>
            <div className="section">
                <div className="section-content grid grid-wrap">
                    <Header></Header>
                    <div className="size_1-of-1 text-align_center text-color_copper-medium grid grid-wrap  padding-top_large">
                        <h2 className="size_1-of-1 text-align_center padding-vertical_large">Edit Test</h2>

                        {TestFields &&
                            TestFields.map((field, iCount) => {
                                return (
                                    <div key={iCount} className="size_1-of-1  medium-size_1-of-2 large-size_1-of-2  padding-around_x-small">
                                        <FormElement ref={field.ref} {...field} />
                                    </div>
                                );
                            })}

                        {SavedTestQuestionFields.map((field, iCount) => {
                            return (
                                <>
                                    {iCount % 2 == '0' && device.width >= 860 && <div style={{ height: '2px', backgroundColor: 'var(--color-copper-medium)' }} className="size_1-of-1 margin-vertical_large"></div>}
                                    {device.width < 860 && <div style={{ height: '2px', backgroundColor: 'var(--color-copper-medium)' }} className="size_1-of-1 margin-vertical_large"></div>}
                                    <div key={field.id} className="size_1-of-1  medium-size_1-of-2 large-size_1-of-2  padding-around_x-small ">
                                        <div className="size_1-of-1 grid grid-wrap grid_align-center">
                                            <p className="">Question {iCount + 1}</p>
                                            <p className="padding-top_none padding-left_large" style={{ cursor: 'pointer' }} onClick={() => RemoveQuestion(iCount)}>
                                                X
                                            </p>
                                        </div>
                                        <FormElement ref={field.ref} {...field} />
                                    </div>

                                    {iCount % 2 == '0' && device.width >= 860 && <div style={{ width: '2px', backgroundColor: 'var(--color-copper-medium)', margin: '-2px' }} className="margin-vertical_large"></div>}
                                </>
                            );
                        })}
                        {TestQuestionFields.map((field, iCount) => {
                            return (
                                <div key={field.id} className="size_1-of-1  padding-around_x-small">
                                    <FormElement ref={field.ref} {...field} />
                                </div>
                            );
                        })}

                        {OpenNewQuestion == true && (
                            <div className="size_1-of-1 grid grid-wrap grid_align-center">
                                <div className="size_1-of-1 medium-size_1-of-3 grid grid_vertical grid-wrap grid_vertical-align-center  padding-around_small">
                                    <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="Add Option" size="xsmall" onClick={(e) => AddOption(e)}></Button>
                                </div>
                                {TestQuestionFields.length > 2 && (
                                    <div className="size_1-of-1 medium-size_1-of-3 grid grid_vertical grid-wrap grid_vertical-align-center  padding-around_small">
                                        <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="Remove Option" size="xsmall" onClick={(e) => RemoveOption(e)}></Button>
                                    </div>
                                )}

                                {TestQuestionFields.length > 2 && (
                                    <div className="size_1-of-1 medium-size_1-of-3 grid grid_vertical grid-wrap grid_vertical-align-center  padding-around_small">
                                        <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="Save Question" size="xsmall" onClick={(e) => SaveQuestion(e)}></Button>
                                    </div>
                                )}
                            </div>
                        )}
                        {OpenNewQuestion == false && (
                            <div className="size_1-of-1 grid grid-wrap grid_align-center">
                                <div className="size_1-of-1 medium-size_1-of-3 grid grid_vertical grid-wrap grid_vertical-align-center  padding-around_small">
                                    <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="Add Question" size="xsmall" onClick={(e) => AddQuestion('RadioButton')}></Button>
                                </div>
                            </div>
                        )}

                        {OpenNewQuestion == false && SavedTestQuestionFields.length > 0 && (
                            <div className="size_1-of-1 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
                                <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="Save Test" size="medium" onClick={(e) => SaveTest(e)}></Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
