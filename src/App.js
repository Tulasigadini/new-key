import React, { useState } from "react";
import Chat from "./components/Chat";
import RandomChat from "./components/RandomChat";

function App() {
  const [currentPage, setCurrentPage] = useState("menu"); // 'menu', 'chat', 'randomChat'

  if (currentPage === "chat") {
    return (
      <div>
        <button 
          onClick={() => setCurrentPage("menu")}
          style={{
            position: "fixed",
            top: "10px",
            left: "10px",
            zIndex: 1000,
            padding: "8px 16px",
            background: "#8166e3",
            color: "white",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          ← Back
        </button>
        <Chat />
      </div>
    );
  }

  if (currentPage === "randomChat") {
    return (
      <div>
        <button 
          onClick={() => setCurrentPage("menu")}
          style={{
            position: "fixed",
            top: "10px",
            left: "10px",
            zIndex: 1000,
            padding: "8px 16px",
            background: "#ff6b6b",
            color: "white",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          ← Back
        </button>
        <RandomChat />
      </div>
    );
  }

  // Menu Page
  return (
    <div style={styles.menuContainer}>
      <div style={styles.menuContent}>
        <h1 style={styles.title}>Chat Application</h1>
        <p style={styles.subtitle}>Choose your chat mode</p>
        
        <div style={styles.buttonContainer}>
          <button 
            style={{...styles.menuButton, ...styles.normalChat}}
            onClick={() => setCurrentPage("chat")}
          >
            <div style={styles.iconWrapper}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2"/>
                <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 style={styles.buttonTitle}>Friends Chat</h2>
            <p style={styles.buttonDescription}>Chat with your friends and contacts</p>
          </button>

          <button 
            style={{...styles.menuButton, ...styles.randomChat}}
            onClick={() => setCurrentPage("randomChat")}
          >
            <div style={styles.iconWrapper}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2"/>
                <circle cx="9" cy="7" r="4" strokeWidth="2"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2"/>
              </svg>
            </div>
            <h2 style={styles.buttonTitle}>Random Chat</h2>
            <p style={styles.buttonDescription}>Connect with strangers worldwide</p>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  menuContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif"
  },
  menuContent: {
    maxWidth: "800px",
    width: "100%",
    textAlign: "center"
  },
  title: {
    fontSize: "3rem",
    color: "white",
    marginBottom: "12px",
    fontWeight: "700"
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: "48px"
  },
  buttonContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    padding: "0 20px"
  },
  menuButton: {
    padding: "40px 32px",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "transform 0.3s, box-shadow 0.3s",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
    color: "white",
    textAlign: "center"
  },
  normalChat: {
    background: "linear-gradient(135deg, #8166e3, #e16ca5)"
  },
  randomChat: {
    background: "linear-gradient(135deg, #ff6b6b, #ee5a6f)"
  },
  iconWrapper: {
    marginBottom: "16px"
  },
  buttonTitle: {
    fontSize: "1.5rem",
    marginBottom: "8px",
    fontWeight: "600"
  },
  buttonDescription: {
    fontSize: "0.95rem",
    opacity: "0.9",
    lineHeight: "1.4"
  }
};

export default App;
