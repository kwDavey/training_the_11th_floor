import { Banner, Header, Circlecontent, Buttonsection, Footer, FormElement, Button } from '@Components';
import { WindowSize } from '@Modules';
import Head from 'next/head';
import { useEffect, useState, useRef } from 'react';
import React from 'react';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import axios from 'axios';

import Router from 'next/router';
import { doc } from 'firebase/firestore';
export default function ViewUser() {
    const device = WindowSize();
    const { data: session } = useSession();
    const [UserValidated, setUserValidated] = useState(false);
    const [OpenNewQuestion, setOpenNewQuestion] = useState(false);
    const [SavedTestQuestionFields, setSavedTestQuestionFields] = useState([]);
    const [TestQuestionFields, setTestQuestionFields] = useState([]);
    const [CT, setCT] = useState([]);

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async () => {
        Swal.fire({
            title: 'Loading...',
            showConfirmButton: false,
            toast: true,
            willOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            var GetCategory = await axios({
                method: 'POST',
                url: '/api/firebase/db',
                data: { MethodName: 'getCategorys' }
            });
            setCT(GetCategory.data);
        } catch (err) {
            console.error(err);
        }

        Swal.close();
    };

    const TestFields = [
        {
            ref: useRef(),
            id: 'field_1',
            label: 'Test name',
            name: 'test name',
            type: 'text',
            required: true,
            variant: 'darkBackground',
            value: ''
        },
        {
            ref: useRef(),
            id: 'field_2',
            label: 'Category',
            name: 'Category',
            type: 'select',
            required: true,
            variant: 'darkBackground',
            value: '-1',
            options: CT
        }
    ];

    const AddTest = async (e) => {
        e.preventDefault();

        var valid = SavedTestQuestionFields.reduce((validSoFar, field) => {
            var valid = field.ref.current.value != ''; //Validate the radio buttons
            return validSoFar && valid;
        }, true);

        if (TestFields[1].ref.current.value == '-1' && TestFields[1].ref.current.value.length == 0) {
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
                CreatedBy: session.token.id
            };

            //Check if ID exists in firebase collection for that test
            try {
                await axios({
                    method: 'POST',
                    url: '../../api/firebase/db',
                    data: { MethodName: 'AddNewTest', InputData: { tempDBData, ExtraTestDetails } }
                });
                Swal.close();
                Swal.fire({
                    title: `New test created`,
                    icon: 'success',
                    timer: '2000',
                    showConfirmButton: false
                }).then(() => {
                    Router.push('./ViewTests');
                });
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

    const AddQuestion = async (e) => {
        setOpenNewQuestion(true);
        if (e == 'RadioButton') {
            //enter amount of options
            await setTestQuestionFields([
                { id: 'TestNewQuestionFieldsField_1', label: 'Question', name: 'Question', type: 'text', required: true, variant: 'darkBackground' },
                { id: 'TestNewQuestionFieldsField_2_option1', label: 'Option1', name: 'TestNewQuestion_options', type: 'text', required: true, variant: 'darkBackground' }
            ]);
            document.getElementById('TestNewQuestionFieldsField_1').focus();
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
        if (TestQuestionFields.length > 2) {
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
                    <div className="size_1-of-1 padding-top_medium text-align_center text-color_copper-medium grid grid-wrap padding-large-left_large padding-large-right_large">
                        <div className="grid grid-wrap size_1-of-1" style={{ position: 'relative' }}>
                            <h2 className="size_1-of-1 text-align_center padding-vertical_large">Add Test</h2>
                        </div>

                        {TestFields.map((field, iCount) => {
                            return (
                                <div key={field.id} className="size_1-of-1  padding-around_x-small">
                                    <FormElement ref={field.ref} {...field} />
                                </div>
                            );
                        })}

                        {SavedTestQuestionFields.map((field, iCount) => {
                            return (
                                <>
                                    {iCount % 2 == '0' && device.width >= 860 && <div style={{ height: '2px', backgroundColor: 'var(--color-copper-medium)' }} className="size_1-of-1 margin-vertical_large"></div>}
                                    {device.width < 860 && <div style={{ height: '2px', backgroundColor: 'var(--color-copper-medium)' }} className="size_1-of-1 margin-vertical_large"></div>}
                                    <div key={field.id} className="size_1-of-1  medium-size_1-of-2 large-size_1-of-2  padding-around_x-small">
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
                                <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="Create Test" size="medium" onClick={(e) => AddTest(e)}></Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
