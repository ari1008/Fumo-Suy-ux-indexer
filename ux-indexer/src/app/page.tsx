import React from 'react';
import Link from 'next/link';
import {ChevronRight} from 'lucide-react';

const ChainInfoPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 space-y-6">
                <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
                    Chain Info
                </h1>

                <div className="space-y-4">
                    <Link
                        href="/chain-info/"
                        className="flex items-center justify-between w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                        <span className="text-blue-800 font-semibold">Vue d'ensemble</span>
                        <ChevronRight className="text-blue-600"/>
                    </Link>

                    <div className="text-center text-gray-500 text-sm mt-4">
                        Explorez les informations détaillées de la blockchain
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChainInfoPage;