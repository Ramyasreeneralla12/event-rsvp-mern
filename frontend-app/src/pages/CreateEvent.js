import api from "../api/axios";
import { useState } from "react";

export default function CreateEvent() {
  const [form, setForm] = useState({});

  const submit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach(k => data.append(k, form[k]));
    await api.post("/events", data);
    alert("Event Created");
  };

  return (
    <form onSubmit={submit}>
      <input placeholder="Title" onChange={(e)=>setForm({...form,title:e.target.value})}/>
      <input placeholder="Description" onChange={(e)=>setForm({...form,description:e.target.value})}/>
      <input type="datetime-local" onChange={(e)=>setForm({...form,dateTime:e.target.value})}/>
      <input placeholder="Location" onChange={(e)=>setForm({...form,location:e.target.value})}/>
      <input placeholder="Capacity" onChange={(e)=>setForm({...form,capacity:e.target.value})}/>
      <input type="file" onChange={(e)=>setForm({...form,image:e.target.files[0]})}/>
      <button>Create</button>
    </form>
  );
}
