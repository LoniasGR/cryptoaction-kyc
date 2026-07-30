// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {KYC, KYCStatus} from "./KYC.sol";
import {Test} from "forge-std/Test.sol";

contract KYCTest is Test {
    KYC kyc;

    function setUp() public {
        address[] memory admins = new address[](1);
        admins[0] = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        kyc = new KYC(admins);
    }

    function test_applyForKYC() public {
        address user = address(0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199);
        vm.prank(user);
        kyc.createKYCApplication(user);
        vm.prank(user);
        require(
            kyc.getKYCStatus(user) == KYCStatus.Pending,
            "KYC status should be Pending after application"
        );
    }

    function test_decideKYC() public {
        address user = address(0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199);
        vm.prank(user);
        kyc.createKYCApplication(user);
        address admin = address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
        vm.prank(admin);
        kyc.decideKYC(user, true);
        vm.prank(user);
        require(
            kyc.getKYCStatus(user) == KYCStatus.Accepted,
            "KYC status should be Accepted after decision"
        );
    }

    function test_getAllKYCApplications() public {
        address user = address(0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199);
        vm.prank(user);
        kyc.createKYCApplication(user);
        address admin = address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
        vm.prank(admin);
        kyc.decideKYC(user, true);
        vm.prank(admin);
        address[] memory acceptedUsers = kyc.getAllKycByStatus(
            KYCStatus.Accepted
        );
        require(
            acceptedUsers.length == 1 && acceptedUsers[0] == user,
            "Should return the correct accepted user"
        );
    }

    function test_getKYCStatus() public {
        address user = address(0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199);
        vm.prank(user);
        kyc.createKYCApplication(user);
        address admin = address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
        vm.prank(admin);
        kyc.decideKYC(user, true);
        vm.prank(user);
        KYCStatus status = kyc.getKYCStatus(user);
        require(
            status == KYCStatus.Accepted,
            "KYC status should be Accepted for the user"
        );
    }
}
