"use client"
import { useEffect, useState } from "react";

type LeaderboardEntry = {
  userHandle: string;
  score: number;
  totalStreamed: number;
};

type CurrentYoinker = {
  profileHandle: string;
};

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentYoinker, setCurrentYoinker] = useState<CurrentYoinker | null>(null);
  const [totalYoinked, setTotalYoinked] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 100;

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // Fetch leaderboard data with pagination
        const leaderboardResponse = await fetch(`/leaderboardApi?page=${page}&size=${pageSize}`);
        const leaderboardData = await leaderboardResponse.json();
        setLeaderboard(leaderboardData);

        // Fetch current yoinker data
        const currentYoinkerResponse = await fetch("/currentYoinkerApi");
        const currentYoinkerData: CurrentYoinker = await currentYoinkerResponse.json();
        setCurrentYoinker(currentYoinkerData);

        // Fetch total yoinked data
        const totalYoinkedResponse = await fetch("/totalYoinked");
        const totalYoinkedData = await totalYoinkedResponse.json();
        setTotalYoinked(totalYoinkedData.totalScore);

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, [page]);

  const handlePreviousPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Hang on a few seconds fellow StreamYoinker, the Leaderboard is loading...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <a
        href="https://warpcast.com/superfluid"
        style={{ textDecoration: "none" }}
      >
        <h1
          style={{ color: "Red", fontSize: "3em", marginBottom: "0.5em" }}
        >
          StreamYoink!
        </h1>
      </a>
      <p style={{ textAlign: "center", lineHeight: "1.5" }}>
        A memecoin and game-in-a-frame powered by{" "}
        <a
          href="https://www.superfluid.finance/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#007bff", textDecoration: "none" }}
        >
          Superfluid
        </a>{" "}
        .
        <br />
        Play{" "}
        <a
          href="https://www.yoink.club/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#007bff", textDecoration: "none" }}
        >
          StreamYoink
        </a>{" "}
        now and start earning 🚩$YOINK every second.
        <br />
        The Stream has now been yoinked {totalYoinked} times.
      </p>
      {currentYoinker && (
        <div style={{ marginBottom: "20px" }}>
          <strong>Current Yoinker:</strong>{" "}
          <a
            href={`https://warpcast.com/${currentYoinker.profileHandle}`}
            style={{ color: "#007bff", textDecoration: "none" }}
          >
            @{currentYoinker.profileHandle}
          </a>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", width: "80%", maxWidth: "600px", marginBottom: "20px" }}>
        <button onClick={handlePreviousPage} style={buttonStyle} disabled={page === 1}>Previous Page</button>
        <button onClick={handleNextPage} style={buttonStyle}>Next Page</button>
      </div>

      <table
        style={{
          borderCollapse: "collapse",
          width: "80%",
          maxWidth: "600px",
          borderColor: "white",
        }}
      >
        <thead style={{ backgroundColor: "white", color: "black" }}>
          <tr>
            <th
              style={{
                border: "1px solid white",
                textAlign: "center",
                padding: "8px",
              }}
            >
              Rank
            </th>
            <th
              style={{
                border: "1px solid white",
                textAlign: "center",
                padding: "8px",
              }}
            >
              User Handle
            </th>
            <th
              style={{
                border: "1px solid white",
                textAlign: "center",
                padding: "8px",
              }}
            >
              StreamYoinks
            </th>
            <th
              style={{
                border: "1px solid white",
                textAlign: "center",
                padding: "8px",
              }}
            >
              Total $YOINK Streamed
            </th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={index}>
              <td
                style={{
                  border: "1px solid white",
                  textAlign: "center",
                  padding: "8px",
                }}
              >
                {(page - 1) * pageSize + index + 1}
              </td>
              <td
                style={{
                  border: "1px solid white",
                  textAlign: "center",
                  padding: "8px",
                }}
              >
                <a
                  href={`https://warpcast.com/${entry.userHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#007bff", textDecoration: "none" }}
                >
                  {entry.userHandle}
                </a>
              </td>
              <td
                style={{
                  border: "1px solid white",
                  textAlign: "center",
                  padding: "8px",
                }}
              >
                {entry.score}
              </td>
              <td
                style={{
                  border: "1px solid white",
                  textAlign: "center",
                  padding: "8px",
                }}
              >
                {entry.totalStreamed}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "space-between", width: "80%", maxWidth: "600px", marginTop: "20px" }}>
        <button onClick={handlePreviousPage} style={buttonStyle} disabled={page === 1}>Previous Page</button>
        <button onClick={handleNextPage} style={buttonStyle}>Next Page</button>
      </div>

      <br />
      <div>
        <p style={{ textAlign: "center", lineHeight: "1.5" }}>
          <a
            href="https://github.com/youssefea/stream-yoink"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#007bff", textDecoration: "none" }}
          >
            📖 Github Repo Link
          </a>
        </p>
        <p style={{ textAlign: "center", lineHeight: "1.5" }}>
          <a
            href="https://explorer.degen.tips/token/0x25c2Afe6249271BDB03eF1090F8e084e296C26c2"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#007bff", textDecoration: "none" }}
          >
            $YOINK Token Address
          </a>
        </p>
        <p>
          Inspired by{" "}
          <a
            href="https://warpcast.com/~/channel/yoink"
            target="_blank"
            rel="noopener noreferrer"
          >
            Yoink!
          </a>{" "}
          (
          <a
            href="https://warpcast.com/horsefacts.eth"
            target="_blank"
            rel="noopener noreferrer"
          >
            @horsefacts.eth
          </a>)
        </p>
      </div>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};