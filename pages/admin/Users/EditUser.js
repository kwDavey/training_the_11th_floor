import { Banner, Header, Circlecontent, Buttonsection, Footer, FormElement, Button } from '@Components';
import Head from 'next/head';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import axios from 'axios';
import ViewPerUser from '../../../components/viewPerUser/viewPerUser.component';

export default function EditUser(props) {
    const router = useRouter();
    const [OGData, setOGData] = useState(null);

    const [testData, setTestData] = useState([]);

    const [activeTestName, setActiveTestName] = useState(null);

    const [activeTestPK, setActiveTestPK] = useState('');

    const archiveUser = async () => {
        if (OGData.Group == 'Admin') {
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "you can't archive admins",
                showConfirmButton: true,
                confirmButtonText: 'Close',
                confirmButtonColor: '#DE7E49',
                buttonsStyling: true
            });
        }
        Swal.fire({
            title: 'Are you sure you want to archive this user',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Archiving...',
                    showConfirmButton: false,
                    toast: true,
                    willOpen: () => {
                        Swal.showLoading();
                    }
                });
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
                        data: { MethodName: 'archiveUser', InputData: { userPK: OGData.UserPK } }
                    })
                ).data;
                if (tempResponse.success) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        timer: '2000'
                    });
                    router.push(
                        {
                            pathname: '/admin/Admin/',
                            query: { tab: 'users' }
                        },
                        '/admin/Admin'
                    );
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        timer: '2000'
                    });
                }
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
        if (!router || !router.query || router.query.UserPK == undefined) {
            router.push(
                {
                    pathname: '/admin/Admin/',
                    query: { tab: 'users' }
                },
                '/admin/Admin'
            );
        } else {
            getUserData();
        }
    }, []);

    const [UserPK, setUserPK] = useState();

    const getUserData = async () => {
        Swal.fire({
            title: 'Loading...',
            showConfirmButton: false,
            toast: true,
            willOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            var optionsState = [];
            let response = (
                await axios({
                    method: 'POST',
                    url: '../../api/firebase/db',
                    data: { MethodName: 'getAllGroups' }
                })
            ).data;

            let result = [];
            for (let item in response) {
                result.push({
                    label: response[item].Name,
                    value: response[item].id
                });
            }
            optionsState = result;

            var tempResponse = (
                await axios({
                    method: 'POST',
                    url: '../../api/firebase/db',
                    data: { MethodName: 'GetUserSpecificDetails', InputData: router.query.UserPK }
                })
            ).data;

            setUserPK(tempResponse.UserPK);

            setUserFields([
                { id: 'UserField_1', label: 'First Name', name: 'FName', type: 'text', required: true, variant: 'darkBackground', value: tempResponse.FName },
                { id: 'UserField_2', label: 'Last Name', name: 'LName', type: 'text', required: true, variant: 'darkBackground', value: tempResponse.LName },
                { id: 'UserField_3', label: 'ID / Passport Number', name: 'IDNumber', type: 'text', required: true, variant: 'darkBackground', value: tempResponse.IDNumber },
                { id: 'UserField_4', label: 'Cell (+27_______)', name: 'CellNumber', type: 'text', required: true, variant: 'darkBackground', value: tempResponse.Cell },
                { id: 'UserField_5', label: 'Email', name: 'Email', type: 'text', required: true, variant: 'darkBackground', value: tempResponse.Email },
                {
                    id: 'UserField_6',
                    label: 'Group',
                    name: 'Group',
                    type: 'select',
                    required: true,
                    variant: 'darkBackground',
                    options: optionsState,
                    value: tempResponse.Group
                }
            ]);
            Swal.close();
            setOGData(tempResponse);
        } catch (err) {
            console.log(err);
        }
    };

    const UpdateUser = async (e) => {
        e.preventDefault();
        var valid = true;

        UserFields.forEach((element) => {
            if (document.getElementById(element.id).value == '') {
                valid = false;
            }
        });

        if (document.getElementById(UserFields[3].id).value.toString().startsWith('+27') == false || document.getElementById(UserFields[3].id).value.toString().length != 12) {
            valid = false;
        }

        if (document.getElementById(UserFields[2].id).value.toString().length != 13) {
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

            var UserDetails = {
                ['Contact-Details']: {
                    Cell: document.getElementById(UserFields[3].id).value,
                    Email: document.getElementById(UserFields[4].id).value
                },
                ['Personal-Details']: {
                    FName: document.getElementById(UserFields[0].id).value,
                    LName: document.getElementById(UserFields[1].id).value,
                    ID: document.getElementById(UserFields[2].id).value
                },
                Group: document.getElementById(UserFields[5].id).value
            };

            //Check if ID exists in firebase collection for that test
            try {
                await axios({
                    method: 'POST',
                    url: '../../api/firebase/db',
                    data: { MethodName: 'EditDBUser', InputData: { UserDetails, UserPK } }
                });
                Swal.close();
                Swal.fire({
                    title: `User details updated`,
                    icon: 'success',
                    timer: '1500',
                    showConfirmButton: false
                }).then(() => {
                    router.push(
                        {
                            pathname: '/admin/Admin/',
                            query: { tab: 'users' }
                        },
                        '/admin/Admin'
                    );
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
                text: 'Please check the entered data and try again.',
                showConfirmButton: true,
                confirmButtonText: 'Okay',
                confirmButtonColor: '#DE7E49',
                buttonsStyling: true
            });
        }
    };

    const [UserFields, setUserFields] = useState([]);

    const Cancel = (e) => {
        e.preventDefault();
        Swal.fire({
            title: `Confirm cancel`,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then(async (result) => {
            if (result.isConfirmed) {
                router.push(
                    {
                        pathname: '/admin/Admin/',
                        query: { tab: 'users' }
                    },
                    '/admin/Admin'
                );
            }
        });
    };

    const ResetUser = (e) => {
        e.preventDefault();
        Swal.fire({
            title: `Confirm reset`,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await setUserFields(null);
                Swal.fire({
                    title: 'Resetting...',
                    showConfirmButton: false,
                    toast: true,
                    willOpen: () => {
                        Swal.showLoading();
                    }
                });

                var optionsState = [];
                let response = (
                    await axios({
                        method: 'POST',
                        url: '../../api/firebase/db',
                        data: { MethodName: 'getAllGroups' }
                    })
                ).data;

                for (let item in response) {
                    optionsState.push({
                        label: response[item].Name,
                        value: response[item].id
                    });
                }

                setUserFields([
                    { id: 'UserField_1', label: 'First Name', name: 'FName', type: 'text', required: true, variant: 'darkBackground', value: OGData.FName },
                    { id: 'UserField_2', label: 'Last Name', name: 'LName', type: 'text', required: true, variant: 'darkBackground', value: OGData.LName },
                    { id: 'UserField_3', label: 'ID / Passport Number', name: 'IDNumber', type: 'text', required: true, variant: 'darkBackground', value: OGData.IDNumber },
                    { id: 'UserField_4', label: 'Cell (+27_______)', name: 'CellNumber', type: 'text', required: true, variant: 'darkBackground', value: OGData.Cell },
                    { id: 'UserField_5', label: 'Email', name: 'Email', type: 'text', required: true, variant: 'darkBackground', value: OGData.Email },
                    {
                        id: 'UserField_6',
                        label: 'Group',
                        name: 'Group',
                        type: 'select',
                        required: true,
                        variant: 'darkBackground',
                        value: OGData.Group,
                        options: optionsState
                    }
                ]);

                Swal.close();
            }
        });
    };


    return (
        <>
            <div className="section">
                <div className="section-content grid grid-wrap">
                    <Header activeTab="Admin"></Header>
                    <div className="size_1-of-1 text-align_center text-color_copper-medium grid grid-wrap  padding-top_large">
                        <h2 className="size_1-of-1 text-align_center padding-vertical_large">Edit User</h2>
                        <div className="size_1-of-1 padding-bottom_xxx-large padding-top_medium" style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className="size_1-of-1 grid grid-wrap" style={{ maxWidth: '600px' }}>
                                {UserFields &&
                                    UserFields.map((field, iCount) => {
                                        return (
                                            <div key={field.id} className="size_1-of-1 large-size_1-of-2 padding-around_x-small">
                                                <FormElement ref={field.ref} {...field} />
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>

                        <div className="size_1-of-1 large-size_1-of-4 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
                            <div className="padding-horizontal_small size_1-of-1">
                                <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="cancel" size="fill" onClick={(e) => Cancel(e)}></Button>
                            </div>
                        </div>
                        <div className="size_1-of-1 large-size_1-of-4 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
                            <div className="padding-horizontal_small size_1-of-1">
                                <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="archive" size="fill" onClick={(e) => archiveUser(e)}></Button>
                            </div>
                        </div>
                        <div className="size_1-of-1 large-size_1-of-4 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
                            <div className="padding-horizontal_small size_1-of-1">
                                <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="reset" size="fill" onClick={(e) => ResetUser(e)}></Button>
                            </div>
                        </div>
                        <div className="size_1-of-1 large-size_1-of-4 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
                            <div className="padding-horizontal_small size_1-of-1">
                                <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="Save" size="fill" onClick={(e) => UpdateUser(e)}></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
