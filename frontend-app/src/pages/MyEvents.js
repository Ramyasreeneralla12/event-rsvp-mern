import { useEffect, useState } from "react";
import api from "../api/axios";

export default function MyEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      const res = await api.get("/events/my/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data.created);
    };
    load();
  }, []);

  return (
    <div className="dash-box">
      <h3>My Events</h3>
      {events.map((e) => (
        <div key={e._id}>
          <b>{e.title}</b> | ID: {e.eventCode}
        </div>
      ))}
    </div>
  );
}
