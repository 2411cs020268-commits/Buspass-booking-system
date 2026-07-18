import React, { useState } from "react";

function SeatGrid({ onSeatSelect, bookedSeats = [] }) {
  const seats = Array.from({ length: 40 }, (_, i) => i + 1);
  const [selected, setSelected] = useState([]);

  const selectSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;
    const updated = selected.includes(seat)
      ? selected.filter((s) => s !== seat)
      : [...selected, seat];
    setSelected(updated);
    onSeatSelect(updated);
  };

  const getSeatClass = (seat) => {
    if (bookedSeats.includes(seat)) return "seat-btn btn btn-danger";
    if (selected.includes(seat))    return "seat-btn btn btn-success";
    return "seat-btn btn btn-outline-primary";
  };

  return (
    <div className="seat-grid-wrap">
      {/* Legend */}
      <div className="d-flex gap-4 mb-4 flex-wrap">
        {[
          { color: "#eff6ff", border: "#3b82f6", text: "#1d4ed8", label: "Available" },
          { color: "#16a34a", border: "#16a34a", text: "#fff",    label: "Selected"  },
          { color: "#dc2626", border: "#dc2626", text: "#fff",    label: "Booked"    },
        ].map(({ color, border, text, label }) => (
          <div key={label} className="d-flex align-items-center gap-2">
            <span className="seat-legend-dot" style={{ background: color, border: `2px solid ${border}` }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Bus front indicator */}
      <div className="text-center mb-3">
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)",
          textTransform: "uppercase", letterSpacing: "1px", background: "var(--bg)",
          padding: "4px 16px", borderRadius: "20px", border: "1px solid var(--border)" }}>
          🚌 Front
        </span>
      </div>

      {/* Seat grid — 4 seats per row with aisle gap */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 44px) 20px repeat(4, 44px)", gap: "4px", justifyContent: "center", maxWidth: 420, margin: "0 auto" }}>
        {Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 9 }, (_, col) => {
            // Column 4 is the aisle
            if (col === 4) return <div key={`aisle-${row}`} />;
            const seatIndex = row * 8 + (col < 4 ? col : col - 1);
            const seat = seatIndex + 1;
            if (seat > 40) return <div key={`empty-${row}-${col}`} />;
            return (
              <button
                key={seat}
                onClick={() => selectSeat(seat)}
                className={getSeatClass(seat)}
                disabled={bookedSeats.includes(seat)}
                title={bookedSeats.includes(seat) ? "Already booked" : `Seat ${seat}`}
              >
                {seat}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default SeatGrid;
