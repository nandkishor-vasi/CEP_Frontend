import React, { useState } from 'react';
import './DeviceForm.css'; // Import the updated CSS

const DeviceForm = ({ onSubmit }) => {
  const [deviceData, setDeviceData] = useState({
    name: '',
    type: 'laptop',
    condition: 'good',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeviceData({ ...deviceData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(deviceData);
  };

  return (
    <div className="form-and-testimonials">
      <form onSubmit={handleSubmit}>
        <label>
          Device Name:
          <input
            type="text"
            name="name"
            value={deviceData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Device Type:
          <select
            name="type"
            value={deviceData.type}
            onChange={handleChange}
            required
          >
            <option value="laptop">Laptop</option>
            <option value="smartphone">Smartphone</option>
            <option value="tablet">Tablet</option>
          </select>
        </label>
        <label>
          Condition:
          <select
            name="condition"
            value={deviceData.condition}
            onChange={handleChange}
            required
          >
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={deviceData.description}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Submit Donation</button>
      </form>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <h2>What People Are Saying</h2>
        <div className="testimonial">
          <p>
            "Thanks to Reusable Tech Inventory, I was able to get a laptop for my online classes. It changed my life!"
          </p>
          <span className="author">- Jane Doe, Student</span>
        </div>
        <div className="testimonial">
          <p>
            "Donating my old devices felt great. Knowing they're helping someone in need makes it even better."
          </p>
          <span className="author">- John Smith, Donor</span>
        </div>
      </div>
    </div>
  );
};

export default DeviceForm;