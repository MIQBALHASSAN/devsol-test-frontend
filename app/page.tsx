'use client';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useState } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

const serverUrl = 'http://127.0.0.1:5050/';

const LoginPage = () => {
    const [data, setData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({ email: '', password: '' });
    const router = useRouter();

    const validate = () => {
        let isValid = true;
        const newErrors = { email: '', password: '' };

        // Email validation
        if (!data.email) {
            newErrors.email = 'Email is required.';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = 'Enter a valid email address.';
            isValid = false;
        }

        // Password validation
        if (!data.password) {
            newErrors.password = 'Password is required.';
            isValid = false;
        } else if (data.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
            const response = await fetch(`${serverUrl}api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.status) {
                localStorage.setItem('token', result.user.email);
                router.push('/dashboard');
            }
        } else {
            console.log('Validation failed.');
        }
    };

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden p-input-filled');

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div className="w-full surface-card py-8 px-5 sm:px-8">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-column mb-3">
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>

                            <InputText id="email1" type="text" name="email" value={data.email} onChange={handleChange} placeholder="Email address" className={`w-full md:w-30rem mb-2 p-3 ${errors.email ? 'p-invalid' : ''}`} />
                            {errors.email && <small className="p-error">{errors.email}</small>}
                        </div>

                        <div className="flex flex-column mb-3">
                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password
                                inputId="password1"
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                placeholder="Password"
                                toggleMask
                                className={`w-full mb-2 ${errors.password ? 'p-invalid' : ''}`}
                                inputClassName="w-full p-3 md:w-30rem"
                            />
                            {errors.password && <small className="p-error">{errors.password}</small>}
                        </div>

                        <Button label="Sign In" className="w-full p-3 text-xl" type="submit"></Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
