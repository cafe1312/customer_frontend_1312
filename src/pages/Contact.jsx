import React from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent successfully! Thank you for reaching out to 1312 Cafe.');
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Header */}
      <section className="bg-cafeDark py-20 text-background text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1000&auto=format&fit=crop"
            alt="Cafe counter"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-3xl mx-auto px-4 relative z-10 space-y-4">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">Get in touch</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">We'd Love to Hear From You</h1>
          <p className="text-sm sm:text-base text-background/60 font-light max-w-xl mx-auto">
            Drop by our physical location, give us a call, or send a message directly using the form below.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-background border border-primary/10 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-cafeDark">Cafe Information</h3>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-cafeDark/50 uppercase tracking-wider">Our Address</h4>
                  <p className="text-sm text-cafeDark font-medium mt-0.5">1312 Espresso Sanctuary Way, Ste 100</p>
                  <p className="text-xs text-cafeDark/60">Downtown Arts District, CA 90013</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-cafeDark/50 uppercase tracking-wider">Opening Hours</h4>
                  <p className="text-sm text-cafeDark font-medium mt-0.5">Open Daily: 8:00 AM - 10:00 PM</p>
                  <p className="text-xs text-cafeDark/60">Kitchen closes daily at 9:30 PM</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-cafeDark/50 uppercase tracking-wider">Phone Call</h4>
                  <p className="text-sm text-cafeDark font-medium mt-0.5">+1 (555) 131-2990</p>
                  <p className="text-xs text-cafeDark/60">Call us for bulk catering or reservations</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-cafeDark/50 uppercase tracking-wider">Email Inquiry</h4>
                  <p className="text-sm text-cafeDark font-medium mt-0.5">hello@1312cafe.com</p>
                  <p className="text-xs text-cafeDark/60">General feedback or partner options</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Message Form */}
        <div className="lg:col-span-7 bg-background border border-primary/10 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-cafeDark mb-1">Send a Message</h3>
          <p className="text-xs text-cafeDark/50 mb-6">Have feedback, questions, or just want to say hi? Write us a line.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-cafeDark/70 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  className="w-full h-11 px-4 rounded-xl border border-primary/15 bg-[#F8F9F6] outline-none focus:border-primary text-sm text-cafeDark"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-cafeDark/70 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full h-11 px-4 rounded-xl border border-primary/15 bg-[#F8F9F6] outline-none focus:border-primary text-sm text-cafeDark"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-cafeDark/70 uppercase">Message</label>
              <textarea
                required
                rows="5"
                placeholder="What would you like to tell us?"
                className="w-full p-4 rounded-xl border border-primary/15 bg-[#F8F9F6] outline-none focus:border-primary text-sm text-cafeDark resize-none"
              />
            </div>

            <button
              type="submit"
              className="h-12 px-8 bg-primary text-cafeDark font-bold text-sm rounded-2xl hover:bg-cafeDark hover:text-background transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
            >
              <Send className="h-4 w-4" />
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
