// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

enum KYCStatus {
    Unknown,
    Accepted,
    Rejected,
    Pending
}

struct Applicant {
    address user;
    KYCStatus status;
    uint256 expirationDate;
}

struct indexValue {
    uint256 index;
    Applicant value;
}

struct ApplicationData {
    mapping(address => indexValue) data;
    address[] keys;
    uint256 length;
}

library Applications {
    function insert(
        ApplicationData storage self,
        address key,
        Applicant memory value
    ) internal returns (bool replaced) {
        uint keyIndex = self.data[key].index;
        self.data[key].value = value;
        if (keyIndex > 0) return true;
        else {
            keyIndex = self.keys.length;
            self.keys.push(key);
            self.data[key].index = keyIndex + 1;
            self.length++;
            return false;
        }
    }
}

contract KYC {
    ApplicationData public applicants;
    using Applications for ApplicationData;

    address[] public kycEvaluators;

    constructor(address[] memory _kycEvaluators) {
        kycEvaluators = _kycEvaluators;
    }

    event KYCStatusChanged(address indexed user, KYCStatus status);

    function isKycEvaluator(address user) public view returns (bool) {
        for (uint256 i = 0; i < kycEvaluators.length; i++) {
            if (kycEvaluators[i] == user) {
                return true;
            }
        }
        return false;
    }

    function createKYCApplication(address user) public {
        require(
            applicants.data[user].value.user == address(0),
            "KYC application already exists for this user"
        );
        applicants.insert(user, Applicant(user, KYCStatus.Pending, 0));
    }

    function decideKYC(address user, bool isAccepted) public {
        require(
            isKycEvaluator(msg.sender),
            "Only KYC evaluators can accept KYC"
        );
        applicants.insert(
            user,
            Applicant(
                user,
                isAccepted ? KYCStatus.Accepted : KYCStatus.Rejected,
                0
            )
        );
        emit KYCStatusChanged(user, applicants.data[user].value.status);
    }

    function getKYCStatus(address user) public view returns (KYCStatus) {
        require(
            isKycEvaluator(msg.sender) || msg.sender == user,
            "Only KYC evaluators or the user can see the KYC status"
        );
        require(
            applicants.data[user].value.user != address(0),
            "KYC application does not exist for this user"
        );
        return applicants.data[user].value.status;
    }

    function getAllKycByStatus(
        KYCStatus status
    ) public view returns (address[] memory) {
        require(
            isKycEvaluator(msg.sender),
            "Only KYC evaluators can see all KYC applications"
        );
        uint256 count = 0;
        for (uint256 i = 0; i < applicants.keys.length; i++) {
            address user = applicants.keys[i];
            if (applicants.data[user].value.status == status) {
                count++;
            }
        }
        address[] memory users = new address[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < applicants.keys.length; i++) {
            address user = applicants.keys[i];
            if (applicants.data[user].value.status == status) {
                users[index] = user;
                index++;
            }
        }
        return users;
    }

    function getAllKycApplications() public view returns (Applicant[] memory) {
        require(
            isKycEvaluator(msg.sender),
            "Only KYC evaluators can see all KYC applications"
        );
        Applicant[] memory allApplicants = new Applicant[](applicants.length);
        for (uint256 i = 0; i < applicants.keys.length; i++) {
            address user = applicants.keys[i];
            allApplicants[i] = applicants.data[user].value;
        }
        return allApplicants;
    }
}
