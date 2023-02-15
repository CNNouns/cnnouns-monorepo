import { task, types } from 'hardhat/config';
import ImageData from '../files/image-data-v2.json';
import { dataToDescriptorInput } from './utils';
import { createSigner } from './utils/createSigner';

task('cnnouns-populate-descriptor', 'Populates the descriptor with color palettes and Noun parts')
  .addOptionalParam(
    'nftDescriptor',
    'The `NFTDescriptorV2` contract address',
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    types.string,
  )
  .addOptionalParam(
    'nounsDescriptor',
    'The `NounsDescriptorV2` contract address',
    '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    types.string,
  )
  .setAction(async ({ nftDescriptor, nounsDescriptor }, { ethers, network }) => {
    const options = { gasLimit: network.name === 'hardhat' ? 30000000 : undefined };
    const signer = createSigner(ethers.provider);

    const descriptorFactory = await ethers.getContractFactory('NounsDescriptorV2', {
      libraries: {
        NFTDescriptorV2: nftDescriptor,
      },
    });
    const descriptorContract = descriptorFactory.connect(signer).attach(nounsDescriptor);

    const { bgcolors, palette, images } = ImageData;
    const { bodies, heads, glasses, skills } = images;

    const bodiesPage = dataToDescriptorInput(bodies.map(({ data }) => data));
    const headsPage = dataToDescriptorInput(heads.map(({ data }) => data));
    const glassesPage = dataToDescriptorInput(glasses.map(({ data }) => data));
    const skillsPage = dataToDescriptorInput(skills.map(({ data }) => data));

    await (await descriptorContract.addManyBackgrounds(bgcolors)).wait();
    await (await descriptorContract.setPalette(0, `0x000000${palette.join('')}`)).wait();

    await (
      await descriptorContract.addBodies(
        bodiesPage.encodedCompressed,
        bodiesPage.originalLength,
        bodiesPage.itemCount,
        options,
      )
    ).wait();
    await (
      await descriptorContract.addHeads(
        headsPage.encodedCompressed,
        headsPage.originalLength,
        headsPage.itemCount,
        options,
      )
    ).wait();

    await (
      await descriptorContract.addGlasses(
        glassesPage.encodedCompressed,
        glassesPage.originalLength,
        glassesPage.itemCount,
        options,
      )
    ).wait();
    await (
      await descriptorContract.addSkills(
        skillsPage.encodedCompressed,
        skillsPage.originalLength,
        skillsPage.itemCount,
        options,
      )
    ).wait();

    console.log('Descriptor populated with palettes and parts.');
  });
