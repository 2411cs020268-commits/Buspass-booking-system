import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BusCard from "../components/BusCard";
import { getAllBuses, searchBus } from "../services/BusService";

function Dashboard() {
  const name = localStorage.getItem("name") || "Traveller";

  const [allBuses, setAllBuses]       = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [source, setSource]           = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading]         = useState(true);
  const [searching, setSearching]     = useState(false);
  const [error, setError]             = useState("");
  const [searched, setSearched]       = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllBuses();
        const data = res.data || [];
        setAllBuses(data);
        setFiltered(data);
      } catch {
        setError("Could not load buses. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!source.trim() && !destination.trim()) { setFiltered(allBuses); setSearched(false); return; }
    setSearched(true);
    setSearching(true);
    try {
      const res = await searchBus(source.trim(), destination.trim());
      setFiltered(res.data || []);
    } catch { setFiltered([]); }
    finally { setSearching(false); }
  };

  const handleClear = () => { setSource(""); setDestination(""); setFiltered(allBuses); setSearched(false); };

  return (
    <>
      <Navbar />
      <div className="container page-wrapper" style={{ paddingTop: "1.5rem" }}>

        {/* Welcome banner */}
        <div className="welcome-banner">
          <h3>Welcome back, {name}! 👋</h3>
          <p>
            {allBuses.length > 0
              ? `${allBuses.length} bus${allBuses.length !== 1 ? "es" : ""} available today — where are you headed?`
              : "Search below to find your next journey."}
          </p>
        </div>

        {/* Search panel */}
        <div className="search-panel">
          <form onSubmit={handleSearch}>
            <div className="row g-2 align-items-end">
              <div className="col-md-4">
                <label className="form-label">From</label>
                <input className="form-control" placeholder="e.g. Mumbai"
                  value={source} onChange={(e) => setSource(e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">To</label>
                <input className="form-control" placeholder="e.g. Pune"
                  value={destination} onChange={(e) => setDestination(e.target.value)} />
              </div>
              <div className="col-md-4">
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary flex-grow-1" disabled={searching}>
                    {searching
                      ? <><span className="spinner-border spinner-border-sm me-2" />Searching…</>
                      : "🔍 Search Buses"}
                  </button>
                  {searched && (
                    <button type="button" className="btn btn-outline-secondary" onClick={handleClear}>✕</button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Section heading */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="section-heading mb-0">
            {searched ? `Search Results — ${filtered.length} found` : `All Available Buses (${allBuses.length})`}
          </div>
          {searched && (
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              "{source}" → "{destination}"
            </span>
          )}
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
            <p className="mt-2" style={{ color: "var(--text-muted)" }}>Loading buses…</p>
          </div>
        )}
        {!loading && error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && allBuses.length === 0 && (
          <div className="alert alert-info text-center py-4">No buses available right now.</div>
        )}
        {!loading && !error && searched && filtered.length === 0 && (
          <div className="alert alert-warning text-center py-4">
            <p className="mb-2">No buses found for this route.</p>
            <button className="btn btn-sm btn-outline-secondary" onClick={handleClear}>Show all buses</button>
          </div>
        )}
        {!loading && !error && filtered.length > 0 && filtered.map((bus) => (
          <BusCard key={bus.id} bus={bus} />
        ))}
      </div>
    </>
  );
}

export default Dashboard;
