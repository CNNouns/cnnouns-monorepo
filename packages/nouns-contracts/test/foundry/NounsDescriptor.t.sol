// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import 'forge-std/StdJson.sol';
import { NounsDescriptor } from '../../contracts/NounsDescriptor.sol';
import { INounsSeeder } from '../../contracts/interfaces/INounsSeeder.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { Base64 } from 'base64-sol/base64.sol';
import { strings } from './lib/strings.sol';

contract NounsDescriptorWithRealArtTest is DeployUtils {
    using strings for *;
    using stdJson for string;
    using Base64 for string;

    NounsDescriptor descriptor;

    function setUp() public {
        descriptor = _deployAndPopulateDescriptor();
    }

    function testGeneratesValidTokenURI() public {
        string memory uri = descriptor.tokenURI(
            0,
            INounsSeeder.Seed({ background: 0, body: 0, head: 0, glasses: 0, skill: 0 })
        );

        string memory json = string(removeDataTypePrefix(uri).decode());
        string memory imageDecoded = string(removeDataTypePrefix(json.readString('.image')).decode());
        strings.slice memory imageSlice = imageDecoded.toSlice();

        assertEq(json.readString('.name'), 'CNNoun 0');
        assertEq(json.readString('.description'), 'CNNoun 0 is a member of the CNNouns DAO');
        assertEq(bytes(imageDecoded).length, 17683);
        assertTrue(
            imageSlice.startsWith(
                '<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">'
                    .toSlice()
            )
        );
        assertTrue(
            imageSlice.endsWith(
                '<rect width="10" height="10" x="150" y="310" fill="#1f1d29" /><rect width="10" height="10" x="160" y="310" fill="#62616d" /></svg>'
                    .toSlice()
            )
        );
    }
}
