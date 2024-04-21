import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import {
  followingQuery,
  walletQuery,
  lastYoinkedQuery,
  fetchSubgraphData,
  updateProfileData,
} from "../api";
import { init, fetchQuery } from "@airstack/node";
import { account, walletClient, publicClient } from "./config";
import ABI from "./abi.json";
import {URL} from "./../../constants"
import { getFrameMessage } from "frames.js";

// USDC contract address on Base
const contractAddress = "0x053CD976a539cC885Dd141BE360635Fe9D259714";
const superTokenAddress = process.env.SUPER_TOKEN_ADDRESS as `0x${string}`;

init(process.env.AIRSTACK_KEY || "");

const noConnectedString = "https://i.imgur.com/rJ117At.png";

const reyoinkedString ="https://i.imgur.com/QllMs7k.png";

const messageInvalid = `https://i.imgur.com/U17WPed.png`;

//const flowRate = 327245050000000000;
const flowRate = 100000000000000000;

const coolDown = 600;

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



async function yoink(_to, _flowRate){
  await walletClient.writeContract({
    address: contractAddress,
    abi: ABI,
    functionName: "yoink",
    account,
    args: [_to, _flowRate],
  });
}


export async function POST(req) {
  const data = await req.json();

  const { untrustedData } = data;
  const { fid } = untrustedData;

  const frameMessage = await getFrameMessage(data);
  if (process.env.ENVIRONMENT != "local") {
    if (!frameMessage || !frameMessage.isValid) {
      return new NextResponse(_html(messageInvalid, "🚩 Retry", "post", `${URL}`));
    }
  }

  const _query2 = walletQuery(fid);
  const { data: results2 } = await fetchQuery(_query2, {
    id: fid,
  });

  const socials = results2.Socials.Social;
  const newAddress = socials[0].userAssociatedAddresses[1];
  const userHandle =socials[0].profileName;

  if (!newAddress) {
    return new NextResponse(
      _html(noConnectedString, "🚩 Retry", "post", `${URL}`)
    );
  }

  let lastYoink = await kv.hget("timestamps", userHandle);
  if (!lastYoink) {
    lastYoink = 0;
  }
  const now = Math.floor(Date.now() / 1000);

  const fetchData = await fetch(`${URL}/currentYoinkerApi`);
  const fetchDataJson = await fetchData.json();
  const currentYoinkerAddress = fetchDataJson.address;

  if (currentYoinkerAddress.toLowerCase() != newAddress.toLowerCase()) {
    if (Number(lastYoink) + coolDown > now) {
      return new NextResponse(
        _html(
          reyoinkedString,
          "🚩 Retry",
          "post",
          `${URL}`
        )
      );
    }

    yoink(newAddress, flowRate);
  } else if (currentYoinkerAddress.toLowerCase() == newAddress.toLowerCase()) {
    return new NextResponse(
      _html(
        "https://i.imgur.com/o54tvZD.gif",
        "See in Dashboard 🌊",
        "link",
        `https://app.superfluid.finance/?view=${newAddress}`
      )
    );
  }

  await updateProfileData(userHandle, newAddress, now);

  return new NextResponse(
    _html(
      "https://i.imgur.com/o54tvZD.gif",
      "See in Dashboard 🌊",
      "link",
      `https://app.superfluid.finance/?view=${newAddress}`
    )
  );
}

export const dynamic = "force-dynamic";
