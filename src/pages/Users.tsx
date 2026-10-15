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
  Calendar
} from 'lucide-react';

export const Users: React.FC = () => {
  const { showToast, user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllUsers();
      if (res && res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      showToast('Failed to load users from database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (userId === (currentAdmin?.id || currentAdmin?._id)) {
      showToast('You cannot delete your own active administrator account!', 'error');
      return;
    }
    if (!window.confirm(`Are you sure you want to permanently delete user "${userName}"?`)) return;

    try {
      await adminService.deleteUser(userId);
      showToast(`User "${userName}" deleted successfully`, 'success');
      setUsers((prev) => prev.filter((u) => (u.id || u._id) !== userId));
    } catch (err) {
      showToast('Failed to delete user', 'error');
    }
  };

  const filteredUsers = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-wide">
            Registered Customer Accounts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Audit user profiles, verified emails, and account privileges</p>
        </div>

        <div className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 self-start sm:self-auto shadow-xs">
          Total Users: <span className="text-emerald-700 font-bold">{users.length}</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, email or phone..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span>Loading user profiles...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <UsersIcon className="w-8 h-8 text-slate-300" />
            <span>No users found matching your search.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Customer Name</th>
                  <th className="py-3 px-4 font-bold">Email Address</th>
                  <th className="py-3 px-4 font-bold">Contact Phone</th>
                  <th className="py-3 px-4 font-bold">Role</th>
                  <th className="py-3 px-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const userId = u.id || u._id || '';
                  const isAdmin = u.role === 'admin';

                  return (
                    <tr key={userId} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isAdmin
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{u.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">ID: {userId.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{u.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {u.phone ? (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{u.phone}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">Not provided</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isAdmin
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {isAdmin && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                          <span className="capitalize">{u.role}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!isAdmin && (
                          <button
                            onClick={() => handleDeleteUser(userId, u.name)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
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
