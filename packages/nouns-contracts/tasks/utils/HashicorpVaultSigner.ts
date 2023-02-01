// Copyright © 2023 Otaku Coin Association
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {ethers, UnsignedTransaction, Signature, Bytes, BytesLike} from 'ethers';
import {strict as assert} from 'assert';
import axios, {AxiosRequestConfig} from 'axios';

const {
  arrayify,
  hexlify,
  keccak256,
  getAddress,
  hashMessage,
  splitSignature,
  joinSignature,
  resolveProperties,
  serializeTransaction,
} = ethers.utils;

export type HashicorpVaultSignerOptions = {
  baseUrl: string;
  token: string;
  pluginPath?: string;
  axiosRequestConfig?: AxiosRequestConfig;
};

const DEFAULT_PLUGIN_PATH = 'ethereum';

export class HashicorpVaultSigner extends ethers.Signer {
  readonly address: string;
  readonly options: HashicorpVaultSignerOptions;
  readonly provider: ethers.providers.Provider | undefined;

  /*
  constructor(
    address: string,
    baseUrl: string,
    token: string,
    provider?: ethers.providers.Provider,
  );

  constructor(
    address: string,
    options: HashicorpVaultSignerOptions,
    provider?: ethers.providers.Provider,
  );
 */

  constructor(
    address: string,
    options: HashicorpVaultSignerOptions,
    provider?: ethers.providers.Provider,
  ) {
    super();

    // ethers.utils.defineReadOnly may cause `error TS2564: Property 'X' has
    // no initializer and is not definitely assigned in the constructor.` and
    // I don't known how to solve it.
    this.address = getAddress(address);

    this.options = {...options};
    this.provider = provider;
  }

  getAddress(): Promise<string> {
    return Promise.resolve(this.address);
  }

  signDigestUrl(): string {
    const address = this.address.toLowerCase();
    return `${this.options.baseUrl}/v1/${
      this.options.pluginPath ?? DEFAULT_PLUGIN_PATH
    }/accounts/${address}/sign_digest`;
  }

  convineAxiosRequestConfig(
    axiosRequestConfig: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const conf = {
      ...(this.options.axiosRequestConfig ?? {}),
      ...axiosRequestConfig,
    };
    conf.headers = {
      ...(conf.headers ?? {}),
      ...{
        Authorization: `Bearer ${this.options.token}`,
      },
    };
    return conf;
  }

  async signDigest(digest: BytesLike): Promise<Signature> {
    const digestBytes = arrayify(digest);
    if (digestBytes.length !== 32) {
      ethers.logger.throwArgumentError('bad digest length', 'digest', digest);
    }
    const hash = hexlify(digestBytes);

    const url = this.signDigestUrl();
    let axiosConfig: AxiosRequestConfig = this.convineAxiosRequestConfig({
      url,
      method: 'post',
      responseType: 'json',
      data: {hash},
    });

    const resp = await axios(axiosConfig);
    return splitSignature(resp.data.data.signature);
  }

  async signMessage(message: string | Bytes): Promise<string> {
    return joinSignature(await this.signDigest(hashMessage(message)));
  }

  async signTransaction(
    transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>,
  ): Promise<string> {
    const tx = await resolveProperties(transaction);
    if (tx.from != null) {
      if (getAddress(tx.from) !== this.address) {
        ethers.logger.throwArgumentError(
          'transaction from address mismatch',
          'transaction.from',
          transaction.from,
        );
      }
      delete tx.from;
    }

    const signature = await this.signDigest(
      keccak256(serializeTransaction(<UnsignedTransaction>tx)),
    );
    const signedTx = serializeTransaction(<UnsignedTransaction>tx, signature);

    {
      //console.log('unsignedTx', tx);
      const parsedTx = ethers.utils.parseTransaction(signedTx);
      //console.log('signedTx', parsedTx);
      const address = ethers.utils.recoverAddress(
        keccak256(serializeTransaction(<UnsignedTransaction>tx)),
        signature,
      );
      //console.log('recoveredAddress', address);
      assert.equal(address, parsedTx.from);
    }
    //throw new Error('BLOCK SEND TRANSACTION');

    return signedTx;
  }

  connect(provider: ethers.providers.Provider): HashicorpVaultSigner {
    return new HashicorpVaultSigner(this.address, this.options, provider);
  }
}
