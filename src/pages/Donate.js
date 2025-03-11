// pages/Donate.js
import DeviceForm from '../components/DeviceForm';

const Donate = ({ handleDonation }) => {
  return (
    <div className="donate-page">
      <DeviceForm onSubmit={handleDonation} />
    </div>
  );
};

export default Donate;