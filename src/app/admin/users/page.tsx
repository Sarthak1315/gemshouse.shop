"use client";

import React, { useState, useEffect } from "react";

interface User {
  id: string;
  name: string | null;
  email: string;
  isBusinessUser: boolean;
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
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [businessFilter, setBusinessFilter] = useState("all"); // all, standard, business

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formIsBusinessUser, setFormIsBusinessUser] = useState(false);

  // Alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load Session User (Admin User checking administrative session)
  const loadCurrentUser = async () => {
    try {
      const res = await fetch("/api/admin/auth");
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

  const loadUsers = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const queryParams = new URLSearchParams({
        search,
      });

      if (businessFilter === "business") {
        queryParams.append("isBusinessUser", "true");
      } else if (businessFilter === "standard") {
        queryParams.append("isBusinessUser", "false");
      }

      const res = await fetch(`/api/users?${queryParams}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        setErrorMsg("Failed to load storefront user list");
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
    loadUsers();
  }, [businessFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers();
  };

  const openCreateModal = () => {
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormIsBusinessUser(false);
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
      isBusinessUser: formIsBusinessUser,
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
      loadUsers();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to create user account");
    }
  };

  const handleBusinessToggle = async (userId: string, currentVal: boolean) => {
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBusinessUser: !currentVal }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to update business status");
        return;
      }

      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      
      setSuccessMsg("User business status updated successfully!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to modify user status");
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you certain you want to revoke credentials and delete storefront user '${user.name || user.email}'?`)) return;

    setErrorMsg(null);
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to delete user");
        return;
      }

      setSuccessMsg("User credentials revoked and deleted successfully!");
      loadUsers();
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
            Storefront Customers
          </h1>
        </div>
        <div>
          <button
            onClick={openCreateModal}
            className="px-5 py-3 bg-emerald-deep text-linen-white hover:bg-emerald-deep/90 font-label-caps text-[10px] uppercase tracking-widest border border-champagne-gold/30 flex items-center gap-2 cursor-pointer transition-colors shadow"
          >
            <span className="material-symbols-outlined text-base select-none">person_add</span>
            Create Storefront User
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
            value={businessFilter}
            onChange={(e) => setBusinessFilter(e.target.value)}
            className="bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md cursor-pointer"
          >
            <option value="all">All Clients</option>
            <option value="standard">Standard Retail Users</option>
            <option value="business">B2B Business Clients</option>
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
                  Customer Name
                </th>
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Email Credentials
                </th>
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Registered Date
                </th>
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Client Type
                </th>
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-xs font-body-md">
              {users.map((user) => {
                return (
                  <tr
                    key={user.id}
                    className="border-b border-outline-variant/10 hover:bg-surface-container-low/30 transition-colors"
                  >
                    <td className="p-4 font-semibold text-emerald-deep">
                      {user.name || "Unnamed Customer"}
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
                      <button
                        onClick={() => handleBusinessToggle(user.id, user.isBusinessUser)}
                        className={`px-2.5 py-1 text-[8px] font-label-caps uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
                          user.isBusinessUser
                            ? "bg-emerald-deep text-linen-white border-champagne-gold/25"
                            : "bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:border-emerald-deep"
                        }`}
                      >
                        {user.isBusinessUser ? "B2B Business" : "Retail User"}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-on-surface-variant hover:text-red-600 p-1.5 cursor-pointer transition-colors"
                        title="Delete User"
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
          <p className="text-on-surface-variant text-sm">No storefront users found.</p>
        </div>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/30 w-full max-w-md shadow-2xl">
            <div className="px-6 py-4 border-b border-outline-variant/15 flex justify-between items-center bg-surface-container-low/30">
              <h3 className="font-headline-sm text-base text-emerald-deep font-semibold tracking-wide uppercase">
                Register Storefront Credentials
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
                  placeholder="e.g. Jane Doe"
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
                  placeholder="e.g. client@gemshouse.shop"
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

              <div className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  id="formIsBusinessUser"
                  checked={formIsBusinessUser}
                  onChange={(e) => setFormIsBusinessUser(e.target.checked)}
                  className="w-4 h-4 border border-outline-variant rounded-none text-emerald-deep focus:ring-0 focus:ring-offset-0 accent-emerald-deep cursor-pointer"
                />
                <label
                  htmlFor="formIsBusinessUser"
                  className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider select-none cursor-pointer"
                >
                  Verify as B2B Business Client / Wholesale Buyer
                </label>
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