import React, { useContext } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SettingsContext } from '../context/SettingsContext';

export default function Privacy() {
  const { settings } = useContext(SettingsContext);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-cafeDark/50 hover:text-primary transition-colors uppercase tracking-widest">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </div>

      <div className="bg-white border border-primary/10 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-4 border-b border-primary/5 pb-6">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-cafeDark">{settings.privacyTitle || "Privacy Policy"}</h1>
            <p className="text-xs text-cafeDark/40 font-semibold mt-1">Last updated: July 4, 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-cafeDark/70 leading-relaxed font-sans whitespace-pre-wrap">
          {settings.privacyContent ? (
            settings.privacyContent
          ) : (
            <>
              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-cafeDark">1. Information We Collect</h2>
                <p>
                  When you use our ordering platform, we collect information necessary to fulfill your orders and enhance your experience. This includes:
                </p>
                <ul className="list-disc list-inside pl-4 space-y-1.5 text-xs">
                  <li><strong>Personal Data:</strong> Your name, phone number, and delivery address (for delivery orders).</li>
                  <li><strong>Authentication Details:</strong> We use third-party authentication services (like Google Sign-In) which share your basic profile details (name, email, and avatar).</li>
                  <li><strong>Order Data:</strong> Details of products ordered, transaction totals, and payment methods selected.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-cafeDark">2. How We Use Your Information</h2>
                <p>
                  We process your data for the following operational purposes:
                </p>
                <ul className="list-disc list-inside pl-4 space-y-1.5 text-xs">
                  <li>Preparing your gourmet coffee, food, and beverages.</li>
                  <li>Delivering orders to your designated location or coordinating takeaway.</li>
                  <li>Enabling order tracking in real-time.</li>
                  <li>Analyzing ordering volumes to improve our menu options.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-cafeDark">3. Information Sharing and Disclosure</h2>
                <p>
                  We value your privacy. We do not sell or lease your personal information. Your contact and delivery details are only shared with our store baristas, administrators, and delivery staff strictly to fulfill your active orders.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-cafeDark">4. Data Security & Storage</h2>
                <p>
                  We use secure server technologies and database structures to ensure your information is safeguarded against unauthorized access, alteration, or deletion. Since we utilize trusted services like Google Auth, we do not store your passwords on our systems.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-cafeDark">5. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy or how your data is handled, please contact our support desk or speak to us directly at the counter.
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
