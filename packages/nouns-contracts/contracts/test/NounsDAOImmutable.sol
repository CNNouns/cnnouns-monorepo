// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

// LICENSE
// This file is a modified version of nounsDAO's NounsDAOImmutable.sol:
// https://github.com/nounsDAO/nouns-monorepo/blob/854b9b64770401da71503972c65c4f9eda060ba6/packages/nouns-contracts/contracts/test/NounsDAOImmutable.sol
//
// NounsDAOImmutable.sol licensed under the MIT license.
// With modifications by CNNouns DAO.
//
// Additional conditions of MIT can be found here: https://opensource.org/licenses/MIT

import '../governance/NounsDAOLogicV1.sol';

contract NounsDAOImmutable is NounsDAOLogicV1 {
    constructor(
        address timelock_,
        address nouns_,
        address admin_,
        address vetoer_,
        uint256 votingPeriod_,
        uint256 votingDelay_,
        uint256 proposalThreshold_,
        uint256 quorumVotesBPS_
    ) {
        admin = msg.sender;
        initialize(timelock_, nouns_, vetoer_, votingPeriod_, votingDelay_, proposalThreshold_, quorumVotesBPS_);

        admin = admin_;
    }

    function initialize(
        address timelock_,
        address nouns_,
        address vetoer_,
        uint256 votingPeriod_,
        uint256 votingDelay_,
        uint256 proposalThreshold_,
        uint256 quorumVotesBPS_
    ) public override {
        require(msg.sender == admin, 'NounsDAO::initialize: admin only');
        require(address(timelock) == address(0), 'NounsDAO::initialize: can only initialize once');

        timelock = INounsDAOExecutor(timelock_);
        nouns = NounsTokenLike(nouns_);
        vetoer = vetoer_;
        votingPeriod = votingPeriod_;
        votingDelay = votingDelay_;
        proposalThreshold = proposalThreshold_;
        quorumVotesBPS = quorumVotesBPS_;
    }
}
