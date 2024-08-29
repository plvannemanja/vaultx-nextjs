import { createThirdwebClient } from 'thirdweb';

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
// const clientId = import.meta.env.VITE_TEMPLATE_CLIENT_ID;

export const client = createThirdwebClient({
  // clientId: '6a17c322cbfb7ff47e4edac48f22414a',
  secretKey:
    'tarkwTUaJWyp_gp38KCZszQ4xWe92wFKAD1H3uiN50FH75gnrIbp7EqQnOnT6qw-TDTX4ciU3q_KEPVzT1Ci6A',
});
