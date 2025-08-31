import { useState } from "react";
import Chat_input from "./components/chat_input";
import ChatWindow from "./components/chat_window";
import TagList from "./components/tagList";
import Map from "./components/map";

const FILTER_OPTIONS = [
  "open now",
  "less crowded",
  "budget friendly",
  "family friendly",
  "romantic",
  "top rated",
  "nearby",
  "big discounts",
  "branded stores",
];

function App() {
  const [messages, setMessages] = useState([]);
  const [filters, setFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [lastQuery, setLastQuery] = useState("");

  const handleMessage = async (msg) => {
    setLastQuery(msg);
    const userMsg = { text: msg, sender: "user", time: Date.now() };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("http://127.0.0.1:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: msg }),
      });
      const data = await res.json();

      if (data.raw_results) {
        const newMarkers = data.raw_results
          .split("\n")
          .map((line) => {
            const match = line.match(/^(.*?) - (.*?) \(Lat: ([\d\.\-]+), Lng: ([\d\.\-]+)\)$/);
            if (!match) return null;
            return { name: match[1], address: match[2], lat: Number(match[3]), lng: Number(match[4]) };
          })
          .filter(Boolean);
        setMarkers(newMarkers);
      }

      const aiMsg = { text: data.recommendations || "No recommendations", sender: "AI", time: Date.now() };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefetchWithFilters = async () => {
    if (!lastQuery) return;

    const previousResults = markers.map((m) => `${m.name} - ${m.address} (Lat: ${m.lat}, Lng: ${m.lng})`).join("\n");

    const res = await fetch("http://127.0.0.1:8000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: lastQuery, previous_results: previousResults, filters }),
    });

    const data = await res.json();

    if (data.raw_results) {
      const newMarkers = data.raw_results
        .split("\n")
        .map((line) => {
          const match = line.match(/^(.*?) - (.*?) \(Lat: ([\d\.\-]+), Lng: ([\d\.\-]+)\)$/);
          if (!match) return null;
          return { name: match[1], address: match[2], lat: Number(match[3]), lng: Number(match[4]) };
        })
        .filter(Boolean);
      setMarkers(newMarkers);
    }

    const aiMsg = { text: data.recommendations || "No recommendations", sender: "AI", time: Date.now() };
    setMessages((prev) => [...prev, aiMsg]);
  };

  return (
    <div className="flex flex-col h-screen">
      <h1 className="p-4 text-xl font-bold border-b">ShopSmart</h1>
      <div className="p-4 overflow-y-auto flex-1">
        <ChatWindow messages={messages} />
      </div>

      <div className="p-2 border-t flex gap-2">
        <button onClick={() => setShowFilters((p) => !p)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
        <button onClick={() => setShowMap((p) => !p)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          {showMap ? "Hide Map" : "Show Map"}
        </button>
        {showFilters && lastQuery && (
          <button onClick={handleRefetchWithFilters} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            🔄 Re-search with Filters
          </button>
        )}
      </div>

      {showFilters && <TagList filters={filters} setFilters={setFilters} options={FILTER_OPTIONS} />}
      {showMap && <div className="p-4"><Map markers={markers} height="400px" /></div>}
      <div className="border-t p-4"><Chat_input onSend={handleMessage} /></div>
    </div>
  );
}

export default App;
