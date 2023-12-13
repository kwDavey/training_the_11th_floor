import { Banner, Header, Circlecontent, Buttonsection, Footer, Modal, Button } from '@Components';
import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import FormElement from 'components/form/form-element';
export default function ViewUser() {
    const router = useRouter();
    const [EditFields, setEditFields] = useState([{ ref: useRef(), id: 'UserField_1', label: 'New category name', name: 'FName', type: 'text', required: true, variant: 'darkBackground', value: '' }]);

    const createCategory = async (e) => {
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
                        data: { MethodName: 'newCategory', InputData: EditFields[0].ref.current.value }
                    })
                ).data;

                if (tempResponse) {
                    Swal.fire({
                        title: `New category created`,
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
                Swal.close();
                console.error(e);
                return false;
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

    useEffect(() => {
        Swal.close();
    }, []);
    return (
        <>
            <div className="section">
                <div className="section-content grid grid-wrap">
                    <Header activeTab="Admin"></Header>

                    <div className="size_1-of-1 text-align_center text-color_copper-medium grid grid-wrap padding-top_large" style={{ position: 'relative' }}>
                        <div className="grid grid-wrap size_1-of-1" style={{ position: 'relative' }}>
                            <h2 className="size_1-of-1 text-align_center padding-vertical_large">Add Category</h2>
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

                    <div className="size_1-of-1 large-size_1-of-2 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
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
                    <div className="size_1-of-1 large-size_1-of-2 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
                        <Button
                            ID="myBtn"
                            variant="CopperBackgroundLight"
                            type="button"
                            label="Create"
                            size="medium"
                            onClick={(e) => {
                                createCategory(e);
                            }}
                        ></Button>
                    </div>
                </div>
            </div>
        </>
    );
}
