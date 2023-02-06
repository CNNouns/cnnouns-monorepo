import { Result } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';
import { createSigner } from './utils/createSigner';

task('cnnouns-verify-ownership', 'Verify ownership of contracts')
  .addOptionalParam(
    'nounsDaoExecutor',
    'The `NounsDAOExecutor` contract address',
    '0xDa06AC4272B4D050e1b64B35d66FAa5E2D3092ec',
    types.string,
  )
  .addOptionalParam(
    'nounsDescriptorV2',
    'The `NounsDescriptorV2` contract address',
    '0x0FC517F1f5f632b459587fa432083Ef9564c7E3C',
    types.string,
  )
  .addOptionalParam(
    'nftDescriptorV2',
    'The `NFTDescriptorV2` contract address',
    '0x8428537376334A145874158477ec1c48CFe9F169',
    types.string,
  )
  .addOptionalParam(
    'nounsToken',
    'The `NounsToken` contract address',
    '0xc16521E252A44424eD0e50da1167e8a9c8a3c8a2',
    types.string,
  )
  .addOptionalParam(
    'nounsAuctionHouseProxyAdmin',
    'The `NounsAuctionHouseProxyAdmin` contract address',
    '0xb212e37d7FE3ba41143418756Cb914ae1177A602',
    types.string,
  )
  .addOptionalParam(
    'nounsAuctionHouseProxy',
    'The `NounsAuctionHouseProxy` contract address',
    '0x765E17E1F4b4b4d2e6f42413dDE3B7CfEa8bB1fC',
    types.string,
  )
  .setAction(async (args, { ethers, run }) => {
    const contracts = {
      NounsDescriptorV2: {
        address: args.nounsDescriptorV2,
        libraries: { NFTDescriptorV2: args.nftDescriptorV2 },
      },
      NounsToken: { address: args.nounsToken, libraries: undefined },
      NounsAuctionHouseProxyAdmin: { address: args.nounsToken, libraries: undefined },
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
