// eslint-disable-next-line import/extensions
import contractAbi from 'contracts/abi/AvatarNFT.json';
import WrongNetworkError from 'errors/WrongNetworkError';
import { Contract } from 'ethers';
import useWeb3Context from '../useWeb3Context';

/**
 * Hook for AvatarNFT Contract.
 */
export default function useAvatarNftContract() {
  const { provider, network } = useWeb3Context();

  function getContract(signerOrProvider) {
    return new Contract(
      process.env.NEXT_PUBLIC_AVATAR_NFT_CONTRACT_ADDRESS,
      contractAbi,
      signerOrProvider,
    );
  }

  /**
   * Mint Avatar NFT for current account.
   *
   * @param {string} tokenUrl URL to token metadata.
   * @returns Transaction.
   */
  async function mint(tokenUrl) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).mint(tokenUrl);
  }

  /**
   * Update URL to Avatar NFT metadata for specified token of current account.
   *
   * @param {number} tokenId Token ID.
   * @param {string} tokenUrl New URL to token metadata.
   * @returns Transaction.
   */
  async function update(tokenId, tokenUrl) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).update(tokenId, tokenUrl);
  }

  /**
   * Add positive or negative reputation to Avatar NFT.
   *
   * @param {number} tokenId Token ID.
   * @param {number} domainId Domain ID.
   * @param {number} ratingId Rating ID.
   * @param {number} amount Amount.
   * @returns Transaction.
   */
  async function addReputation(tokenId, domainId, ratingId, amount) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).repAdd(
      tokenId,
      domainId,
      ratingId,
      amount,
    );
  }

  return {
    mint,
    update,
    addReputation,
  };
}
