import React from 'react';

interface HomeSectionProps {
  onExploreClick: () => void;
}

export function HomeSection({ onExploreClick }: HomeSectionProps) {
  return (
    <section id="home" className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Decorative Elements */}
      <div className="decorative-circle w-[500px] h-[500px] left-[-200px] top-[-200px]"></div>
      <div className="decorative-circle-2 w-[600px] h-[600px] right-[-300px] bottom-[-200px]"></div>
      
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <div className="relative w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute w-full h-full object-cover"
          >
            <source src="/videos/video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-blue-900/40"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full transform -rotate-6"></div>
          <h1 className="relative text-6xl font-bold text-white mb-8 leading-tight">
            Найдите свой путь к успеху через конкурсы и гранты
          </h1>
        </div>
        <p className="text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
          Откройте для себя множество возможностей для развития и получения поддержки в реализации ваших идей
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={onExploreClick}
            className="group bg-blue-500 text-white px-12 py-4 rounded-full text-xl font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <span className="relative">Смотреть все конкурсы</span>
          </button>
          <button
            onClick={() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' })}
            className="group bg-white text-blue-900 px-12 py-4 rounded-full text-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-blue-100/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <span className="relative">Связаться с нами</span>
          </button>
        </div>
      </div>
    </section>
  );
}