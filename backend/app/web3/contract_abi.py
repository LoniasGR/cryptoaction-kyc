abi = [
    {
        "inputs": [
            {"internalType": "address[]", "name": "_kycEvaluators", "type": "address[]"}
        ],
        "stateMutability": "nonpayable",
        "type": "constructor",
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "user",
                "type": "address",
            },
            {
                "indexed": False,
                "internalType": "enum KYCStatus",
                "name": "status",
                "type": "uint8",
            },
        ],
        "name": "KYCStatusChanged",
        "type": "event",
    },
    {
        "inputs": [],
        "name": "applicants",
        "outputs": [{"internalType": "uint256", "name": "length", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [
            {"internalType": "address", "name": "user", "type": "address"},
            {"internalType": "bytes32", "name": "digest", "type": "bytes32"},
        ],
        "name": "createKYCApplication",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "inputs": [
            {"internalType": "address", "name": "user", "type": "address"},
            {"internalType": "bool", "name": "isAccepted", "type": "bool"},
        ],
        "name": "decideKYC",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "inputs": [],
        "name": "getAllKycApplications",
        "outputs": [
            {
                "components": [
                    {"internalType": "address", "name": "user", "type": "address"},
                    {"internalType": "bytes32", "name": "digest", "type": "bytes32"},
                    {
                        "internalType": "enum KYCStatus",
                        "name": "status",
                        "type": "uint8",
                    },
                    {
                        "internalType": "uint256",
                        "name": "expirationDate",
                        "type": "uint256",
                    },
                ],
                "internalType": "struct Applicant[]",
                "name": "",
                "type": "tuple[]",
            }
        ],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [
            {"internalType": "enum KYCStatus", "name": "status", "type": "uint8"}
        ],
        "name": "getAllKycByStatus",
        "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
        "name": "getKYCApplication",
        "outputs": [
            {
                "components": [
                    {"internalType": "address", "name": "user", "type": "address"},
                    {"internalType": "bytes32", "name": "digest", "type": "bytes32"},
                    {
                        "internalType": "enum KYCStatus",
                        "name": "status",
                        "type": "uint8",
                    },
                    {
                        "internalType": "uint256",
                        "name": "expirationDate",
                        "type": "uint256",
                    },
                ],
                "internalType": "struct Applicant",
                "name": "",
                "type": "tuple",
            }
        ],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
        "name": "getKYCStatus",
        "outputs": [{"internalType": "enum KYCStatus", "name": "", "type": "uint8"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
        "name": "isKycEvaluator",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "name": "kycEvaluators",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function",
    },
]
