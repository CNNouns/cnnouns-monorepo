import { task, types } from 'hardhat/config';
import { createSigner } from './utils/createSigner';

task('cnnouns-start-auction', 'Start the first auction')
  .addOptionalParam(
    'nounsAuctionHouseProxy',
    'The `NounsAuctionHouseProxy` contract address',
    '0x765E17E1F4b4b4d2e6f42413dDE3B7CfEa8bB1fC',
    types.string,
  )
  .addOptionalParam(
    'nounsDaoExecutor',
    'The `NounsDAOExecutor` contract address',
    '0xDa06AC4272B4D050e1b64B35d66FAa5E2D3092ec',
    types.string,
  )
  .setAction(async (args, { ethers, run }) => {
    const signer = createSigner(ethers.provider);

    // kick off the first auction and transfer ownership of the auction house
    // to the CNNouns DAO executor.
    console.log('Start auction', args.nounsAuctionHouseProxy);
    const auctonHouseFactory = await ethers.getContractFactory('NounsAuctionHouse');
    const auctionHouse = auctonHouseFactory.connect(signer).attach(args.nounsAuctionHouseProxy);
    await auctionHouse.unpause({
      gasLimit: 1_000_000,
    });

    console.log('Transfer ownership', args.nounsDaoExecutor);
    await auctionHouse.transferOwnership(args.nounsDaoExecutor);
    console.log(
      'Started the first auction and transferred ownership of the auction house to the executor.',
    );
  });
