import { Result } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';
import { createSigner } from './utils/createSigner';

task('mint-cnnoun', 'Mints a CNNoun')
  .addOptionalParam(
    'nounsToken',
    'The `NounsToken` contract address',
    '0xa0C8D694baCeeC69532E1547514B50006381dAAF',
    types.string,
  )
  .setAction(async ({ nounsToken }, { ethers }) => {
    const deployer = createSigner(ethers.provider);
    const nftFactory = await ethers.getContractFactory('NounsToken');
    const nftContract = nftFactory.connect(deployer).attach(nounsToken);

    const receipt = await (await nftContract.mint({ gasLimit: 10000000 })).wait();
    const nounCreated = receipt.events?.[1];
    const { tokenId } = nounCreated?.args as Result;

    console.log(`CNNoun minted with ID: ${tokenId.toString()}.`);

    const noundersDAO = await nftContract.noundersDAO();
    console.log(`Transfer token to ${noundersDAO}`);
    await nftContract.transferFrom(deployer.address, noundersDAO, tokenId);
  });
