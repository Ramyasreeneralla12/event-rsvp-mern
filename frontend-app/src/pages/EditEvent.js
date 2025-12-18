import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch existing event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`);
        const event = res.data;

        setTitle(event.title);
        setDescription(event.description);
        setDateTime(event.dateTime.slice(0, 16)); // for datetime-local
        setLocation(event.location);
        setCapacity(event.capacity);
      } catch {
        setMessage("Failed to load event ❌");
      }
    };

    fetchEvent();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("dateTime", dateTime);
      formData.append("location", location);
      formData.append("capacity", capacity);

      if (image) {
        formData.append("image", image);
      }

      await API.put(`/events/${id}`, formData);

      setMessage("Event updated successfully ✅");

      setTimeout(() => {
        navigate("/events");
      }, 1000);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Update failed ❌"
      );
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "30px auto" }}>
      <h2>Edit Event</h2>

      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br /><br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="number"
          placeholder="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <br /><br />

        <button type="submit">Update Event</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default EditEvent;
