import { useState } from 'react';
import { SERVICES } from '@/data/services';
import { BRANCH_LIST } from '@/data/branches';

export type BookingFormData = {
  serviceId: string;
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

export const useBookingForm = () => {
  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: SERVICES[0]?.id || '',
    branchId: BRANCH_LIST[0]?.id || '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    note: '',
    guests: 1,
    staff: 'NGẪU NHIÊN',
    agreeTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleServiceSelect = (id: string) => {
    setFormData(prev => ({ ...prev, serviceId: id }));
  };

  const updateGuests = (delta: number) => {
    setFormData(prev => {
      const newGuests = prev.guests + delta;
      if (newGuests >= 1 && newGuests <= 10) {
        return { ...prev, guests: newGuests };
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert('Vui lòng đồng ý với các Điều khoản và Điều kiện.');
      return;
    }
    
    setIsSubmitting(true);
    // TODO: Supabase integration
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return { 
    formData, 
    handleChange, 
    handleServiceSelect,
    updateGuests,
    handleSubmit, 
    isSubmitting, 
    isSuccess 
  };
};
