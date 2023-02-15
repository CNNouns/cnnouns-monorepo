import { task } from 'hardhat/config';
import { createSigner } from './utils/createSigner';

task('cnnouns-verify-addresses', 'Show contract addresses for verification').setAction(
  async ({}, { ethers }) => {
    const signer = createSigner(ethers.provider);

    {
      const NounsDescriptorV2Factory = await ethers.getContractFactory('NounsDescriptorV2', {
        libraries: { NFTDescriptorV2: '0xf4aE9A4559523bf2f850d9eBC7f84544aBda1735' },
      });
      const nftDescriptorV2 = NounsDescriptorV2Factory.connect(signer).attach(
        '0x00Ad9422fF4A060858f184Afdf7576111076ccDF',
      );
      console.log('NounsDescriptorV2Factory');
      console.log('art', await nftDescriptorV2.art());
      console.log('renderer', await nftDescriptorV2.renderer());
      console.log('owner', await nftDescriptorV2.owner());
    }

    {
      const NounsTokenFactory = await ethers.getContractFactory('NounsToken');
      const nounsToken = NounsTokenFactory.connect(signer).attach(
        '0xa0C8D694baCeeC69532E1547514B50006381dAAF',
      );
      console.log('NounsToken');
      console.log('noundersDAO', await nounsToken.noundersDAO());
      console.log('minter', await nounsToken.minter());
      console.log('descriptor', await nounsToken.descriptor());
      console.log('seeder', await nounsToken.seeder());
      console.log('proxyRegistry', await nounsToken.proxyRegistry());
      console.log('owner', await nounsToken.owner());
    }

    {
      const NounsAuctionHouseFactory = await ethers.getContractFactory('NounsAuctionHouse');
      const nounsAuctionHouse = NounsAuctionHouseFactory.connect(signer).attach(
        '0x99A8AFdb4f8D6c02Cb5D5C27769a056aC79e45Fd',
      );
      console.log('NounsAuctionHouse');
      console.log('nouns', await nounsAuctionHouse.nouns());
      console.log('weth', await nounsAuctionHouse.weth());
    }

    {
      const NounsDAOExecutorFactory = await ethers.getContractFactory('NounsDAOExecutor');
      const nounsDAOExecutor = NounsDAOExecutorFactory.connect(signer).attach(
        '0x5FBf55eEc421db4bdEd1E2098048384fa18dC0B3',
      );
      console.log('NounsDAOExecutor');
      console.log('admin', await nounsDAOExecutor.admin());
    }

    {
      const NounsDAOProxyV2Factory = await ethers.getContractFactory('NounsDAOProxyV2');
      const nounsDAOProxyV2 = NounsDAOProxyV2Factory.connect(signer).attach(
        '0x8D566AAB17a2EEa02ef655a60F6188048169753D',
      );
      console.log('NounsDAOProxyV2');
      console.log('admin', await nounsDAOProxyV2.admin());
    }

    {
      const NounsDAOLogicV2Factory = await ethers.getContractFactory('NounsDAOLogicV2');
      const nounsDAOLogicV2 = NounsDAOLogicV2Factory.connect(signer).attach(
        '0x8D566AAB17a2EEa02ef655a60F6188048169753D',
      );
      console.log('NounsDAOLogicV2');
      console.log('timelock', await nounsDAOLogicV2.admin());
      console.log('nouns', await nounsDAOLogicV2.nouns());
      console.log('vetoer', await nounsDAOLogicV2.vetoer());
    }
  },
);
