import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { formatTime, formatDuration, formatPrice } from "../../utils/helpers";
import "./FlightCard.css";

const FlightCard = ({ flight }) => {
  const { itineraries, price, validatingAirlineCodes } = flight;
  const outbound = itineraries[0];
  const segments = outbound.segments;
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  const departure = firstSegment.departure;
  const arrival = lastSegment.arrival;
  const stops = segments.length - 1;
  const airline = validatingAirlineCodes[0];


  return (
    <div className="flight-card">
      <div className="flight-card-header">
        <div className="airline-info">
          <div className="airline-logo">{airline}</div>
          <span className="airline-name">{airline}</span>
        </div>
        <div className="flight-price">
          <span className="price-amount">{formatPrice(price.total)}</span>
          <span className="price-currency">{price.currency}</span>
        </div>
      </div>

      <div className="flight-card-body">
        <div className="flight-route">
          <div className="flight-point">
            <div className="time">{formatTime(departure.at)}</div>
            <div className="airport">{departure.iataCode}</div>
          </div>

          <div className="flight-path">
            <div className="duration-info">
              <ClockIcon className="duration-icon" />
              <span>{formatDuration(outbound.duration)}</span>
            </div>
            <div className="flight-line">
              <div className="line"></div>
              {stops > 0 && <div className="stops-dot">{stops}</div>}
            </div>
            <div className="stops-info">
              {stops === 0 ? "Direct" : `${stops} stop${stops > 1 ? "s" : ""}`}
            </div>
          </div>

          <div className="flight-point">
            <div className="time">{formatTime(arrival.at)}</div>
            <div className="airport">{arrival.iataCode}</div>
          </div>
        </div>

        {stops > 0 && (
          <div className="layover-info">
            <MapPinIcon className="layover-icon" />
            <span>
              Via{" "}
              {segments
                .slice(0, -1)
                .map((seg) => seg.arrival.iataCode)
                .join(", ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightCard;
