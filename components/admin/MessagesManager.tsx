"use client";

import { useState } from "react";
import { Mail, MailOpen, Reply, Trash2, Archive, CheckCircle2, Loader2, Send } from "lucide-react";
import type { ContactMessage, MessageReply, MessageStatus } from "@prisma/client";
import {
  updateMessageStatusAction,
  replyToMessageAction,
  deleteMessageAction,
} from "@/actions/message-actions";

type MessageWithReplies = ContactMessage & { replies: MessageReply[] };

interface MessagesManagerProps {
  initialMessages: MessageWithReplies[];
}

export function MessagesManager({ initialMessages }: MessagesManagerProps) {
  const [messages, setMessages] = useState<MessageWithReplies[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<MessageWithReplies | null>(
    initialMessages[0] || null
  );
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const handleSelect = async (msg: MessageWithReplies) => {
    setSelectedMessage(msg);
    if (msg.status === "UNREAD") {
      await updateMessageStatusAction(msg.id, "READ");
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: "READ" } : m))
      );
    }
  };

  const handleStatusChange = async (id: string, status: MessageStatus) => {
    const res = await updateMessageStatusAction(id, status);
    if (res.success && res.message) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, status } : null));
      }
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyText.trim()) return;

    setSendingReply(true);
    const res = await replyToMessageAction(selectedMessage.id, replyText);
    if (res.success && res.reply) {
      const updatedReplies = [...selectedMessage.replies, res.reply];
      const updatedMsg = { ...selectedMessage, status: "REPLIED" as MessageStatus, replies: updatedReplies };

      setMessages((prev) =>
        prev.map((m) => (m.id === selectedMessage.id ? updatedMsg : m))
      );
      setSelectedMessage(updatedMsg);
      setReplyText("");
    }
    setSendingReply(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    const res = await deleteMessageAction(id);
    if (res.success) {
      const remaining = messages.filter((m) => m.id !== id);
      setMessages(remaining);
      if (selectedMessage?.id === id) {
        setSelectedMessage(remaining[0] || null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <h1 className="text-2xl font-bold font-heading text-white">Contact Inbox</h1>
        <p className="text-xs text-zinc-400 font-mono mt-0.5">
          Review inquiries, project requests, and manage responses
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-white/10 space-y-3">
          <Mail className="w-8 h-8 text-zinc-500 mx-auto" />
          <h3 className="font-bold text-sm text-white font-heading">Your Inbox is Empty</h3>
          <p className="text-xs text-zinc-400 font-mono">
            New contact submissions from the public site will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[650px]">
          {/* Messages List (5 cols) */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-3 border border-white/10 flex flex-col overflow-y-auto space-y-1.5">
            {messages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              const isUnread = msg.status === "UNREAD";

              return (
                <button
                  key={msg.id}
                  onClick={() => handleSelect(msg)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all cursor-pointer flex flex-col gap-1 ${
                    isSelected
                      ? "bg-amber-500/10 border border-amber-400/30"
                      : "hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,1)]" />
                      )}
                      <span className={`text-xs font-mono font-bold ${isUnread ? "text-white" : "text-zinc-300"}`}>
                        {msg.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {new Date(msg.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-300 font-sans line-clamp-1 font-medium">
                    {msg.subject || "(No Subject)"}
                  </div>

                  <div className="text-[11px] text-zinc-500 line-clamp-1 font-sans">
                    {msg.body}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Message Detail & Reply (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between overflow-y-auto">
            {selectedMessage ? (
              <div className="space-y-6">
                {/* Detail Header */}
                <div className="flex items-start justify-between pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-lg font-bold font-heading text-white">
                      {selectedMessage.subject || "(No Subject)"}
                    </h2>
                    <div className="flex items-center gap-2 mt-1 text-xs font-mono text-zinc-400">
                      <span>From: <strong className="text-zinc-200">{selectedMessage.name}</strong> ({selectedMessage.email})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleStatusChange(selectedMessage.id, "ARCHIVED")}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
                      title="Archive"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs sm:text-sm text-zinc-200 font-sans leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.body}
                </div>

                {/* Existing Replies */}
                {selectedMessage.replies.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">
                      Previous Replies ({selectedMessage.replies.length})
                    </h4>
                    {selectedMessage.replies.map((rep) => (
                      <div
                        key={rep.id}
                        className="p-3.5 rounded-xl bg-amber-500/[0.04] border border-amber-400/20 space-y-1 text-xs font-sans"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-amber-300/70">
                          <span>Sent via Portal</span>
                          <span>{new Date(rep.sentAt).toLocaleString()}</span>
                        </div>
                        <p className="text-zinc-200">{rep.bodyHtml}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                      <Reply className="w-3.5 h-3.5 text-amber-400" />
                      <span>Compose Reply to {selectedMessage.email}</span>
                    </label>
                  </div>

                  <textarea
                    rows={3}
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a professional response..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400/60 font-sans leading-relaxed"
                  />

                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={sendingReply}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs font-mono shadow-md transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {sendingReply ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>Send Reply</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-xs font-mono text-zinc-500">
                Select a message to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
