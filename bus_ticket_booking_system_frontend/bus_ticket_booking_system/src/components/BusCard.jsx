import React from "react";
import { useNavigate } from "react-router-dom";

function BusCard({ bus }) {
  const navigate = useNavigate();

  const bookNow = () => {
    localStorage.setItem("selectedBus", JSON.stringify(bus));
    navigate("/seats");
  };

  return (
    <div className="bus-card">
      <div className="bus-card-body d-flex align-items-center gap-3 flex-wrap">

        {/* Bus name + route */}
        <div style={{ minWidth: 160, flex: "1 1 160px" }}>
          <div className="fw-bold" style={{ fontSize: "1rem" }}>{bus.busName}</div>
          <div className="bus-card-route">
            <span className="city-badge">{bus.source}</span>
            <span className="arrow">→</span>
            <span className="city-badge">{bus.destination}</span>
          </div>
        </div>

        {/* Vertical divider (desktop) */}
        <div className="bus-card-divider d-none d-md-block" />

        {/* Departure */}
        <div style={{ minWidth: 80 }}>
          <div className="time-label">Departs</div>
          <div className="time-value">{bus.departureTime || "—"}</div>
        </div>

        {/* Arrow */}
        <div className="text-muted d-none d-md-block" style={{ fontSize: "1.1rem" }}>→</div>

        {/* Arrival */}
        <div style={{ minWidth: 80 }}>
          <div className="time-label">Arrives</div>
          <div className="time-value">{bus.arrivalTime || "—"}</div>
        </div>

        {/* Vertical divider */}
        <div className="bus-card-divider d-none d-md-block" />

        {/* Seats */}
        <div style={{ minWidth: 80 }}>
          <div className="time-label">Seats</div>
          {bus.totalSeats > 0
            ? <div className="seats-avail">{bus.totalSeats} available</div>
            : <div className="seats-full">Fully Booked</div>
          }
        </div>

        {/* Vertical divider */}
        <div className="bus-card-divider d-none d-md-block" />

        {/* Fare + book */}
        <div className="d-flex align-items-center gap-3 ms-auto">
          <div className="text-end">
            <div className="fare-amount">₹{bus.fare}</div>
            <div className="fare-per">per seat</div>
          </div>
          <button
            className="btn btn-primary px-4"
            onClick={bookNow}
            disabled={bus.totalSeats === 0}
            style={{ whiteSpace: "nowrap" }}
          >
            {bus.totalSeats === 0 ? "Sold Out" : "Book Now"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default BusCard;
