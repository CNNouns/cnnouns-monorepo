import { ethers } from 'ethers';
import https from 'https';
import { AxiosRequestConfig } from 'axios';
import { HashicorpVaultSigner, HashicorpVaultSignerOptions } from './HashicorpVaultSigner';

const axiosRequestConfig: AxiosRequestConfig = {
  httpsAgent: new https.Agent({
    keepAlive: true,
    rejectUnauthorized: false,
  }),
};

export function createSigner(provider: ethers.providers.Provider): HashicorpVaultSigner {
  if (process.env.ADDRESS_FROM === undefined) {
    throw new Error('Missing ADDRESS_FROM');
  }
  if (process.env.VAULT_ADDR === undefined) {
    throw new Error('Missing VAULT_ADDR');
  }
  if (process.env.VAULT_TOKEN === undefined) {
    throw new Error('Missing VAULT_TOKEN');
  }

  const address: string = process.env.ADDRESS_FROM;
  const options: HashicorpVaultSignerOptions = {
    baseUrl: process.env.VAULT_ADDR,
    token: process.env.VAULT_TOKEN,
    axiosRequestConfig: axiosRequestConfig,
  };
  return new HashicorpVaultSigner(address, options, provider);
}
