import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types';
import {
  Users as UsersIcon,
  Search,
  Trash2,
  ShieldCheck,
  User as UserIcon,
  Loader2,
  Mail,
  Phone,
  Crown,
  UserCheck,
  ShieldAlert
} from 'lucide-react';

export const Users: React.FC = () => {
  const { showToast, user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'manager' | 'admin' | 'superadmin'>('all');
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllUsers();
      if (res && res.success) {
        setUsers(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load users from database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string, userName: string) => {
    const myId = currentAdmin?.id || currentAdmin?._id;
    if (userId === myId) {
      showToast('You cannot alter your own administrative role!', 'error');
      return;
    }

    try {
      setUpdatingRoleId(userId);
      const res = await adminService.updateUserRole(userId, newRole);
      if (res && res.success) {
        showToast(`Role for "${userName}" successfully upgraded to ${newRole.toUpperCase()}`, 'success');
        setUsers((prev) =>
          prev.map((u) => {
            const uid = u.id || u._id;
            return uid === userId ? { ...u, role: newRole as any } : u;
          })
        );
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || 'Failed to update user role', 'error');
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    const myId = currentAdmin?.id || currentAdmin?._id;
    if (userId === myId) {
      showToast('You cannot delete your own active administrator account!', 'error');
      return;
    }
    if (!window.confirm(`Are you sure you want to permanently delete user "${userName}"?`)) return;

    try {
      await adminService.deleteUser(userId);
      showToast(`User "${userName}" deleted successfully`, 'success');
      setUsers((prev) => prev.filter((u) => (u.id || u._id) !== userId));
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || 'Failed to delete user', 'error');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'superadmin':
        return {
          icon: Crown,
          className: 'bg-purple-50 text-purple-700 border-purple-200',
          label: 'Super Admin'
        };
      case 'admin':
        return {
          icon: ShieldCheck,
          className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: 'Admin'
        };
      case 'manager':
        return {
          icon: UserCheck,
          className: 'bg-amber-50 text-amber-700 border-amber-200',
          label: 'Manager'
        };
      default:
        return {
          icon: UserIcon,
          className: 'bg-slate-100 text-slate-700 border-slate-200',
          label: 'Customer'
        };
    }
  };

  const counts = {
    all: users.length,
    customer: users.filter((u) => u.role === 'customer').length,
    manager: users.filter((u) => u.role === 'manager').length,
    admin: users.filter((u) => u.role === 'admin').length,
    superadmin: users.filter((u) => u.role === 'superadmin').length
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-wide">
            User Accounts & RBAC Roles
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage customer profiles, staff managers, and executive administrator privileges</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-xs">
            Total Accounts: <span className="text-emerald-700 font-bold">{users.length}</span>
          </div>
        </div>
      </div>

      {/* Role Filters & Search */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'customer', 'manager', 'admin', 'superadmin'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition capitalize cursor-pointer border ${
                roleFilter === role
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {role === 'all' ? 'All Roles' : role} ({counts[role]})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span>Loading user accounts and access controls...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <UsersIcon className="w-8 h-8 text-slate-300" />
            <span>No user accounts match the current filter or search criteria.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">User Identity</th>
                  <th className="py-3 px-4 font-bold">Email</th>
                  <th className="py-3 px-4 font-bold">Phone</th>
                  <th className="py-3 px-4 font-bold">Current Role</th>
                  <th className="py-3 px-4 font-bold">Role Assignment (RBAC)</th>
                  <th className="py-3 px-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const userId = u.id || u._id || '';
                  const myId = currentAdmin?.id || currentAdmin?._id;
                  const isSelf = userId === myId;
                  const isUpdating = updatingRoleId === userId;
                  const badge = getRoleBadge(u.role);
                  const Icon = badge.icon;

                  return (
                    <tr key={userId} className="hover:bg-slate-50/70 transition">
                      
                      {/* Name & ID */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${badge.className}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-slate-900">{u.name}</p>
                              {isSelf && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono">ID: {userId.slice(-6)}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{u.email}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {u.phone ? (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{u.phone}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Not provided</span>
                        )}
                      </td>

                      {/* Current Role Badge */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.className}`}>
                          <Icon className="w-3.5 h-3.5" />
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      {/* Role Assignment Dropdown */}
                      <td className="py-3 px-4">
                        {isSelf ? (
                          <span className="text-[11px] text-slate-400 italic">Self account locked</span>
                        ) : (
                          <div className="relative inline-flex items-center">
                            <select
                              value={u.role}
                              disabled={isUpdating}
                              onChange={(e) => handleRoleChange(userId, e.target.value, u.name)}
                              className={`text-xs font-semibold py-1.5 px-3 rounded-xl border transition cursor-pointer appearance-none pr-7 ${
                                isUpdating
                                  ? 'bg-slate-100 text-slate-400 border-slate-200'
                                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 focus:outline-none focus:border-emerald-500'
                              }`}
                            >
                              <option value="customer">Customer (Storefront Shopper)</option>
                              <option value="manager">Manager (Orders & Inventory)</option>
                              <option value="admin">Admin (Full Control)</option>
                              <option value="superadmin">Super Admin (Root Privileges)</option>
                            </select>
                            <div className="pointer-events-none absolute right-2 text-slate-400">
                              {isUpdating ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                              ) : (
                                <span className="text-[10px]">▼</span>
                              )}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        {!isSelf && (
                          <button
                            onClick={() => handleDeleteUser(userId, u.name)}
                            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
