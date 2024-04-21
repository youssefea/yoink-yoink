import { NextResponse } from "next/server";
import {
  followingQuery,
  walletQuery,
  lastYoinkedQuery,
  fetchSubgraphData,
} from "../api";
import { init, fetchQuery } from "@airstack/node";
import { account, walletClient, publicClient } from "./config";
import ERC20ABI from "./erc20abi.json";
import { formatEther } from "viem";
import { getFrameMessage } from "frames.js";

import {
  checkIsFollowingFarcasterUser,
  CheckIsFollowingFarcasterUserInput,
  CheckIsFollowingFarcasterUserOutput,
} from "@airstack/frames";
import { URL } from "./../../constants";

init(process.env.AIRSTACK_KEY || "");

const tokenAddress = process.env.SUPER_TOKEN_ADDRESS as `0x${string}`;

const notFollowing = `https://i.imgur.com/V2MXezK.png`;
const didNotRecast = `https://i.imgur.com/PyyC6KC.png`;
const messageInvalid = `https://i.imgur.com/U17WPed.png`;

const welcomeString = (yoinker, totalLeft) =>
  `_${yoinker}_has the stream ! _${totalLeft} $YOINK left in the pot`;
const gameEnded =
  "_Too late!_No more $YOINK left in the pot_Follow @superfluid for more $YOINK streams!_";

function getImgUrl(myString: string) {
  const myStringEncoded = encodeURIComponent(myString);
  return `${URL}/imgen?text=${myStringEncoded}&color=black,superfluid,black,black,black,black,black,black&size=10,24,8,8,8,8,8,8,8`;
}

const _html = (img, msg, action, url) => `
<!DOCTYPE html>
<html>
  <head>
    <title>Frame</title>
    <meta property="og:image" content="${img}" />
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${img}" />
    <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
    <meta property="fc:frame:button:1" content="${msg}" />
    <meta property="fc:frame:button:1:action" content="${action}" />
    <meta property="fc:frame:button:1:target" content="${url}" />
    <meta property="fc:frame:button:2" content="🏆 Go to Leaderboard" />
    <meta property="fc:frame:button:2:action" content="link" />
    <meta property="fc:frame:button:2:target" content="${URL}/leaderboard" />
    <meta property="fc:frame:post_url" content="${url}" />
  </head>
</html>
`;

const minBalance = 5000;

export async function POST(req) {
  const data = await req.json();

  const { untrustedData } = data;
  const { fid } = untrustedData;

  const frameMessage = await getFrameMessage(data);
  if (process.env.ENVIRONMENT != "local") {
    if (!frameMessage || !frameMessage.isValid) {
      return new NextResponse(_html(messageInvalid, "🚩 Retry", "post", `${URL}`));
    }
    if (!frameMessage.recastedCast) {
      return new NextResponse(
        _html(didNotRecast, "🚩 Retry", "post", `${URL}`)
      );
    }
  }

  const fetchDataTotalStreams = await fetch(`${URL}/totalYoinked`);
  const fetchDataTotalStreamsJson = await fetchDataTotalStreams.json();
  const totalStreams = fetchDataTotalStreamsJson.totalScore;
  const fetchDataCurrentYoinker = await fetch(`${URL}/currentYoinkerApi`);
  const fetchDataCurrentYoinkerJson = await fetchDataCurrentYoinker.json();
  const currentYoinker = fetchDataCurrentYoinkerJson.profileHandle;

  const balanceOfAccount: any = await publicClient.readContract({
    address: tokenAddress,
    abi: ERC20ABI,
    functionName: "balanceOf",
    args: [account.address],
  });

  const totalLeft = Number(formatEther(balanceOfAccount));
  console.log(totalLeft);

  return new NextResponse(
    _html("https://i.imgur.com/ZIfVSfC.png", "🚩YOINK", "post", `${URL}/check`)
  );
}

export const dynamic = "force-dynamic";
