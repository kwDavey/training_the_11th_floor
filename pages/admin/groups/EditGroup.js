import { Banner, Header, Circlecontent, Buttonsection, Footer, FormElement, Button } from '@Components';
import Head from 'next/head';
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import axios from 'axios';
export default function EditGroup() {
    const router = useRouter();
    const [group, setGroup] = useState(null);
    const [EditFlields, setEditFields] = useState([]);
    const [DefEditFlields, setDefEditFields] = useState([]);

    const [optionsGroups, setoptionsGroups] = useState([]);

    const [allocateTo, setAllocateTo] = useState('null');
    const [showArchive, setShowArchive] = useState(false);

    const getGroups = async () => {
        let response = (
            await axios({
                method: 'POST',
                url: '../../api/firebase/db',
                data: { MethodName: 'getAllGroups' }
            })
        ).data;
        let result = [{ label: 'please select', value: 'null' }];
        for (let item of response) {
            if (item.id != router?.query?.id) {
                result.push({
                    label: item.Name,
                    value: item.id
                });
            }
        }
        setoptionsGroups(result);
        Swal.close();
    };

    const Archive = async () => {
        if (allocateTo == 'null') {
            await Swal.fire({
                icon: '',
                title: 'Please select a group',
                timer: '2000'
            });
        } else {
            Swal.fire({
                title: 'Are you sure you want to archive this group?',
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
                    var tempResponse = (
                        await axios({
                            method: 'POST',
                            url: '../../api/firebase/db',
                            data: { MethodName: 'archiveGroup', InputData: { groupPK: router?.query?.id, allocateTo } }
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
                                query: { tab: 'groups' }
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
        }
    };

    useEffect(() => {
        if (!router?.query?.Name || !router?.query?.id) {
            router.push(
                {
                    pathname: '/admin/Admin/',
                    query: { tab: 'groups' }
                },
                '/admin/Admin'
            );
        }
        setGroup({
            Name: router?.query?.Name,
            id: router?.query?.id
        });

        setEditFields([{ id: 'UserField_1', label: 'Group name', name: 'FName', type: 'text', required: true, variant: 'darkBackground', value: router?.query?.Name }]);
        setDefEditFields([{ id: 'UserField_1', label: 'Group name', name: 'FName', type: 'text', required: true, variant: 'darkBackground', value: router?.query?.Name }]);

        Swal.close();
        getGroups();
    }, []);

    const Reset = (e) => {
        e.preventDefault();
        Swal.fire({
            title: `Confirm reset`,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await setEditFields(null);
                setEditFields(DefEditFlields);
            }
        });
    };

    const SaveGroup = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Loading...',
            showConfirmButton: false,
            toast: true,
            willOpen: () => {
                Swal.showLoading();
            }
        });
        let response = (
            await axios({
                method: 'POST',
                url: '../../api/firebase/db',
                data: {
                    MethodName: 'updateGroup',
                    InputData: {
                        id: group.id,
                        Name: document.getElementById('UserField_1').value
                    }
                }
            })
        ).data;
        if (response) {
            router.push(
                {
                    pathname: '/admin/Admin/',
                    query: { tab: 'groups' }
                },
                '/admin/Admin'
            );
        } else {
            Swal.fire({
                title: 'there was an error saving group',
                icon: 'error',
                timer: '2000'
            });
        }
    };

    const Cancel = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Confirm cancel',
            showCancelButton: true,
            confirmButtonText: 'yes',
            cancelButtonText: 'no'
        }).then(async (result) => {
            if (result.isConfirmed) {
                router.push(
                    {
                        pathname: '/admin/Admin/',
                        query: { tab: 'groups' }
                    },
                    '/admin/Admin'
                );
            }
        });
    };

    return (
        <>
            <div className="section">
                <div className="section-content grid grid-wrap  text-color_copper-medium">
                    <Header activeTab="Admin"></Header>
                    {(!showArchive && (
                        <>
                            <div className="size_1-of-1 grid grid-wrap  padding-top_large">
                                <h2 className="size_1-of-1 text-align_center padding-vertical_large">Edit Group</h2>
                            </div>
                            <div className="size_1-of-1 padding-top_medium" style={{ display: 'flex', justifyContent: 'center' }}>
                                <div className="size_1-of-1 grid grid-wrap" style={{ maxWidth: '600px' }}>
                                    {EditFlields &&
                                        EditFlields.map((field) => {
                                            return (
                                                <div key={field.id} className="size_1-of-1 large-size_1-of-1  padding-around_x-small">
                                                    <FormElement ref={field.ref} {...field} />
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>

                            <div className="size_1-of-4 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
                                <Button
                                    ID="myBtn"
                                    variant="CopperBackgroundLight"
                                    type="button"
                                    label="cancel"
                                    size="medium"
                                    onClick={(e) => {
                                        Cancel(e);
                                    }}
                                ></Button>
                            </div>
                            <div className="size_1-of-4 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
                                <Button
                                    ID="myBtn"
                                    variant="CopperBackgroundLight"
                                    type="button"
                                    label="Archive"
                                    size="medium"
                                    onClick={(e) => {
                                        setShowArchive(true);
                                    }}
                                ></Button>
                            </div>
                            <div className="size_1-of-4 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
                                <Button
                                    ID="myBtn"
                                    variant="CopperBackgroundLight"
                                    type="button"
                                    label="reset"
                                    size="medium"
                                    onClick={(e) => {
                                        Reset(e);
                                    }}
                                ></Button>
                            </div>
                            <div className="size_1-of-4 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
                                <Button
                                    ID="myBtn"
                                    variant="CopperBackgroundLight"
                                    type="button"
                                    label="Save"
                                    size="medium"
                                    onClick={(e) => {
                                        SaveGroup(e);
                                    }}
                                ></Button>
                            </div>
                        </>
                    )) || (
                        <>
                            <div className="size_1-of-1 text-align_center text-color_copper-medium grid grid-wrap  padding-top_large" style={{ position: 'relative' }}>
                                <h2 className="size_1-of-1 text-align_center padding-vertical_large">
                                    Archive Group: <span className="text-size_xx-large text-color_white">{group.name}</span>
                                </h2>
                                <div className="size_1-of-1 text-align_center ">
                                    <p className={`text-size_large text-weight_bold text-align_center`} style={{ color: 'white' }}>
                                        Please select a group to allocate users listed with category &apos;{group.Name}&apos;
                                    </p>
                                </div>
                                <div className="grid size_1-of-1 padding-top_large">
                                    <div className="margin-around_auto">
                                        <FormElement
                                            onChange={(value) => {
                                                setAllocateTo(value);
                                            }}
                                            id="UserField_7"
                                            label="Group"
                                            name="Group"
                                            type="select"
                                            variant="darkBackground"
                                            options={optionsGroups}
                                            value="All"
                                        ></FormElement>
                                    </div>
                                </div>
                                <div className="padding-top_xx-large size_1-of-1 grid">
                                    <div className="grid margin-around_auto" style={{ width: '350px' }}>
                                        <Button
                                            variant="CopperBackgroundLight"
                                            type="button"
                                            label={`Cancel`}
                                            size="fill"
                                            onClick={(e) => {
                                                setShowArchive(false);
                                            }}
                                        ></Button>
                                    </div>
                                    <div className="grid margin-around_auto" style={{ width: '350px' }}>
                                        <Button
                                            variant="CopperBackgroundLight"
                                            type="button"
                                            label={`Archive`}
                                            size="fill"
                                            onClick={(e) => {
                                                Archive();
                                            }}
                                        ></Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
