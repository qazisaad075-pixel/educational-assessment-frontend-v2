import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

import { supabase } from "./supabaseClient";
import Auth from "./Auth";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [user, setUser] = useState(null);

  const [subject, setSubject] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    total_assessments: 0,
    total_questions: 0,
    success_rate: 0,
  });

  const [recent, setRecent] = useState([]);
  const [chartData, setChartData] = useState(null);

  // AUTH CHECK
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    getUser();
  }, []);

  // LOAD DATA
  const loadStats = async () => {
    try {
      const statsRes = await axios.get(
        "https://educational-assessment-creator.onrender.com/stats"
      );

      const recentRes = await axios.get(
        "https://educational-assessment-creator.onrender.com/assessments"
      );

      setStats(statsRes.data);
      setRecent(recentRes.data.slice(0, 5));

      setChartData({
        labels: ["Assessments", "Questions", "Success Rate"],
        datasets: [
          {
            label: "AI Analytics",
            data: [
              statsRes.data.total_assessments || 0,
              statsRes.data.total_questions || 0,
              statsRes.data.success_rate || 0,
            ],
            backgroundColor: ["#4f46e5", "#06b6d4", "#22c55e"],
          },
        ],
      });
    } catch (err) {
      console.log("Stats Error:", err.message);
    }
  };

  useEffect(() => {
    if (user) loadStats();
  }, [user]);

  // CREATE
  const createAssessment = async () => {
    if (!subject || !gradeLevel || !topic) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://educational-assessment-creator.onrender.com/create-assessment",
        {
          subject,
          grade_level: parseInt(gradeLevel),
          topic,
        }
      );

      setResult(response.data);
      loadStats();

      setSubject("");
      setGradeLevel("");
      setTopic("");
    } catch (error) {
      alert("Error: " + error.message);
    }

    setLoading(false);
  };

  // PDF DOWNLOAD (FIXED)
  const downloadPDF = async () => {
    const element = document.getElementById("pdf-area");

    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("assessment.pdf");
  };

  // LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (!user) return <Auth setUser={setUser} />;

  return (
    <div className="App">

      {/* HEADER */}
      <div className="header">
        <h1>🚀 AI Assessment Creator</h1>
        <p>Welcome {user.email}</p>
        <button onClick={logout}>Logout</button>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="card"><h2>{stats.total_assessments}</h2><p>Assessments</p></div>
        <div className="card"><h2>{stats.total_questions}</h2><p>Questions</p></div>
        <div className="card"><h2>{stats.success_rate}%</h2><p>Success Rate</p></div>
      </div>

      {/* CHART */}
      {chartData && (
        <div style={{ width: "600px", margin: "40px auto" }}>
          <Bar data={chartData} />
        </div>
      )}

      {/* ANALYTICS */}
      <div className="analytics">
        <div className="analyticsCard"><h3>📊 Live AI System</h3></div>
        <div className="analyticsCard"><h3>⚡ Performance</h3></div>
        <div className="analyticsCard"><h3>🎯 Accuracy</h3></div>
      </div>

      {/* FORM */}
      <div className="form">
        <h2>Create Assessment</h2>

        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
        <input value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} placeholder="Grade Level" />
        <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic" />

        <button onClick={createAssessment} disabled={loading}>
          {loading ? "Generating..." : "Create Assessment"}
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div className="result" id="pdf-area">
          <h2>✅ Assessment Generated</h2>

          <button onClick={downloadPDF}>
            📄 Download PDF
          </button>

          {result.questions.map((q, i) => (
            <div className="question" key={i}>
              <h4>Q{q.id}</h4>
              <p>{q.question}</p>

              <div className="tags">
                <span>{q.type}</span>
                <span>{q.difficulty || "medium"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RECENT */}
      <div className="result">
        <h2>📌 Recent Assessments</h2>

        {recent.length === 0 ? (
          <p>No assessments yet</p>
        ) : (
          recent.map((item, i) => (
            <div className="question" key={i}>
              <h4>{item.subject}</h4>
              <p>Grade: {item.grade_level}</p>
              <p>Topic: {item.topic}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default App;