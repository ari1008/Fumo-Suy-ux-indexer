'use client';

import React from 'react';
import {
    useAccount,
    useChainId,
    useBlockNumber,
    useConnect,
    useDisconnect,
    useSwitchChain,
    useBlock,
    useGasPrice
} from 'wagmi';
import { Info, Network, Wallet, AlertTriangle, LogOut } from 'lucide-react';
import { formatEther, formatUnits } from 'viem';

function Page() {
    const { isConnected, address } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { switchChain } = useSwitchChain();
    const chainId = useChainId();
    const { data: blockNumber } = useBlockNumber();
    const { data: blockData } = useBlock({ blockNumber });
    const { data: gasPrice } = useGasPrice();

    const ALLOWED_CHAINS = {
        MAINNET: 1,
        SEPOLIA: 11155111
    };

    const getChainName = (id: number) => {
        const chainNames: { [key: number]: string } = {
            [ALLOWED_CHAINS.MAINNET]: 'Ethereum Mainnet',
            [ALLOWED_CHAINS.SEPOLIA]: 'Sepolia Testnet',
        };
        return chainNames[id] || `Unknown Chain (ID: ${id})`;
    };

    const isValidChain = () => Object.values(ALLOWED_CHAINS).includes(chainId);

    const handleChainError = () => {
        if (isConnected && !isValidChain()) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
                    <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md space-y-4">
                        <AlertTriangle className="mx-auto text-6xl text-red-600" />

                        <div>
                            <h2 className="text-2xl font-semibold mb-2 text-red-800">
                                Mauvaise Chaîne Réseau
                            </h2>
                            <p className="mb-4 text-gray-600">
                                Vous êtes actuellement connecté à {getChainName(chainId)}.
                                Veuillez vous connecter à l'une des chaînes suivantes :
                            </p>
                        </div>

                        <div className="space-y-3">
                            {Object.entries(ALLOWED_CHAINS).map(([name, id]) => (
                                <button
                                    key={id}
                                    onClick={() => switchChain({ chainId: id })}
                                    className={`w-full py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center 
                                    ${id === ALLOWED_CHAINS.MAINNET
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                        : 'bg-green-500 hover:bg-green-600 text-white'}`}
                                >
                                    <Network className="mr-2" />
                                    Passer à {name}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => disconnect()}
                            className="w-full bg-red-500 text-white py-3 px-4 rounded-lg
                            hover:bg-red-600 transition duration-300 flex items-center justify-center"
                        >
                            <LogOut className="mr-2" />
                            Se déconnecter
                        </button>
                    </div>
                </div>
            );
        }
        return null;
    };

    if (!isConnected) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
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

    const chainErrorComponent = handleChainError();
    if (chainErrorComponent) return chainErrorComponent;

    // Fonctions utilitaires de conversion sécurisées
    const safeFormatEther = (value: bigint | undefined) => {
        try {
            return value ? formatEther(value) : 'Chargement...';
        } catch {
            return 'Erreur';
        }
    };

    const safeFormatGwei = (value: bigint | undefined) => {
        try {
            return value ? formatUnits(value, 9) : 'Chargement...';
        } catch {
            return 'Erreur';
        }
    };

    const calculateBurntFees = () => {
        try {
            if (!blockData?.baseFeePerGas || !blockData?.gasUsed) return 'Chargement...';
            const burntFees = blockData.baseFeePerGas * blockData.gasUsed;
            return safeFormatEther(burntFees);
        } catch {
            return 'Erreur';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center mb-6 justify-between">
                    <div className="flex items-center">
                        <Network className="mr-2 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-800">
                            Informations Blockchain
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-600">
                            {address && `Connecté: ${address.slice(0, 6)}...${address.slice(-4)}`}
                        </div>
                        <button
                            onClick={() => disconnect()}
                            className="bg-red-500 text-white px-3 py-1 rounded-md
                            hover:bg-red-600 transition duration-300 flex items-center"
                        >
                            <LogOut className="mr-1 w-4 h-4" />
                            Déconnexion
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
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

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoCard
                        label="Dernier Hash de Bloc"
                        value={blockData?.hash ? `${blockData.hash.slice(0, 10)}...` : 'Chargement...'}
                        icon={<Info className="text-orange-500" />}
                    />
                    <InfoCard
                        label="Gaz Utilisé"
                        value={blockData?.gasUsed ? blockData.gasUsed.toString() : 'Chargement...'}
                        icon={<Info className="text-red-500" />}
                    />
                    <InfoCard
                        label="Prix du Gaz"
                        value={safeFormatGwei(gasPrice) + ' Gwei'}
                        icon={<Info className="text-yellow-500" />}
                    />
                    <InfoCard
                        label="Frais Brûlés"
                        value={calculateBurntFees() + ' ETH'}
                        icon={<Info className="text-pink-500" />}
                    />
                </div>
            </div>
        </div>
    );
}

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

export default Page;