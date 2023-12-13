import { Banner, Header, Circlecontent, Buttonsection, Footer, FormElement, Button } from '@Components';
import { WindowSize, AddNewDBUser } from '@Modules';
import Head from 'next/head';
import Swal from 'sweetalert2';
import { useEffect, useState, useRef, use } from 'react';
import { useRouter } from 'next/router';

import { useSession } from 'next-auth/react';

import axios from 'axios';
export default function AddUser() {
    const { data: session, status } = useSession();

    const router = useRouter();

    const [UserValidated, setUserValidated] = useState(false);
    const [constViewUsers, setConstViewUsers] = useState();
    const [optionsState, setOptionsState] = useState([]);
    const AddUserFields = [
        { ref: useRef(), id: 'UserField_1', label: 'First Name', name: 'FName', type: 'text', required: true, variant: 'darkBackground' },
        { ref: useRef(), id: 'UserField_2', label: 'Last Name', name: 'LName', type: 'text', required: true, variant: 'darkBackground' },
        { ref: useRef(), id: 'UserField_3', label: 'ID / Passport Number', name: 'IDNumber', type: 'text', required: true, variant: 'darkBackground' },
        { ref: useRef(), id: 'UserField_4', label: 'Cell (+27_______)', name: 'CellNumber', type: 'text', required: true, variant: 'darkBackground', value: '+27' },
        { ref: useRef(), id: 'UserField_5', label: 'Email', name: 'Email', type: 'text', required: true, variant: 'darkBackground' },
        {
            ref: useRef(),
            id: 'UserField_6',
            label: 'Group',
            name: 'Group',
            type: 'select',
            required: true,
            variant: 'darkBackground',
            value: -1,
            options: optionsState
        }
    ];

    const getGroups = async () => {
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
        setOptionsState(result);
        Swal.close();
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
        getGroups();
    }, []);

    const Cancel = () => {
        Swal.fire({
            title: 'Confirm cancel',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
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

    const AddNewUser = async (e) => {
        e.preventDefault();

        var valid = AddUserFields.reduce((validSoFar, field) => {
            var valid = field.ref.current.reportValidity();
            return validSoFar && valid;
        }, true);

        if (AddUserFields[3].ref.current.value.toString().startsWith('+27') == false || AddUserFields[3].ref.current.value.toString().length != 12) {
            valid = false;
        }

        if (AddUserFields[2].ref.current.value.toString().length != 13) {
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
                    Cell: AddUserFields[3].ref.current.value,
                    Email: AddUserFields[4].ref.current.value
                },
                ['Personal-Details']: {
                    FName: AddUserFields[0].ref.current.value,
                    LName: AddUserFields[1].ref.current.value,
                    ID: AddUserFields[2].ref.current.value,
                    Password: AddUserFields[1].ref.current.value + '-' + AddUserFields[2].ref.current.value
                },
                CreatedBy: session.token.id,
                ['User-Access']: 'User',
                Group: AddUserFields[5].ref.current.value
            };

            try {
                await axios({
                    method: 'POST',
                    url: '../../api/firebase/db',
                    data: { MethodName: 'AddNewDBUser', InputData: UserDetails }
                });
                Swal.close();

                Swal.fire({
                    title: `New user created`,
                    icon: 'success',
                    timer: '2000',
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
    return (
        <>
            <div className="section">
                <div className="section-content grid grid-wrap">
                    <Header activeTab="Admin"></Header>
                    <div className="size_1-of-1 text-align_center text-color_copper-medium grid grid-wrap  padding-top_large">
                        <h2 className="size_1-of-1 text-align_center padding-vertical_large">Add New User</h2>

                        <div className="size_1-of-1 padding-bottom_xxx-large padding-top_medium" style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className="size_1-of-1 grid grid-wrap" style={{ maxWidth: '600px' }}>
                                {AddUserFields.map((field, iCount) => {
                                    return (
                                        <div key={field.id} className="size_1-of-1 large-size_1-of-2  padding-around_x-small">
                                            <FormElement ref={field.ref} {...field} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="grid grid-wrap size_1-of-1">
                            <div className="size_1-of-2 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
                                <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="Cancel" size="medium" onClick={(e) => Cancel(e)}></Button>
                            </div>
                            <div className="size_1-of-2 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
                                <Button ID="myBtn" variant="CopperBackgroundLight" type="button" label="Add User" size="medium" onClick={(e) => AddNewUser(e)}></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
