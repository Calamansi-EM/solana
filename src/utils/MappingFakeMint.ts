// LIST https://github.com/solana-labs/token-list/blob/main/src/tokens/solana.tokenlist.json

export function convertMintToRealOnes(mint: string): string {
  switch (mint) {
    // QUOTE USDC
    case "7Z4CcHpzRyTEFXPbf93PbDqmAjgaTEUDKSUyR1WvSN8z": {
      return "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
    }

    // BASE wBTC
    case "8azQFUcBm6Mpy2NLgT6amMfyf8eBkMk4nkWVKjB6j5CJ": {
      return "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E";
    }

    // BASE wETH
    case "GVuYKUpKhjdTRFE4xYpfoGssvoPhLPTGivXhpbsQCu69": {
      return "2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk";
    }

    default: {
      return mint;
    }
  }
}
