import { task, types } from 'hardhat/config';
import { createSigner } from './utils/createSigner';

task('cnnouns-verify-ownership', 'Verify ownership of contracts')
  .addOptionalParam(
    'nounsDaoExecutor',
    'The `NounsDAOExecutor` contract address',
    '0x5FBf55eEc421db4bdEd1E2098048384fa18dC0B3',
    types.string,
  )
  .addOptionalParam(
    'nounsDescriptorV2',
    'The `NounsDescriptorV2` contract address',
    '0x00Ad9422fF4A060858f184Afdf7576111076ccDF',
    types.string,
  )
  .addOptionalParam(
    'nftDescriptorV2',
    'The `NFTDescriptorV2` contract address',
    '0xf4aE9A4559523bf2f850d9eBC7f84544aBda1735',
    types.string,
  )
  .addOptionalParam(
    'nounsToken',
    'The `NounsToken` contract address',
    '0xa0C8D694baCeeC69532E1547514B50006381dAAF',
    types.string,
  )
  .addOptionalParam(
    'nounsAuctionHouseProxyAdmin',
    'The `NounsAuctionHouseProxyAdmin` contract address',
    '0xAADe9aB82135F341EA175d2414e49D6A8b36B28F',
    types.string,
  )
  .addOptionalParam(
    'nounsAuctionHouseProxy',
    'The `NounsAuctionHouseProxy` contract address',
    '0x99A8AFdb4f8D6c02Cb5D5C27769a056aC79e45Fd',
    types.string,
  )
  .setAction(async (args, { ethers }) => {
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
