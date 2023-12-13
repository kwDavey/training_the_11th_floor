import { Banner, Header, Circlecontent, Buttonsection, Footer, Button, Modal } from '@Components';
import { WindowSize } from '@Modules';
import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import Swal from 'sweetalert2';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import FormElement from 'components/form/form-element';
export default function ViewUser() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [selectedStyle, setSelectedStyle] = useState({});
    const [unSelectedStyle, setUnselectedStyle] = useState({});
    const [buttonState, setButtonState] = useState(0);
    const [SelectedGroupStyles, setSelectedGroupStyles] = useState({});

    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({});

    const [constunSelectedUsersToSendTestTo, setConstunSelectedUsersToSendTestTo] = useState([]);
    const [constSelectedUsersToSendTestTo, setConstSelectedUsersToSendTestTo] = useState([]);
    const [SelectedTestToSend, setSelectedTestToSend] = useState({});
    const [VersionField, setVersionField] = useState();
    const [unselectedGroupData, setUnselectedGroupData] = useState([]);
    const [selectedGroupData, setSelectedGroupData] = useState([]);

    const onlyShowSelected = () => {
        if (constSelectedUsersToSendTestTo.length == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Missing information.',
                text: 'No users selected',
                showConfirmButton: true,
                confirmButtonText: 'Okay',
                confirmButtonColor: '#DE7E49',
                buttonsStyling: true
            });
        } else {
            setSelectedStyle({ height: 'min-content', zIndex: '1' });
            setUnselectedStyle({ transform: 'scale(0)', transition: 'all 1s', width: '0px', height: '0px', opacity: '0' });
            setButtonState(1);
            if (selectedGroupData.length == 0) {
                setSelectedGroupStyles({ display: 'none' });
            }
        }
    };
    const UnOnlyShowSelected = () => {
        setSelectedStyle({});
        setUnselectedStyle({});
        setSelectedGroupStyles({});
        setButtonState(0);
    };

    const viewQuestions = async () => {
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
                url: '../../api/firebase/db',
                data: { MethodName: 'GetAllDetailOfTestToEdit', InputData: { TestPK: router.query.TestPK, LatestVersion: SelectedTestToSend.LatestVersion } }
            })
        ).data;

        var tempQuestions = [];

        tempResponse.forEach((element, iCounter) => {
            tempQuestions.push({ id: 'TestQuestionFieldsField_' + iCounter, label: element.Question, name: 'TestNewQuestion' + iCounter, type: element.Type, required: true, variant: 'darkBackground', options: element.Options, value: element.CorrectAnswer, readOnly: true });
        });

        setModalData({
            TestName: SelectedTestToSend.TestName,
            Version: SelectedTestToSend.LatestVersion,
            SavedTestQuestionFields: tempQuestions,
            TestFields: [],
            VersionField: FieldInputs
        });
        setShowModal(true);
        Swal.close();
    };

    const FieldInputs = {
        ref: useRef(),
        id: 'field_MaximumAmountOfAttempts',
        label: '',
        name: 'MaximumAmountOfAttempts',
        type: 'select',
        required: true,
        variant: 'darkBackground',
        value: 1,
        options: [
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4', label: '4' },
            { value: '5', label: '5' }
        ]
    };

    const ExpiryTimeInputs = [
        {
            ref: useRef(),
            id: 'field_Hours',
            label: '',
            name: 'ExpiryHours',
            type: 'select',
            required: true,
            variant: 'darkBackground',
            value: '10',
            options: [
                { value: '00', label: '00' },
                { value: '01', label: '01' },
                { value: '02', label: '02' },
                { value: '03', label: '03' },
                { value: '04', label: '04' },
                { value: '05', label: '05' },
                { value: '06', label: '06' },
                { value: '07', label: '07' },
                { value: '08', label: '08' },
                { value: '09', label: '09' },
                { value: '10', label: '10' },
                { value: '11', label: '11' },
                { value: '12', label: '12' },
                { value: '13', label: '13' },
                { value: '14', label: '14' },
                { value: '15', label: '15' },
                { value: '16', label: '16' },
                { value: '17', label: '17' },
                { value: '18', label: '18' },
                { value: '19', label: '19' },
                { value: '20', label: '20' },
                { value: '21', label: '21' },
                { value: '22', label: '22' },
                { value: '23', label: '23' }
            ]
        },
        {
            ref: useRef(),
            id: 'field_Minutes',
            label: '',
            name: 'ExpiryMinutes',
            type: 'select',
            required: true,
            variant: 'darkBackground',
            value: '00',
            options: [
                { value: '00', label: '00' },
                { value: '15', label: '15' },
                { value: '30', label: '30' },
                { value: '45', label: '45' }
            ]
        }
    ];

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

            var tempQuestions = '';
            tempResponse.forEach((element, iCounter) => {
                tempQuestions += iCounter + 1 + ',';
            });
            var tempDet = SelectedTestToSend;
            tempDet.ActiveQuestions = tempQuestions.substring(0, tempQuestions.length - 1);

            setSelectedTestToSend({ TestPK: router.query.TestPK, LatestVersion: VersionNumber, ActiveQuestions: tempDet.ActiveQuestions, TestName: router.query.TestName });

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
        if (!router || !router.query || router.query.TestPK == undefined || router.query.TestVersion == undefined || router.query.ActiveQuestions == undefined || router.query.TestName == undefined) {
            router.push({
                pathname: '/admin/Tests/ViewTests'
            });
        } else {
            setSelectedTestToSend({ TestPK: router.query.TestPK, LatestVersion: router.query.TestVersion, ActiveQuestions: router.query.ActiveQuestions, TestName: router.query.TestName });
            getUsersToDisplay();
            getGroupsToDisplay();

            var tempOptionsForVersions = [];
            for (let index = 0; index < router.query.TestVersion; index++) {
                tempOptionsForVersions.push({
                    value: Number(index + 1),
                    label: index + 1
                });
            }

            setVersionField({
                ref: React.createRef(),
                id: 'fieldVersions',
                label: '',
                name: 'fieldVersions',
                type: 'select',
                required: true,
                variant: 'darkBackground',
                value: router.query.TestVersion,
                options: tempOptionsForVersions,
                onChange: ChangeTestVersion
            });
        }
    }, []);

    const getGroupsToDisplay = async () => {
        var Groups = (
            await axios({
                method: 'POST',
                url: '../../api/firebase/db',
                data: { MethodName: 'getAllGroups' }
            })
        ).data;
        setUnselectedGroupData(Groups.filter((x) => x.Amount > 0));
        setSelectedGroupData([]);
    };

    const getUsersToDisplay = async () => {
        try {
            var tempResponse = await axios({
                method: 'POST',
                url: '../../api/firebase/db',
                data: { MethodName: 'GetAllUsersToDisplay' }
            });
            setConstSelectedUsersToSendTestTo([]);
            setConstunSelectedUsersToSendTestTo(tempResponse.data);

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

    const SendTestOut = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Loading...',
            showConfirmButton: false,
            toast: true,
            willOpen: () => {
                Swal.showLoading();
            }
        });

        if (constSelectedUsersToSendTestTo.length <= 0 || document.getElementById('ExpiryDateInput').value == '' || FieldInputs.ref.current.value < 1) {
            Swal.fire({
                icon: 'error',
                title: 'Missing information.',
                text: 'Please fill in all required details.',
                showConfirmButton: true,
                confirmButtonText: 'Okay',
                confirmButtonColor: '#DE7E49',
                buttonsStyling: true
            });
            return;
        }

        var tempData = [];
        var usersPKForTest = [];
        var userCellNumbers = '';

        var testDetails = {
            Code: SelectedTestToSend.TestPK,
            Version: VersionField.ref.current.value
        };

        //populating data for each person meant to receive the assessment
        constSelectedUsersToSendTestTo.forEach((element) => {
            usersPKForTest.push(element.UserPK);
            userCellNumbers += element.Cell + ';';
        });

        var tempExpiryDate = new Date(document.getElementById('ExpiryDateInput').value);

        tempExpiryDate.setHours(ExpiryTimeInputs[0].ref.current.value);
        tempExpiryDate.setMinutes(ExpiryTimeInputs[1].ref.current.value);

        try {
            var tempResponse = (
                await axios({
                    method: 'POST',
                    url: '../../api/firebase/db',
                    data: { MethodName: 'DBSendTestOut', InputData: usersPKForTest, testDetails, tempExpiryDate, ActiveQuestions: SelectedTestToSend.ActiveQuestions, MaxAmountOfAttempts: FieldInputs.ref.current.value }
                })
            ).data;

            constSelectedUsersToSendTestTo.forEach((element) => {
                tempData.push({
                    to: element.Email,
                    substitutions: {
                        fname: element.FName,
                        AssessmentLink: 'https://training.the11thfloor.co.za/Take-Test/' + tempResponse,
                        Attempts: FieldInputs.ref.current.value,
                        ExpiryDateTime: tempExpiryDate.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })
                    }
                });
            });

            try {
                //send Mail to staff for assessment
                var tRes = await axios({
                    method: 'POST',
                    url: '../../api/contact/email',
                    data: {
                        details: tempData,
                        EmailURL: 'https://training.the11thfloor.co.za/email-templates/SendAssessmentLink.html'
                    }
                });
            } catch (error) {
                console.error(error);
            }

            var SMSMessage = 'The 11th Floor. Please complete the assessment at the following link: ' + 'https://training.the11thfloor.co.za/Take-Test/' + tempResponse;
            while (SMSMessage.indexOf(' ') != -1) {
                SMSMessage = SMSMessage.replace(' ', '%20');
            }
            SMSMessage += '&numbers=' + userCellNumbers.substring(0, userCellNumbers.length - 1) + ';';
            await axios({
                method: 'POST',
                url: '../../api/contact/sms',
                data: {
                    details: SMSMessage
                }
            });

            Swal.fire({
                title: `Test sent to allocated users.`,
                icon: 'success',
                timer: '1500',
                showConfirmButton: false
            }).then(() => {
                router.push({
                    pathname: '/admin/Tests/ViewTests'
                });
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
    };

    const RemoveUserToSelectedUsers = async (e) => {
        let tempUser = constunSelectedUsersToSendTestTo;
        if (tempUser == '') {
            tempUser = [constSelectedUsersToSendTestTo[e]];
        } else {
            tempUser.push(constSelectedUsersToSendTestTo[e]);
        }

        setConstunSelectedUsersToSendTestTo([...tempUser]);
        setConstSelectedUsersToSendTestTo([...constSelectedUsersToSendTestTo.filter((x) => x !== constSelectedUsersToSendTestTo[e])]);
    };

    const AddUserToSelectedUsers = async (e) => {
        let tempUser = constSelectedUsersToSendTestTo;
        if (tempUser == '') {
            tempUser = [constunSelectedUsersToSendTestTo[e]];
        } else {
            tempUser.push(constunSelectedUsersToSendTestTo[e]);
        }

        setConstSelectedUsersToSendTestTo([...tempUser]);
        setConstunSelectedUsersToSendTestTo([...constunSelectedUsersToSendTestTo.filter((x) => x !== constunSelectedUsersToSendTestTo[e])]);
    };

    const RemoveGroupToSelectedUsers = async (e) => {
        let tempUser = unselectedGroupData;
        if (tempUser == '') {
            tempUser = [selectedGroupData[e]];
        } else {
            tempUser.push(selectedGroupData[e]);
        }

        var temp = constunSelectedUsersToSendTestTo;

        constSelectedUsersToSendTestTo
            .filter((x) => x.GroupPK == selectedGroupData[e].id)
            .forEach((element) => {
                temp.push(element);
            });

        setConstunSelectedUsersToSendTestTo(temp);
        setConstSelectedUsersToSendTestTo([...constSelectedUsersToSendTestTo.filter((x) => x.GroupPK != selectedGroupData[e].id)]);

        setUnselectedGroupData([...tempUser]);
        setSelectedGroupData([...selectedGroupData.filter((x) => x !== selectedGroupData[e])]);
    };

    const AddGroupToSelectedUsers = async (e) => {
        let tempUser = selectedGroupData;
        if (tempUser == '') {
            tempUser = [unselectedGroupData[e]];
        } else {
            tempUser.push(unselectedGroupData[e]);
        }

        var temp = constSelectedUsersToSendTestTo;

        constunSelectedUsersToSendTestTo
            .filter((x) => x.GroupPK == unselectedGroupData[e].id)
            .forEach((element) => {
                temp.push(element);
            });

        setConstSelectedUsersToSendTestTo(temp);
        setConstunSelectedUsersToSendTestTo([...constunSelectedUsersToSendTestTo.filter((x) => x.GroupPK != unselectedGroupData[e].id)]);

        setSelectedGroupData([...tempUser]);
        setUnselectedGroupData([...unselectedGroupData.filter((x) => x !== unselectedGroupData[e])]);
    };

    return (
        <>
            <div className="section">
                <div className="section-content grid grid-wrap">
                    <Header></Header>
                    <div className="size_1-of-1 text-align_center  grid grid-wrap  padding-top_large">
                        <h2 className="size_1-of-1 text-align_center padding-top_large  text-color_copper-medium">Send test</h2>
                        <h3 className="size_1-of-1 text-align_center padding-bottom_large  text-color_copper-medium padding-top_large">{SelectedTestToSend.TestName}</h3>

                        <div className="size_1-of-1 grid grid-wrap">
                            <div className="size_1-of-1 medium-size_1-of-3 large-size_1-of-3 grid grid_vertical">
                                <label className="padding-bottom_small">Expiry Date:</label>
                                <div className="grid grid-wrap size_1-of-1">
                                    <div className="grid size_1-of-2">
                                        <input
                                            type="date"
                                            id="ExpiryDateInput"
                                            className="text-color_black"
                                            style={{ maxWidth: '200px', margin: '5px', width: '100%', minHeight: '39px', textAlign: 'center', position: 'relative' }}
                                            min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}
                                            defaultValue={new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0]}
                                        ></input>
                                    </div>
                                    <div className="grid size_1-of-2">
                                        {ExpiryTimeInputs &&
                                            ExpiryTimeInputs.map &&
                                            ExpiryTimeInputs.map((field, iCount) => {
                                                return (
                                                    <div key={'ExpiryTimeInputs-' + iCount} className="size_1-of-3">
                                                        <FormElement ref={field.ref} {...field} />
                                                    </div>
                                                );
                                            })}
                                    </div>

                                    {/*    <input type="time" id="ExpiryTimeInput" className="text-color_black" style={{ maxWidth: '200px', margin: '5px', width: '100%', minHeight: '39px', textAlign: 'center', position: 'relative' }} defaultValue="10:00"></input> */}
                                </div>
                            </div>

                            <div className="size_1-of-1 medium-size_1-of-3 large-size_1-of-3 grid grid-wrap padding-bottom_large text-align_left grid_align-center  grid_vertical-align-center ">
                                <div className="grid grid_wrap padding-left_large grid_vertical-align-center grid_vertical">
                                    <p className={`text-size_large text-weight_bold size_1-of-2 text-color_white`}>Version: </p>
                                    {VersionField && VersionField.ref && <FormElement ref={VersionField.ref} {...VersionField} />}
                                </div>
                            </div>

                            <div className="size_1-of-1 medium-size_1-of-3 large-size_1-of-3 grid grid-wrap padding-bottom_large text-align_left grid_align-center  grid_vertical-align-center ">
                                <div className="grid grid_wrap  grid_vertical-align-center grid_vertical">
                                    <p className={`text-size_large text-weight_bold size_1-of-1 text-color_white`}>Maximum amount of attempts: </p>
                                    {FieldInputs && FieldInputs.ref && <FormElement ref={FieldInputs.ref} {...FieldInputs} />}
                                </div>
                            </div>
                        </div>
                        <div className="size_1-of-1 grid grid-wrap" style={{ justifyContent: 'center' }}>
                            <div className="size_1-of-1 padding-around_large"></div>

                            <div className="size_1-of-1 medium-size_1-of-2 large-size_1-of-2 grid grid-wrap grid_vertical grid_vertical-align-start padding-horizontal_large" style={unSelectedStyle}>
                                <h3 className="size_1-of-1 text-align_center padding-vertical_large text-color_copper-medium">UN-SELECTED GROUPS</h3>
                                <div id={`TableRow-Headings`} name="tablerow" className="size_1-of-1">
                                    <div className="size_1-of-1 grid grid-wrap padding-bottom_small" style={{ margin: 'auto' }}>
                                        <div className="size_1-of-2" style={{ margin: 'auto' }}>
                                            <p className={`text-size_large text-weight_bold `}>Name</p>
                                        </div>
                                    </div>

                                    <div className="size_1-of-1" style={{ height: '2px', background: '#FFFFFF', maxWidth: '100%', margin: 'auto' }}></div>
                                </div>

                                <div className="size_1-of-1 tblHeight">
                                    {unselectedGroupData &&
                                        unselectedGroupData.map &&
                                        unselectedGroupData.map((field, iCount) => {
                                            return (
                                                <div id={`TableRow-${iCount}`} name="tablerow" key={iCount} className="size_1-of-1 text-color_white" style={{ cursor: 'pointer' }} onClick={(e) => AddGroupToSelectedUsers(iCount)}>
                                                    {iCount != 0 && <div className="size_1-of-1" style={{ height: '1px', background: '#FFFFFF', maxWidth: '100%', margin: 'auto' }}></div>}

                                                    <div className="size_1-of-1 grid grid-wrap" style={{ margin: 'auto' }}>
                                                        <div className="size_1-of-2 padding-around_small" style={{ margin: 'auto' }}>
                                                            <p className={`text-size_medium`}>{field.Name}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                            <div className="size_1-of-1 medium-size_1-of-2 large-size_1-of-2 margin-small-vertical_xx-large grid grid-wrap  grid_vertical grid_vertical-align-start  SelectedGroupsUsers" style={{ ...selectedStyle, ...SelectedGroupStyles }}>
                                <h3 className="size_1-of-1 text-align_center padding-vertical_large text-color_copper-medium">SELECTED GROUPS</h3>
                                <div id={`TableRow-Headings`} name="tablerow" className="size_1-of-1">
                                    <div className="size_1-of-1 grid grid-wrap padding-bottom_small" style={{ margin: 'auto' }}>
                                        <div className="size_1-of-2" style={{ margin: 'auto' }}>
                                            <p className={`text-size_large text-weight_bold `}>Name</p>
                                        </div>
                                    </div>

                                    <div className="size_1-of-1" style={{ height: '2px', background: '#FFFFFF', maxWidth: '100%', margin: 'auto' }}></div>
                                </div>

                                <div className="size_1-of-1 tblHeight">
                                    {selectedGroupData &&
                                        selectedGroupData.map &&
                                        selectedGroupData.map((field, iCount) => {
                                            return (
                                                <div id={`TableRow-${iCount}`} name="tablerow" key={iCount} className="size_1-of-1" style={{ cursor: 'pointer' }} onClick={(e) => RemoveGroupToSelectedUsers(iCount)}>
                                                    {iCount != 0 && <div className="size_1-of-1" style={{ height: '1px', background: '#FFFFFF', maxWidth: '100%', margin: 'auto' }}></div>}
                                                    <div className="size_1-of-1 grid grid-wrap" style={{ margin: 'auto' }}>
                                                        <div className="size_1-of-2 padding-around_small" style={{ margin: 'auto' }}>
                                                            <p className={`text-size_medium`}>{field.Name}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>

                            <div className="size_1-of-1 padding-around_large"></div>

                            <div className="size_1-of-1 medium-size_1-of-2 large-size_1-of-2 grid grid-wrap grid_vertical grid_vertical-align-start padding-horizontal_large" style={unSelectedStyle}>
                                <h3 className="size_1-of-1 text-align_center padding-vertical_large text-color_copper-medium">UN-SELECTED USERS</h3>
                                <div id={`TableRow-Headings`} name="tablerow" className="size_1-of-1">
                                    <div className="size_1-of-1 grid grid-wrap padding-bottom_small" style={{ margin: 'auto' }}>
                                        <div className="size_1-of-2" style={{ margin: 'auto' }}>
                                            <p className={`text-size_large text-weight_bold `}>Full Name</p>
                                        </div>
                                        <div className="size_1-of-2" style={{ margin: 'auto' }}>
                                            <p className={`text-size_large text-weight_bold `}>Group</p>
                                        </div>
                                    </div>

                                    <div className="size_1-of-1" style={{ height: '2px', background: '#FFFFFF', maxWidth: '100%', margin: 'auto' }}></div>
                                </div>

                                <div className="size_1-of-1 tblHeight">
                                    {constunSelectedUsersToSendTestTo &&
                                        constunSelectedUsersToSendTestTo.map &&
                                        constunSelectedUsersToSendTestTo.map((field, iCount) => {
                                            return (
                                                <div id={`TableRow-${iCount}`} name="tablerow" key={iCount} className="size_1-of-1" style={{ cursor: 'pointer' }} onClick={(e) => AddUserToSelectedUsers(iCount)}>
                                                    {iCount != 0 && <div className="size_1-of-1" style={{ height: '1px', background: '#FFFFFF', maxWidth: '100%', margin: 'auto' }}></div>}

                                                    <div className="size_1-of-1 grid grid-wrap" style={{ margin: 'auto' }}>
                                                        <div className="size_1-of-2 padding-around_small" style={{ margin: 'auto' }}>
                                                            <p className={`text-size_medium`}>{field.FName + ' ' + field.LName}</p>
                                                        </div>
                                                        <div className="size_1-of-2 padding-around_small" style={{ margin: 'auto' }}>
                                                            <p className={`text-size_medium`}>{field.Group}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                            <div className="size_1-of-1 medium-size_1-of-2 large-size_1-of-2 grid grid-wrap  margin-small-vertical_xx-large  grid_vertical grid_vertical-align-start  SelectedGroupsUsers " style={selectedStyle}>
                                <h3 className="size_1-of-1 text-align_center padding-vertical_large text-color_copper-medium">SELECTED USERS</h3>
                                <div id={`TableRow-Headings`} name="tablerow" className="size_1-of-1">
                                    <div className="size_1-of-1 grid grid-wrap padding-bottom_small " style={{ margin: 'auto' }}>
                                        <div className="size_1-of-2" style={{ margin: 'auto' }}>
                                            <p className={`text-size_large text-weight_bold `}>Full Name</p>
                                        </div>
                                        <div className="size_1-of-2" style={{ margin: 'auto' }}>
                                            <p className={`text-size_large text-weight_bold `}>Group</p>
                                        </div>
                                    </div>

                                    <div className="size_1-of-1" style={{ height: '2px', background: '#FFFFFF', maxWidth: '100%', margin: 'auto' }}></div>
                                </div>

                                <div className="size_1-of-1 tblHeight">
                                    {constSelectedUsersToSendTestTo &&
                                        constSelectedUsersToSendTestTo.map &&
                                        constSelectedUsersToSendTestTo.map((field, iCount) => {
                                            return (
                                                <div id={`TableRow-${iCount}`} name="tablerow" key={iCount} className="size_1-of-1" style={{ cursor: 'pointer' }} onClick={(e) => RemoveUserToSelectedUsers(iCount)}>
                                                    {iCount != 0 && <div className="size_1-of-1" style={{ height: '1px', background: '#FFFFFF', maxWidth: '100%', margin: 'auto' }}></div>}
                                                    <div className="size_1-of-1 grid grid-wrap" style={{ margin: 'auto' }}>
                                                        <div className="size_1-of-2 padding-around_small" style={{ margin: 'auto' }}>
                                                            <p className={`text-size_medium`}>{field.FName + ' ' + field.LName}</p>
                                                        </div>
                                                        <div className="size_1-of-2 padding-around_small" style={{ margin: 'auto' }}>
                                                            <p className={`text-size_medium`}>{field.Group}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>

                        {buttonState == 0 && (
                            <div className="size_1-of-1 grid  padding-top_xx-large">
                                <div className="size_1-of-1 grid grid_vertical grid-wrap grid_vertical-align-center">
                                    <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="Cancel" size="medium" onClick={(e) => router.push('/admin/Tests/ViewTests')}></Button>
                                </div>
                                <div className="size_1-of-1 grid grid_vertical grid-wrap grid_vertical-align-center">
                                    <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="View Questions" size="medium" onClick={(e) => viewQuestions()}></Button>
                                </div>
                                <div className="size_1-of-1 grid grid_vertical grid-wrap grid_vertical-align-center">
                                    <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="Next" size="medium" onClick={(e) => onlyShowSelected()}></Button>
                                </div>
                            </div>
                        )}
                        {buttonState == 1 && (
                            <div className="size_1-of-1 grid  padding-top_xx-large">
                                <div className="size_1-of-1 grid grid_vertical grid-wrap grid_vertical-align-center">
                                    <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="back" size="medium" onClick={(e) => UnOnlyShowSelected()}></Button>
                                </div>
                                <div className="size_1-of-1 grid grid_vertical grid-wrap grid_vertical-align-center">
                                    <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="View Questions" size="medium" onClick={(e) => viewQuestions()}></Button>
                                </div>
                                <div className="size_1-of-1 grid grid_vertical grid-wrap grid_vertical-align-center">
                                    <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="Send" size="medium" onClick={(e) => SendTestOut(e)}></Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                Page="ViewResults"
                show={showModal}
                onClose={() => {
                    setShowModal(false);
                }}
                data={modalData}
            />
        </>
    );
}
