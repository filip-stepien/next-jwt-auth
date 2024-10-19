'use client';

import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

export default function Login() {
    const router = useRouter();

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const response = await fetch('/api/login', {
            method: 'POST',
            body: formData
        });

        if (response.ok) router.push('http://localhost:3000/test');
    };

    return (
        <div>
            <form
                onSubmit={onSubmit}
                style={{ display: 'flex', flexDirection: 'column', width: '200px', gap: '10px' }}
            >
                <input type='text' name='username' placeholder='Login...' />
                <input type='text' name='password' placeholder='Hasło...' />
                <input type='submit' value='Log in' />
            </form>
        </div>
    );
}
