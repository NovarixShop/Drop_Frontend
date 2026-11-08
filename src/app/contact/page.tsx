'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success('Your message has been sent. We will respond within 24 hours!');
    }, 800);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-12 md:py-20 pb-28 md:pb-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Get In Touch</span>
        <h1 className="font-headline-xl text-3xl md:text-5xl font-bold text-on-surface mt-2 mb-4">
          We&apos;re here to help
        </h1>
        <p className="text-on-surface-variant font-body-md text-sm md:text-base leading-relaxed">
          Have a question about an order, shipment, or product details? Reach out to our dedicated support team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-on-surface text-base">Email Support</h3>
              <p className="text-sm text-on-surface-variant mt-1 mb-2">Our support team answers around the clock.</p>
              <a href="mailto:support@novarixshop.tech" className="text-sm font-medium text-primary hover:underline">
                support@novarixshop.tech
              </a>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-on-surface text-base">Customer Helpline</h3>
              <p className="text-sm text-on-surface-variant mt-1 mb-2">Mon - Sat: 9:00 AM - 8:00 PM IST</p>
              <a href="tel:+918041234567" className="text-sm font-medium text-primary hover:underline">
                +91 (80) 4123-4567
              </a>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-on-surface text-base">Corporate Office</h3>
              <p className="text-sm text-on-surface-variant mt-1">
                NOVARIX Technologies Pvt. Ltd.<br />
                Indiranagar, 100 Feet Road<br />
                Bengaluru, Karnataka 560038, India
              </p>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-on-surface text-base">Order Processing Hours</h3>
              <p className="text-sm text-on-surface-variant mt-1">
                Orders placed before 2:00 PM IST dispatch the same business day across India.
              </p>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7 bg-surface-container-low rounded-3xl p-6 md:p-10 border border-outline-variant/30">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-[#00C853]/15 text-[#00C853] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-on-surface mb-2">Message Received!</h3>
              <p className="text-on-surface-variant text-sm max-w-md mx-auto mb-6">
                Thank you, {name}. Our support team will review your inquiry and email you at {email} within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setSubject('');
                  setMessage('');
                }}
                className="bg-primary text-on-primary px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-on-surface">Send a Message</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-surface border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-surface border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                  Subject / Order ID (Optional)
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Order inquiry #4783A225 or Return request"
                  className="w-full bg-surface border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you today?"
                  className="w-full bg-surface border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3.5 px-6 rounded-xl font-label-md text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-md shadow-primary/20"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
