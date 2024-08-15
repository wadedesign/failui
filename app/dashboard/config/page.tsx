// app/dashboard/settings/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';  // Adjust the import path as necessary

import View from '../../components/View';  // Adjust the import path as necessary

export default function ConfPage() {
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
                    <h1 className="text-3xl font-bold mb-6 text-[#00BCD4]">Edit Conf File</h1>
                        <View />
                    </div>         
            </div>
        </Layout>
    );
}