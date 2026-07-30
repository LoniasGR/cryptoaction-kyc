import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("KYC", async function () {
  const { viem } = await network.create();
  const publicClient = await viem.getPublicClient();

  it("Should emit the KYCStatusChanged event when calling the decideKYC() function", async function () {
    const kyc = await viem.deployContract("KYC", [["0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"]]);

    await viem.assertions.emitWithArgs(
      kyc.write.decideKYC(["0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", true]),
      kyc,
      "KYCStatusChanged",
      ["0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", 1], // 1 corresponds to KYCStatus.Accepted
    );
  });
});