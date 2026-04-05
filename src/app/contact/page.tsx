"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-14">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Get in Touch</p>
        <h1 className="text-4xl font-black">Contact Us</h1>
        <p className="text-gray-500 mt-3 max-w-md mx-auto">Have a question or feedback? We'd love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Info */}
        <div className="space-y-6">
          {[
            { icon: Mail, label: "Email", value: "hello@threadco.in" },
            { icon: Phone, label: "Phone", value: "+91 98765 43210" },
            { icon: MapPin, label: "Address", value: "Mumbai, Maharashtra, India" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shrink-0">
                <Icon size={18} className="text-black" />
              </div>
              <div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-gray-500 text-sm">{value}</p>
              </div>
            </div>
          ))}

          <div className="bg-gray-50 rounded-2xl p-5 mt-6">
            <p className="font-semibold text-sm mb-1">Business Hours</p>
            <p className="text-sm text-gray-500">Mon – Sat: 10am – 7pm</p>
            <p className="text-sm text-gray-500">Sunday: Closed</p>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2">
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
              <CheckCircle size={56} className="text-green-500" />
              <h3 className="text-2xl font-black">Message Sent!</h3>
              <p className="text-gray-500">We'll get back to you within 24 hours.</p>
              <button onClick={() => setSent(false)} className="text-sm text-gray-400 hover:text-black underline">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "name", label: "Your Name", type: "text", placeholder: "Full name" },
                  { name: "email", label: "Email Address", type: "email", placeholder: "your@email.com" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-semibold mb-1.5">{f.label}</label>
                    <input
                      type={f.type}
                      name={f.name}
                      value={form[f.name as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                      placeholder={f.placeholder}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="How can we help?"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Write your message here..."
                  required
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>
              <button type="submit" className="bg-black text-white font-bold px-8 py-4 rounded-full hover:bg-gray-800 transition-colors">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
