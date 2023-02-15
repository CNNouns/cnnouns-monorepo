// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.15;

// LICENSE
// This file is a modified version of nounsDAO's NounsTokenHarness.sol:
// https://github.com/nounsDAO/nouns-monorepo/blob/854b9b64770401da71503972c65c4f9eda060ba6/packages/nouns-contracts/contracts/test/NounsTokenHarness.sol
//
// NounsTokenHarness.sol source code Copyright Nouns licensed under the GPL-3.0 license.
// With modifications by CNNouns DAO.

import { NounsToken } from '../NounsToken.sol';
import { INounsDescriptorMinimal } from '../interfaces/INounsDescriptorMinimal.sol';
import { INounsSeeder } from '../interfaces/INounsSeeder.sol';
import { IProxyRegistry } from '../external/opensea/IProxyRegistry.sol';

contract NounsTokenHarness is NounsToken {
    uint256 public currentNounId;

    constructor(
        address noundersDAO,
        address minter,
        INounsDescriptorMinimal descriptor,
        INounsSeeder seeder,
        IProxyRegistry proxyRegistry
    ) NounsToken(noundersDAO, minter, descriptor, seeder, proxyRegistry) {}

    function mintTo(address to) public {
        _mintTo(to, currentNounId++);
    }

    function mintMany(address to, uint256 amount) public {
        for (uint256 i = 0; i < amount; i++) {
            mintTo(to);
        }
    }

    function mintSeed(
        address to,
        uint48 background,
        uint48 body,
        uint48 head,
        uint48 glasses,
        uint48 skill
    ) public {
        seeds[currentNounId] = INounsSeeder.Seed({
            background: background,
            body: body,
            head: head,
            glasses: glasses,
            skill: skill
        });

        _mint(owner(), to, currentNounId++);
    }
}
