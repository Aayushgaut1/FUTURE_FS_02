import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  Mail,
  Globe,
  Calendar,
  MessageSquare,
  Plus,
  Edit,
  Check,
} from "lucide-react";
import { api, type Lead, type LeadNote } from "../api/client";

export function LeadDetails() {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("new");
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([api.leads.get(id), api.notes.list(id)])
      .then(([leadData, notesData]) => {
        if (cancelled) return;
        setLead(leadData);
        setStatus(leadData.status);
        setNotes(notesData);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load lead");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-gray-500">Loading lead...</div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="text-center py-12">
        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}
        <h2 className="text-xl font-semibold text-gray-900">Lead not found</h2>
        <Link to="/leads" className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block">
          Back to Leads
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "contacted":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "converted":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "New Lead";
      case "contacted":
        return "Contacted";
      case "converted":
        return "Converted";
      default:
        return status;
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const updated = await api.leads.update(lead.id, { ...lead, status });
      setLead(updated);
      setIsEditingStatus(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || savingNote) return;
    setSavingNote(true);
    try {
      const note = await api.notes.add(lead.id, newNote.trim(), "John Doe");
      setNotes((prev) => [note, ...prev]);
      setNewNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add note");
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/leads"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Leads</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Information Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-semibold text-2xl">
                  {lead.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {lead.name}
              </h2>
              <p className="text-gray-600 mt-1">{lead.company}</p>
            </div>

            {/* Status Dropdown */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lead Status
              </label>
              {isEditingStatus ? (
                <div className="flex items-center space-x-2">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="new">New Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(
                      status
                    )}`}
                  >
                    {getStatusLabel(status)}
                  </span>
                  <button
                    onClick={() => setIsEditingStatus(true)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {lead.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Source</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {lead.source}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Created</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {lead.createdAt
                      ? new Date(lead.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Notes & Follow-ups
                </h3>
              </div>
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="mb-6">
              <div className="relative">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note or follow-up..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={savingNote}
                  className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{savingNote ? "Adding..." : "Add Note"}</span>
                </button>
              </div>
            </form>

            {/* Timeline of Notes */}
            <div className="space-y-4">
              {notes.map((note, index) => (
                <div key={note.id} className="relative pl-8 pb-6">
                  {/* Timeline Line */}
                  {index !== notes.length - 1 && (
                    <div className="absolute left-2 top-6 bottom-0 w-px bg-gray-200"></div>
                  )}

                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white"></div>

                  {/* Note Content */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-900">{note.content}</p>
                    <div className="flex items-center space-x-3 mt-3 text-xs text-gray-500">
                      <span>{note.author}</span>
                      <span>•</span>
                      <span>{note.timestamp || ""}</span>
                    </div>
                  </div>
                </div>
              ))}

              {notes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No notes yet. Add your first note above.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
