// app/dashboard/settings/page.tsx

'use client';
'use client';

import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';  // Adjust the import path as necessary
import Password from '../../components/Password';  // Adjust the import path as necessary
import Install from '../../components/Install';  // Adjust the import path as necessary

export default function SettingsPage() {
    const [username, setUsername] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/');
            return;
        }

        try {
            const decodedToken: { sub: string } = jwtDecode(token);
            setUsername(decodedToken.sub);
        } catch (error) {
            console.error("Invalid token", error);
            router.push('/');
        }
    }, [router]);

    return (
        <Layout>
            <div className="min-h-screen bg-[#121212] text-[#E0E0E0]">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6 text-[#00BCD4]">Settings</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <Password />
                        </div>
                        <div className="space-y-6">
                            <Install />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}