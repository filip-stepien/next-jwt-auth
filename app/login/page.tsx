'use client';

import useLoginForm from '@/lib/hooks/useLoginForm';

export default function Login() {
    const { onSubmit, onChange, clearInputRef, errorMsg } = useLoginForm('/api/login', '/test');

    return (
        <div>
            <form
                onSubmit={onSubmit}
                style={{ display: 'flex', flexDirection: 'column', width: '200px', gap: '10px' }}
            >
                <input onChange={onChange} type='text' name='username' placeholder='Login...' />
                <input ref={clearInputRef} type='text' name='password' placeholder='Hasło...' />
                <input type='submit' value='Log in' />
                <p>{errorMsg}</p>
            </form>
        </div>
    );
}
