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

      <div className="relative min-h-[90vh] bg-white text-[#17171c] py-24 px-6 md:px-12 overflow-hidden flex flex-col justify-center">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          {/* Left Column info */}
          <div className="space-y-6 text-left">
            <span className="inline-flex px-3 py-1 rounded-full border border-neutral-200 bg-[#eeece7]/50 text-[10px] uppercase font-mono tracking-wider font-bold text-neutral-500">
              Get in Touch
            </span>
            
            <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-none tracking-tight text-[#17171c]">
              Let's create <br />
              <span className="text-[#ff7759]">something viral.</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-[#616161] font-light leading-relaxed max-w-sm">
              Have a custom AI trend you want to request? Spot a bug in one of our guides? Or want to talk about partnership opportunities? Drop us a message and we'll get back to you within 24 hours.
            </p>

            <div className="space-y-3 pt-6 text-xs text-[#616161] font-mono">
              <div className="flex items-center space-x-2.5">
                <Mail size={14} className="text-[#ff7759]" />
                <span>support@viralaihub.com</span>
              </div>
            </div>
          </div>

          {/* Right Column Form */}
          <div>
            <Card hoverEffect={false} className="p-6 md:p-8 bg-white border border-neutral-200 rounded-3xl relative overflow-hidden shadow-sm">
              {submitted ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-12 text-center space-y-4 flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-2 shadow-sm">
                    <Check size={22} className="stroke-[3px]" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[#17171c] leading-none">
                    Message Sent!
                  </h3>
                  <p className="text-xs text-[#616161] max-w-xs leading-relaxed">
                    Thank you for reaching out. A member of our prompt engineering team will review your message and get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-[#ff7759] hover:underline font-bold tracking-wide mt-4 cursor-pointer border-0 bg-transparent"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-[#616161]" htmlFor="name">
                      Your Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3.5 flex items-center text-neutral-400">
                        <User size={14} />
                      </span>
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="Creator Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-full pl-10 pr-4 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-[#616161]" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3.5 flex items-center text-neutral-400">
                        <Mail size={14} />
                      </span>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="you@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-full pl-10 pr-4 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-[#616161]" htmlFor="message">
                      Message
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-neutral-400">
                        <MessageSquare size={14} />
                      </span>
                      <textarea
                        id="message"
                        required
                        rows={4}
                        placeholder="What custom workflow are you looking to build?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 focus:bg-white transition-all resize-none"
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
