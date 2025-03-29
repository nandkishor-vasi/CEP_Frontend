import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import "../styles/Home.css"; 

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleRedirect = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth"); // Redirect to login/signup if not authenticated
    }
  };

  return (
    <div className="bg-gray-100 text-gray-800">
      {/* Hero Section */}
      <div className="parallax">
        <div className="overlay">
          <motion.h2
            className="parallax-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Bridging the Digital Divide
          </motion.h2>
          <motion.p
            className="parallax-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Reusing technology to empower education and 
            <br></br>
            reduce e-waste.
          </motion.p>
          <motion.button
            className="donate-btn"
            whileHover={{ scale: 1.1 }}
            onClick={handleRedirect} // Redirect on button click
          >
            Get Started
          </motion.button>
        </div>
      </div>

      {/* Mission Section */}
      <section className="section">
        <h3 className="title">Our Mission</h3>
        <p className="content">
          We connect donors of unused devices with people in need, providing opportunities for education and growth while promoting sustainability.
        </p>
      </section>

      {/* How It Works */}
      <section className="section how-it-works">
        <h3 className="title">How It Works</h3>
        <div className="steps">
          {["Donate", "Refurbish", "Distribute"].map((step, index) => (
            <motion.div
              key={step}
              className="step"
              whileHover={{ scale: 1.05 }}
              onClick={handleRedirect} // Redirect when clicked
            >
              <h4>{step}</h4>
              <p>Process description here.</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact Stats */}
      <section className="section impact">
        <h3 className="title">Our Impact</h3>
        <div className="stats">
          {[5000, 10000, 20000].map((stat, index) => (
            <motion.div key={index} className="stat" whileHover={{ scale: 1.05 }}>
              <p>{stat.toLocaleString()}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
