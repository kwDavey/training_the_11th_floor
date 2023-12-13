import { Header, Button, FormElement } from '@Components';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
export default function Archived() {
    const [allocateTo, setAllocateTo] = React.useState('null');

    const [active, setActive] = React.useState('Tests');

    const [archivedTests, setArchivedTests] = React.useState();

    const [archivedUsers, setArchivedUsers] = React.useState();

    const [archivedCategorys, setArchivedCategorys] = React.useState();

    const [archivedGroups, setArchivedGroups] = React.useState();

    const [optionsGroups, setoptionsGroups] = React.useState([]);
    const [optionsCategorys, setoptionsCategorys] = React.useState([]);

    const [showArchiveTests, setShowArchivedTests] = useState(false);

    const [showUnArchiveUser, setShowUnarchiveUser] = React.useState(false);

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
            result.push({
                label: item.Name,
                value: item.id
            });
        }
        setoptionsGroups(result);
        Swal.close();
    };
    const getCategorys = async () => {
        let response = (
            await axios({
                method: 'POST',
                url: '../../api/firebase/db',
                data: { MethodName: 'getCategorys' }
            })
        ).data;
        setoptionsCategorys([{ label: 'please select', value: 'null' },...response]);
        Swal.close();
    };
    useEffect(() => {
        getGroups();
        getCategorys();
    }, []);

    useEffect(() => {
        (async () => {
            var tempResponse;
            switch (active) {
                case 'Tests':
                    tempResponse = (
                        await axios({
                            method: 'POST',
                            url: '../../api/firebase/db',
                            data: { MethodName: 'getArchivedTests' }
                        })
                    ).data;
                    setArchivedTests(tempResponse);
                    break;
                case 'Groups':
                    tempResponse = (
                        await axios({
                            method: 'POST',
                            url: '../../api/firebase/db',
                            data: { MethodName: 'getArchivedGroups' }
                        })
                    ).data;
                    setArchivedGroups(tempResponse);
                    break;
                case 'Categories':
                    tempResponse = (
                        await axios({
                            method: 'POST',
                            url: '../../api/firebase/db',
                            data: { MethodName: 'getArchivedCategorys' }
                        })
                    ).data;
                    setArchivedCategorys(tempResponse);
                    break;
                case 'Users':
                    tempResponse = (
                        await axios({
                            method: 'POST',
                            url: '../../api/firebase/db',
                            data: { MethodName: 'getArchivedUsers' }
                        })
                    ).data;
                    setArchivedUsers(tempResponse);
                    break;
            }
        })();
    }, [active]);

    const menu = ['Tests', 'Groups', 'Categories', 'Users'];

    const unArchiveTest = async (test) => {
        if (allocateTo == 'null') {
            await Swal.fire({
                icon: '',
                title: 'Please select a category',
                timer: '2000'
            });
        }else{
            Swal.fire({
                title: 'Are you sure you want to unarchive this item',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let tempResponse = (
                        await axios({
                            method: 'POST',
                            url: '../../api/firebase/db',
                            data: { MethodName: 'unArchiveTest', InputData: { testPK: test.TestPK,allocateTo } }
                        })
                    ).data;
                    Swal.fire({
                        title: 'Please wait...',
                        showConfirmButton: false,
                        toast: true,
                        willOpen: () => {
                            Swal.showLoading();
                        }
                    });
                    if (tempResponse.success) {
                        await Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            timer: '2000'
                        });
                        setArchivedTests(
                            (
                                await axios({
                                    method: 'POST',
                                    url: '../../api/firebase/db',
                                    data: { MethodName: 'getArchivedTests' }
                                })
                            ).data
                        );
                        setAllocateTo("null");
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

    const unArchiveUser = async () => {
        if (allocateTo == 'null') {
            await Swal.fire({
                icon: '',
                title: 'Please select a group',
                timer: '2000'
            });
        } else {
            Swal.fire({
                title: 'Are you sure you want to unarchive this item',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then(async (result) => {
                
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Please wait...',
                        showConfirmButton: false,
                        toast: true,
                        willOpen: () => {
                            Swal.showLoading();
                        }
                    });
                    let tempResponse = (
                        await axios({
                            method: 'POST',
                            url: '../../api/firebase/db',
                            data: { MethodName: 'unArchiveUser', InputData: { userPK: showUnArchiveUser.UserPK, groupPK: allocateTo } }
                        })
                    ).data;
                    if (tempResponse.success) {
                        await Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            timer: '2000'
                        });
                        setArchivedUsers(
                            (
                                await axios({
                                    method: 'POST',
                                    url: '../../api/firebase/db',
                                    data: { MethodName: 'getArchivedUsers' }
                                })
                            ).data
                        );
                        setAllocateTo("null");
                        setShowUnarchiveUser(false);
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

    const unArchiveCategory = async (category) => {
        Swal.fire({
            title: 'Are you sure you want to unarchive this item',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Please wait...',
                    showConfirmButton: false,
                    toast: true,
                    willOpen: () => {
                        Swal.showLoading();
                    }
                });
                let tempResponse = (
                    await axios({
                        method: 'POST',
                        url: '../../api/firebase/db',
                        data: { MethodName: 'unArchiveCategory', InputData: { categoryPK: category.value } }
                    })
                ).data;
                if (tempResponse.success) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        timer: '2000'
                    });
                    setArchivedCategorys(
                        (
                            await axios({
                                method: 'POST',
                                url: '../../api/firebase/db',
                                data: { MethodName: 'getArchivedCategorys' }
                            })
                        ).data
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

    const unArchiveGroup = async (group) => {
        Swal.fire({
            title: 'Are you sure you want to unarchive this item',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Please wait...',
                    showConfirmButton: false,
                    toast: true,
                    willOpen: () => {
                        Swal.showLoading();
                    }
                });
                let tempResponse = (
                    await axios({
                        method: 'POST',
                        url: '../../api/firebase/db',
                        data: { MethodName: 'unArchiveGroup', InputData: { groupPK: group.id } }
                    })
                ).data;
                if (tempResponse.success) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        timer: '2000'
                    });
                    setArchivedGroups(
                        (
                            await axios({
                                method: 'POST',
                                url: '../../api/firebase/db',
                                data: { MethodName: 'getArchivedGroups' }
                            })
                        ).data
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

    return (
        <>
            <div className="grid grid-wrap size_1-of-1 text-color_copper-medium" style={{ position: 'relative' }}>
                <h2 className="size_1-of-1 text-align_center padding-vertical_large" style={{ marginTop: '-1rem' }}>
                    ARCHIVED
                </h2>
            </div>
            <div className="text-align_center size_1-of-1 grid">
                {menu.map((item, index) => {
                    return (
                        <div className="size_1-of-4 margin-horizontal_x-small" key={'archived-menu-item-' + index} style={{ marginLeft: !index ? '1rem' : '' }}>
                            <Button onClick={() => setActive(item)} variant={'CopperBackgroundLight' + (active == item ? 'Active' : '')} type="button" label={item} size="fill"></Button>
                        </div>
                    );
                })}
            </div>
            <div className="size_1-of-1 margin-horizontal_medium margin-top_small">
                {(() => {
                    switch (active) {
                        case 'Tests':
                            if (archivedTests && archivedTests.length) {
                                return (
                                    <>
                                        {(!showArchiveTests && (
                                            <>
                                                <div id={`TableRow-Headings`} name="tablerow" className="size_1-of-1 padding-top_large">
                                                    <div className="size_1-of-1 grid grid-wrap padding-bottom_small  text-color_copper-medium">
                                                        <div className="size_1-of-4 text-align_center">
                                                            <p className={`text-size_large text-weight_bold `}>Name</p>
                                                        </div>
                                                        <div className="size_1-of-4 text-align_center ">
                                                            <p className={`text-size_large text-weight_bold `}>Status</p>
                                                        </div>
                                                        <div className="size_1-of-4 text-align_center">
                                                            <p className={`text-size_large text-weight_bold `}>Latest version</p>
                                                        </div>
                                                    </div>

                                                    <div className="size_1-of-1" style={{ height: '1px', background: '#999999', maxWidth: '100%', margin: 'auto' }}></div>
                                                </div>

                                                <div className="size_1-of-1 tblHeight">
                                                    {archivedTests &&
                                                        archivedTests.map &&
                                                        archivedTests.map((field, iCount) => {
                                                            return (
                                                                <div id={`TableRow-${iCount}`} name="tablerow" key={iCount} className="size_1-of-1 text-color_white">
                                                                    <div className="size_1-of-1 grid grid-wrap">
                                                                        <div className="size_1-of-4 margin-around_auto text-align_center">
                                                                            <p className={`text-size_medium`}>{field.Name}</p>
                                                                        </div>
                                                                        <div className="size_1-of-4 margin-around_auto text-align_center">
                                                                            <p className={`text-size_medium`}>{field.TestSendOut == true ? 'Sent' : 'Draft'}</p>
                                                                        </div>
                                                                        <div className="size_1-of-4 margin-around_auto  text-align_center">
                                                                            <p className={`text-size_medium`}>{field.LatestVersion}</p>
                                                                        </div>
                                                                        <div className="size_1-of-4 margin-around_auto padding-vertical_small">
                                                                            <div className="size_1-of-1" style={{ width: '180px', marginLeft: 'auto', marginTop: 'auto', marginBottom: 'auto' }}>
                                                                                <Button
                                                                                    size="xsmall"
                                                                                    label="unArchive"
                                                                                    variant="CopperBackgroundLight"
                                                                                    onClick={() => {
                                                                                        setShowArchivedTests(field);
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="size_1-of-1" style={{ height: '0.5px', background: '#999999', maxWidth: '100%', margin: 'auto' }}></div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </>
                                        )) || (
                                            <>
                                                <>
                                                    <div className="size_1-of-1 grid grid-wrap">
                                                        <h2 className="size_1-of-1 text-align_center padding-vertical_large text-color_copper-medium">
                                                            Unarchive test: <span className="text-size_xx-large text-color_white">{showArchiveTests.Name}</span>
                                                        </h2>
                                                    </div>
                                                    <div className="size_1-of-1 text-align_center ">
                                                        <p className={`text-size_large text-weight_bold text-align_center`} style={{ color: 'white' }}>
                                                            Please select a new category for test
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
                                                                options={optionsCategorys}
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
                                                                    setShowArchivedTests(false);
                                                                
                                                                }}
                                                            ></Button>
                                                        </div>
                                                        <div className="grid margin-around_auto" style={{ width: '350px' }}>
                                                            <Button
                                                                variant="CopperBackgroundLight"
                                                                type="button"
                                                                label={`UnArchive`}
                                                                size="fill"
                                                                onClick={(e) => {
                                                                    unArchiveTest(showArchiveTests);
                                                                }}
                                                            ></Button>
                                                        </div>
                                                    </div>
                                                </>
                                            </>
                                        )}
                                    </>
                                );
                            } else {
                                return (
                                    <>
                                        <div className="size_1-of-1 grid">
                                            <div className="margin-around_auto padding-top_xxx-large">No archived tests</div>
                                        </div>
                                    </>
                                );
                            }
                        case 'Groups':
                            if (archivedGroups && Object.keys(archivedGroups).length) {
                                return (
                                    <div className="size_1-of-1 padding-top_large">
                                        <div id={`TableRow-Headings`} name="tablerow" className="size_1-of-1">
                                            <div className="size_1-of-1 grid grid-wrap padding-bottom_small text-color_copper-medium">
                                                <div className="size_1-of-2 text-align_center">
                                                    <p className={`text-size_large text-weight_bold `}>Name</p>
                                                </div>
                                            </div>

                                            <div className="size_1-of-1" style={{ height: '1px', background: '#999999', maxWidth: '100%', margin: 'auto' }}></div>
                                        </div>
                                        <div className="size_1-of-1 tblHeight">
                                            {archivedGroups &&
                                                Object.keys(archivedGroups).map((key, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <div id={`TableRow-${index}`} name="tablerow" key={index} className="size_1-of-1 text-color_white" style={{ cursor: 'pointer' }}>
                                                                <div className="size_1-of-1 grid grid-wrap">
                                                                    <div className="size_1-of-2 margin-around_auto text-align_center">
                                                                        <p className={`text-size_medium`}>{archivedGroups[key].Name}</p>
                                                                    </div>
                                                                    <div className="size_1-of-2 padding-vertical_small text-align_center">
                                                                        <div style={{ width: '180px', marginLeft: 'auto', marginTop: 'auto', marginBottom: 'auto' }}>
                                                                            <Button
                                                                                size="xsmall"
                                                                                label="unArchive"
                                                                                variant="CopperBackgroundLight"
                                                                                onClick={() => {
                                                                                    unArchiveGroup(archivedGroups[key]);
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="size_1-of-1" style={{ height: '0.5px', background: '#999999', maxWidth: '100%', margin: 'auto' }}></div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <>
                                        <div className="size_1-of-1 grid">
                                            <div className="margin-around_auto padding-top_xxx-large">No archived groups</div>
                                        </div>
                                    </>
                                );
                            }

                        case 'Categories':
                            if (archivedCategorys && archivedCategorys.length) {
                                return (
                                    <div className="size_1-of-1 padding-top_large">
                                        <div id={`TableRow-Headings`} name="tablerow" className="size_1-of-1">
                                            <div className="size_1-of-1 grid grid-wrap padding-bottom_small  text-color_copper-medium ">
                                                <div className="size_1-of-2 text-align_center ">
                                                    <p className={`text-size_large text-weight_bold `}>Name</p>
                                                </div>
                                            </div>
                                            <div className="size_1-of-1" style={{ height: '1px', background: '#999999', maxWidth: '100%', margin: 'auto' }}></div>
                                        </div>
                                        <div className="size_1-of-1 tblHeight ">
                                            {archivedCategorys &&
                                                archivedCategorys.map &&
                                                archivedCategorys.map((field, iCount) => {
                                                    return (
                                                        <div id={`TableRow-${iCount}`} name="tablerow" key={iCount} className="size_1-of-1 text-color_white" style={{ cursor: 'pointer' }}>
                                                            <div className="size_1-of-1 grid grid-wrap">
                                                                <div className="size_1-of-2 margin-around_auto  text-align_center">
                                                                    <p className={`text-size_medium`}>{field.label}</p>
                                                                </div>
                                                                <div className="size_1-of-2 padding-vertical_small text-align_center">
                                                                    <div style={{ width: '180px', marginLeft: 'auto', marginTop: 'auto', marginBottom: 'auto' }}>
                                                                        <Button
                                                                            size="xsmall"
                                                                            label="unArchive"
                                                                            variant="CopperBackgroundLight"
                                                                            onClick={() => {
                                                                                unArchiveCategory(field);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="size_1-of-1" style={{ height: '0.5px', background: '#999999', maxWidth: '100%', margin: 'auto' }}></div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <>
                                        <div className="size_1-of-1 grid">
                                            <div className="margin-around_auto padding-top_xxx-large">No archived categories</div>
                                        </div>
                                    </>
                                );
                            }

                        case 'Users':
                            if (archivedUsers && archivedUsers.length) {
                                return (
                                    <>
                                        {(!showUnArchiveUser && (
                                            <>
                                                <div className="size_1-of-1 padding-top_large">
                                                    <div id={`TableRow-Headings`} name="tablerow" className="size_1-of-1">
                                                        <div className="size_1-of-1 grid grid-wrap padding-bottom_small text-color_copper-medium ">
                                                            <div className="size_1-of-4">
                                                                <p className={`text-size_large text-weight_bold text-align_center`}>Full Name</p>
                                                            </div>
                                                            <div className="size_1-of-4">
                                                                <p className={`text-size_large text-weight_bold text-align_center`}>Cell</p>
                                                            </div>
                                                            <div className="size_1-of-4">
                                                                <p className={`text-size_large text-weight_bold text-align_center`}>Email</p>
                                                            </div>
                                                        </div>
                                                        <div className="size_1-of-1" style={{ height: '1px', background: '#999999', maxWidth: '100%', margin: 'auto' }}></div>
                                                    </div>

                                                    <div className="size_1-of-1 tblHeight">
                                                        {archivedUsers &&
                                                            archivedUsers.map &&
                                                            archivedUsers.map((field, iCount) => {
                                                                return (
                                                                    <div id={`TableRow-${iCount}`} name="tablerow" key={iCount} className="size_1-of-1 text-color_white" style={{ cursor: 'pointer' }}>
                                                                        <div className="size_1-of-1 grid grid-wrap">
                                                                            <div className="size_1-of-4 margin-around_auto text-align_center">
                                                                                <p className={`text-size_medium`}>{field.FName + ' ' + field.LName}</p>
                                                                            </div>

                                                                            <div className="size_1-of-4 margin-around_auto text-align_center">
                                                                                <p className={`text-size_medium`}>{field.Cell}</p>
                                                                            </div>
                                                                            <div className="size_1-of-4 margin-around_auto text-align_center">
                                                                                <p className={`text-size_medium`}>{field.Email}</p>
                                                                            </div>
                                                                            <div className="size_1-of-4 padding-vertical_small text-align_center">
                                                                                <div className="size_1-of-1 ">
                                                                                    <div style={{ width: '180px', marginLeft: 'auto', marginTop: 'auto', marginBottom: 'auto' }}>
                                                                                        <Button
                                                                                            size="xsmall"
                                                                                            label="unArchive"
                                                                                            variant="CopperBackgroundLight"
                                                                                            onClick={() => {
                                                                                                setShowUnarchiveUser(field);
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="size_1-of-1" style={{ height: '0.5px', background: '#999999', maxWidth: '100%', margin: 'auto' }}></div>
                                                                    </div>
                                                                );
                                                            })}
                                                    </div>
                                                </div>
                                            </>
                                        )) || (
                                            <>
                                                <div className="size_1-of-1 grid grid-wrap">
                                                    <h2 className="size_1-of-1 text-align_center padding-vertical_large text-color_copper-medium">
                                                        Unarchive user: <span className="text-size_xx-large text-color_white">{showUnArchiveUser.FName}</span>
                                                    </h2>
                                                </div>
                                                <div className="size_1-of-1 text-align_center ">
                                                    <p className={`text-size_large text-weight_bold text-align_center`} style={{ color: 'white' }}>
                                                        Please select a new group for user
                                                    </p>
                                                </div>
                                                <div className="grid size_1-of-1 padding-top_large">
                                                    <div className="margin-around_auto">
                                                        <FormElement
                                                            onChange={(value) => {
                                                                setAllocateTo(value);
                                                            }}
                                                            id="UserField_7"
                                                            label="Groups"
                                                            name="Groups"
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
                                                                setShowUnarchiveUser(false);
                                                            }}
                                                        ></Button>
                                                    </div>
                                                    <div className="grid margin-around_auto" style={{ width: '350px' }}>
                                                        <Button
                                                            variant="CopperBackgroundLight"
                                                            type="button"
                                                            label={`UnArchive`}
                                                            size="fill"
                                                            onClick={(e) => {
                                                                unArchiveUser();
                                                            }}
                                                        ></Button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                );
                            } else {
                                return (
                                    <>
                                        <div className="size_1-of-1 grid">
                                            <div className="margin-around_auto padding-top_xxx-large">No archived users</div>
                                        </div>
                                    </>
                                );
                            }
                    }
                })()}
            </div>
        </>
    );
}
