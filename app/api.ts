import { account} from "./check/config";
import fetch from 'node-fetch';

const URL =
  process.env.ENVIRONMENT === "local"
    ? process.env.LOCALHOST
    : process.env.PROD_URL;

const tokenAddress=process.env.SUPER_TOKEN_ADDRESS;

const subgraphURL = "https://degenchain.subgraph.x.superfluid.dev";

export const followingQuery = (id) => `
query isFollowing {
  Wallet(input: {identity: "fc_fid:${id}", blockchain: ethereum}) {
    socialFollowers(input: {filter: {identity: {_in: ["fc_fid:${process.env.FID}"]}}}) {
      Follower {
        dappName
        dappSlug
        followingProfileId
        followerProfileId
        followerAddress {
          socials(input: {filter: {dappName: {_eq: farcaster}}}) {
            profileHandle
            profileName
            dappName
          }
        }
      }
    }
  }
}
`;



export const walletQuery = (id) => `
query GetAddressesOfFarcasters {
  Socials(input: {filter: {userId: {_eq: "${id}"}}, blockchain: ethereum}) {
    Social {
      userAssociatedAddresses
      profileName
    }
  }
}
`;

export const profileQuery = (id) => `
query GetAddressesOfFarcasters {
  Socials(input: {filter: {profileName: {_eq: "${id}"}}, blockchain: ethereum}) {
    Social {
      userAssociatedAddresses
    }
  }
}
`;

export const profileQueryLens = (id) => `
query GetAddressesOfFarcasters {
  Socials(
    input: {filter: {profileName: {_eq: "lens/${id}"}}, blockchain: ethereum}
  ) {
    Social {
      userAssociatedAddresses
    }
  }
}
`;

export const lastYoinkedQuery = (receiverAddress) => `
query GetLastYoinked {
  account(id: "${account.address.toLowerCase()}") {
    outflows(
      where: {receiver: "${receiverAddress.toLowerCase()}", token_contains_nocase: "${tokenAddress}"}
      orderBy: updatedAtTimestamp
      orderDirection: desc
    ) {
      updatedAtTimestamp
      token {
        id
      }
    }
  }
}
`;

export const totalStreamedQuery = (receiverAddress) => `
query totalStreamed {
  accountTokenSnapshots(where: {account: "${account.address.toLowerCase()}", token: "${tokenAddress?.toLocaleLowerCase()}"}) {
    account {
      outflows(where: {receiver: "${receiverAddress.toLowerCase()}"}) {
        streamedUntilUpdatedAt
      }
    }
  }
}
`
export const totalStreamedQueryByTimestamp = (receiverAddress,timestamp) => `
query totalStreamed {
  accountTokenSnapshots(where: {account: "${account.address.toLowerCase()}", token: "${tokenAddress?.toLocaleLowerCase()}"}) {
    account {
      outflows(where: {receiver: "${receiverAddress.toLowerCase()}", createdAtTimestamp_gt: "${timestamp}"}) {
        streamedUntilUpdatedAt
      }
    }
  }
}
`

// Function to perform the POST request and handle the response
export async function fetchSubgraphData(myQuery) {
  const requestData = {
    query: myQuery,
  };

  // Accessing the token from environment variables
  const token = process.env.BEARER_TOKEN;

  try {
    const response = await fetch(subgraphURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // Adding the Authorization header
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    return data;

  } catch (error) {
    console.error('There was a problem with your fetch operation:', error);
    throw error; // Rethrow or handle as needed
  }
}




export async function updateProfileData(profileHandle: string, address: string, timestamp: number) {
  const url = `${URL}/currentYoinkerPost`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profileHandle, address, timestamp }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Success:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}
