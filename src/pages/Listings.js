// pages/Listings.js
import DeviceCard from '../components/DeviceCard';

const Listings = ({ devices }) => (
  <div className="section">
    <div className="container">
      <div className="columns is-multiline">
        {devices.map(device => (
          <div className="column is-4" key={device.id}>
            <DeviceCard device={device} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Listings;