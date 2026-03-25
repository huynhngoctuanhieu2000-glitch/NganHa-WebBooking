// ═══════════════════════════════════════
// BookingForm Logic Hook
// Multi-service selection with grouped services
// ═══════════════════════════════════════

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Service } from '@/types';
import { fetchServices } from '@/data/services';
import { BRANCH_LIST } from '@/data/branches';
import {
  GroupedService, DurationVariant,
  groupServices, getGroupedServiceName,
} from '@/lib/groupServices';

// 🔧 CONFIGURATION
const MAX_GUESTS = 10;
const MIN_GUESTS = 1;
const TOTAL_STEPS = 3;
const ALL_CATEGORY = 'all';

/** One selected service = a grouped service + chosen variant */
export type SelectedServiceItem = {
  groupKey: string;
  variantId: string; // id of the chosen DurationVariant
  name: string;
  duration: number;
  priceVND: number;
  priceUSD: number;
};

export type BookingFormData = {
  selectedServices: SelectedServiceItem[];
  branchId: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  note: string;
  guests: number;
  staff: string;
  agreeTerms: boolean;
};

export type BookingSummary = {
  services: SelectedServiceItem[];
  totalDuration: number;
  totalPriceVND: number;
  totalPriceUSD: number;
  date: string;
  time: string;
  branchName: string;
  guests: number;
  staffName: string;
};

export const useBookingForm = () => {
  // ─── Raw Services ───
  const [rawServices, setRawServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  // ─── Category Filter ───
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY);

  // ─── Step State (for mobile wizard) ───
  const [currentStep, setCurrentStep] = useState(1);
  const [stepDirection, setStepDirection] = useState(1);

  // ─── Form State ───
  const [formData, setFormData] = useState<BookingFormData>({
    selectedServices: [],
    branchId: BRANCH_LIST[0]?.id || '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    note: '',
    guests: 1,
    staff: 'NGẪU NHIÊN',
    agreeTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ─── Grouped Services ───
  const groupedServices = useMemo(() => groupServices(rawServices), [rawServices]);

  // ─── Categories ───
  const categories = useMemo(() => {
    const cats = [...new Set(groupedServices.map(g => g.category))];
    return cats.sort();
  }, [groupedServices]);

  // ─── Filtered Services ───
  const filteredGroups = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) return groupedServices;
    return groupedServices.filter(g => g.category === activeCategory);
  }, [groupedServices, activeCategory]);

  // ─── Fetch Services ───
  useEffect(() => {
    const loadServices = async () => {
      setIsLoadingServices(true);
      const data = await fetchServices();
      setRawServices(data);
      setIsLoadingServices(false);
    };
    loadServices();
  }, []);

  // ─── Handlers ───
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    },
    []
  );

  /**
   * Toggle a service: add/remove from selected list.
   * When adding, picks default variant (first / cheapest).
   */
  const toggleService = useCallback((group: GroupedService) => {
    setFormData(prev => {
      const exists = prev.selectedServices.find(s => s.groupKey === group.groupKey);
      if (exists) {
        // Remove
        return {
          ...prev,
          selectedServices: prev.selectedServices.filter(s => s.groupKey !== group.groupKey),
        };
      } else {
        // Add with default variant (first one = shortest duration)
        const defaultVariant = group.variants[0];
        const newItem: SelectedServiceItem = {
          groupKey: group.groupKey,
          variantId: defaultVariant.id,
          name: getGroupedServiceName(group, 'vi'),
          duration: defaultVariant.duration,
          priceVND: defaultVariant.priceVND,
          priceUSD: defaultVariant.priceUSD,
        };
        return {
          ...prev,
          selectedServices: [...prev.selectedServices, newItem],
        };
      }
    });
  }, []);

  /**
   * Change duration variant for an already-selected service
   */
  const changeVariant = useCallback((groupKey: string, variant: DurationVariant, groupName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.map(s =>
        s.groupKey === groupKey
          ? {
              ...s,
              variantId: variant.id,
              name: groupName,
              duration: variant.duration,
              priceVND: variant.priceVND,
              priceUSD: variant.priceUSD,
            }
          : s
      ),
    }));
  }, []);

  /** Check if a grouped service is selected */
  const isServiceSelected = useCallback(
    (groupKey: string) => formData.selectedServices.some(s => s.groupKey === groupKey),
    [formData.selectedServices]
  );

  /** Get selected variant ID for a grouped service */
  const getSelectedVariantId = useCallback(
    (groupKey: string) => formData.selectedServices.find(s => s.groupKey === groupKey)?.variantId || null,
    [formData.selectedServices]
  );

  const updateGuests = useCallback((delta: number) => {
    setFormData(prev => {
      const newGuests = prev.guests + delta;
      if (newGuests >= MIN_GUESTS && newGuests <= MAX_GUESTS) {
        return { ...prev, guests: newGuests };
      }
      return prev;
    });
  }, []);

  // ─── Step Navigation ───
  const canProceedFromStep = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1:
          return formData.selectedServices.length > 0;
        case 2:
          return !!(formData.name.trim() && formData.phone.trim());
        case 3:
          return !!(formData.date && formData.time && formData.agreeTerms);
        default:
          return false;
      }
    },
    [formData]
  );

  const nextStep = useCallback(() => {
    if (currentStep < TOTAL_STEPS && canProceedFromStep(currentStep)) {
      setStepDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, canProceedFromStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setStepDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= TOTAL_STEPS) {
        setStepDirection(step > currentStep ? 1 : -1);
        setCurrentStep(step);
      }
    },
    [currentStep]
  );

  // ─── Booking Summary ───
  const bookingSummary = useMemo((): BookingSummary => {
    const selectedBranch = BRANCH_LIST.find(b => b.id === formData.branchId);
    const totalDuration = formData.selectedServices.reduce((sum, s) => sum + s.duration, 0);
    const totalPriceVND = formData.selectedServices.reduce((sum, s) => sum + s.priceVND, 0);
    const totalPriceUSD = formData.selectedServices.reduce((sum, s) => sum + s.priceUSD, 0);

    return {
      services: formData.selectedServices,
      totalDuration,
      totalPriceVND,
      totalPriceUSD,
      date: formData.date,
      time: formData.time,
      branchName: selectedBranch?.name || '',
      guests: formData.guests,
      staffName: formData.staff === 'NGẪU NHIÊN' ? 'Random' : formData.staff,
    };
  }, [formData]);

  const stepProgress = currentStep / TOTAL_STEPS;

  // ─── Submit ───
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.agreeTerms) {
        alert('Vui lòng đồng ý với các Điều khoản và Điều kiện.');
        return;
      }
      if (formData.selectedServices.length === 0) {
        alert('Vui lòng chọn ít nhất 1 dịch vụ.');
        return;
      }
      setIsSubmitting(true);
      // TODO: Supabase integration
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 1500);
    },
    [formData.agreeTerms, formData.selectedServices.length]
  );

  return {
    // Form
    formData,
    rawServices,
    groupedServices,
    filteredGroups,
    isLoadingServices,
    handleChange,
    toggleService,
    changeVariant,
    isServiceSelected,
    getSelectedVariantId,
    updateGuests,
    handleSubmit,
    isSubmitting,
    isSuccess,
    // Categories
    categories,
    activeCategory,
    setActiveCategory,
    // Steps
    currentStep,
    stepDirection,
    stepProgress,
    totalSteps: TOTAL_STEPS,
    nextStep,
    prevStep,
    goToStep,
    canProceedFromStep,
    // Summary
    bookingSummary,
  };
};
