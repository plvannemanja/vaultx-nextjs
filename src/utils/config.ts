export const explorer =
  process.env.REACT_APP_NODE_ENV === "DEV"
    ? "https://amoy.polygonscan.com/"
    : "https://polygonscan.com";

export const contractAddress =
  process.env.REACT_APP_NODE_ENV === "DEV"
    ? "0xAAdcdEC98CE6C560C6e4b1C2B1b31258D5C1AF9A"
    : process.env.REACT_APP_CONTRACT_ADDRESS;