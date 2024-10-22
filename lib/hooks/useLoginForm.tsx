import { useRouter } from 'next/navigation';
import { FormEvent, useRef, useState } from 'react';

export default function useLoginForm(loginEndpoint: string, redirectPage: string) {
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState('');
    const clearInputRef = useRef<HTMLInputElement>(null);

    const onChange = () => {
        setErrorMsg('');
    };

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const response = await fetch(loginEndpoint, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            router.push(redirectPage);
        } else {
            if (response.status === 400 || response.status === 500)
                setErrorMsg('There was an error while attempting to log in.');
            else {
                setErrorMsg('Invalid login credentials.');
            }

            if (clearInputRef.current) clearInputRef.current.value = '';
        }
    };

    return { onSubmit, onChange, clearInputRef, errorMsg };
}
