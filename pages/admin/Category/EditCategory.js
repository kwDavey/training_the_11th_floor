import { Banner, Header, Circlecontent, Buttonsection, Footer, Modal, Button } from '@Components';
import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import FormElement from 'components/form/form-element';
import { archiveGroup } from 'pages/api/firebase/db';
export default function ViewUser() {
    const router = useRouter();
    const [EditFields, setEditFields] = useState([{ ref: useRef(), id: 'UserField_1', label: 'New category name', name: 'FName', type: 'text', required: true, variant: 'darkBackground', value: router.query.label }]);

    const [showArchive, setShowArchive] = useState(false);

    const [optionsCategories, setoptionsCategories] = useState([]);

    const [allocateTo, setAllocateTo] = useState('null');

    const Archive = async () => {
        if (allocateTo == 'null') {
            await Swal.fire({
                icon: '',
                title: 'Please select a category',
                timer: '2000'
            });
        } else {
            Swal.fire({
                title: 'Are you sure you want to archive this category',
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
                            data: { MethodName: 'archiveCategory', InputData: { categoryPK: router.query.CatPK, categoryPK: router.query.CatPK, allocateTo } }
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
                                query: { tab: 'categories' }
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

    const updateCategory = async (e) => {
        e.preventDefault();

        var valid = EditFields.reduce((validSoFar, field) => {
            var valid = field.ref.current.reportValidity();
            return validSoFar && valid;
        }, true);

        if (valid) {
            try {
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
                        data: { MethodName: 'updateCategory', InputData: EditFields[0].ref.current.value, CatPK: router.query.CatPK }
                    })
                ).data;
                if (tempResponse) {
                    Swal.fire({
                        title: `Category updated`,
                        icon: 'success',
                        timer: '2000',
                        showConfirmButton: false
                    }).then(() => {
                        router.push(
                            {
                                pathname: '/admin/Admin/',
                                query: { tab: 'categories' }
                            },
                            '/admin/Admin'
                        );
                    });
                } else {
                    Swal.fire({
                        title: 'there was an error creating category.',
                        icon: 'error',
                        timer: '2000'
                    });
                }
            } catch (e) {
                console.error(e);
                return false;
            }

            Swal.close();
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
                        query: { tab: 'categories' }
                    },
                    '/admin/Admin'
                );
            }
        });
    };

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
                setEditFields([{ id: 'UserField_1', label: 'New category name', name: 'FName', type: 'text', required: true, variant: 'darkBackground', value: router.query.label }]);
            }
        });
    };

    useEffect(() => {
        if (!router?.query?.label) {
            router.push(
                {
                    pathname: '/admin/Admin/',
                    query: { tab: 'categories' }
                },
                '/admin/Admin'
            );
        }
        Swal.close();
        axios({
            method: 'POST',
            url: '/api/firebase/db',
            data: { MethodName: 'getCategorys' }
        }).then((response) => {
            var categories = [
                {
                    value: 'null',
                    label: 'Please select'
                }
            ];

            for (let category of response.data) {
                if (category.label != router.query.label) {
                    categories.push(category);
                }
            }

            setoptionsCategories(categories);
        });
    }, []);

    return (
        <>
            <div className="section">
                <div className="section-content grid grid-wrap">
                    <Header activeTab="Admin"></Header>
                    {(!showArchive && (
                        <>
                            <div className="size_1-of-1 text-align_center text-color_copper-medium grid grid-wrap  padding-top_large" style={{ position: 'relative' }}>
                                <div className="grid grid-wrap size_1-of-1" style={{ position: 'relative' }}>
                                    <h2 className="size_1-of-1 text-align_center padding-vertical_large">Edit Category</h2>
                                </div>
                            </div>
                            <div className="size_1-of-1 padding-top_medium" style={{ display: 'flex', justifyContent: 'center' }}>
                                <div className="size_1-of-1 grid grid-wrap" style={{ maxWidth: '600px' }}>
                                    {EditFields &&
                                        EditFields.map((field) => {
                                            return (
                                                <div key={field.id} className="size_1-of-1 large-size_1-of-1  padding-around_x-small">
                                                    <FormElement ref={field.ref} {...field} />
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                            <div className="size_1-of-1 large-size_1-of-4 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
                                <Button
                                    ID="myBtn"
                                    variant="CopperBackgroundLight"
                                    type="button"
                                    label="cancel"
                                    size="medium"
                                    onClick={(e) => {
                                        Cancel();
                                    }}
                                ></Button>
                            </div>
                            <div className="size_1-of-1 large-size_1-of-4 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
                                <Button
                                    ID="myBtn"
                                    variant="CopperBackgroundLight"
                                    type="button"
                                    label="archive"
                                    size="medium"
                                    onClick={(e) => {
                                        setShowArchive(true);
                                    }}
                                ></Button>
                            </div>
                            <div className="size_1-of-1 large-size_1-of-4 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
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
                            <div className="size_1-of-1 large-size_1-of-4 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
                                <Button
                                    ID="myBtn"
                                    variant="CopperBackgroundLight"
                                    type="button"
                                    label="Update"
                                    size="medium"
                                    onClick={(e) => {
                                        updateCategory(e);
                                    }}
                                ></Button>
                            </div>
                        </>
                    )) || (
                        <>
                            <div className="size_1-of-1 text-align_center text-color_copper-medium grid grid-wrap  padding-top_large" style={{ position: 'relative' }}>
                                <div className="grid grid-wrap size_1-of-1" style={{ position: 'relative' }}>
                                    <h2 className="size_1-of-1 text-align_center padding-vertical_large">
                                        Archive Category: <span className="text-size_xx-large text-color_white">{router.query.label}</span>
                                    </h2>
                                </div>
                                <div className="size_1-of-1 text-align_center ">
                                    <p className={`text-size_large text-weight_bold text-align_center`} style={{ color: 'white' }}>
                                        Please select a category to allocate tests listed with category &apos;{router.query.label}&apos;
                                    </p>
                                </div>

                                <div className="grid size_1-of-1 padding-top_large">
                                    <div className="margin-around_auto">
                                        <FormElement
                                            onChange={(value) => {
                                                setAllocateTo(value);
                                            }}
                                            id="UserField_7"
                                            label="Category"
                                            name="Category"
                                            type="select"
                                            variant="darkBackground"
                                            options={optionsCategories}
                                            value="All"
                                        ></FormElement>
                                    </div>
                                </div>
                                <div className="size_1-of-1 text-align_center ">
                                    <p className={`padding-top_xx-large text-size_medium text-align_center`} style={{ color: 'white' }}>
                                        Note this action cannot effect tests that are already sent.
                                    </p>
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
