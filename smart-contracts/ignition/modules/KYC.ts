import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("KYCModule", (m) => {
  const kyc = m.contract("contracts/KYC.sol:KYC", [["0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"]]);
});
