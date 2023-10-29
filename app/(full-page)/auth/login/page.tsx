/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';


interface LoginResponse {
    result: string;
    data: {
        sid: string;
    }
    // 可能还有其他属性
}


const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });


    const handleLogin = async () => {
        const cmd = 'com.awspaas.user.apps.app20231017165850.login'
        const url = `http://localhost:8088/portal/r/jd?cmd=${cmd}&userAccount=${username}&passWord=${password}`

        const res = await fetch(url, {
            method: 'POST',
        })
        const data: LoginResponse = await res.json()
        console.log(data)

        if (data.result === 'ok') {
            localStorage.setItem('uid', username)
            localStorage.setItem('sid', data.data.sid)
            router.push('/')
        }
    }


    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">欢迎!</div>
                            {/* <span className="text-600 font-medium">登录继续</span> */}
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-900 text-xl font-medium mb-2">
                                用户名
                            </label>
                            <InputText id="username" type="text" value={username} placeholder="用户名" onChange={(e) => setUsername(e.target.value)} className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                密码
                            </label>
                            <Password inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="密码" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">记住密码</label>
                                </div>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    忘记密码?
                                </a>
                            </div>
                            <Button label="登录" className="w-full p-3 text-xl" onClick={handleLogin}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
