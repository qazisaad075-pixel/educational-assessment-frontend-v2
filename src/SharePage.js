import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function SharePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://educational-assessment-creator.onrender.com/share/${id}`
        );
        setData(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [id]);

  if (!data) return <h2>Loading...</h2>;

  if (data.error) return <h2>Not Found</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Shared Assessment</h1>

      <h2>{data.subject}</h2>
      <p>Grade: {data.grade_level}</p>
      <p>Topic: {data.topic}</p>

      <hr />

      <h3>Questions</h3>

      {data.questions.map((q, i) => (
        <div key={i}>
          <h4>Q{q.id}</h4>
          <p>{q.question}</p>
        </div>
      ))}
    </div>
  );
}

export default SharePage;