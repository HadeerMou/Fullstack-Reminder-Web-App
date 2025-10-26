import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/reminders")
      .then(res => setReminders(res.data));
  }, []);

  // Notification checker
  useEffect(() => {
    const checkReminders = setInterval(() => {
      const now = new Date().toISOString().slice(0, 16);
      reminders.forEach(r => {
        if (r.time === now) {
          new Notification("Reminder", { body: r.title });
        }
      });
    }, 60000); // check every 1 minute
    return () => clearInterval(checkReminders);
  }, [reminders]);

  const addReminder = async () => {
    await axios.post("http://127.0.0.1:5000/api/reminders", { title, time });
    setTitle(""); setTime("");
    const res = await axios.get("http://127.0.0.1:5000/api/reminders");
    setReminders(res.data);
  };

  const deleteReminder = async (id) => {
    await axios.delete(`http://127.0.0.1:5000/api/reminders/${id}`);
    setReminders(reminders.filter(r => r.id !== id));
  };

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "40px", maxWidth: "500px", margin: "auto" }}>
      <h2>FocusPulse — Reminder App</h2>
      <div>
        <input
          type="text"
          placeholder="Reminder title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <input
          type="datetime-local"
          value={time}
          onChange={e => setTime(e.target.value)}
          style={{ padding: "8px" }}
        />
        <button onClick={addReminder} style={{ marginLeft: "10px", padding: "8px 16px" }}>Add</button>
      </div>

      <ul style={{ marginTop: "30px", listStyle: "none", padding: 0 }}>
        {reminders.map(r => (
          <li key={r.id} style={{ margin: "10px 0", background: "#eee", padding: "10px", borderRadius: "8px" }}>
            <strong>{r.title}</strong><br />
            <small>{r.time}</small>
            <button onClick={() => deleteReminder(r.id)} style={{ float: "right" }}>✖</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
