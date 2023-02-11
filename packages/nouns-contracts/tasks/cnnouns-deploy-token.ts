import { task, types } from 'hardhat/config';
import { ChainId, ContractName, DeployedContract } from './types';
import { printContractsTable } from './utils';
import { createSigner } from './utils/createSigner';

async function delay(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, 1000 * seconds));
}

const proxyRegistries: Record<number, string> = {
  [ChainId.Mainnet]: '0xa5409ec958c83c3f309868babaca7c86dcb077c1',
  [ChainId.Rinkeby]: '0xf57b2c51ded3a29e6891aba85459d600256cf317',
};

task('cnnouns-deploy-token', 'Deploy NFT')
  .addOptionalParam(
    'noundersdao',
    'The nounders DAO contract address',
    undefined,
    types.string,
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
  .addOptionalParam(
    'nounsSeeder',
    'The `NounsSeeder` contract address',
    '0xD3285Ae848083375a7dc42be8D6Ccfba5F663a65',
    types.string,
  )
  .setAction(async ({ noundersdao, nftDescriptor, inflator, svgRenderer, nounsSeeder }, { ethers, run }) => {
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

    console.log("NounsDescriptorV2");
    const nounsDescriptorFactory = (await ethers.getContractFactory('NounsDescriptorV2', {
      libraries: {
        NFTDescriptorV2: nftDescriptor,
      },
    })).connect(deployer);
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

    console.log("NounsArt");
    const art = await (
      (await ethers.getContractFactory('NounsArt', deployer)).connect(deployer)
    ).deploy(nounsDescriptor.address, inflator);
    contracts.NounsArt = {
      name: 'NounsArt',
      address: art.address,
      constructorArguments: [nounsDescriptor.address, inflator],
      instance: art,
      libraries: {},
    };

    console.log("NounsToken");
    const network = await ethers.provider.getNetwork();
    const proxyRegistryAddress = proxyRegistries[network.chainId] ?? proxyRegistries[ChainId.Rinkeby];

    const token = await (
      (await ethers.getContractFactory('NounsToken', deployer)).connect(deployer)
    ).deploy(
      noundersdao,
      deployer.address,
      nounsDescriptor.address,
      nounsSeeder,
      proxyRegistryAddress,
    )
    contracts.NounsToken = {
      name: 'NounsToken',
      address: token.address,
      constructorArguments: [
        noundersdao,
        deployer.address,
        nounsDescriptor.address,
        nounsSeeder,
        proxyRegistryAddress,
      ],
      instance: token,
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

    if (network.name !== 'localhost') {
      console.log('Waiting 1 minute before verifying contracts on Etherscan');
      await delay(60);

      console.log('Verifying contracts on Etherscan...');
      await run('verify-etherscan', {
        contracts,
      });
      console.log('Verify complete.');
    }
  });
