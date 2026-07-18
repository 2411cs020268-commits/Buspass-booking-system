import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BusCard from "../components/BusCard";
import { getAllBuses, searchBus } from "../services/BusService";

function SearchBus() {
  const [allBuses, setAllBuses]       = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [source, setSource]           = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading]         = useState(true);
  const [searching, setSearching]     = useState(false);
  const [searched, setSearched]       = useState(false);
  const [error, setError]             = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllBuses();
        const data = res.data || [];
        setAllBuses(data); setFiltered(data);
      } catch { setError("Failed to load buses. Please try again."); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!source.trim() && !destination.trim()) { setFiltered(allBuses); setSearched(false); return; }
    setSearched(true); setSearching(true);
    try { const res = await searchBus(source.trim(), destination.trim()); setFiltered(res.data || []); }
    catch { setFiltered([]); }
    finally { setSearching(false); }
  };

  const handleClear = () => { setSource(""); setDestination(""); setFiltered(allBuses); setSearched(false); };

  return (
    <>
      <Navbar />
      <div className="container page-wrapper" style={{ paddingTop: "1.5rem" }}>

        {/* Search header card */}
        <div className="card p-4 mb-4">
          <h4 className="fw-bold text-center mb-4" style={{ color: "var(--primary)" }}>
            🔍 Find Your Bus
          </h4>
          <form onSubmit={handleSearch}>
            <div className="row g-3 align-items-end">
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
                      : "Search"}
                  </button>
                  {searched && (
                    <button type="button" className="btn btn-outline-secondary" onClick={handleClear}>
                      ✕ Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Section label */}
        <div className="section-heading">
          {searched
            ? `Results for "${source}" → "${destination}" — ${filtered.length} found`
            : `All Available Buses (${allBuses.length})`}
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
            <p className="mt-2" style={{ color: "var(--text-muted)" }}>Loading buses…</p>
          </div>
        )}
        {!loading && error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && allBuses.length === 0 && (
          <div className="alert alert-info text-center">No buses available right now.</div>
        )}
        {!loading && !error && searched && filtered.length === 0 && (
          <div className="alert alert-warning text-center">
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

export default SearchBus;
