import Link from 'next/link';

import { Button } from '@Components';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
//Exported for mobile-menu view
export const items = [
    {
        name: 'Tests',
        href: '/admin/Tests/ViewTests'
    },
    /* {
        name: 'Add Test',
        href: '/admin/Tests/AddTest'
    }, */
    {
        name: 'Admin',
        href: '/admin/Admin'
    }
];
export default function Header({ activeTab }) {
    const Router = useRouter();
    const SignUserOut = async () => {
        Swal.fire({
            title: 'Are you sure you want to sign out?',
            showCancelButton: true,
            confirmButtonText: 'Sign out'
        }).then(async (result) => {
            if (result.isConfirmed) {
                var tempLoginResult = await signOut({ redirect: true });
                Router.push('/SignIn');
            }
        });
    };
    return (
        <>
            <div className="size_1-of-1 text-color_copper-medium" style={{ height: 'min-content' }}>
                <div className="grid grid-wrap size_1-of-1 grid_align-spread grid_vertical-align-center text-align_center" style={{ height: 'min-content' }}>
                    <div className="size_1-of-1 large-size_1-of-3">
                        <img style={{ height: '80px', width: 'auto', objectFit: 'contain' }} className="margin-small-around_auto" src="/logo.png" />
                    </div>

                    <div className="size_1-of-1 large-size_1-of-3">
                        <h1>STAFF ASSESSMENT PORTAL</h1>
                    </div>

                    <div className="size_1-of-1 large-size_1-of-3" title="sign out" onClick={SignUserOut}>
                        <div className="grid grid_align-end">
                            <svg className={`SvgStroke`} xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                                <g id="Interface / Log_Out">
                                    <path
                                        id="Vector"
                                        d="M12 15L15 12M15 12L12 9M15 12H4M9 7.24859V7.2002C9 6.08009 9 5.51962 9.21799 5.0918C9.40973 4.71547 9.71547 4.40973 10.0918 4.21799C10.5196 4 11.0801 4 12.2002 4H16.8002C17.9203 4 18.4796 4 18.9074 4.21799C19.2837 4.40973 19.5905 4.71547 19.7822 5.0918C20 5.5192 20 6.07899 20 7.19691V16.8036C20 17.9215 20 18.4805 19.7822 18.9079C19.5905 19.2842 19.2837 19.5905 18.9074 19.7822C18.48 20 17.921 20 16.8031 20H12.1969C11.079 20 10.5192 20 10.0918 19.7822C9.71547 19.5905 9.40973 19.2839 9.21799 18.9076C9 18.4798 9 17.9201 9 16.8V16.75"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="size_1-of-1 grid grid-wrap padding-horizontal_xx-small">
                    {items.map((item, count) => {
                        if (Router.pathname == item.href || item.name == activeTab) {
                            return (
                                <Link key={count} href={item.href} className={' size_1-of-'+items.length+' padding-horizontal_x-small '+(()=>{
                                    if(count == 0){
                                        return "padding-left_none"
                                    }else if(count == items.length-1){
                                        return "padding-right_none"
                                    }
                                    return ""
                                })()} >
                                    <Button variant="CopperBackgroundLightActive" type="button" label={item.name} size="fill"></Button>
                                </Link>
                            );
                        }
                        return (
                            <Link  key={count} href={item.href} className={' size_1-of-'+items.length+' padding-horizontal_x-small '+(()=>{
                                if(count == 0){
                                    return "padding-left_none"
                                }else if(count == items.length-1){
                                    return "padding-right_none"
                                }
                                return ""
                            })()} >
                                <Button  variant="CopperBackgroundLight" type="button" size="fill" label={item.name}></Button>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
