// app/dashboard/page.tsx


'use client';
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';  // Adjust the import path as necessary
import Montior from '../components/Montior';  // Adjust the import path as necessary

export default function Dashboard() {
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
            <div className="min-h-screen bg-black text-green-100">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6 text-green-400">Dashboard</h1>
                    {username && (
                        <div className="bg-gray-900 shadow-md rounded-lg p-6 border border-green-700">
                            <h2 className="text-2xl font-semibold mb-4 text-green-500">Welcome, {username}!</h2>
                            <p className="text-green-200">Here, we make managing fail2ban, easier for the common folk, nice gui, logs, editing files, etc! LOOK below you see its online? its already working </p>
                        </div>
                    )}
                    <div className="mt-8">
                        <Montior />
                    </div>
                    {/* Add more dashboard content here */}
                </div>
            </div>
        </Layout>
    );
}