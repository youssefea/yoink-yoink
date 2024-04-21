export const runtime = 'edge'
import { URL } from '../constants'


const myString = `_StreamYoink!_Click to yoink the stream _Earn $YOINK every second`;
const myStringEncoded = encodeURIComponent(myString);
const image = "https://i.imgur.com/OayeAGm.png";
const buttonText1 = '🚩 $YOINK'
const buttonText2 = '🏆 Go to Leaderboard'

export default function Home() {
  return (
  <div className="flex flex-col items-center justify-center h-screen">
    <div className="mb-auto mt-2">welcome degen</div>
    <h1 className="text-9xl font-bold mb-8">
      🚩 $YOINK
    </h1>
    <a href={`${URL}/leaderboard`} className="text-2xl hover:text-blue-700 underline mb-20">
      Leaderboard
    </a>
    <div className="mt-auto w-auto text-center mb-2">
      <a 
        href="https://explorer.degen.tips/token/0x25c2Afe6249271BDB03eF1090F8e084e296C26c2" 
        className="text-2xl text-gray-600 hover:text-blue-800"
      >
        View on Explorer - add to metamask
      </a>
      <p>21M capped supply - basically deflationary - 5% airdropped, 95% yoinkable</p>
      <p className='text-xs'>Superfluid tokens are too magic for explorer. Add to metamask to check your balance</p>
    </div>
  </div>
  );
}

export async function generateMetadata() {
  const meta = {
    'og:image': image,
    'fc:frame': 'vNext',
    'fc:frame:image': image,
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': buttonText1,
    'fc:frame:button:1:action': 'post',
    'fc:frame:button:1:target': `${URL}/start`,
    'fc:frame:post_url': `${URL}/start`,
    'fc:frame:button:2': buttonText2,
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': `${URL}/leaderboard`,

  }

  return {
    openGraph: {
      images: [
        {
          url: image,
          width: '1000',
          height: '1000'
        }
      ]
    },
    other: {
      ...meta
    },
  }
}