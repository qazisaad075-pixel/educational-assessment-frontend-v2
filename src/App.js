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

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    getUser();
  }, []);

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
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (user) loadStats();
  }, [user]);

  const createAssessment = async () => {
    if (!subject || !gradeLevel || !topic) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "https://educational-assessment-creator.onrender.com/create-assessment",
        {
          subject,
          grade_level: parseInt(gradeLevel),
          topic,
        }
      );

      setResult(res.data);
      loadStats();
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  const downloadPDF = async () => {
    const element = document.getElementById("pdf-area");
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("assessment.pdf");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (!user) return <Auth setUser={setUser} />;

  return (
    <div className="App">
      <div className="header">
        <h1>🚀 AI Assessment Creator</h1>
        <p>Welcome {user.email}</p>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="stats">
        <div className="card"><h2>{stats.total_assessments}</h2></div>
        <div className="card"><h2>{stats.total_questions}</h2></div>
        <div className="card"><h2>{stats.success_rate}%</h2></div>
      </div>

      {chartData && <Bar data={chartData} />}

      <div className="form">
        <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" />
        <input value={gradeLevel} onChange={e => setGradeLevel(e.target.value)} placeholder="Grade" />
        <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic" />

        <button onClick={createAssessment}>
          {loading ? "Generating..." : "Create"}
        </button>
      </div>

      {result && (
        <div id="pdf-area">
          <button onClick={downloadPDF}>Download PDF</button>

          {result.questions.map((q, i) => (
            <div key={i}>
              <h4>{q.question}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;