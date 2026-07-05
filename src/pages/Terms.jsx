import React, { useContext } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SettingsContext } from '../context/SettingsContext';

export default function Terms() {
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
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-cafeDark">{settings.termsTitle || "Terms of Service"}</h1>
            <p className="text-xs text-cafeDark/40 font-semibold mt-1">Last updated: July 4, 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-cafeDark/70 leading-relaxed font-sans whitespace-pre-wrap">
          {settings.termsContent ? (
            settings.termsContent
          ) : (
            <>
              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-cafeDark">1. Ordering & Acceptance</h2>
                <p>
                  By placing an order through 1312 Cafe, you agree to buy the selected items at the prices displayed. All orders are subject to availability and kitchen operating hours. We reserve the right to cancel or refuse any order due to stock constraints, pricing errors, or general kitchen capacity limits.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-cafeDark">2. Cancellations and Changes</h2>
                <p>
                  We know plans change! You are allowed to cancel your order directly from the tracking page <strong>within 10 seconds</strong> of submitting the order. Once the 10-second window closes, the order is locked and sent to prep, and cancellations or refunds will no longer be possible.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-cafeDark">3. Payments & Billing</h2>
                <p>
                  We support multiple payment choices, including Cash, Card, and UPI.
                </p>
                <ul className="list-disc list-inside pl-4 space-y-1.5 text-xs">
                  <li><strong>Cash:</strong> Cash payments are due at the counter upon picking up your order (Takeaway) or to the driver upon delivery.</li>
                  <li><strong>Card / UPI:</strong> Payments must be authorized at checkout. Any promo codes must be applied before final payment.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-cafeDark">4. Delivery and Pick Up</h2>
                <p>
                  We provide Takeaway and Home Delivery services:
                </p>
                <ul className="list-disc list-inside pl-4 space-y-1.5 text-xs">
                  <li><strong>Takeaway:</strong> You are responsible for picking up your order from our counter within a reasonable time. We cannot guarantee beverage temperature for late pick ups.</li>
                  <li><strong>Home Delivery:</strong> Delivery will be executed to the address supplied during checkout. You must ensure someone is available to receive and pay for the order (if paying via Cash).</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-cafeDark">5. Terms Revisions</h2>
                <p>
                  We may revise these Terms of Service at any time. Your continued use of our ordering platform constitutes agreement to the updated terms.
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
