'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookingForm } from './BookingForm.logic';
import { SERVICES } from '@/data/services';
import { BRANCH_LIST } from '@/data/branches';
import VietQRPayment from '../VietQRPayment/VietQRPayment';
import { CalendarDays, Clock, MapPin, Users, UserCircle, CheckCircle2, ChevronDown, Check } from 'lucide-react';

const BookingForm = () => {
  const { formData, handleChange, handleServiceSelect, updateGuests, handleSubmit, isSubmitting, isSuccess } = useBookingForm();
  const today = new Date().toISOString().split('T')[0];

  if (isSuccess) {
    const selectedService = SERVICES.find(s => s.id === formData.serviceId);
    const totalPrice = selectedService ? selectedService.priceVND : 0;
    
    return (
      <section id="booking" className="py-24 px-6 bg-[#0A0A0A] min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        <div className="max-w-md w-full relative z-10">
          <VietQRPayment 
            amount={totalPrice} 
            orderInfo={`Khach ${formData.name.split(' ').pop()} - SDT ${formData.phone}`} 
          />
        </div>
      </section>
    );
  }

  const inputClasses = "w-full bg-transparent border-0 border-b-2 border-dashed border-[#D4AF37]/30 pb-3 text-white focus:outline-none focus:border-solid focus:border-[#D4AF37] transition-all text-xl font-light placeholder:text-white/20";
  const labelClasses = "text-[#D4AF37] font-serif italic text-lg opacity-80 mb-2 block tracking-wide";
  const boxClasses = "bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.05] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white/[0.05] transition-colors";

  return (
    <section id="booking" className="min-h-[100dvh] py-16 px-4 bg-[#050505] relative overflow-hidden flex flex-col items-center justify-center">
      {/* Premium Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.1),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.05),transparent_50%)] pointer-events-none" />
      
      {/* Custom Styles for Scrollbar */}
      <style>{`
        .premium-scrollbar::-webkit-scrollbar { width: 6px; }
        .premium-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .premium-scrollbar::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.2); border-radius: 10px; }
        .premium-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(212,175,55,0.5); }
        .date-input::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0; width: 100%; height: 100%; position: absolute; left: 0; top: 0; }
      `}</style>

      <div className="max-w-[960px] w-full mx-auto relative z-10">
        
        {/* Title Area */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center gap-3 px-6 py-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="uppercase tracking-[0.3em] text-[#D4AF37] text-sm font-medium">Reservation</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-white tracking-wide"
          >
            Book Your <br/><span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#E7AA51] via-[#FFF3D4] to-[#B8860B]">Experience</span>
          </motion.h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring" }}
          className="bg-[#0A0A0A]/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-8 md:p-12 lg:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative"
        >
          {/* Subtle glowing border top */}
          <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
              
              {/* === LEFT COLUMN: Personal Details === */}
              <div className="flex flex-col gap-14 lg:mt-6">
                <div className="relative group">
                  <label className={labelClasses}>Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="relative group">
                  <label className={labelClasses}>Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div className="relative group">
                  <label className={labelClasses}>Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="+84 90 123 4567"
                    required
                  />
                </div>
              </div>

              {/* === RIGHT COLUMN: Booking Details === */}
              <div className="flex flex-col gap-5">
                
                {/* Scrollable Services */}
                <div className={`${boxClasses} pb-3`}>
                  <label className="text-white/60 font-medium text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span> Select Service
                  </label>
                  <div className="h-[210px] overflow-y-auto premium-scrollbar pr-2 space-y-2">
                    {SERVICES.map(service => {
                      const isSelected = formData.serviceId === service.id;
                      return (
                        <div 
                          key={service.id}
                          onClick={() => handleServiceSelect(service.id)}
                          className={`p-4 rounded-xl cursor-pointer transition-all duration-300 flex justify-between items-center group relative overflow-hidden ${
                            isSelected 
                              ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/50' 
                              : 'bg-black/30 border border-transparent hover:bg-white/5'
                          }`}
                        >
                          <div className="flex flex-col gap-1 relative z-10">
                            <span className={`font-medium text-lg ${isSelected ? 'text-[#D4AF37]' : 'text-white'}`}>
                              {service.nameVi}
                            </span>
                            <span className="text-sm text-white/40">{service.duration} mins</span>
                          </div>
                          <div className={`font-serif text-lg relative z-10 ${isSelected ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                            {service.priceVND.toLocaleString()}đ
                          </div>
                          {isSelected && (
                            <motion.div layoutId="service-bg" className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 to-[#D4AF37]/5 pointer-events-none" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Guests & Staff Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className={`${boxClasses} flex items-center justify-between`}>
                    <div className="flex items-center gap-3 text-white/60">
                      <Users className="w-5 h-5 text-[#D4AF37]" />
                      <span className="text-sm uppercase tracking-wider font-medium">Guests</span>
                    </div>
                    <div className="flex items-center gap-4 bg-black/50 rounded-full px-2 py-1 border border-white/10">
                      <button type="button" onClick={() => updateGuests(-1)} className="w-7 h-7 rounded-full text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors">–</button>
                      <span className="text-white font-medium w-4 text-center">{formData.guests}</span>
                      <button type="button" onClick={() => updateGuests(1)} className="w-7 h-7 rounded-full text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors">+</button>
                    </div>
                  </div>

                  <div className={`${boxClasses} flex items-center justify-between relative`}>
                    <div className="flex items-center gap-3 text-white/60">
                      <UserCircle className="w-5 h-5 text-[#D4AF37]" />
                      <span className="text-sm uppercase tracking-wider font-medium">Staff</span>
                    </div>
                    <select 
                      name="staff" 
                      value={formData.staff} 
                      onChange={handleChange}
                      className="bg-transparent border-none text-white focus:outline-none appearance-none font-medium text-right cursor-pointer pl-6 outline-none"
                    >
                      <option value="NGẪU NHIÊN" className="bg-[#111]">Random</option>
                      <option value="Anna" className="bg-[#111]">Anna</option>
                      <option value="Mia" className="bg-[#111]">Mia</option>
                    </select>
                  </div>
                </div>

                {/* Date & Time Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className={`${boxClasses} flex items-center relative overflow-hidden group`}>
                     <div className="flex items-center gap-3 text-white/60 pointer-events-none">
                        <CalendarDays className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-sm uppercase tracking-wider font-medium">Date</span>
                     </div>
                     <input 
                        type="date" 
                        name="date" 
                        value={formData.date} 
                        onChange={handleChange}
                        min={today}
                        className="date-input absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        required
                     />
                     <div className="ml-auto text-white font-medium group-focus-within:text-[#D4AF37] transition-colors relative z-0">
                       {formData.date || <span className="text-white/30">Select</span>}
                     </div>
                  </div>
                  
                  <div className={`${boxClasses} flex items-center relative overflow-hidden group`}>
                     <div className="flex items-center gap-3 text-white/60 pointer-events-none">
                        <Clock className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-sm uppercase tracking-wider font-medium">Time</span>
                     </div>
                     <input 
                        type="time" 
                        name="time" 
                        value={formData.time} 
                        onChange={handleChange}
                        className="date-input absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        required
                     />
                     <div className="ml-auto text-white font-medium group-focus-within:text-[#D4AF37] transition-colors relative z-0">
                       {formData.time || <span className="text-white/30">Select</span>}
                     </div>
                  </div>
                </div>

                {/* Branch */}
                <div className={`${boxClasses} flex items-center justify-between relative`}>
                  <div className="flex items-center gap-3 text-white/60 pointer-events-none">
                    <MapPin className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-sm uppercase tracking-wider font-medium">Branch</span>
                  </div>
                  <select 
                    name="branchId" 
                    value={formData.branchId} 
                    onChange={handleChange}
                    className="flex-1 bg-transparent border-none text-white focus:outline-none appearance-none cursor-pointer text-right font-medium pr-8 outline-none z-10"
                    required
                  >
                    {BRANCH_LIST.map(branch => (
                      <option key={branch.id} value={branch.id} className="bg-[#111]">{branch.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-5 w-4 h-4 text-[#D4AF37] pointer-events-none" />
                </div>
                
              </div>
            </div>

            {/* Note Area */}
            <div className="w-full relative mt-4">
               <label className={`${labelClasses} !text-sm !uppercase !not-italic !tracking-widest !opacity-60 mb-3`}>Additional Note (Optional)</label>
               <textarea 
                 name="note" 
                 value={formData.note}
                 onChange={handleChange}
                 rows={3}
                 placeholder="Any special requests or details we should know about?"
                 className="w-full bg-white/[0.02] border border-white/10 rounded-2xl focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/[0.04] transition-all p-5 text-white text-lg resize-none placeholder:text-white/20"
               />
            </div>

            {/* Terms and Submit Row */}
            <div className="flex flex-col items-center justify-center gap-8 mt-8 w-full">
              <div className="flex items-center gap-4">
                <div className="relative flex items-center cursor-pointer">
                   <div className={`w-7 h-7 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${formData.agreeTerms ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-white/30 bg-transparent'}`}>
                     <input 
                       type="checkbox" 
                       name="agreeTerms"
                       id="agreeTerms"
                       checked={formData.agreeTerms}
                       onChange={handleChange}
                       className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                     />
                     <Check className={`w-4 h-4 text-black transition-transform duration-300 ${formData.agreeTerms ? 'scale-100' : 'scale-0'}`} />
                   </div>
                </div>
                <label htmlFor="agreeTerms" className="text-white/70 cursor-pointer text-sm sm:text-base hover:text-white transition-colors">
                  I agree to the <span className="text-[#D4AF37] underline underline-offset-4 decoration-1 decoration-[#D4AF37]/40">Terms & Conditions</span>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="group relative overflow-hidden bg-white text-black font-semibold uppercase tracking-[0.2em] text-sm md:text-base py-4 md:py-5 px-10 md:px-16 rounded-full transition-all focus:outline-none disabled:opacity-80 disabled:cursor-not-allowed hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] via-[#FFF3D4] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? 'Processing...' : 'Complete Booking'}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingForm;
