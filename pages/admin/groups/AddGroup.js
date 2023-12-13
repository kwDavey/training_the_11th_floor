import { Banner, Header, Circlecontent, Buttonsection, Footer, FormElement, Button } from '@Components';
import Head from 'next/head';
import React, { useEffect, useState, useRef } from 'react';
import { GetAllUsersToDisplay } from '@Modules';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useRouter } from 'next/router';
export default function AddGroup() {
    const router = useRouter();

    const [EditFlields, setEditFields] = useState([{ id: 'UserField_1', label: 'New group name', name: 'FName', type: 'text', required: true, variant: 'darkBackground', value: '' }]);

    const createGroup = async () => {
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
                    data: { MethodName: 'newGroup', InputData: document.getElementById('UserField_1').value }
                })
            ).data;
            if (tempResponse) {
                Swal.fire({
                    title: `New group created`,
                    icon: 'success',
                    timer: '2000',
                    showConfirmButton: false
                }).then(() => {
                    router.push(
                        {
                            pathname: '/admin/Admin/',
                            query: { tab: 'groups' }
                        },
                        '/admin/Admin'
                    );
                });
            } else {
                Swal.fire({
                    title: 'there was an error creating group.',
                    icon: 'error',
                    timer: '2000'
                });
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    useEffect(() => {
        Swal.close();
    }, []);

    return (
        <>
            <div className="section">
                <div className="section-content grid grid-wrap  text-color_copper-medium">
                    <Header activeTab="Admin"></Header>
                    <>
                        <div className="size_1-of-1 grid grid-wrap  padding-top_large">
                            <h2 className="size_1-of-1 text-align_center padding-vertical_large">New group</h2>
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

                        <div className="size_1-of-1 large-size_1-of-2 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
                            <Button
                                ID="myBtn"
                                variant="CopperBackgroundLight"
                                type="button"
                                label="cancel"
                                size="medium"
                                onClick={(e) => {
                                    Swal.fire({
                                        title: 'Confirm cancel',
                                        showCancelButton: true,
                                        confirmButtonText: 'Yes',
                                        cancelButtonText: 'No'
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
                                }}
                            ></Button>
                        </div>
                        <div className="size_1-of-1 large-size_1-of-2 grid grid_vertical grid-wrap grid_vertical-align-center  padding-top_large">
                            <Button
                                ID="myBtn"
                                variant="CopperBackgroundLight"
                                type="button"
                                label="Create group"
                                size="medium"
                                onClick={(e) => {
                                    createGroup(e);
                                }}
                            ></Button>
                        </div>
                    </>
                </div>
            </div>
        </>
    );
}
