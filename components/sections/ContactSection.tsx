"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2, AlertCircle, Copy, Check, MessageSquare } from "lucide-react";

export function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [copied, setCopied] = useState(false);

  const contactEmail = "enamul@example.com"; // Fallback public contact

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact@enamul.dev");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          body: formData.message,
        }),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">Get in Touch</h2>
        </div>
        <span className="text-xs font-mono text-emerald-400">Response within 24h</span>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-5 overflow-y-auto pr-1">
        {/* Left Col: Direct Contacts & Info */}
        <div className="md:col-span-2 flex flex-col justify-between gap-4 p-5 rounded-2xl glass-panel border border-white/10">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold font-heading text-white">Let’s build something extraordinary.</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              I’m open to full-time engineering roles, consulting, and ambitious architectural initiatives.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleCopyEmail}
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/40 text-xs font-mono text-slate-200 transition-all text-left group"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>contact@enamul.dev</span>
              </div>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300" />
              )}
            </button>
          </div>
        </div>

        {/* Right Col: Contact Message Form */}
        <form
          onSubmit={handleSubmit}
          className="md:col-span-3 flex flex-col justify-between gap-3 p-5 rounded-2xl glass-panel border border-white/10"
        >
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-sans text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-sans text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Subject</label>
              <input
                type="text"
                placeholder="Project Consultation / Engineering Role"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-sans text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Message</label>
              <textarea
                required
                rows={3}
                placeholder="Hi Enamul, I would like to discuss..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-sans text-white focus:outline-none focus:border-cyan-400 transition-colors resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            {status === "success" && (
              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Message received! Will reply soon.</span>
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-1.5 text-xs font-mono text-rose-400">
                <AlertCircle className="w-4 h-4" />
                <span>Could not send. Try copying email.</span>
              </div>
            )}
            {status === "idle" && <div />}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-mono bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-medium shadow-md shadow-purple-600/30 transition-all ml-auto disabled:opacity-50"
            >
              <span>{loading ? "Sending..." : "Send Message"}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
