import { task, types } from 'hardhat/config';
import { createSigner } from './utils/createSigner';

task('cnnouns-verify-ownership', 'Verify ownership of contracts')
  .addOptionalParam(
    'nounsDaoExecutor',
    'The `NounsDAOExecutor` contract address',
    '0x52C5DcF49f10C827E070cee4aDf1D006942eAaB6',
    types.string,
  )
  .addOptionalParam(
    'nounsDescriptorV2',
    'The `NounsDescriptorV2` contract address',
    '0x08d84A6cd9523Ddc7a16F94D004Db985C3406a70',
    types.string,
  )
  .addOptionalParam(
    'nftDescriptorV2',
    'The `NFTDescriptorV2` contract address',
    '0x1EfBCe9A5A4add7a85cC4b30416D86E01Db2BFF5',
    types.string,
  )
  .addOptionalParam(
    'nounsToken',
    'The `NounsToken` contract address',
    '0xAc3aaFF5576CD40343651f1a32DD160Df3b36537',
    types.string,
  )
  .addOptionalParam(
    'nounsAuctionHouseProxyAdmin',
    'The `NounsAuctionHouseProxyAdmin` contract address',
    '0xCc0751a9c90547BaaDF1436E100255AAf2B889C6',
    types.string,
  )
  .addOptionalParam(
    'nounsAuctionHouseProxy',
    'The `NounsAuctionHouseProxy` contract address',
    '0x9d1e0eC380B8EE1683FaAfdd2651432Ef641Be38',
    types.string,
  )
  .setAction(async (args, { ethers }) => {
    const contracts = {
      NounsDescriptorV2: {
        address: args.nounsDescriptorV2,
        libraries: { NFTDescriptorV2: args.nftDescriptorV2 },
      },
      NounsToken: { address: args.nounsToken, libraries: undefined },
      NounsAuctionHouseProxyAdmin: { address: args.nounsAuctionHouseProxyAdmin, libraries: undefined },
      NounsAuctionHouse: { address: args.nounsAuctionHouseProxy, libraries: undefined },
    };

    const signer = createSigner(ethers.provider);
    for (const [key, { address, libraries }] of Object.entries(contracts)) {
      const factory = await ethers.getContractFactory(key, { libraries: libraries });
      const contract = factory.connect(signer).attach(address);
      const owner = await contract.owner();
      console.log(
        owner === args.nounsDaoExecutor ? 'match:' : 'unmatch:',
        `${key}=${address} owner=${owner}`,
      );
    }
  });
