'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteSession } from '@/app/lib/session';

export default function ToolsPage() {
    const [tools, setTools] = useState<string[]>([]);
    const [status, setStatus] = useState<'loading' | 'error' | 'ok'>('loading');
    const router = useRouter();

    useEffect(() => {
        const sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            router.push('/login');
            return;
        }

        fetch(`/api/session?sid=${sessionId}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    router.push('/login');
                    return;
                }

                setTools(data.toolIds || []);
                setStatus('ok');
            })
            .catch(() => setStatus('error'));
    }, [router]);

    if (status === 'loading') return <p>Loading...</p>;
    if (status === 'error') return <p style={{ color: 'red' }}>Error fetching tools.</p>;

    const handleLogout = async () => {
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
            await fetch('/api/logout', {
                method: 'POST',
                body: JSON.stringify({ sid: sessionId }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            localStorage.removeItem('sessionId');
            deleteSession(sessionId);
        }
        router.push('/login');
    };

    return (
        <main className='flex'>
            {tools.length > 0 ? (
                <div className='flex'>
                    <div className="xl:rounded-r transform  xl:translate-x-0  ease-in-out transition duration-500 flex justify-start items-start h-full  w-full sm:w-64 bg-gray-900 flex-col" style={{ height: '100vh' }}>
                        <div className="flex justify-between  items-center space-x-3 align-center" style={{ width: '100%' }}>
                            <p className="text-white text-center" style={{ width: '100%' }}>ITAP</p>
                        </div>
                        <div className="mt-6 flex flex-col justify-start items-center  pl-4 w-full border-gray-600 border-b space-y-3 pb-5 ">
                            <h2>Your Tools</h2>
                        </div>
                        <ul style={{ width: '100%' }}>
                            {tools.map((toolId) => (
                                <li key={toolId} className='text-center pb-5 text-white-900'>
                                    <a className='text-white-900' href={`/tools/${toolId}`}>
                                        {toolId.toUpperCase()}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div className="text-center mt-auto" style={{ width: '100%' }}>
                            <button onClick={handleLogout} style={{ width: '100%', padding: '0.5rem 1rem', border: 'none', borderRadius: '5px', backgroundColor: 'red', color: 'white' }}>
                                Logout
                            </button>
                        </div>
                    </div>
                    <div className='flex-1 ml-0 p-6'>
                        <div>Welcome to the Internal Tools Access Panel</div>
                        <div> <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10" style={{ display: 'inline', marginRight: '5px' }}>
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"></path>
                        </svg> Click on a tool to access it</div>
                    </div>
                </div>
            ) : (
                <p>No tools available for your role.</p>
            )}
        </main>
    );
}
