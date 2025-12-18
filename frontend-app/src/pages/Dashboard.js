import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [created, setCreated] = useState([]);
  const [joined, setJoined] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [eventCode, setEventCode] = useState("");
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    dateTime: "",
    location: "",
    capacity: "",
    image: null,
  });

  const loadData = async () => {
    try {
      const dash = await API.get("/events/my/dashboard");
      const all = await API.get("/events/all");
      setCreated(dash.data.created);
      setJoined(dash.data.joined);
      setAllEvents(all.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createEvent = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const data = new FormData();
      Object.keys(form).forEach((k) => {
        if (form[k]) data.append(k, form[k]);
      });

      const res = await API.post("/events", data);
      setMsg(`✅ Event created. Event ID: ${res.data.eventCode}`);
      setForm({
        title: "",
        description: "",
        dateTime: "",
        location: "",
        capacity: "",
        image: null,
      });
      loadData();
    } catch (err) {
      setMsg(err.response?.data?.message || "Create failed");
    }
  };

  const joinEvent = async () => {
    try {
      await API.post(`/events/${eventCode}/join`);
      setMsg("✅ Joined successfully");
      setEventCode("");
      loadData();
    } catch (err) {
      setMsg(err.response?.data?.message || "Join failed");
    }
  };

  const enterEvent = async (id) => {
    try {
      await API.get(`/events/${id}/enter`);
      navigate(`/event/${id}`);
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete event?")) return;
    try {
      await API.delete(`/events/${id}`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const getStatus = (e) => {
    const now = Date.now();
    const start = new Date(e.dateTime).getTime();
    const end = start + 30 * 60 * 1000;

    if (now < start) return "Upcoming";
    if (now <= end) return "Live";
    return "Ended";
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>
      {msg && <p>{msg}</p>}

      <div className="card">
        <h3>Create Event</h3>
        <form onSubmit={createEvent}>
          <input placeholder="Title" required value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Description" required value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input type="datetime-local" required value={form.dateTime}
            onChange={(e) => setForm({ ...form, dateTime: e.target.value })} />
          <input placeholder="Location" required value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <input type="number" placeholder="Capacity" required value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
          <input type="file"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
          <button>Create</button>
        </form>
      </div>

      <div className="card">
        <h3>Join Event</h3>
        <input placeholder="Event ID" value={eventCode}
          onChange={(e) => setEventCode(e.target.value)} />
        <button onClick={joinEvent}>Join</button>
      </div>

      <div className="card">
        <h3>My Created Events</h3>
        {created.map((e) => (
          <div key={e._id} className="event">
            {e.title} | {getStatus(e)} | ID: {e.eventCode}
            <br />
            <button onClick={() => enterEvent(e._id)}>Enter</button>
            <button onClick={() => deleteEvent(e._id)}>Delete</button>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>My Joined Events</h3>
        {joined.map((e) => (
          <div key={e._id} className="event">
            {e.title} | {getStatus(e)}
            <br />
            <button onClick={() => enterEvent(e._id)}>Enter</button>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>All Events</h3>
        {allEvents.map((e) => (
          <div key={e._id}>
            {e.title} | ID: {e.eventCode} | {getStatus(e)}
          </div>
        ))}
      </div>

      <button
        style={{ background: "red", marginTop: 30 }}
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
