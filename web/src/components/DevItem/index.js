import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import "./styles.css";
import api from "../../services/api";

function DevItem({ dev }) {
  async function remove(id) {
    alert("teste remove id: " + id);
    const response = await api.delete(`/devs/${id}`);
    console.log(response);
  }
  return (
    <li className="dev-item">
      <header>
        <div>
          <img src={dev.avatar_url} alt={dev.name} />
          <div className="user-info">
            <strong>{dev.name}</strong>
            <span>{dev.techs.join(", ")}</span>
          </div>
        </div>
        <button type="submit" onClick={() => remove(dev._id)}>
          <FaTimesCircle color="red" size={16} />
        </button>
      </header>
      <p>{dev.bio}</p>
      <a href={`https://github.com/${dev.github_username}`} target="blank">
        Acessar Perfil no GitHub
      </a>
    </li>
  );
}

export default DevItem;
