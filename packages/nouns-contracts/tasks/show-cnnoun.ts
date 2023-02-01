import { Result } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';
import { createSigner } from './utils/createSigner';

task('show-cnnoun', 'Show a Noun')
  .addOptionalParam(
    'nounsToken',
    'The `NounsToken` contract address',
    '0xa513e6e4b8f2a923d98304ec87f64353c4d5c853',
    types.string,
  )
  .setAction(async ({ nounsToken }, { ethers }) => {
    const signer = createSigner(ethers.provider);
    const nftFactory = await ethers.getContractFactory('NounsToken');
    const nftContract = nftFactory.connect(signer).attach(nounsToken);

    console.log('token', nounsToken);
    console.log('minter', await nftContract.minter());

    const owner = await nftContract.ownerOf(0);
    console.log('owner', owner);

    const tokenURI = await nftContract.tokenURI(0, { gasLimit: 200_000_000 });
    console.log('tokenURI', tokenURI);
  });
