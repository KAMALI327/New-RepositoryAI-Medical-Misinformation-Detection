import { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PredictionResult {
  prediction: string;
  confidence: number;
  risk_level: string;
}

interface HistoryItem {
  id: number;
  text: string;
  prediction: string;
  confidence: number;
  risk_level: string;
}

function App() {

  const [text, setText] = useState<string>("");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Fetch history
  const fetchHistory = async () => {

    try {

      const response = await axios.get<HistoryItem[]>(
        "http://127.0.0.1:8000/history"
      );

      setHistory(response.data);

    } catch (error) {

      console.error(error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Analyze claim
  const analyzeNews = async () => {

    try {

      const response = await axios.post<PredictionResult>(
        "http://127.0.0.1:8000/predict",
        {
          text: text,
        }
      );

      setResult(response.data);

      fetchHistory();

    } catch (error) {

      console.error(error);

      alert("Error connecting to backend");
    }
  };

  // Analytics
  const fakeCount = history.filter(
    (item) => item.prediction === "Fake"
  ).length;

  const realCount = history.filter(
    (item) => item.prediction === "Real"
  ).length;

  const highRisk = history.filter(
    (item) => item.risk_level === "High"
  ).length;

  const mediumRisk = history.filter(
    (item) => item.risk_level === "Medium"
  ).length;

  const lowRisk = history.filter(
    (item) => item.risk_level === "Low"
  ).length;

  // Pie chart data
  const predictionData = [
    { name: "Fake", value: fakeCount },
    { name: "Real", value: realCount },
  ];

  // Risk chart data
  const riskData = [
    { risk: "High", count: highRisk },
    { risk: "Medium", count: mediumRisk },
    { risk: "Low", count: lowRisk },
  ];

  return (

    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f7fb",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >

      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
        }}
      >

        <h1
          style={{
            textAlign: "center",
            color: "#1565c0",
            marginBottom: "30px",
          }}
        >
          🩺 AI Medical Misinformation Dashboard
        </h1>

        {/* Input Card */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >

          <textarea
            rows={6}
            placeholder="Enter medical claim..."
            value={text}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setText(e.target.value)
            }
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />

          <button
            onClick={analyzeNews}
            style={{
              marginTop: "20px",
              padding: "12px 25px",
              backgroundColor: "#1565c0",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Analyze Claim
          </button>

          {/* Result */}
          {result && (

            <div
              style={{
                marginTop: "25px",
                background:
                  result.prediction === "Fake"
                    ? "#ffebee"
                    : "#e8f5e9",
                padding: "20px",
                borderRadius: "10px",
              }}
            >

              <h2>
                Prediction: {result.prediction}
              </h2>

              <h3>
                Confidence: {result.confidence}%
              </h3>

              <h3>
                Risk Level: {result.risk_level}
              </h3>

            </div>
          )}

        </div>

        {/* Charts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "30px",
          }}
        >

          {/* Pie Chart */}
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
          >

            <h2>Fake vs Real</h2>

            <ResponsiveContainer width="100%" height={300}>

              <PieChart>

                <Pie
                  data={predictionData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >

                  <Cell fill="#ef5350" />

                  <Cell fill="#66bb6a" />

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

          {/* Bar Chart */}
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
          >

            <h2>Risk Levels</h2>

            <ResponsiveContainer width="100%" height={300}>

              <BarChart data={riskData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="risk" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar dataKey="count" fill="#1565c0" />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* History Table */}
        <div
          style={{
            background: "white",
            marginTop: "30px",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >

          <h2>Prediction History</h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >

            <thead>

              <tr
                style={{
                  backgroundColor: "#1565c0",
                  color: "white",
                }}
              >

                <th style={{ padding: "12px" }}>Text</th>

                <th style={{ padding: "12px" }}>Prediction</th>

                <th style={{ padding: "12px" }}>Confidence</th>

                <th style={{ padding: "12px" }}>Risk</th>

              </tr>

            </thead>

            <tbody>

              {history.map((item) => (

                <tr key={item.id}>

                  <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    {item.text}
                  </td>

                  <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    {item.prediction}
                  </td>

                  <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    {item.confidence}%
                  </td>

                  <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    {item.risk_level}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default App;