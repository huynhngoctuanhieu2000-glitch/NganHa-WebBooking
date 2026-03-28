'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookingForm } from './BookingForm.logic';
import type { BookingResult } from './BookingForm.logic';
import { t } from './BookingForm.i18n';
import {
  stepSlideVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from './BookingForm.animation';
import { GroupedService, DurationVariant, getGroupedServiceName } from '@/lib/groupServices';
import { BRANCH_LIST } from '@/data/branches';
import {
  CalendarDays, Clock, MapPin, Users, UserCircle,
  ChevronDown, Check, ArrowRight, ArrowLeft, Sparkles,
  Plus, ShoppingBag, AlertCircle,
} from 'lucide-react';

// 🔧 UI CONFIGURATION
const GOLD = '#D4AF37';
const GOLD_LIGHT = '#F5E6B8';
const GOLD_DARK = '#A08520';
const CATEGORY_ICONS: Record<string, string> = {
  body: '💆', foot: '🦶', 'hair wash': '💇', facial: '✨',
  'heel skin shave': '🪒', 'manicure & pedicure': '💅',
  barber: '💈', 'ear clean': '👂', additional: '🌿',
};
// P2: Validation regex
const PHONE_REGEX = /^[+]?[0-9\s\-().]{7,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ═══════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════

/** Decorative gold line */
const GoldDivider = () => (
  <div className="flex items-center gap-4 my-2">
    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
    <div className="w-1 h-1 rounded-full bg-[#D4AF37]/40" />
    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
  </div>
);

/** Step progress — shows on BOTH mobile and desktop */
const StepProgress = ({
  current, total, onStepClick, canClickStep,
}: {
  current: number; total: number;
  onStepClick?: (step: number) => void;
  canClickStep?: (step: number) => boolean;
}) => (
  <div className="flex items-center justify-center gap-3 mb-10">
    {Array.from({ length: total }, (_, i) => {
      const step = i + 1;
      const isActive = step === current;
      const isDone = step < current;
      const isClickable = isDone || (onStepClick && canClickStep?.(step - 1));
      const labels = [t.steps.service, t.steps.details, t.steps.confirm];
      return (
        <React.Fragment key={step}>
          {i > 0 && (
            <div className={`h-[1px] w-10 sm:w-16 transition-all duration-500
              ${isDone
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#D4AF37]/60'
                : 'bg-white/8'
              }`} />
          )}
          <div
            className={`flex flex-col items-center gap-2 ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
            onClick={() => isClickable && onStepClick?.(step)}
          >
            <motion.div
              whileHover={isClickable ? { scale: 1.08 } : {}}
              whileTap={isClickable ? { scale: 0.95 } : {}}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-light transition-all duration-500
                ${isActive
                  ? 'bg-gradient-to-br from-[#D4AF37]/25 to-[#D4AF37]/5 text-[#D4AF37] ring-1 ring-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                  : isDone
                    ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                    : 'bg-white/[0.03] text-white/25 ring-1 ring-white/8'
                }
              `}
            >
              {isDone ? <Check className="w-4 h-4" strokeWidth={2.5} /> : step}
            </motion.div>
            <span className={`text-[10px] tracking-[0.2em] font-light transition-colors duration-500
              ${isActive ? 'text-[#D4AF37]/80' : isDone ? 'text-white/60' : 'text-white/20'}`}>
              {labels[i]}
            </span>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

/** Elegant section header */
const SectionHeader = ({ icon: Icon, label, subtitle }: { icon: React.ElementType; label: string; subtitle?: string }) => (
  <div className="mb-6">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37]/15 to-[#D4AF37]/5 flex items-center justify-center ring-1 ring-[#D4AF37]/20">
        <Icon className="w-4 h-4 text-[#D4AF37]" />
      </div>
      <div>
        <h3 className="text-white/80 font-light text-sm tracking-[0.2em] uppercase">{label}</h3>
        {subtitle && <p className="text-white/25 text-xs mt-0.5 font-light">{subtitle}</p>}
      </div>
    </div>
    <div className="mt-3 h-[1px] bg-gradient-to-r from-[#D4AF37]/15 via-[#D4AF37]/8 to-transparent" />
  </div>
);

/** Premium category tabs */
const CategoryTabs = ({
  categories, active, onSelect, selectedCount,
}: {
  categories: string[]; active: string; onSelect: (cat: string) => void; selectedCount: number;
}) => (
  <div className="mb-5 -mx-2">
    <div className="flex gap-2 px-2 overflow-x-auto pb-3 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
      <button type="button" onClick={() => onSelect('all')}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] tracking-[0.15em] uppercase whitespace-nowrap transition-all duration-400 font-light
          ${active === 'all'
            ? 'bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/8 text-[#D4AF37] ring-1 ring-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.08)]'
            : 'bg-white/[0.02] text-white/35 ring-1 ring-white/[0.05] hover:bg-white/[0.04] hover:text-white/55'
          }`}>
        <span className="text-sm">✦</span>
        All
        {selectedCount > 0 && (
          <span className="ml-1 bg-[#D4AF37] text-black text-[9px] font-medium rounded-full w-4 h-4 inline-flex items-center justify-center">{selectedCount}</span>
        )}
      </button>
      {categories.map(cat => (
        <button key={cat} type="button" onClick={() => onSelect(cat)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] tracking-[0.15em] uppercase whitespace-nowrap transition-all duration-400 font-light
            ${active === cat
              ? 'bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/8 text-[#D4AF37] ring-1 ring-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.08)]'
              : 'bg-white/[0.02] text-white/35 ring-1 ring-white/[0.05] hover:bg-white/[0.04] hover:text-white/55'
            }`}>
          <span className="text-sm">{CATEGORY_ICONS[cat] || '🌿'}</span>
          {cat}
        </button>
      ))}
    </div>
  </div>
);

/** Elegant duration pills */
const DurationPicker = ({
  variants, selectedVariantId, onSelect,
}: {
  variants: DurationVariant[]; selectedVariantId: string | null; onSelect: (v: DurationVariant) => void;
}) => {
  if (variants.length <= 1) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#D4AF37]/10">
      {variants.map(v => {
        const isSelected = v.id === selectedVariantId;
        return (
          <button key={v.id} type="button"
            onClick={(e) => { e.stopPropagation(); onSelect(v); }}
            className={`px-3.5 py-2 rounded-xl text-[11px] font-light tracking-wide transition-all duration-300
              ${isSelected
                ? 'bg-gradient-to-r from-[#D4AF37]/25 to-[#D4AF37]/10 text-[#F5E6B8] ring-1 ring-[#D4AF37]/40 shadow-[0_0_10px_rgba(212,175,55,0.1)]'
                : 'bg-white/[0.02] text-white/35 ring-1 ring-white/[0.05] hover:ring-white/10 hover:text-white/55'
              }`}>
            <span className="font-medium">{v.duration}</span>
            <span className="opacity-60">min</span>
            <span className="mx-1.5 opacity-20">·</span>
            <span>{v.priceVND.toLocaleString('vi-VN')}đ</span>
          </button>
        );
      })}
    </div>
  );
};

/** Premium service card */
const ServiceCard = ({
  group, isSelected, selectedVariantId, onToggle, onVariantChange,
}: {
  group: GroupedService; isSelected: boolean; selectedVariantId: string | null;
  onToggle: () => void; onVariantChange: (v: DurationVariant) => void;
}) => {
  const displayName = getGroupedServiceName(group, 'vi');
  const currentVariant = isSelected
    ? group.variants.find(v => v.id === selectedVariantId) || group.variants[0]
    : group.variants[0];
  const hasDurations = group.variants.length > 1;
  const minDur = group.variants[0].duration;
  const maxDur = group.variants[group.variants.length - 1].duration;

  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      onClick={onToggle}
      className={`
        relative rounded-2xl cursor-pointer transition-all duration-400 overflow-hidden group/card
        ${isSelected
          ? 'ring-1 ring-[#D4AF37]/40 shadow-[0_0_25px_rgba(212,175,55,0.06)]'
          : 'ring-1 ring-white/[0.05] hover:ring-white/10'
        }
      `}
    >
      {/* Background layers */}
      <div className={`absolute inset-0 transition-all duration-500
        ${isSelected
          ? 'bg-gradient-to-br from-[#D4AF37]/12 via-[#D4AF37]/4 to-transparent'
          : 'bg-gradient-to-br from-white/[0.03] to-white/[0.01] group-hover/card:from-white/[0.05] group-hover/card:to-white/[0.02]'
        }`}
      />

      <div className="relative z-10 p-5">
        {/* Top row: name + action */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className={`text-[15px] leading-relaxed transition-colors duration-400 ${isSelected ? 'text-[#F5E6B8] font-medium' : 'text-white/80 font-light'}`}>
              {displayName}
            </p>
            {!isSelected && (
              <p className="text-white/25 text-xs mt-1.5 flex items-center gap-1.5 font-light">
                <Clock className="w-3 h-3 opacity-60" />
                {hasDurations ? `${minDur} – ${maxDur} min` : `${minDur} min`}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {!isSelected && (
              <span className="text-white/40 text-sm font-light tracking-wide group-hover/card:text-white/60 transition-colors">
                {hasDurations ? `from ${currentVariant.priceVND.toLocaleString('vi-VN')}` : currentVariant.priceVND.toLocaleString('vi-VN')}
                <span className="text-[10px] ml-0.5 opacity-50">đ</span>
              </span>
            )}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300
              ${isSelected
                ? 'bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                : 'ring-1 ring-white/15 group-hover/card:ring-white/25'
              }`}>
              {isSelected
                ? <Check className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                : <Plus className="w-3.5 h-3.5 text-white/30 group-hover/card:text-white/50" />
              }
            </div>
          </div>
        </div>

        {/* Expanded: duration picker + selected info */}
        {isSelected && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
            {hasDurations && (
              <DurationPicker variants={group.variants} selectedVariantId={selectedVariantId} onSelect={onVariantChange} />
            )}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#D4AF37]/10">
              <span className="text-white/30 text-xs flex items-center gap-1.5 font-light">
                <Clock className="w-3 h-3 opacity-50" />
                {currentVariant.duration} min
              </span>
              <span className="font-serif text-[#D4AF37] text-base tracking-wide">
                {currentVariant.priceVND.toLocaleString('vi-VN')}
                <span className="text-xs ml-0.5 opacity-60">đ</span>
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

/** P2: Elegant floating label input with real-time validation */
const FormInput = ({
  label, type = 'text', name, value, onChange, placeholder, required = false, validate,
}: {
  label: string; type?: string; name: string; value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>; placeholder: string;
  required?: boolean;
  validate?: (v: string) => string | null; // returns error message or null
}) => {
  const [touched, setTouched] = React.useState(false);
  const error = touched && validate ? validate(value) : null;
  const isValid = touched && !error && value.length > 0;

  return (
    <div className="group/input">
      {/* P2: Increased contrast — from /50 to /80 */}
      <label className="text-[#D4AF37]/80 text-[10px] tracking-[0.2em] uppercase font-light mb-2.5 flex items-center gap-1.5">
        {label}
        {required && <span className="text-[#D4AF37]/60">*</span>}
        {isValid && <Check className="w-3 h-3 text-emerald-400/70 ml-auto" strokeWidth={2.5} />}
        {error && <AlertCircle className="w-3 h-3 text-rose-400/80 ml-auto" strokeWidth={2} />}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        onBlur={() => setTouched(true)}
        placeholder={placeholder} required={required}
        className={`w-full bg-white/[0.02] ring-1 rounded-xl px-5 py-4 text-white/90 text-[15px] font-light
          placeholder:text-white/15 focus:outline-none focus:bg-white/[0.04]
          transition-all duration-400 hover:ring-white/10
          ${ error
            ? 'ring-rose-400/30 focus:ring-rose-400/50'
            : isValid
              ? 'ring-emerald-400/25 focus:ring-emerald-400/40'
              : 'ring-white/[0.06] focus:ring-[#D4AF37]/30'
          }`}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="text-rose-400/70 text-[11px] font-light mt-1.5 pl-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

/** Refined selector box — P2: Increased label contrast */
const SelectorBox = ({
  icon: Icon, label, children,
}: {
  icon: React.ElementType; label: string; children: React.ReactNode;
}) => (
  <div className="bg-white/[0.02] ring-1 ring-white/[0.06] rounded-xl px-5 py-4
    flex items-center justify-between hover:ring-white/10 transition-all duration-300 group/sel">
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-[#D4AF37]/70 group-hover/sel:text-[#D4AF37]/90 transition-colors" />
      {/* P2: from text-white/35 to text-white/60 for better contrast */}
      <span className="text-[10px] tracking-[0.2em] uppercase text-white/60 font-light">{label}</span>
    </div>
    {children}
  </div>
);

// ═══════════════════════════════════════
// Booking Summary — Floating Glass Card
// ═══════════════════════════════════════

const BookingSummaryPanel = ({
  summary, agreeTerms, onTermsChange, onSubmit, isSubmitting,
}: {
  summary: ReturnType<typeof useBookingForm>['bookingSummary'];
  agreeTerms: boolean; onTermsChange: React.ChangeEventHandler<HTMLInputElement>;
  onSubmit: (e: React.FormEvent) => void; isSubmitting: boolean;
}) => (
  <div className="relative rounded-3xl overflow-hidden">
    {/* Outer glow */}
    <div className="absolute -inset-[1px] bg-gradient-to-b from-[#D4AF37]/20 via-[#D4AF37]/5 to-transparent rounded-3xl" />

    <div className="relative bg-[#0C0C0C]/90 backdrop-blur-2xl rounded-3xl p-7">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        </div>
        <h3 className="text-white/80 font-serif text-lg tracking-wide">{t.summary.title}</h3>
      </div>

      <div className="space-y-4">
        {/* Selected services — P3: Improved empty state with onboarding hint */}
        {summary.services.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-14 h-14 mx-auto rounded-full bg-white/[0.03] flex items-center justify-center mb-4 ring-1 ring-white/[0.06]"
            >
              <ShoppingBag className="w-5 h-5 text-white/20" />
            </motion.div>
            <p className="text-white/25 text-sm font-light italic mb-2">{t.summary.noServiceSelected}</p>
            <p className="text-white/15 text-[11px] font-light leading-relaxed">
              👈 Choose at least 1 service<br />to get started
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3 max-h-[180px] overflow-y-auto premium-scrollbar pr-1">
            {summary.services.map((svc) => (
              <div key={svc.groupKey} className="flex justify-between items-start gap-3 py-2 border-b border-white/[0.04] last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-white/70 text-sm font-light truncate">{svc.name}</p>
                  <p className="text-white/20 text-xs font-light mt-0.5">{svc.duration} min</p>
                </div>
                <span className="text-white/50 text-sm font-light flex-shrink-0">{svc.priceVND.toLocaleString('vi-VN')}đ</span>
              </div>
            ))}
          </div>
        )}

        {/* Schedule info */}
        {(summary.date || summary.time || summary.branchName) && (
          <>
            <GoldDivider />
            <div className="space-y-2.5">
              {(summary.date || summary.time) && (
                <div className="flex justify-between text-sm font-light">
                  <span className="text-white/25 flex items-center gap-2"><CalendarDays className="w-3 h-3" />{t.summary.date}</span>
                  <span className="text-white/55">{summary.date || '—'} {summary.time && `· ${summary.time}`}</span>
                </div>
              )}
              {summary.branchName && (
                <div className="flex justify-between text-sm font-light">
                  <span className="text-white/25 flex items-center gap-2"><MapPin className="w-3 h-3" />{t.summary.branch}</span>
                  <span className="text-white/55">{summary.branchName}</span>
                </div>
              )}
              {summary.guests > 1 && (
                <div className="flex justify-between text-sm font-light">
                  <span className="text-white/25 flex items-center gap-2"><Users className="w-3 h-3" />{t.summary.guests}</span>
                  <span className="text-white/55">{summary.guests}</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Total */}
        <GoldDivider />
        <div className="flex justify-between items-end pt-1">
          <div>
            <span className="text-white/40 text-xs tracking-[0.2em] uppercase font-light">{t.summary.total}</span>
            {summary.totalDuration > 0 && (
              <p className="text-white/20 text-[11px] font-light mt-0.5">{summary.totalDuration} min total</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-3xl font-serif tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#E7AA51] via-[#FFF3D4] to-[#B8860B]">
              {summary.totalPriceVND > 0 ? `${summary.totalPriceVND.toLocaleString('vi-VN')}đ` : '—'}
            </p>
            {summary.totalPriceUSD > 0 && (
              <p className="text-white/20 text-xs font-light mt-0.5">${summary.totalPriceUSD}</p>
            )}
          </div>
        </div>
      </div>

      {/* Terms + Submit — desktop */}
      <div className="mt-7 space-y-5 hidden lg:block">
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer">
            <div className={`w-5 h-5 rounded-md transition-all duration-300 flex items-center justify-center
              ${agreeTerms
                ? 'bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                : 'ring-1 ring-white/20 bg-transparent'
              }`}>
              <input type="checkbox" name="agreeTerms" id="agreeTermsDesktop"
                checked={agreeTerms} onChange={onTermsChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              <Check className={`w-3 h-3 text-black transition-transform ${agreeTerms ? 'scale-100' : 'scale-0'}`} />
            </div>
          </div>
          <label htmlFor="agreeTermsDesktop" className="text-white/40 cursor-pointer text-xs font-light hover:text-white/60 transition-colors">
            {t.terms.agree}{' '}
            <span className="text-[#D4AF37]/70 underline underline-offset-2 decoration-[#D4AF37]/20 hover:decoration-[#D4AF37]/50 transition-colors">{t.terms.link}</span>
          </label>
        </div>

        <button type="submit" onClick={onSubmit}
          disabled={isSubmitting || !agreeTerms || summary.services.length === 0}
          className="w-full relative overflow-hidden rounded-xl py-4 transition-all duration-500
            disabled:opacity-30 disabled:cursor-not-allowed group/btn active:scale-[0.98]">
          {/* Button gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#E7AA51] group-hover/btn:from-[#E7AA51] group-hover/btn:via-[#FFF3D4] group-hover/btn:to-[#D4AF37] transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          <span className="relative z-10 text-black font-medium text-sm tracking-[0.2em] uppercase">
            {isSubmitting ? t.buttons.processing : t.buttons.confirm}
            {summary.services.length > 0 && ` (${summary.services.length})`}
          </span>
        </button>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════
// Mobile Navigation
// ═══════════════════════════════════════

const MobileNavigation = ({
  currentStep, totalSteps, onNext, onPrev, canProceed,
  agreeTerms, onTermsChange, onSubmit, isSubmitting, serviceCount,
}: {
  currentStep: number; totalSteps: number;
  onNext: () => void; onPrev: () => void; canProceed: boolean;
  agreeTerms: boolean; onTermsChange: React.ChangeEventHandler<HTMLInputElement>;
  onSubmit: (e: React.FormEvent) => void; isSubmitting: boolean; serviceCount: number;
}) => (
  <div className="mt-10 space-y-6 lg:hidden">
    {currentStep === totalSteps && (
      <div className="flex items-center gap-3 justify-center">
        <div className="relative cursor-pointer">
          <div className={`w-6 h-6 rounded-md transition-all duration-300 flex items-center justify-center
            ${agreeTerms ? 'bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'ring-1 ring-white/20 bg-transparent'}`}>
            <input type="checkbox" name="agreeTerms" id="agreeTermsMobile"
              checked={agreeTerms} onChange={onTermsChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
            <Check className={`w-3.5 h-3.5 text-black transition-transform ${agreeTerms ? 'scale-100' : 'scale-0'}`} />
          </div>
        </div>
        <label htmlFor="agreeTermsMobile" className="text-white/40 cursor-pointer text-sm font-light hover:text-white/60 transition-colors">
          {t.terms.agree}{' '}
          <span className="text-[#D4AF37]/70 underline underline-offset-2">{t.terms.link}</span>
        </label>
      </div>
    )}

    <div className="flex items-center gap-3">
      {currentStep > 1 && (
        <button type="button" onClick={onPrev}
          className="flex-shrink-0 w-13 h-13 rounded-xl ring-1 ring-white/10 text-white/40
            flex items-center justify-center hover:bg-white/[0.03] hover:text-white/60 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      {currentStep < totalSteps ? (
        <button type="button" onClick={onNext} disabled={!canProceed}
          className="flex-1 relative overflow-hidden rounded-xl py-4
            ring-1 ring-white/10 transition-all disabled:opacity-25 disabled:cursor-not-allowed
            hover:ring-white/20 active:scale-[0.98] group/btn">
          <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] to-white/[0.06] group-hover/btn:from-white/[0.05] group-hover/btn:to-white/[0.08] transition-all" />
          <span className="relative z-10 flex items-center justify-center gap-2 text-white/70 text-sm tracking-[0.15em] uppercase font-light">
            {t.buttons.next}
            {currentStep === 1 && serviceCount > 0 && (
              <span className="text-[#D4AF37]">({serviceCount})</span>
            )}
            <ArrowRight className="w-4 h-4" />
          </span>
        </button>
      ) : (
        <button type="submit" onClick={onSubmit} disabled={isSubmitting || !agreeTerms}
          className="flex-1 relative overflow-hidden rounded-xl py-4 transition-all
            disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] group/btn">
          <div className="absolute inset-0 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#E7AA51] group-hover/btn:from-[#E7AA51] group-hover/btn:via-[#FFF3D4] group-hover/btn:to-[#D4AF37] transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          <span className="relative z-10 text-black font-medium text-sm tracking-[0.2em] uppercase">
            {isSubmitting ? t.buttons.processing : t.buttons.confirm}
          </span>
        </button>
      )}
    </div>
  </div>
);

// ═══════════════════════════════════════
// Main BookingForm Component
// ═══════════════════════════════════════

const BookingForm = () => {
  const {
    formData, filteredGroups, handleChange,
    toggleService, changeVariant, isServiceSelected, getSelectedVariantId,
    updateGuests, handleSubmit, isSubmitting, isSuccess,
    bookingResult,
    categories, activeCategory, setActiveCategory,
    currentStep, stepDirection, totalSteps, nextStep, prevStep, canProceedFromStep,
    goToStep,
    bookingSummary,
  } = useBookingForm();

  const today = new Date().toISOString().split('T')[0];

  // ─── Booking Success Screen ───
  if (isSuccess && bookingResult) {
    return (
      <section id="booking" className="py-24 px-6 bg-[#080808] min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(212,175,55,0.08),transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(212,175,55,0.04),transparent_65%)] pointer-events-none" />

        <div className="max-w-lg w-full relative z-10">
          {/* Card */}
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute -inset-[1px] bg-gradient-to-b from-[#D4AF37]/30 via-[#D4AF37]/8 to-transparent rounded-3xl" />
            <div className="relative bg-[#0C0C0C]/95 backdrop-blur-2xl rounded-3xl p-8 sm:p-10">

              {/* Check icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center ring-1 ring-[#D4AF37]/30 shadow-[0_0_40px_rgba(212,175,55,0.15)]">
                    <Check className="w-9 h-9 text-[#D4AF37]" strokeWidth={2.5} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.4)]">
                    <Sparkles className="w-3 h-3 text-black" />
                  </div>
                </div>
              </div>

              {/* Badge + heading */}
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 ring-1 ring-[#D4AF37]/25 text-[#D4AF37]/80 text-[10px] tracking-[0.3em] uppercase font-light mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60 animate-pulse" />
                  {t.success.badge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-white/90 tracking-wide">{t.success.title}</h2>
                <p className="text-white/30 text-sm font-light mt-2 max-w-xs mx-auto leading-relaxed">{t.success.subtitle}</p>
              </div>

              {/* Booking code highlight */}
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#D4AF37]/10 via-[#D4AF37]/5 to-transparent ring-1 ring-[#D4AF37]/20">
                <p className="text-[#D4AF37]/50 text-[10px] tracking-[0.25em] uppercase font-light mb-1">{t.success.bookingCode}</p>
                <p className="text-[#F5E6B8] text-xl font-mono tracking-widest font-medium">{bookingResult.billCode}</p>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-baseline py-2.5 border-b border-white/[0.05]">
                  <span className="text-white/30 text-xs tracking-wide font-light">{t.success.customerName}</span>
                  <span className="text-white/75 text-sm font-light">{bookingResult.customerName}</span>
                </div>
                {bookingResult.customerPhone && (
                  <div className="flex justify-between items-baseline py-2.5 border-b border-white/[0.05]">
                    <span className="text-white/30 text-xs tracking-wide font-light">{t.success.phone}</span>
                    <span className="text-white/75 text-sm font-light">{bookingResult.customerPhone}</span>
                  </div>
                )}
                <div className="py-2.5 border-b border-white/[0.05]">
                  <span className="text-white/30 text-xs tracking-wide font-light block mb-2">{t.success.services}</span>
                  <div className="space-y-1">
                    {bookingResult.services.map((svc, i) => (
                      <div key={i} className="flex justify-between items-baseline">
                        <span className="text-white/60 text-sm font-light truncate max-w-[60%]">{svc.name}</span>
                        <span className="text-white/40 text-xs font-light">{svc.priceVND.toLocaleString('vi-VN')}đ</span>
                      </div>
                    ))}
                  </div>
                </div>
                {(bookingResult.date || bookingResult.time) && (
                  <div className="flex justify-between items-baseline py-2.5 border-b border-white/[0.05]">
                    <span className="text-white/30 text-xs tracking-wide font-light">{t.success.dateTime}</span>
                    <span className="text-white/75 text-sm font-light">
                      {bookingResult.date} {bookingResult.time && `· ${bookingResult.time}`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-baseline py-2.5 border-b border-white/[0.05]">
                  <span className="text-white/30 text-xs tracking-wide font-light">{t.success.branch}</span>
                  <span className="text-white/75 text-sm font-light">{bookingResult.branchName}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-white/50 text-xs tracking-[0.2em] uppercase font-light">{t.success.total}</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E7AA51] via-[#FFF3D4] to-[#B8860B] text-xl font-serif tracking-wide">
                    {bookingResult.totalAmount.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              {/* Note */}
              <p className="text-center text-white/20 text-xs font-light mb-6 leading-relaxed">{t.success.note}</p>

              {/* CTA */}
              <a href="/" className="block w-full relative overflow-hidden rounded-xl py-4 transition-all active:scale-[0.98] group/btn">
                <div className="absolute inset-0 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#E7AA51] group-hover/btn:opacity-90 transition-opacity duration-300" />
                <span className="relative z-10 block text-center text-black font-medium text-sm tracking-[0.2em] uppercase">
                  {t.success.backHome}
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback khi thành công nhưng chưa có result (hiếm)
  if (isSuccess) {
    return (
      <section id="booking" className="py-24 px-6 bg-[#080808] min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <Check className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-white/90">{t.success.title}</h2>
          <a href="/" className="mt-6 inline-block text-[#D4AF37]/70 text-sm underline underline-offset-4">{t.success.backHome}</a>
        </div>
      </section>
    );
  }

  // ─── Service Selection ───
  const renderServiceSelection = () => (
    <div>
      <SectionHeader icon={Sparkles} label={t.steps.service} subtitle="Choose one or more services" />
      <CategoryTabs categories={categories} active={activeCategory} onSelect={setActiveCategory}
        selectedCount={formData.selectedServices.length} />

      {/* P0+P3: Responsive grid — 1 col on mobile, 2 col on sm+ */}
      {filteredGroups.length === 0 ? (
        // P3: Empty state when filter has no results
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4 ring-1 ring-white/[0.06]">
            <span className="text-3xl">{CATEGORY_ICONS[activeCategory] || '🌿'}</span>
          </div>
          <p className="text-white/30 text-sm font-light mb-1">No services in this category</p>
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className="mt-3 text-[#D4AF37]/60 text-xs font-light underline underline-offset-4 hover:text-[#D4AF37]/90 transition-colors"
          >
            View all services
          </button>
        </motion.div>
      ) : (
        <motion.div variants={staggerContainerVariants} initial="hidden" animate="visible"
          key={activeCategory}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto premium-scrollbar max-h-[60vh] lg:max-h-[420px] pr-1">
          {filteredGroups.map(group => (
            <motion.div key={group.groupKey} variants={staggerItemVariants}>
              <ServiceCard group={group} isSelected={isServiceSelected(group.groupKey)}
                selectedVariantId={getSelectedVariantId(group.groupKey)}
                onToggle={() => toggleService(group)}
                onVariantChange={(v) => changeVariant(group.groupKey, v, getGroupedServiceName(group, 'vi'))} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {formData.selectedServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            className="mt-5 text-center"
          >
            {/* P3: Micro-animation — bounce when count changes */}
            <motion.span
              key={formData.selectedServices.length}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 600, damping: 20 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#D4AF37]/8 ring-1 ring-[#D4AF37]/20 text-[#D4AF37]/80 text-sm font-light tracking-wide"
            >
              <Check className="w-3.5 h-3.5" />
              {formData.selectedServices.length} service{formData.selectedServices.length > 1 ? 's' : ''} selected
              <span className="opacity-30">·</span>
              <span className="text-white/50">{bookingSummary.totalPriceVND.toLocaleString('vi-VN')}đ</span>
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // ─── Personal Details ───
  const renderPersonalDetails = () => (
    <div>
      <SectionHeader icon={UserCircle} label={t.steps.details} subtitle="Tell us about yourself" />
      {/* P2: Real-time validation added */}
      <div className="space-y-5 lg:grid lg:grid-cols-3 lg:gap-5 lg:space-y-0">
        <FormInput
          label={t.fields.name} name="name" value={formData.name}
          onChange={handleChange} placeholder={t.fields.namePlaceholder} required
          validate={(v) => v.trim().length < 2 ? 'Name must be at least 2 characters' : null}
        />
        <FormInput
          label={t.fields.phone} type="tel" name="phone" value={formData.phone}
          onChange={handleChange} placeholder={t.fields.phonePlaceholder} required
          validate={(v) => !PHONE_REGEX.test(v) ? 'Invalid phone number format' : null}
        />
        <FormInput
          label={t.fields.email} type="email" name="email" value={formData.email}
          onChange={handleChange} placeholder={t.fields.emailPlaceholder}
          validate={(v) => v.length > 0 && !EMAIL_REGEX.test(v) ? 'Invalid email address' : null}
        />
      </div>
    </div>
  );

  // ─── Schedule ───
  const renderSchedule = () => (
    <div>
      <SectionHeader icon={CalendarDays} label={t.steps.confirm} subtitle="Pick your preferred date & time" />
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <SelectorBox icon={CalendarDays} label={t.fields.date}>
            <div className="relative">
              <input type="date" name="date" value={formData.date} onChange={handleChange} min={today} required
                className="bg-transparent border-none text-white/80 text-sm font-light focus:outline-none cursor-pointer
                  [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute
                  [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full
                  [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer" />
              {/* P2: Date hint — dd/mm/yyyy format for Vietnamese users */}
              {!formData.date && (
                <span className="text-white/20 text-xs pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 font-light tracking-wider">
                  dd/mm/yyyy
                </span>
              )}
            </div>
          </SelectorBox>
          <SelectorBox icon={Clock} label={t.fields.time}>
            <div className="relative">
              <input type="time" name="time" value={formData.time} onChange={handleChange} required
                className="bg-transparent border-none text-white/80 text-sm font-light focus:outline-none cursor-pointer
                  [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute
                  [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full
                  [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer" />
              {!formData.time && <span className="text-white/20 text-xs pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 font-light">--:--</span>}
            </div>
          </SelectorBox>
        </div>

        <SelectorBox icon={MapPin} label={t.fields.branch}>
          <select name="branchId" value={formData.branchId} onChange={handleChange} required
            className="bg-transparent border-none text-white/80 text-sm font-light focus:outline-none appearance-none cursor-pointer text-right pr-5">
            {BRANCH_LIST.map(b => <option key={b.id} value={b.id} className="bg-[#111]">{b.name}</option>)}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]/50 -ml-4 pointer-events-none" />
        </SelectorBox>

        <div className="grid grid-cols-2 gap-3">
          <SelectorBox icon={Users} label={t.fields.guests}>
            <div className="flex items-center gap-3 bg-black/30 rounded-full px-2.5 py-1 ring-1 ring-white/[0.06]">
              <button type="button" onClick={() => updateGuests(-1)}
                className="w-6 h-6 rounded-full text-white/30 hover:text-white/60 hover:bg-white/[0.05] flex items-center justify-center transition-colors text-sm font-light">–</button>
              <span className="text-white/70 font-light w-4 text-center text-sm">{formData.guests}</span>
              <button type="button" onClick={() => updateGuests(1)}
                className="w-6 h-6 rounded-full text-white/30 hover:text-white/60 hover:bg-white/[0.05] flex items-center justify-center transition-colors text-sm font-light">+</button>
            </div>
          </SelectorBox>
          <SelectorBox icon={UserCircle} label={t.fields.staff}>
            <select name="staffGender" value={formData.staffGender} onChange={handleChange}
              className="bg-transparent border-none text-white/80 text-sm font-light focus:outline-none appearance-none cursor-pointer text-right">
              <option value="any" className="bg-[#111]">{t.fields.staffAny}</option>
              <option value="female" className="bg-[#111]">{t.fields.staffFemale}</option>
              <option value="male" className="bg-[#111]">{t.fields.staffMale}</option>
            </select>
          </SelectorBox>
        </div>

        <div className="mt-3">
          <label className="text-[#D4AF37]/40 text-[10px] tracking-[0.2em] uppercase font-light mb-2.5 block">{t.fields.note}</label>
          <textarea name="note" value={formData.note} onChange={handleChange} rows={2}
            placeholder={t.fields.notePlaceholder}
            className="w-full bg-white/[0.02] ring-1 ring-white/[0.06] rounded-xl focus:outline-none
              focus:ring-[#D4AF37]/25 focus:bg-white/[0.03] transition-all p-5 text-white/80 text-sm font-light resize-none
              placeholder:text-white/12" />
        </div>
      </div>
    </div>
  );

  const renderMobileSummary = () => (
    <div className="lg:hidden mt-8">
      <BookingSummaryPanel summary={bookingSummary} agreeTerms={formData.agreeTerms}
        onTermsChange={handleChange} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );

  return (
    <section id="booking" className="min-h-[100dvh] py-20 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #060606 0%, #0A0808 30%, #080606 70%, #050505 100%)' }}>

      {/* Ambient glow effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(212,175,55,0.06),transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(212,175,55,0.03),transparent_65%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(ellipse,rgba(139,90,43,0.04),transparent_70%)] pointer-events-none" />

      <style>{`
        .premium-scrollbar::-webkit-scrollbar{width:4px}
        .premium-scrollbar::-webkit-scrollbar-track{background:transparent}
        .premium-scrollbar::-webkit-scrollbar-thumb{background:rgba(212,175,55,0.12);border-radius:10px}
        .premium-scrollbar::-webkit-scrollbar-thumb:hover{background:rgba(212,175,55,0.3)}
        .scrollbar-hide::-webkit-scrollbar{display:none}
        .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>

      <div className="max-w-[1200px] w-full mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-14 lg:mb-16">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center justify-center gap-3 px-6 py-2 rounded-full ring-1 ring-[#D4AF37]/20 bg-[#D4AF37]/[0.05] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60 animate-pulse" />
            <span className="tracking-[0.35em] text-[#D4AF37]/70 text-[10px] font-light uppercase">{t.badge}</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-serif text-white/90 tracking-wide leading-tight">
            {t.heading}{' '}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#E7AA51] via-[#FFF3D4] to-[#B8860B]">
              {t.headingHighlight}
            </span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-white/20 text-sm font-light tracking-wide max-w-md mx-auto">
            Indulge in our premium treatments · Trải nghiệm dịch vụ cao cấp
          </motion.p>
        </div>

        {/* P1: Step indicator — visible on both mobile and desktop, clickable for done steps */}
        <StepProgress
          current={currentStep}
          total={totalSteps}
          onStepClick={goToStep}
          canClickStep={(step) => canProceedFromStep(step)}
        />

        {/* MAIN LAYOUT */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col lg:flex-row lg:gap-8 lg:items-start">

          {/* LEFT: Form */}
          <div className="flex-1 relative rounded-[28px] overflow-hidden">
            {/* Card border gradient */}
            <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-transparent rounded-[28px] pointer-events-none" />

            <div className="relative bg-[#0A0A0A]/80 backdrop-blur-2xl rounded-[28px] p-6 sm:p-8 lg:p-10
              shadow-[0_25px_80px_rgba(0,0,0,0.6)]">

              <form onSubmit={handleSubmit}>
                {/* MOBILE */}
                <div className="lg:hidden">
                  <AnimatePresence mode="wait" custom={stepDirection}>
                    <motion.div key={currentStep} custom={stepDirection}
                      variants={stepSlideVariants} initial="enter" animate="center" exit="exit">
                      {currentStep === 1 && renderServiceSelection()}
                      {currentStep === 2 && renderPersonalDetails()}
                      {currentStep === 3 && (<>{renderSchedule()}{renderMobileSummary()}</>)}
                    </motion.div>
                  </AnimatePresence>
                  <MobileNavigation currentStep={currentStep} totalSteps={totalSteps}
                    onNext={nextStep} onPrev={prevStep} canProceed={canProceedFromStep(currentStep)}
                    agreeTerms={formData.agreeTerms} onTermsChange={handleChange}
                    onSubmit={handleSubmit} isSubmitting={isSubmitting}
                    serviceCount={formData.selectedServices.length} />
                </div>

                {/* DESKTOP — P1: Step-based rendering with locked sections */}
                <div className="hidden lg:flex lg:flex-col lg:gap-12">
                  {/* Step 1: Always visible */}
                  <motion.div
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderServiceSelection()}
                  </motion.div>

                  {/* Step 2: Locked until step 1 done */}
                  <motion.div
                    animate={{
                      opacity: canProceedFromStep(1) ? 1 : 0.3,
                      filter: canProceedFromStep(1) ? 'none' : 'blur(2px)',
                    }}
                    transition={{ duration: 0.5 }}
                    className={canProceedFromStep(1) ? '' : 'pointer-events-none select-none'}
                  >
                    {!canProceedFromStep(1) && (
                      <div className="flex items-center gap-2 mb-4 pl-1">
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37]/30 animate-pulse" />
                        <span className="text-white/25 text-xs font-light tracking-widest uppercase">
                          Select a service first
                        </span>
                      </div>
                    )}
                    {renderPersonalDetails()}
                  </motion.div>

                  {/* Step 3: Locked until step 2 done */}
                  <motion.div
                    animate={{
                      opacity: canProceedFromStep(2) ? 1 : 0.3,
                      filter: canProceedFromStep(2) ? 'none' : 'blur(2px)',
                    }}
                    transition={{ duration: 0.5 }}
                    className={canProceedFromStep(2) ? '' : 'pointer-events-none select-none'}
                  >
                    {!canProceedFromStep(2) && (
                      <div className="flex items-center gap-2 mb-4 pl-1">
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37]/30 animate-pulse" />
                        <span className="text-white/25 text-xs font-light tracking-widest uppercase">
                          Fill your details first
                        </span>
                      </div>
                    )}
                    {renderSchedule()}
                  </motion.div>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT: Sticky Summary */}
          <div className="hidden lg:block lg:w-[350px] lg:flex-shrink-0 lg:sticky lg:top-24">
            <BookingSummaryPanel summary={bookingSummary} agreeTerms={formData.agreeTerms}
              onTermsChange={handleChange} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingForm;
