import api from "../api/axios";
import { useEffect, useState } from "react";

export default function AllEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/events/all").then(res => setEvents(res.data));
  }, []);

  return events.map(e => (
    <div key={e._id}>
      <h3>{e.title}</h3>
      <p>{e.eventCode}</p>
    </div>
  ));
}
