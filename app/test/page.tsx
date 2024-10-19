'use client';

import { useRouter } from 'next/navigation';

export default function Test() {
    const router = useRouter();

    const logout = async () => {
        const res = await fetch('http://localhost:3000/api/logout', { method: 'POST' });

        if (res.ok) {
            router.push('http://localhost:3000/login');
        }
    };

    return (
        <>
            <div>Logged in.</div>
            <button onClick={logout}>Log out</button>
        </>
    );
}
