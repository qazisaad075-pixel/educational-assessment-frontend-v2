import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [subject, setSubject] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const createAssessment = async () => {
    if (!subject || !gradeLevel || !topic) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://educational-assessment-creator-production.up.railway.app/create-assessment",
        {
          subject,
          grade_level: parseInt(gradeLevel),
          topic,
        }
      );

      setResult(response.data);
    } catch (error) {
      alert("Error: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Educational Assessment Creator</h1>
        <p>AI Powered Assessment Generation System</p>
      </div>

      <div className="stats">
        <div className="card">
          <h2>50+</h2>
          <p>Assessments Created</p>
        </div>

        <div className="card">
          <h2>100+</h2>
          <p>Questions Generated</p>
        </div>

        <div className="card">
          <h2>95%</h2>
          <p>Success Rate</p>
        </div>
      </div>

      <div className="form">
        <h2>Create Assessment</h2>

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          type="number"
          placeholder="Grade Level"
          value={gradeLevel}
          onChange={(e) => setGradeLevel(e.target.value)}
        />

        <input
          type="text"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <button onClick={createAssessment} disabled={loading}>
          {loading ? "Creating..." : "Create Assessment"}
        </button>
      </div>

      {result && (
        <div className="result">
          <h2>Assessment Created Successfully</h2>

          <div className="analytics">
            <div className="analyticsCard">
              <h3>{result.analytics.total_questions}</h3>
              <p>Total Questions</p>
            </div>

            <div className="analyticsCard">
              <h3>{result.analytics.total_points}</h3>
              <p>Total Points</p>
            </div>
          </div>

          <h3>Learning Objectives</h3>

          <ul>
            {result.standards.objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>

          <h3>Generated Questions</h3>

          {result.questions.map((q, i) => (
            <div className="question" key={i}>
              <h4>Q{q.id}</h4>
              <p>{q.question}</p>

              <div className="tags">
                <span>{q.type}</span>
                <span>{q.difficulty}</span>
                <span>{q.points} Points</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;