import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Send, Check, Mail, MessageSquare, User } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/toast';

export const Contact = () => {
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.show('Message sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | ViralAI Hub</title>
        <meta name="description" content="Get in touch with ViralAI Hub. Request custom workflows, report issues, or collaborate with us." />
      </Helmet>

      <div className="relative min-h-[90vh] bg-[#07070d] text-white py-24 px-6 md:px-12 overflow-hidden flex flex-col justify-center">
        {/* Glow decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          {/* Left Column info */}
          <div className="space-y-6 text-left">
            <span className="inline-flex px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase font-mono tracking-wider font-bold text-white/60">
              Get in Touch
            </span>
            
            <h1 className="font-heading text-4xl sm:text-5xl font-semibold leading-none tracking-tight">
              Let's create <br />
              <span className="text-[#ff7759]">something viral.</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-white/60 font-light leading-relaxed max-w-sm">
              Have a custom AI trend you want to request? Spot a bug in one of our guides? Or want to talk about partnership opportunities? Drop us a message and we'll get back to you within 24 hours.
            </p>

            <div className="space-y-3 pt-6 text-xs text-white/60 font-mono">
              <div className="flex items-center space-x-2.5">
                <Mail size={14} className="text-secondary" />
                <span>support@viralaihub.com</span>
              </div>
            </div>
          </div>

          {/* Right Column Form */}
          <div>
            <Card hoverEffect={false} className="p-6 md:p-8 bg-white/[0.02] border-white/10 rounded-3xl relative overflow-hidden">
              {submitted ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-12 text-center space-y-4 flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                    <Check size={22} className="stroke-[3px]" />
                  </div>
                  <h3 className="font-heading text-xl font-medium text-white leading-none">
                    Message Sent!
                  </h3>
                  <p className="text-xs text-white/50 max-w-xs leading-relaxed">
                    Thank you for reaching out. A member of our prompt engineering team will review your message and get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-secondary hover:underline font-bold tracking-wide mt-4 cursor-pointer"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-textSecondary" htmlFor="name">
                      Your Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3.5 flex items-center text-textMuted">
                        <User size={14} />
                      </span>
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="Creator Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-textSecondary" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3.5 flex items-center text-textMuted">
                        <Mail size={14} />
                      </span>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="you@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-textSecondary" htmlFor="message">
                      Message
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-textMuted">
                        <MessageSquare size={14} />
                      </span>
                      <textarea
                        id="message"
                        required
                        rows={4}
                        placeholder="What custom workflow are you looking to build?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    variant="premium"
                    className="w-full h-11 flex items-center justify-center gap-1.5 font-bold text-xs mt-4"
                  >
                    <Send size={12} />
                    <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
