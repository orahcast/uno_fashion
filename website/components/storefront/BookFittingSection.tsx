'use client';

import { useState } from 'react';
import { Phone, Mail, Clock, MapPin, ArrowUpRight, Sparkles, Check } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Wedding & Gala Suiting',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name.trim(),
          customerEmail: formData.email.trim(),
          customerPhone: formData.phone.trim(),
          type: 'Online',
          status: 'Request',
          occasion: formData.service,
          itemName: `Consultation: ${formData.service}`,
          notes: formData.message || 'Atelier fitting inquiry from storefront',
        }),
      });
    } catch (err) {
      console.error('Fitting inquiry submission error:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const contactDetails = [
    {
      icon: Phone,
      label: 'Phone Number',
      value: '+250 783 036 628',
      href: 'tel:+250783036628',
    },
    {
      icon: Mail,
      label: 'Email Address',
      value: 'ufashionagency@gmail.com',
      href: 'mailto:ufashionagency@gmail.com',
    },
    {
      icon: Clock,
      label: 'Opening Hours',
      value: 'Mon – Sat: 8:00 AM – 8:00 PM',
    },
    {
      icon: MapPin,
      label: 'Our Location',
      value: 'KN 74 St, Nyarugenge, Kigali, Rwanda',
    },
  ];

  return (
    <section id="contact" className="py-12 sm:py-16 bg-[#FAF8F5] scroll-mt-6">
      {/* Target anchor for existing buttons linking to #fitting */}
      <span id="fitting" className="scroll-mt-20 block" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Card: Contact Information */}
          <div className="lg:col-span-5 bg-white border border-[#E8E3DA] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#9E7B4F] block">
                  Atelier Concierge
                </span>
                <h3 className="text-xl sm:text-2xl font-serif-luxury font-normal text-[#191C1A] mt-1">
                  Contact Information
                </h3>
                <p className="text-xs text-[#736E67] mt-2 leading-relaxed">
                  Have questions or need assistance with your suit rental or wedding styling? Our atelier team is ready to assist with tailoring and protocol services in Kigali.
                </p>
              </div>

              {/* Contact Rows with Subtle Dividers */}
              <div className="divide-y divide-[#F2EFE9] pt-1">
                {contactDetails.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="py-3.5 first:pt-0 last:pb-0 flex items-start space-x-3.5">
                      <div className="w-8 h-8 rounded-lg bg-[#F5EFE6] border border-[#E9DFD0] flex items-center justify-center text-[#9E7B4F] flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-[#9E7B4F]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#191C1A] block">
                          {item.label}
                        </span>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-xs text-[#6B655E] hover:text-[#9E7B4F] transition-colors mt-0.5 block"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <span className="text-xs text-[#6B655E] mt-0.5 block">
                            {item.value}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Card: Get In Touch Form */}
          <div className="lg:col-span-7 bg-[#F4EFE7] border border-[#E5DEC4]/40 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              {/* Pill Badge */}
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white border border-[#E2DAD0] rounded-full text-[10px] uppercase tracking-wider font-semibold text-[#191C1A] shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#9E7B4F]" />
                <span>Get In Touch</span>
              </div>

              {/* Heading & Subtitle */}
              <div>
                <h2 className="text-xl sm:text-2xl font-serif-luxury font-normal text-[#191C1A]">
                  Get In Touch
                </h2>
                <p className="text-xs text-[#736E67] mt-1.5 leading-relaxed max-w-lg">
                  Tell us about your upcoming occasion, suit rental requirements, or wedding protocol needs, and our team will get back to you promptly.
                </p>
              </div>

              {submitted ? (
                <div className="bg-white border border-[#E2DAD0] rounded-xl p-6 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#EBF7EE] text-[#25D366] flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-[#191C1A]">Inquiry Received</h3>
                  <p className="text-xs text-[#736E67] max-w-sm mx-auto">
                    Thank you, <span className="font-semibold text-[#191C1A]">{formData.name}</span>. Our Kigali atelier concierge will contact you regarding <span className="font-semibold text-[#191C1A]">{formData.service}</span> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#9E7B4F] hover:underline pt-1"
                  >
                    <span>Send another inquiry</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                  {/* Grid 2x2 for inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Name */}
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white border border-[#E0D7CB] rounded-lg px-3.5 py-2.5 text-xs text-[#191C1A] placeholder-[#9E968D] focus:outline-none focus:border-[#9E7B4F] focus:ring-1 focus:ring-[#9E7B4F] transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white border border-[#E0D7CB] rounded-lg px-3.5 py-2.5 text-xs text-[#191C1A] placeholder-[#9E968D] focus:outline-none focus:border-[#9E7B4F] focus:ring-1 focus:ring-[#9E7B4F] transition-all"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white border border-[#E0D7CB] rounded-lg px-3.5 py-2.5 text-xs text-[#191C1A] placeholder-[#9E968D] focus:outline-none focus:border-[#9E7B4F] focus:ring-1 focus:ring-[#9E7B4F] transition-all"
                      />
                    </div>

                    {/* Service Selector */}
                    <div>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full bg-white border border-[#E0D7CB] rounded-lg px-3.5 py-2.5 text-xs text-[#191C1A] focus:outline-none focus:border-[#9E7B4F] focus:ring-1 focus:ring-[#9E7B4F] transition-all appearance-none cursor-pointer"
                      >
                        <option value="Wedding & Gala Suiting">Wedding & Gala Suiting</option>
                        <option value="Black Tie Tuxedo Rental">Black Tie Tuxedo Rental</option>
                        <option value="Wedding Protocol Services">Wedding Protocol Services</option>
                        <option value="Private In-Person Fitting">Private In-Person Fitting</option>
                      </select>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <textarea
                      rows={3}
                      placeholder="Message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white border border-[#E0D7CB] rounded-lg px-3.5 py-2.5 text-xs text-[#191C1A] placeholder-[#9E968D] focus:outline-none focus:border-[#9E7B4F] focus:ring-1 focus:ring-[#9E7B4F] transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center space-x-2 bg-[#191C1A] hover:bg-[#2C2724] text-white px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-150 shadow-xs hover:shadow cursor-pointer disabled:opacity-60"
                    >
                      <span>{isSubmitting ? 'Sending Request...' : 'Send Message'}</span>
                      <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                        <ArrowUpRight className="w-2.5 h-2.5 text-white" />
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
