import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import useHttpClient from "../../Shared/Hooks/http-hook";
import { AuthContext } from "../../Shared/Context/auth-context";
import "./AdminDashboard.css";

const API_URL = "http://localhost:4000";

const GROUPS = [
  { key: "posted", label: "Posted" },
  { key: "fostered", label: "Fostered" },
  { key: "adopted", label: "Adopted" },
];

function AnimalChip({ animal }) {
  return (
    <li>
      <Link className="admin-animal" to={`/animals/${animal.id}`}>
        <img
          className="admin-animal-image"
          src={`${API_URL}/${animal.imageURL}`}
          alt=""
        />
        <span className="admin-animal-text">
          <span className="admin-animal-name">{animal.name}</span>
          <span className="admin-animal-meta">
            {animal.type} · {animal.status === "adopt" ? "adopted" : animal.status === "foster" ? "fostered" : animal.status}
          </span>
        </span>
      </Link>
    </li>
  );
}

function UserCard({ user }) {
  return (
    <li className="admin-user">
      <div className="admin-user-header">
        <img
          className="admin-user-avatar"
          src={`${API_URL}/${user.imageURL}`}
          alt=""
        />
        <div className="admin-user-id">
          <span className="admin-user-name">
            {user.name}
            {user.isAdmin && <span className="admin-badge">Admin</span>}
          </span>
          <span className="admin-user-email">{user.email}</span>
        </div>
        <Link className="admin-user-link" to={`/${user.id}/animals`}>
          View profile
        </Link>
      </div>

      <div className="admin-user-groups">
        {GROUPS.map((group) => (
          <div className="admin-group" key={group.key}>
            <span className="admin-group-title">
              {group.label}
              <span className="admin-group-count">{user[group.key].length}</span>
            </span>
            {user[group.key].length > 0 ? (
              <ul className="admin-animal-list">
                {user[group.key].map((animal) => (
                  <AnimalChip key={animal.id} animal={animal} />
                ))}
              </ul>
            ) : (
              <span className="admin-empty">None yet</span>
            )}
          </div>
        ))}
      </div>
    </li>
  );
}

export default function AdminDashboard() {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await sendRequest(
          `${API_URL}/api/users/admin/overview`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );
        setUsers(response.data.users);
      } catch (err) {}
    };
    fetchOverview();
  }, [sendRequest, auth.token]);

  const totals = useMemo(
    () => ({
      users: users.length,
      posted: users.reduce((sum, u) => sum + u.posted.length, 0),
      fostered: users.reduce((sum, u) => sum + u.fostered.length, 0),
      adopted: users.reduce((sum, u) => sum + u.adopted.length, 0),
    }),
    [users]
  );

  const filteredUsers = users.filter((user) => {
    const term = search.trim().toLowerCase();
    return (
      !term ||
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <section className="admin-page">
        <h1 className="admin-title">Admin</h1>

        <div className="admin-stats">
          <div className="admin-stat">
            <span className="admin-stat-number">{totals.users}</span>
            <span className="admin-stat-label">Users</span>
          </div>
          <div className="admin-stat">
            <span className="admin-stat-number">{totals.posted}</span>
            <span className="admin-stat-label">Posted</span>
          </div>
          <div className="admin-stat">
            <span className="admin-stat-number">{totals.fostered}</span>
            <span className="admin-stat-label">Fostered</span>
          </div>
          <div className="admin-stat">
            <span className="admin-stat-number">{totals.adopted}</span>
            <span className="admin-stat-label">Adopted</span>
          </div>
        </div>

        <input
          className="admin-search"
          type="search"
          placeholder="Search by name or email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}

        {!isLoading && filteredUsers.length === 0 && (
          <span className="admin-empty">No users found.</span>
        )}

        {!isLoading && filteredUsers.length > 0 && (
          <ul className="admin-user-list">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
