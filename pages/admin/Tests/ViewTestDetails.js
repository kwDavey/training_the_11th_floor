import { Banner, Header, Circlecontent, Buttonsection, Footer, Button } from '@Components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import FormElement from 'components/form/form-element';
import { WindowSize } from '@Modules';
import { archiveTest } from 'pages/api/firebase/db';

export default function ViewTestDetails() {

    const archiveTest =async () =>{
        Swal.fire({
            title: 'Are you sure you want to archive this test?',
            text:"note archiving this test does not effect any tests sent out.",
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then(async(result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Archiving...',
                    showConfirmButton: false,
                    toast: true,
                    willOpen: () => {
                        Swal.showLoading();
                    }
                });
                var tempResponse = (
                    await axios({
                        method: 'POST',
                        url: '../../api/firebase/db',
                        data: { MethodName: 'archiveTest', InputData: { testPK: router.query.TestPK } }
                    })
                ).data;
                if(tempResponse.success){
                    await Swal.fire({
                        icon:"success",
                        title:"Success",
                        timer:"2000"
                    });
                    router.push("/admin/Tests/ViewTests")
                }else{
                    Swal.fire({
                        icon:"error",
                        title:"Error",
                        timer:"2000"
                    })
                }
            }
        });

    }

    const device = WindowSize();
    const router = useRouter();
    const [constTestDetails, setConstTestDetails] = useState();
    const [SavedTestQuestionFields, setSavedTestQuestionFields] = useState([]);
    const [TestFields, setTestFields] = useState([]);
    const [constEditTestDetails, setConstEditTestDetails] = useState();
    const [VersionField, setVersionField] = useState();
    const [CT, setCT] = useState([]);
    const GetDetailsToEditTest = async (TestDetailsToView) => {
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
                    data: { MethodName: 'GetAllDetailOfTestToEdit', InputData: { TestPK: TestDetailsToView.TestPK, LatestVersion: TestDetailsToView.TestVersion } }
                })
            ).data;

            var tempQuestions = [];
            tempResponse.forEach((element, iCounter) => {
                tempQuestions.push({ id: 'TestQuestionFieldsField_' + iCounter, label: element.Question, name: 'TestNewQuestion' + iCounter, type: element.Type, required: true, variant: 'darkBackground', options: element.Options, value: element.CorrectAnswer, readOnly: true });
            });

            let optionsres = await axios({
                method: 'POST',
                url: '../../api/firebase/db',
                data: { MethodName: 'getCategorys' }
            });

            setSavedTestQuestionFields([...tempQuestions]);
            setTestFields([
                {
                    id: 'field_1',
                    label: 'Name',
                    name: 'Name',
                    type: 'text',
                    required: true,
                    variant: 'darkBackground',
                    value: TestDetailsToView.TestName,
                    readOnly: true
                },
                {
                    id: 'field_1',
                    label: 'Category',
                    name: 'Category',
                    type: 'select',
                    required: true,
                    variant: 'darkBackground',
                    value: TestDetailsToView.CatPK,
                    options: optionsres.data,
                    readOnly: true
                }
            ]);
            var tempOptionsForVersions = [];
            for (let index = 0; index < TestDetailsToView.TestVersion; index++) {
                tempOptionsForVersions.push({
                    value: Number(index + 1),
                    label: index + 1
                });
            }

            setVersionField({
                ref: React.createRef(),
                id: 'fieldVersions',
                label: '',
                name: 'Name',
                type: 'select',
                required: true,
                variant: 'darkBackground',
                value: TestDetailsToView.TestVersion,
                options: tempOptionsForVersions,
                onChange: ChangeTestVersion
            });

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

    const ViewEditTest = () => {
        Swal.fire({
            title: 'Loading...',
            showConfirmButton: false,
            toast: true,
            willOpen: () => {
                Swal.showLoading();
            }
        });
        //Show edit test page
        //GetDetailsToEditTest(router.query);

        router.push(
            {
                pathname: '/admin/Tests/EditTest',
                query: { TestPK: constEditTestDetails.TestPK, CurrentVersion: VersionField.ref.current.value, TestVersion: constEditTestDetails.TestVersion, Category: constEditTestDetails.Category, Name: constEditTestDetails.TestName }
            },
            '/admin/Tests/EditTest'
        );
    };

    const ChangeTestVersion = async (VersionNumber) => {
        //Load details for specified version and not latest version
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
                    data: { MethodName: 'GetAllDetailOfTestToEdit', InputData: { TestPK: router.query.TestPK, LatestVersion: VersionNumber } }
                })
            ).data;

            var tempQuestions = [];
            tempResponse.forEach((element, iCounter) => {
                tempQuestions.push({ id: 'TestQuestionFieldsField_' + iCounter, label: element.Question, name: 'TestNewQuestion' + iCounter, type: element.Type, required: true, variant: 'darkBackground', options: element.Options, value: element.CorrectAnswer, readOnly: true });
            });
            let optionsres = await axios({
                method: 'POST',
                url: '../../api/firebase/db',
                data: { MethodName: 'getCategorys' }
            });
            setSavedTestQuestionFields([...tempQuestions]);
            setTestFields([
                {
                    id: 'field_1',
                    label: 'Name',
                    name: 'Name',
                    type: 'text',
                    required: true,
                    variant: 'darkBackground',
                    value: router.query.TestName,
                    readOnly: true
                },
                {
                    id: 'field_1',
                    label: 'Category',
                    name: 'Category',
                    type: 'select',
                    required: true,
                    variant: 'darkBackground',
                    value: router.query.Category,
                    options: optionsres.data,
                    readOnly: true
                }
            ]);

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

    useEffect(() => {
        Swal.fire({
            title: 'Loading...',
            showConfirmButton: false,
            toast: true,
            willOpen: () => {
                Swal.showLoading();
            }
        });
        if (!router || !router.query || router.query.TestPK == undefined || router.query.TestVersion == undefined || router.query.TestName == undefined) {
            router.push({
                pathname: '/admin/Tests/ViewTests'
            });
        } else {
            GetDetailsToEditTest(router.query);
        }
    }, []);

    return (
        <>
            <div className="section">
                <div className="section-content grid grid-wrap text-color_copper-medium">
                    <Header></Header>
                    <div className="size_1-of-1 grid grid-wrap  padding-top_large">
                        <h2 className="size_1-of-1 text-align_center padding-vertical_large">
                            VIEWING: <span className="text-size_xx-large text-color_white">{constEditTestDetails?.TestName}</span>
                        </h2>
                    </div>
                    <div className="size_1-of-1 text-align_center grid grid-wrap">
                        <div className="size_1-of-1 grid grid-wrap padding-bottom_large text-align_left grid_align-center  grid_vertical-align-center ">
                            <div className="grid grid_wrap padding-left_large grid_vertical-align-center">
                                <p className={`text-size_large text-weight_bold size_1-of-2 text-color_white`}>Version: </p>
                                {VersionField && VersionField.ref && <FormElement ref={VersionField.ref} {...VersionField} />}
                            </div>
                        </div>

                        <div className="grid grid-wrap size_1-of-1 padding-large-left_large padding-large-right_large">
                            {TestFields &&
                                TestFields.map((field, iCount) => {
                                    return (
                                        <div key={iCount} className="size_1-of-1 medium-size_1-of-2 large-size_1-of-2  padding-around_x-small">
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
                                                <p className="text-color_white">Question {iCount + 1}</p>
                                            </div>
                                            <FormElement ref={field.ref} {...field} />
                                        </div>

                                        {iCount % 2 == '0' && device.width >= 860 && <div style={{ width: '2px', backgroundColor: 'var(--color-copper-medium)', margin: '-2px' }} className="margin-vertical_large"></div>}
                                    </>
                                );
                            })}
                        </div>

                        <div className="size_1-of-1 grid grid-wrap grid grid-wrap grid_vertical-align-center grid_align-center padding-top_large">
                            <div className="size_1-of-1 medium-size_1-of-4">
                                <Button
                                    ID="myBtn"
                                    variant="CopperBackgroundLight"
                                    type="button"
                                    label="Back"
                                    size="medium"
                                    onClick={(e) => {
                                        router.push(
                                            {
                                                pathname: '/admin/Tests/ViewTests'
                                            },
                                            '/admin/Tests/ViewTests'
                                        );
                                    }}
                                ></Button>
                            </div>
                            <div className="size_1-of-1 medium-size_1-of-4 padding-vertical_x-large">
                                <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="Archive" size="medium" onClick={(e) => archiveTest(e)}></Button>
                            </div>
                            <div className="size_1-of-1 medium-size_1-of-4 padding-vertical_x-large">
                                <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="Edit" size="medium" onClick={(e) => ViewEditTest(e)}></Button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
