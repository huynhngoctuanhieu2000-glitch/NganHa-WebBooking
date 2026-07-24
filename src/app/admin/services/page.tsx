'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Image as ImageIcon, Video, Upload, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const ServicesAdminPage = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const json = await res.json();
      if (Array.isArray(json)) setServices(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (id: string, file: File) => {
    const isVideo = file.type.startsWith('video/');
    const type = isVideo ? 'video' : 'image';

    setUploadingId(id);
    setSuccessId(null);

    try {
      // 1. Upload file
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'services');

      const uploadRes = await fetch('/api/admin/media', { method: 'POST', body: form });
      const uploadJson = await uploadRes.json();

      if (!uploadJson.success) {
        alert('Lỗi tải lên: ' + (uploadJson.error?.message || 'Không rõ'));
        return;
      }

      // 2. Update service
      const updateRes = await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ media_url: uploadJson.data.url, media_type: type }),
      });

      if (updateRes.ok) {
        setSuccessId(id);
        setTimeout(() => setSuccessId(null), 3000);
        fetchServices();
      } else {
        alert('Lỗi cập nhật!');
      }
    } catch {
      alert('Lỗi hệ thống');
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-admin-text-dim hover:text-admin-text text-sm mb-4 transition-colors">
          <ArrowLeft size={16} /> Quay lại Tổng quan
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-admin-text">💆 Quản Lý Ảnh / Video Dịch Vụ</h1>
        <p className="text-admin-text-dim mt-2">Tải lên hình ảnh hoặc video giới thiệu cho từng dịch vụ spa.</p>
      </div>

      {/* Hướng dẫn */}
      <div className="mb-8 bg-admin-panel border border-admin-line rounded-2xl p-5 shadow-[var(--shadow)]">
        <p className="text-sm text-admin-text-dim">
          👉 Nhấn nút <strong className="text-admin-text">"Chọn ảnh/video"</strong> bên dưới mỗi dịch vụ để tải file lên.
          File sẽ tự động lưu và hiển thị trên website.
        </p>
      </div>

      {/* Services Grid */}
      <div className="space-y-12">
        {loading ? (
          <p className="text-admin-text-dim text-center py-8">⏳ Đang tải danh sách dịch vụ...</p>
        ) : services.length === 0 ? (
          <p className="text-admin-text-dim text-center py-8">Chưa có dịch vụ nào trong hệ thống.</p>
        ) : (
          Object.entries(
            services.reduce((acc: any, service) => {
              const cat = service.category || 'Khác';
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(service);
              return acc;
            }, {})
          ).map(([category, items]: [string, any]) => (
            <div key={category} className="space-y-6">
              <h2 className="text-xl font-bold text-admin-gold border-b border-admin-line-strong pb-2">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map((service: any) => (
            <div
              key={service.id}
              className={`
                bg-admin-panel border rounded-2xl overflow-hidden flex flex-col shadow-[var(--shadow)]
                transition-all duration-300
                ${successId === service.id ? 'border-admin-green ring-1 ring-admin-green-a' : 'border-admin-line-strong hover:border-admin-gold hover:-translate-y-1'}
              `}
            >
              {/* Media Preview */}
              <div className="relative w-full aspect-video bg-admin-panel-2 flex items-center justify-center border-b border-admin-line-strong">
                {service.media_url ? (
                  service.media_type === 'video' ? (
                    <video src={service.media_url} controls className="w-full h-full object-cover" />
                  ) : (
                    <img src={service.media_url} alt="" className="w-full h-full object-cover" />
                  )
                ) : (
                  <div className="text-center text-admin-text-faint">
                    <ImageIcon size={32} className="mx-auto mb-2" />
                    <p className="text-xs">Chưa có ảnh/video</p>
                  </div>
                )}

                {/* Success Badge */}
                {successId === service.id && (
                  <div className="absolute top-3 right-3 bg-admin-green text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 animate-bounce">
                    <CheckCircle size={14} /> Đã lưu!
                  </div>
                )}

                {/* Uploading Overlay */}
                {uploadingId === service.id && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-admin-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-sm text-admin-gold font-medium">Đang tải lên...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col flex-1">
                <div className="mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-admin-gold-dim text-admin-gold px-2 py-0.5 rounded-full border border-admin-gold/20">
                    {service.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-admin-text mb-0.5">{service.name_vi}</h3>
                <p className="text-xs text-admin-text-dim mb-4">{service.name_en}</p>

                {/* Upload Button */}
                <label className={`
                  mt-auto flex items-center justify-center gap-2 py-2.5 rounded-xl cursor-pointer
                  font-semibold text-[13.5px] transition-all duration-200 border border-admin-line-strong
                  ${uploadingId === service.id
                    ? 'bg-admin-line text-admin-text-faint cursor-wait'
                    : 'bg-transparent hover:border-admin-gold hover:bg-admin-gold-dim text-admin-text-dim hover:text-admin-gold'
                  }
                `}>
                  <Upload size={16} />
                  Chọn ảnh / video
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    disabled={uploadingId === service.id}
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(service.id, file);
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ServicesAdminPage;
