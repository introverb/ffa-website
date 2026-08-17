// FFA's on-chain donation/sale wallet (Ledger-secured ETH account).
// Same address receives ETH and any ERC-20 token (USDC, DAI, etc.)
// since it's a standard Ethereum mainnet address. Shared by the "Give
// in ETH" button and the ETH-only Ledgerworks checkout (The Pope) —
// one wallet, one place to change it if it ever moves.
export const FFA_ETH_ADDRESS = '0x54ce4Cf841ef47ed0773B0c197aceFCFc076cec7';

// Convert a decimal ETH string ("0.13") to its wei equivalent string.
// Done via string manipulation rather than float math because
// 0.13 * 1e18 = 1.3e17 exceeds JavaScript's MAX_SAFE_INTEGER, so
// the float would lose precision in the low digits. Strings are
// exact and BigInt-clean.
export function ethToWei(ethStr: string): string {
  const [intPart, fracPart = ''] = ethStr.split('.');
  const fracPadded = (fracPart + '0'.repeat(18)).slice(0, 18);
  const combined = (intPart + fracPadded).replace(/^0+/, '');
  return combined || '0';
}

// Build an EIP-681 payment URI for the FFA wallet. When passed an
// amount, wallet apps that scan the resulting QR code (Rainbow,
// MetaMask Mobile, Coinbase Wallet, etc.) open with both recipient
// AND amount pre-filled. Chain ID 1 = Ethereum mainnet. When called
// without an amount, returns the bare address so the QR encodes a
// recipient-only payment.
export function eip681Uri(address: string, ethAmount?: string): string {
  if (!ethAmount) return address;
  const wei = ethToWei(ethAmount);
  return `ethereum:${address}@1?value=${wei}`;
}
