import { useEffect, useState } from "react";
import api from "../api/axios";

export default function JoinedEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      const res = await api.get("/events/my/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data.joined);
    };
    load();
  }, []);

  return (
    <div className="dash-box">
      <h3>Joined Events</h3>
      {events.map((e) => (
        <div key={e._id}>{e.title}</div>
      ))}
    </div>
  );
}
