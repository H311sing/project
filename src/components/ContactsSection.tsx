import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export function ContactsSection() {
  const [titleRef, titleInView] = useInView();
  const [cardsRef, cardsInView] = useInView();
  const [formRef, formInView] = useInView();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('complaints')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            message: formData.message,
            status: 'new',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      toast.success('Ваше сообщение отправлено!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Ошибка отправки:', error);
      toast.error('Произошла ошибка при отправке');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <section id="contacts" className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-24 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="decorative-circle w-[500px] h-[500px] left-[-200px] top-[30%] opacity-10"></div>
      <div className="decorative-circle-2 w-[600px] h-[600px] right-[-200px] bottom-[20%] opacity-10"></div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div ref={titleRef as React.RefObject<HTMLDivElement>} className={`text-center mb-16 fade-up ${titleInView ? 'in-view' : ''}`}>
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full transform -rotate-3"></div>
            <h2 className="relative text-5xl font-bold text-gray-900 mb-6">Свяжитесь с нами</h2>
          </div>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            Наши специалисты готовы ответить на все ваши вопросы и помочь с участием в конкурсах
          </p>
        </div>

        <div ref={cardsRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className={`bg-white p-8 rounded-2xl shadow-lg text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 fade-up fade-up-delay-1 ${cardsInView ? 'in-view' : ''}`}>
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300"></div>
              <Phone className="w-12 h-12 text-blue-600 mx-auto relative" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Телефон</h3>
            <p className="text-lg text-gray-600">+7 (999) 123-45-67</p>
            <p className="text-lg text-gray-600">+7 (999) 765-43-21</p>
          </div>
          
          <div className={`bg-white p-8 rounded-2xl shadow-lg text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 fade-up fade-up-delay-2 ${cardsInView ? 'in-view' : ''}`}>
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300"></div>
              <Mail className="w-12 h-12 text-blue-600 mx-auto relative" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Email</h3>
            <p className="text-lg text-gray-600">support@contests.kz</p>
          </div>
          
          <div className={`bg-white p-8 rounded-2xl shadow-lg text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 fade-up fade-up-delay-3 ${cardsInView ? 'in-view' : ''}`}>
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300"></div>
              <MapPin className="w-12 h-12 text-blue-600 mx-auto relative" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Адрес</h3>
            <p className="text-lg text-gray-600">г. Астана, ул. AITU</p>
          </div>
        </div>

        <div ref={formRef as React.RefObject<HTMLDivElement>} className={`bg-white p-12 rounded-2xl shadow-lg relative group scale-up ${formInView ? 'in-view' : ''}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Ваше имя
                </label>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  id="name"
                  type="text"
                  placeholder="Введите ваше имя"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  id="email"
                  type="email"
                  placeholder="Введите ваш email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                Сообщение
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                id="message"
                rows={5}
                placeholder="Введите ваше сообщение"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full bg-blue-600 text-white py-4 px-8 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 relative overflow-hidden disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Отправка...
                </span>
              ) : (
                <>
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative">Отправить сообщение</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}