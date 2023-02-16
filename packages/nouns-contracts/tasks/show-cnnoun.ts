import { task, types } from 'hardhat/config';
import { createSigner } from './utils/createSigner';

task('show-cnnoun', 'Show a Noun')
  .addOptionalParam(
    'nounsToken',
    'The `NounsToken` contract address',
    '0xAc3aaFF5576CD40343651f1a32DD160Df3b36537',
    types.string,
  )
  .addOptionalParam(
    'nftDescriptor',
    'The `NFTDescriptorV2` contract address',
    '0x1EfBCe9A5A4add7a85cC4b30416D86E01Db2BFF5',
    types.string,
  )
  .addOptionalParam(
    'nounsDescriptor',
    'The `NounsDescriptorV2` contract address',
    '0x08d84A6cd9523Ddc7a16F94D004Db985C3406a70',
    types.string,
  )
  .addOptionalParam('tokenId', '`NounsToken` id', 0, types.int)
  .setAction(async ({ nounsToken, nftDescriptor, nounsDescriptor, tokenId }, { ethers }) => {
    console.log('nounsToken', nounsToken);
    console.log('nftDescriptor', nftDescriptor);
    console.log('nounsDescriptor', nounsDescriptor);
    console.log('tokenId', tokenId);

    const signer = createSigner(ethers.provider);
    const nftFactory = await ethers.getContractFactory('NounsToken');
    const nftContract = nftFactory.connect(signer).attach(nounsToken);

    console.log('minter', await nftContract.minter());

    const owner = await nftContract.ownerOf(tokenId);
    console.log('owner', owner);

    const seeds = await nftContract.seeds(tokenId);
    console.log('seeds', seeds);

    const descriptorFactory = await ethers.getContractFactory('NounsDescriptorV2', {
      libraries: {
        NFTDescriptorV2: nftDescriptor,
      },
    });
    const descriptorContract = descriptorFactory.connect(signer).attach(nounsDescriptor);

    const art = await descriptorContract.art();
    console.log('art', art);

    const extra = { gasLimit: 200_000_000 };
    const background = await descriptorContract.backgrounds(seeds.background);
    console.log('background', background);
    const head = await descriptorContract.heads(seeds.head, extra);
    console.log('head', head);
    const body = await descriptorContract.bodies(seeds.body, extra);
    console.log('body', body);
    const glasses = await descriptorContract.glasses(seeds.glasses, extra);
    console.log('glasses', glasses);
    const skill = await descriptorContract.skills(seeds.skill, extra);
    console.log('skill', skill);

    const svg = await descriptorContract.generateSVGImage(seeds, extra);
    console.log('svg', `data:image/svg+xml;base64,${svg}`);

    const tokenURI = await nftContract.tokenURI(tokenId, extra);
    console.log('tokenURI', tokenURI);
  });
