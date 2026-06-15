"use client";

import React, { useState, useEffect } from "react";

interface Role {
  id: string;
  name: string;
  description: string | null;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  roleId: string;
  role: Role;
  createdAt: string;
}

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRoleId, setFormRoleId] = useState("");

  // Alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load Session User (to prevent self-deletion)
  const loadCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth");
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          setCurrentUser(data.user);
        }
      }
    } catch (err) {
      console.error("Failed loading session user", err);
    }
  };

  const loadUsersAndRoles = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const queryParams = new URLSearchParams({
        search,
        roleId: selectedRole,
      });

      const res = await fetch(`/api/users?${queryParams}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setRoles(data.roles || []);
      } else {
        setErrorMsg("Failed to load user list");
      }
    } catch (err) {
      console.error("Error loading users", err);
      setErrorMsg("Failed to connect to users API");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
    loadUsersAndRoles();
  }, [selectedRole]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsersAndRoles();
  };

  const openCreateModal = () => {
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormRoleId(roles[0]?.id || "");
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const payload = {
      name: formName,
      email: formEmail,
      password: formPassword,
      roleId: formRoleId,
    };

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to create user");
        return;
      }

      setSuccessMsg("User account created successfully!");
      setIsModalOpen(false);
      loadUsersAndRoles();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to create user account");
    }
  };

  const handleRoleChange = async (userId: string, newRoleId: string) => {
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId: newRoleId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to update role");
        return;
      }

      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      
      setSuccessMsg("User role updated successfully!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to modify user role");
    }
  };

  const handleDelete = async (user: User) => {
    if (currentUser && currentUser.id === user.id) {
      alert("Security Block: You cannot delete your own account while logged in.");
      return;
    }

    if (!confirm(`Are you certain you want to revoke database credentials and delete user '${user.name || user.email}'?`)) return;

    setErrorMsg(null);
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to delete user");
        return;
      }

      setSuccessMsg("User credentials revoked and deleted successfully!");
      loadUsersAndRoles();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to delete user");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase block mb-1">
            Access Control
          </span>
          <h1 className="font-headline-sm text-2xl text-emerald-deep font-semibold tracking-wide">
            Console Users
          </h1>
        </div>
        <div>
          <button
            onClick={openCreateModal}
            className="px-5 py-3 bg-emerald-deep text-linen-white hover:bg-emerald-deep/90 font-label-caps text-[10px] uppercase tracking-widest border border-champagne-gold/30 flex items-center gap-2 cursor-pointer transition-colors shadow"
          >
            <span className="material-symbols-outlined text-base select-none">person_add</span>
            Create User Account
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-body-sm text-xs p-4 mb-6 flex items-start gap-2">
          <span className="material-symbols-outlined text-sm select-none">check_circle</span>
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-700 font-body-sm text-xs p-4 mb-6 flex items-start gap-2">
          <span className="material-symbols-outlined text-sm select-none">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant/15 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto flex-grow max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email..."
            className="flex-grow bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2.5 px-3 transition-colors rounded-none text-on-surface font-body-md"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-emerald-deep text-linen-white hover:bg-emerald-deep/90 font-label-caps text-[9px] uppercase tracking-wider border border-champagne-gold/25 cursor-pointer transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex gap-3 w-full md:w-auto justify-end">
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
            }}
            className="bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md cursor-pointer"
          >
            <option value="">All Roles</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="py-12 text-center text-on-surface-variant/60 font-semibold">
          Loading credentials list...
        </div>
      ) : users.length > 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/15 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container-low/10">
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  User Name
                </th>
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Email Credentials
                </th>
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Registered Date
                </th>
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Privilege Level Role
                </th>
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-xs font-body-md">
              {users.map((user) => {
                const isSelf = currentUser && currentUser.id === user.id;
                return (
                  <tr
                    key={user.id}
                    className="border-b border-outline-variant/10 hover:bg-surface-container-low/30 transition-colors"
                  >
                    <td className="p-4 font-semibold text-emerald-deep flex items-center gap-2">
                      {user.name || "Unnamed Officer"}
                      {isSelf && (
                        <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[8px] font-label-caps tracking-widest px-1.5 py-0.5 rounded-none font-bold">
                          You
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-on-surface">
                      {user.email}
                    </td>
                    <td className="p-4 text-on-surface-variant/80 font-mono text-[10px]">
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      {isSelf ? (
                        <span className="inline-flex px-2 py-1 text-[9px] font-label-caps bg-emerald-deep text-linen-white uppercase tracking-wider font-semibold border border-champagne-gold/25">
                          {user.role.name}
                        </span>
                      ) : (
                        <select
                          value={user.roleId}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="text-[9px] font-label-caps uppercase tracking-wider py-1 px-2.5 border border-outline-variant bg-surface text-on-surface rounded-none cursor-pointer focus:outline-none focus:border-emerald-deep"
                        >
                          {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(user)}
                        disabled={isSelf ?? false}
                        className={`text-on-surface-variant hover:text-red-600 p-1.5 cursor-pointer transition-colors ${
                          isSelf ? "opacity-30 cursor-not-allowed hover:text-on-surface-variant" : ""
                        }`}
                        title={isSelf ? "Cannot delete self" : "Revoke Access"}
                      >
                        <span className="material-symbols-outlined text-base select-none">person_remove</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-outline-variant/30 bg-surface-container-lowest">
          <span className="material-symbols-outlined text-champagne-gold text-4xl mb-3 select-none">
            group
          </span>
          <p className="text-on-surface-variant text-sm">No console users found.</p>
        </div>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/30 w-full max-w-md shadow-2xl">
            <div className="px-6 py-4 border-b border-outline-variant/15 flex justify-between items-center bg-surface-container-low/30">
              <h3 className="font-headline-sm text-base text-emerald-deep font-semibold tracking-wide uppercase">
                Register Platform Credentials
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-emerald-deep p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined select-none">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-5">
              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Sarthak Patel"
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                />
              </div>

              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="e.g. partner@gemshouse.shop"
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-mono"
                />
              </div>

              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                  Security Password *
                </label>
                <input
                  type="password"
                  required
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-mono"
                />
              </div>

              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                  Privilege Role *
                </label>
                <select
                  required
                  value={formRoleId}
                  onChange={(e) => setFormRoleId(e.target.value)}
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md cursor-pointer"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} - {r.description || "No description"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t border-outline-variant/15 pt-5 flex justify-end gap-3 bg-surface-container-low/10 px-6 py-4 -mx-6 -mb-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-outline-variant/35 text-on-surface hover:bg-surface-container-low font-label-caps text-[10px] uppercase tracking-widest cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-deep text-linen-white hover:bg-emerald-deep/95 font-label-caps text-[10px] uppercase tracking-widest border border-champagne-gold/30 cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}