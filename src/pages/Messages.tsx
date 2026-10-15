import React, { useEffect, useState } from 'react';
import { contactService } from '../services/contactService';
import { useAuth } from '../context/AuthContext';
import type { ContactMessage } from '../types';
import {
  MessageSquare,
  Search,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  X,
  Loader2
} from 'lucide-react';

export const Messages: React.FC = () => {
  const { showToast } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await contactService.getAllContactMessages();
      if (res && res.success) {
        setMessages(res.data);
      }
    } catch (err) {
      showToast('Failed to load contact messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Delete this customer inquiry?')) return;
    try {
      await contactService.deleteMessage(id);
      showToast('Message deleted', 'success');
      setMessages((prev) => prev.filter((m) => (m.id || m._id) !== id));
      if (selectedMessage && (selectedMessage.id || selectedMessage._id) === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      showToast('Failed to delete message', 'error');
    }
  };

  const filteredMessages = messages.filter((m) => {
    return (
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.subject && m.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-wide">
            Customer Support & Inquiries
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Inbox for Contact Us submissions, inquiries, and customer feedback</p>
        </div>

        <div className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 self-start sm:self-auto shadow-xs">
          Inquiries: <span className="text-emerald-700 font-bold">{messages.length}</span>
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
            placeholder="Search inquiries by sender, email or message..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span>Loading support inquiries...</span>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <MessageSquare className="w-8 h-8 text-slate-300" />
            <span>No inquiries received yet.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Customer</th>
                  <th className="py-3 px-4 font-bold">Subject</th>
                  <th className="py-3 px-4 font-bold">Message Snippet</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMessages.map((m) => {
                  const msgId = m.id || m._id || '';
                  const formattedDate = m.createdAt
                    ? new Date(m.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Recently';

                  return (
                    <tr key={msgId} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{m.name}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{m.email}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700">
                        {m.subject || 'General Inquiry'}
                      </td>
                      <td className="py-3 px-4 text-slate-700 max-w-xs truncate font-medium">
                        {m.message}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-medium">
                        {formattedDate}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedMessage(m)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition cursor-pointer"
                            title="Read Inquiry"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msgId)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Reader Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setSelectedMessage(null)} />
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 z-10 text-xs text-slate-900">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <span>Support Inquiry</span>
                </h2>
                <p className="text-[11px] text-slate-500">From {selectedMessage.name} &bull; {selectedMessage.email}</p>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-200/80 pb-2 font-medium">
                <span>Subject: <strong className="text-slate-900 font-bold">{selectedMessage.subject || 'General'}</strong></span>
                {selectedMessage.phone && <span>Phone: <strong className="text-slate-800 font-bold">{selectedMessage.phone}</strong></span>}
              </div>
              <p className="text-slate-800 text-sm whitespace-pre-wrap leading-relaxed pt-1 font-medium">
                {selectedMessage.message}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Your VELORA Inquiry')}`}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Reply via Email</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
