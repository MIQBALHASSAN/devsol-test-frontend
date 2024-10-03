'use client';

import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';

type ErrorType = {
    model?: string;
    price?: string;
    phone?: string;
    city?: string;
    noOfImg?: string;
    images?: string;
};

const serverUrl = 'http://127.0.0.1:5050/';

const DashboardPage = () => {
    const [data, setData] = useState({
        model: '',
        price: '',
        phone: '',
        city: 'Lahore',
        noOfImg: 1,
        images: [] as string[]
    });
    const [errors, setErrors] = useState<ErrorType>({});
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const fileUploadRef: any = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.replace('/');
        }
    }, [router]);

    const validate = () => {
        let isValid = true;
        const newErrors: any = {};

        // Model validation: minimum 3 letters
        if (!data.model) {
            newErrors.model = 'Model is required';
            isValid = false;
        } else if (data.model.length < 3) {
            newErrors.model = 'Model must be at least 3 characters long';
            isValid = false;
        }

        // Price validation: must be a number
        if (!data.price) {
            newErrors.price = 'Price is required';
            isValid = false;
        } else if (isNaN(Number(data.price))) {
            newErrors.price = 'Price must be a number';
            isValid = false;
        }

        // Phone validation: exactly 11 digits
        const phoneRegex = /^\d{11}$/;
        if (!data.phone) {
            newErrors.phone = 'Phone is required';
            isValid = false;
        } else if (!phoneRegex.test(data.phone)) {
            newErrors.phone = 'Phone number must be exactly 11 digits';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleDropdownChange = (e: DropdownChangeEvent) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleRadioButtonChange = (e: RadioButtonChangeEvent) => {
        const { value } = e;
        setData((prevData) => ({
            ...prevData,
            city: value
        }));
    };

    const handleSelect = (e: any) => {
        const selectedFiles = e.files;
        if (selectedFiles.length > data.noOfImg) {
            setErrorMessage(`You can only upload a maximum of ${data.noOfImg} files.`);

            if (fileUploadRef.current) {
                fileUploadRef.current.clear();
            }
        } else {
            setErrorMessage('');
        }
    };

    const handleFileUpload = async (e: any) => {
        const res = JSON.parse(e.xhr.response);
        if (res.data && Array.isArray(res.data.paths)) {
            setData((prevData) => ({
                ...prevData,
                images: res.data.paths
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            const response = await fetch(`${serverUrl}api/add-car`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.ok) {
                router.push('/');
            }
        } else {
            console.log('Validation failed.');
        }
    };

    const cities = ['Lahore', 'Karachi'];

    const copiesOptions = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 }
    ];

    return (
        <div className="w-full surface-card py-8 px-5 sm:px-8">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-column mb-3">
                    <label htmlFor="model" className="block text-900 text-xl font-medium mb-2">
                        Car Model
                    </label>
                    <InputText id="model" name="model" value={data.model} onChange={handleChange} placeholder="Car Model" className={`w-full mb-2 p-3 ${errors.model ? 'p-invalid' : ''}`} />
                    {errors.model && <small className="p-error">{errors.model}</small>}
                </div>

                <div className="flex flex-column mb-3">
                    <label htmlFor="price" className="block text-900 text-xl font-medium mb-2">
                        Price
                    </label>
                    <InputText id="price" name="price" value={data.price} onChange={handleChange} placeholder="Price" className={`w-full mb-2 p-3 ${errors.price ? 'p-invalid' : ''}`} />
                    {errors.price && <small className="p-error">{errors.price}</small>}
                </div>

                <div className="flex flex-column mb-3">
                    <label htmlFor="phone" className="block text-900 text-xl font-medium mb-2">
                        Phone
                    </label>
                    <InputText id="phone" name="phone" value={data.phone} onChange={handleChange} placeholder="Phone" className={`w-full mb-2 p-3 ${errors.phone ? 'p-invalid' : ''}`} />
                    {errors.phone && <small className="p-error">{errors.phone}</small>}
                </div>

                <div className="flex mb-3">
                    <label className="block text-900 text-xl font-medium mr-3">City</label>
                    {cities.map((city) => (
                        <div key={city} className="flex align-items-center mr-8">
                            <RadioButton inputId={city} name="city" value={city} onChange={handleRadioButtonChange} checked={data.city === city} />
                            <label htmlFor={city} className="ml-2">
                                {city}
                            </label>
                        </div>
                    ))}
                </div>

                <div className="flex flex-row align-items-center mb-3">
                    <label htmlFor="noOfImg" className="block text-900 text-xl font-medium mb-2 mr-3">
                        No. of copies
                    </label>
                    <Dropdown id="noOfImg" name="noOfImg" value={data.noOfImg} options={copiesOptions} onChange={handleDropdownChange} className="w-full md:w-30rem mb-2" placeholder="Select number of copies" />
                </div>

                <div className="flex flex-column mb-3">
                    <FileUpload ref={fileUploadRef} name="images" url={serverUrl + 'api/upload-image'} onUpload={handleFileUpload} multiple accept="image/*" onSelect={handleSelect} />
                    {errorMessage && <p className="p-error">{errorMessage}</p>}
                </div>

                <Button label="Add Car" className="w-full p-3 text-xl" type="submit"></Button>
            </form>
        </div>
    );
};

export default DashboardPage;
