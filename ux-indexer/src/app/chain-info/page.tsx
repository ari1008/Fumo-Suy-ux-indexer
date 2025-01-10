'use client';

import React from 'react';
import { useAccount, useChainId, useBlockNumber, useConnect } from 'wagmi';
import { Info, Network, Wallet } from 'lucide-react';

export default function Page() {
    const { isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const chainId = useChainId();
    const { data: blockNumber } = useBlockNumber();

    const getChainName = (id: number) => {
        const chainNames: { [key: number]: string } = {
            1: 'Ethereum Mainnet',
            11155111: 'Sepolia Testnet',
        };
        return chainNames[id] || `Unknown Chain (ID: ${id})`;
    };

    // Si non connecté, afficher un bouton de connexion
    if (!isConnected) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                    <Network className="mx-auto mb-4 text-6xl text-blue-600" />
                    <h2 className="text-2xl font-semibold mb-4">
                        Connectez votre portefeuille
                    </h2>
                    <div className="space-y-4">
                        {connectors.map((connector) => (
                            <button
                                key={connector.id}
                                onClick={() => connect({ connector })}
                                className="w-full flex items-center justify-center
                  bg-blue-500 text-white py-3 px-4 rounded-lg
                  hover:bg-blue-600 transition duration-300"
                            >
                                <Wallet className="mr-2" />
                                Connecter avec {connector.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Si connecté, afficher les informations
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center mb-6">
                    <Network className="mr-2 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-800">
                        Informations Blockchain
                    </h1>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <InfoCard
                        label="Chain ID"
                        value={chainId.toString()}
                        icon={<Info className="text-blue-500" />}
                    />
                    <InfoCard
                        label="Nom de la Chaîne"
                        value={getChainName(chainId)}
                        icon={<Info className="text-green-500" />}
                    />
                    <InfoCard
                        label="Numéro de Bloc"
                        value={blockNumber ? blockNumber.toString() : 'Chargement...'}
                        icon={<Info className="text-purple-500" />}
                    />
                </div>
            </div>
        </div>
    );
}

// Composant de carte d'information
interface InfoCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
}

function InfoCard({ label, value, icon }: InfoCardProps) {
    return (
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center">
            <div className="mr-4">{icon}</div>
            <div>
                <p className="text-sm text-gray-600 mb-1">{label}</p>
                <p className="text-lg font-semibold text-gray-800 truncate">{value}</p>
            </div>
        </div>
    );
}