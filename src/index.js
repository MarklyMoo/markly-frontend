import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <div style={{
      fontFamily: "system-ui, sans-serif",
      background: "#0B0F1A",
      color: "#E8ECF4",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: 20
    }}>
      <div>
        <div style={{
          width: 60, height: 60, borderRadius: 16,
          background: "linear-gradient(135deg, #6366F1, #34D399)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 900, color: "#fff",
          margin: "0 auto 20px"
        }}>M</div>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 10 }}>Markly</h1>
        <p style={{ color: "#94A3B8", fontSize: 16, marginBottom: 30 }}>
          AI-Powered Marketing Automation
        </p>
        <p style={{ color: "#34D399", fontSize: 14 }}>
          ✅ Frontend is live and working!
        </p>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
