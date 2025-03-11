// pages/DeviceDetails.js
import { useParams } from 'react-router-dom';

const DeviceDetails = ({ devices }) => {
  const { id } = useParams();
  const device = devices.find(d => d.id === Number(id));

  return (
    <div className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-half">
            <figure className="image is-16by9">
              <img src={device.image} alt={device.name} />
            </figure>
          </div>
          <div className="column">
            <h1 className="title">{device.name}</h1>
            <div className="content">
              <p><strong>Type:</strong> {device.type}</p>
              <p><strong>Condition:</strong> {device.condition}</p>
              <p><strong>Status:</strong> {device.status}</p>
              <p><strong>Description:</strong> {device.description}</p>
            </div>
            <button className="button is-primary is-large">Request Device</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetails;