// pages/Home.js
import HeroSection from '../components/HeroSection';
import Listings from './Listings';

const Home = ({ stats, devices }) => (
  <div>
    <HeroSection />
    <div className="section">
      <div className="container">
        <h3 className="title">Impact Statistics</h3>
        <div className="columns">
          <div className="column">
            <div className="box">
              <p className="title">{stats.devicesDonated}+</p>
              <p className="subtitle">Devices Donated</p>
            </div>
          </div>
          <div className="column">
            <div className="box">
              <p className="title">{stats.beneficiaries}+</p>
              <p className="subtitle">Lives Impacted</p>
            </div>
          </div>
          <div className="column">
            <div className="box">
              <p className="title">{stats.eWasteReduced}%</p>
              <p className="subtitle">E-Waste Reduced</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="section">
      <div className="container">
        <h3 className="title">Available Devices</h3>
        <Listings devices={devices} />
      </div>
    </div>

  </div>
);

export default Home;