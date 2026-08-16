"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2, AlertCircle, Copy, Check } from "lucide-react";

export function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [copied, setCopied] = useState(false);

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
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-zinc-100">Get in Touch</h2>
          <div className="text-[11px] font-mono text-zinc-500">
            Direct communication channel · Responses within 24 hours
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 overflow-y-auto pr-1">
        {/* Left Col: Contact Information */}
        <div className="md:col-span-2 flex flex-col justify-between gap-4 p-5 rounded-2xl glass-panel border border-white/[0.06] bg-[#18181b]/40">
          <div className="flex flex-col gap-2.5">
            <h3 className="text-base font-bold font-heading text-zinc-200">
              Open to ambitious initiatives.
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Currently available for full-time engineering roles, technical architecture, and high-impact distributed systems.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-mono text-zinc-500 uppercase">Direct Email</div>
            <button
              onClick={handleCopyEmail}
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-white/[0.08] hover:border-amber-400/40 text-xs font-mono text-zinc-300 transition-all text-left group"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>contact@enamul.dev</span>
              </div>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
              )}
            </button>
          </div>
        </div>

        {/* Right Col: Contact Message Form */}
        <form
          onSubmit={handleSubmit}
          className="md:col-span-3 flex flex-col justify-between gap-3 p-5 rounded-2xl glass-panel border border-white/[0.06] bg-[#18181b]/40"
        >
          <div className="flex flex-col gap-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-white/[0.08] text-xs font-sans text-zinc-100 focus:outline-none focus:border-amber-400/60 transition-colors placeholder:text-zinc-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-white/[0.08] text-xs font-sans text-zinc-100 focus:outline-none focus:border-amber-400/60 transition-colors placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">Subject</label>
              <input
                type="text"
                placeholder="Software Engineering Role / Architecture Inquiry"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-white/[0.08] text-xs font-sans text-zinc-100 focus:outline-none focus:border-amber-400/60 transition-colors placeholder:text-zinc-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">Message</label>
              <textarea
                required
                rows={3}
                placeholder="Hello Enamul, I would like to discuss..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-white/[0.08] text-xs font-sans text-zinc-100 focus:outline-none focus:border-amber-400/60 transition-colors resize-none placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            {status === "success" && (
              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Message received. I will reply shortly.</span>
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-1.5 text-xs font-mono text-rose-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Error sending. Please use direct email.</span>
              </div>
            )}
            {status === "idle" && <div />}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-mono bg-amber-500 hover:bg-amber-400 text-zinc-950 font-medium shadow-sm transition-all ml-auto disabled:opacity-50"
            >
              <span>{loading ? "Sending..." : "Send Message"}</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
