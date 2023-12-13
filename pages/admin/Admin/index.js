import { Header, Button, FormElement } from '@Components';

import MetaTages from '../../metaTags/metaTags';

import ViewCategorys from '../Category/ViewCategorys';
import ViewGroups from '../groups/ViewGroups';
import ViewUser from '../Users/ViewUser';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

import Archived from './archived';


export default function Admin() {
    const router = useRouter();
    const [active, setActive] = React.useState('none');
    React.useEffect(() => {
        if (router.query.tab) {
            setActive(router.query.tab);
        }
    }, []);
    const items = [
        {
            name: 'categories',
            onClick: () => {
                setActive('categories');
            }
        },
        {
            name: 'groups',
            onClick: () => {
                setActive('groups');
            }
        },
        {
            name: 'users',
            onClick: () => {
                setActive('users');
            }
        },
        {
            name: 'archived',
            onClick: () => {
                setActive('archived');
            }
        }
    ];
    return (
        <div className="section">
            <div className="size_1-of-1 grid" style={{ justifyContent: 'center' }}>
                <div className="section-content">
                    <Header></Header>
                </div>
            </div>
            <div className="grid grid-wrap section-content" style={{ padding: '0 1.3rem' }}>
                <div className="grid grid-wrap size_1-of-9" style={{ height: 'min-content' }}>
                    {items.map((item, count) => {
                        if (active == item.name) {
                            return (
                                <div className="size_1-of-1 padding-bottom_small " key={count}>
                                    <Button class="" variant="CopperBackgroundLightActive" type="button" label={item.name} onClick={item.onClick}></Button>
                                </div>
                            );
                        }
                        return (
                            <div className={`size_1-of-1 padding-bottom_small`} key={count}>
                                <Button class="" variant="CopperBackgroundLight" type="button" label={item.name} onClick={item.onClick}></Button>
                            </div>
                        );
                    })}
                </div>
                <div className="size_8-of-9">
                    {(() => {
                        switch (active) {
                            case 'categories':
                                return <ViewCategorys />;
                            case 'users':
                                return <ViewUser />;
                            case 'groups':
                                return <ViewGroups />;
                            case 'archived':
                                return <Archived />;
                            default:
                                return (
                                    <div className="text-align_center size_1-of-1 " style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        Please select an option on your left.
                                    </div>
                                );
                        }
                    })()}
                </div>
            </div>
        </div>
    );
}


