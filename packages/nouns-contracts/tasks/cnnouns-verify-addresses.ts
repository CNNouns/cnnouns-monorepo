import { task } from 'hardhat/config';
import { createSigner } from './utils/createSigner';

task('cnnouns-verify-addresses', 'Show contract addresses for verification').setAction(
  async ({}, { ethers }) => {
    const signer = createSigner(ethers.provider);

    {
      const NounsDescriptorV2Factory = await ethers.getContractFactory('NounsDescriptorV2', {
        libraries: { NFTDescriptorV2: '0x1EfBCe9A5A4add7a85cC4b30416D86E01Db2BFF5' },
      });
      const nounsDescriptorV2 = NounsDescriptorV2Factory.connect(signer).attach(
        '0x08d84A6cd9523Ddc7a16F94D004Db985C3406a70',
      );
      console.log('NounsDescriptorV2Factory');
      console.log('art', await nounsDescriptorV2.art());
      console.log('renderer', await nounsDescriptorV2.renderer());
      console.log('owner', await nounsDescriptorV2.owner());
    }

    {
      const NounsTokenFactory = await ethers.getContractFactory('NounsToken');
      const nounsToken = NounsTokenFactory.connect(signer).attach(
        '0xAc3aaFF5576CD40343651f1a32DD160Df3b36537',
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
        '0x9d1e0eC380B8EE1683FaAfdd2651432Ef641Be38',
      );
      console.log('NounsAuctionHouse');
      console.log('nouns', await nounsAuctionHouse.nouns());
      console.log('weth', await nounsAuctionHouse.weth());
    }

    {
      const NounsDAOExecutorFactory = await ethers.getContractFactory('NounsDAOExecutor');
      const nounsDAOExecutor = NounsDAOExecutorFactory.connect(signer).attach(
        '0x52C5DcF49f10C827E070cee4aDf1D006942eAaB6',
      );
      console.log('NounsDAOExecutor');
      console.log('admin', await nounsDAOExecutor.admin());
    }

    {
      const NounsDAOProxyV2Factory = await ethers.getContractFactory('NounsDAOProxyV2');
      const nounsDAOProxyV2 = NounsDAOProxyV2Factory.connect(signer).attach(
        '0x19C2F22832dda0A8F8dA411a24eA25C8CE84f359',
      );
      console.log('NounsDAOProxyV2');
      console.log('admin', await nounsDAOProxyV2.admin());
    }

    {
      const NounsDAOLogicV2Factory = await ethers.getContractFactory('NounsDAOLogicV2');
      const nounsDAOLogicV2 = NounsDAOLogicV2Factory.connect(signer).attach(
        '0x19C2F22832dda0A8F8dA411a24eA25C8CE84f359',
      );
      console.log('NounsDAOLogicV2');
      console.log('timelock', await nounsDAOLogicV2.admin());
      console.log('nouns', await nounsDAOLogicV2.nouns());
      console.log('vetoer', await nounsDAOLogicV2.vetoer());
    }
  },
);
