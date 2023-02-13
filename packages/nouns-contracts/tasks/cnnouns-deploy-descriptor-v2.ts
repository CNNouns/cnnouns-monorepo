import { task, types } from 'hardhat/config';
import { ContractName, DeployedContract } from './types';
import { printContractsTable } from './utils';
import { createSigner } from './utils/createSigner';

async function delay(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, 1000 * seconds));
}

task('cnnouns-deploy-descriptor-v2', 'Deploy DescriptorV2 & populate it with art')
  .addParam(
    'daoExecutor',
    'The address of the NounsDAOExecutor that should be the owner of the descriptor.',
  )
  .addOptionalParam(
    'nftDescriptor',
    'The `NFTDescriptorV2` contract address',
    '0xf4aE9A4559523bf2f850d9eBC7f84544aBda1735',
    types.string,
  )
  .addOptionalParam(
    'inflator',
    'The `Inflator` contract address',
    '0x4F6e334E6aE91990435e32e111198c3C993820E3',
    types.string,
  )
  .addOptionalParam(
    'svgRenderer',
    'The `SVGRenderer` contract address',
    '0xc39B813Ec27230add8BED45a664Bb074204944F2',
    types.string,
  )
  .setAction(
    async ({ daoExecutor, nftDescriptor, inflator, svgRenderer }, { ethers, run, network }) => {
      const contracts: Record<ContractName, DeployedContract> = {} as Record<
        ContractName,
        DeployedContract
      >;
      const deployer = await createSigner(ethers.provider);
      console.log(`Deploying from address ${deployer.address}`);

      const nonce = await deployer.getTransactionCount();
      const expectedNounsArtAddress = ethers.utils.getContractAddress({
        from: deployer.address,
        nonce: nonce + 1,
      });

      console.log('Deploying contracts...');

      console.log('NounsDescriptorV2');
      const nounsDescriptorFactory = (
        await ethers.getContractFactory('NounsDescriptorV2', {
          libraries: {
            NFTDescriptorV2: nftDescriptor,
          },
        })
      ).connect(deployer);
      const nounsDescriptor = await nounsDescriptorFactory.deploy(
        expectedNounsArtAddress,
        svgRenderer,
      );
      contracts.NounsDescriptorV2 = {
        name: 'NounsDescriptorV2',
        address: nounsDescriptor.address,
        constructorArguments: [expectedNounsArtAddress, svgRenderer],
        instance: nounsDescriptor,
        libraries: {
          NFTDescriptorV2: nftDescriptor,
        },
      };

      console.log('NounsArt');
      const art = await (await ethers.getContractFactory('NounsArt', deployer))
        .connect(deployer)
        .deploy(nounsDescriptor.address, inflator);
      contracts.NounsArt = {
        name: 'NounsArt',
        address: art.address,
        constructorArguments: [nounsDescriptor.address, inflator],
        instance: art,
        libraries: {},
      };

      console.log('Waiting for contracts to be deployed');
      for (const c of Object.values<DeployedContract>(contracts)) {
        console.log(`Waiting for ${c.name} to be deployed`);
        await c.instance.deployTransaction.wait();
        console.log('Done');
      }

      console.log('Deployment complete:');
      printContractsTable(contracts);

      console.log('Populating Descriptor...');
      await run('cnnouns-populate-descriptor', {
        nftDescriptor: nftDescriptor,
        nounsDescriptor: contracts.NounsDescriptorV2.address,
      });
      console.log('Population complete.');

      console.log('Transfering ownership to DAO Executor...');
      await nounsDescriptor.transferOwnership(daoExecutor);
      console.log('Transfer complete.');

      if (network.name !== 'localhost') {
        console.log('Waiting 1 minute before verifying contracts on Etherscan');
        await delay(60);

        console.log('Verifying contracts on Etherscan...');
        await run('verify-etherscan', {
          contracts,
        });
        console.log('Verify complete.');
      }
    },
  );
