import React from 'react';
import { ChevronRight, Calendar, Users, Trophy } from 'lucide-react';
import { Contest } from '../types';
import { useInView } from '../hooks/useInView';

interface ContestsSectionProps {
  contests: Contest[];
}

export function ContestsSection({ contests }: ContestsSectionProps) {
  const [titleRef, titleInView] = useInView();
  const [statsRef, statsInView] = useInView();
  const [contestsRef, contestsInView] = useInView();

  return (
    <section id="contests" className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="decorative-circle w-[600px] h-[600px] right-[-200px] top-[20%] opacity-10"></div>
      <div className="decorative-circle-2 w-[500px] h-[500px] left-[-200px] bottom-[10%] opacity-10"></div>
      
      <div className="max-w-7xl mx-auto relative">
        <div ref={titleRef as React.RefObject<HTMLDivElement>} className={`mb-16 text-center fade-up ${titleInView ? 'in-view' : ''}`}>
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full transform rotate-3"></div>
            <h2 className="relative text-5xl font-bold text-gray-900 mb-6">Актуальные конкурсы</h2>
          </div>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            Выберите интересующий вас конкурс и начните свой путь к успеху уже сегодня
          </p>
        </div>

        {/* Stats Section */}
        <div ref={statsRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className={`bg-blue-50 p-8 rounded-2xl text-center transform hover:scale-105 transition-transform duration-300 relative group fade-up fade-up-delay-1 ${statsInView ? 'in-view' : ''}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-4 relative" />
            <h3 className="text-3xl font-bold text-gray-900 mb-2 relative">100+</h3>
            <p className="text-gray-600 relative">Активных конкурсов</p>
          </div>
          <div className={`bg-blue-50 p-8 rounded-2xl text-center transform hover:scale-105 transition-transform duration-300 relative group fade-up fade-up-delay-2 ${statsInView ? 'in-view' : ''}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4 relative" />
            <h3 className="text-3xl font-bold text-gray-900 mb-2 relative">50,000+</h3>
            <p className="text-gray-600 relative">Участников</p>
          </div>
          <div className={`bg-blue-50 p-8 rounded-2xl text-center transform hover:scale-105 transition-transform duration-300 relative group fade-up fade-up-delay-3 ${statsInView ? 'in-view' : ''}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4 relative" />
            <h3 className="text-3xl font-bold text-gray-900 mb-2 relative">₸500M+</h3>
            <p className="text-gray-600 relative">Призовой фонд</p>
          </div>
        </div>

        <div ref={contestsRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contests.map((contest, index) => (
            <div
              key={contest.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group fade-up ${contestsInView ? 'in-view' : ''}`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-video relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <iframe
                  src={`${contest.video}?autoplay=0&controls=1&mute=1&modestbranding=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={contest.title}
                ></iframe>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {contest.title}
                </h3>
                <p className="text-gray-600 mb-6 text-lg">{contest.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-medium">
                    Дедлайн: {contest.deadline}
                  </span>
                  <button className="group inline-flex items-center text-white bg-blue-600 px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 relative overflow-hidden">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    <span className="relative flex items-center">
                      Подробнее
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}