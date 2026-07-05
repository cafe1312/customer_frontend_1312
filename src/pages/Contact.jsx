import React, { useContext } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';

export default function Contact() {
  const { settings } = useContext(SettingsContext);

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
            Drop by our physical location or give us a call/email. We look forward to welcoming you!
          </p>
        </div>
      </section>

      {/* Main Grid - Centered Info Cards */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-background border border-primary/10 rounded-3xl p-8 sm:p-10 shadow-sm space-y-8">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-cafeDark text-center border-b border-primary/5 pb-4">
            Cafe Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Address */}
            <div className="flex gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-cafeDark/50 uppercase tracking-wider">Our Address</h4>
                <p className="text-sm text-cafeDark font-medium mt-0.5">{settings.address}</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-cafeDark/50 uppercase tracking-wider">Opening Hours</h4>
                <p className="text-sm text-cafeDark font-medium mt-0.5">{settings.businessHours?.days || 'Open Daily'}</p>
                <p className="text-xs text-cafeDark/60 mt-0.5">{settings.businessHours?.open || '08:00 AM'} - {settings.businessHours?.close || '10:00 PM'}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-cafeDark/50 uppercase tracking-wider">Phone Call</h4>
                <p className="text-sm text-cafeDark font-medium mt-0.5">{settings.phone}</p>
                <p className="text-xs text-cafeDark/60 mt-0.5">Call us for bulk catering or reservations</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-cafeDark/50 uppercase tracking-wider">Email Inquiry</h4>
                <p className="text-sm text-cafeDark font-medium mt-0.5">{settings.email}</p>
                <p className="text-xs text-cafeDark/60 mt-0.5">General feedback or partner options</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
