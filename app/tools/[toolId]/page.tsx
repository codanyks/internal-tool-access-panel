'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { deleteSession } from '@/app/lib/session';

export default function ToolPage() {
    const [status, setStatus] = useState<'loading' | 'ok' | 'unauthorized'>('loading');
    const [username, setUsername] = useState('');
    const [toolId, setToolId] = useState<string | null>(null);
    const [tools, setTools] = useState<string[]>([]);
    const router = useRouter();
    const { toolId: routeToolId } = useParams() as { toolId: string };

    useEffect(() => {
        setToolId(routeToolId); // Set the toolId from the URL
        const sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            router.push('/login');
            return;
        }

        fetch(`/api/session?sid=${sessionId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    router.push('/login');
                    return;
                }

                if (!data.toolIds.includes(routeToolId)) {
                    setStatus('unauthorized');
                } else {
                    setTools(data.toolIds || []);
                    setUsername(data.username);
                    setStatus('ok');
                }
            });
    }, [router, routeToolId]);

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

    if (status === 'loading') return <p>Loading...</p>;
    if (status === 'unauthorized') return <p style={{ color: 'red' }}>🚫 No access</p>;

    return (
        <main className='flex'>
            <div id="Main" className="xl:rounded-r transform  xl:translate-x-0  ease-in-out transition duration-500 flex justify-start items-start h-full  w-full sm:w-64 bg-gray-900 flex-col" style={{ height: '100vh' }}>
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
                <h2>Welcome, {username}</h2>
                <h3>🔧 Tool: {toolId?.toUpperCase()}</h3>
                <ul>
                    <li>Tool Feature A</li>
                    <li>Tool Feature B</li>
                    <li>Tool Feature C</li>
                </ul>
            </div>
        </main>
    );
}
