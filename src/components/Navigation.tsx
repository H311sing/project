import React from 'react';
import { Trophy, Home, Phone, Lightbulb, LogOut, User } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (section: string) => void;
  onRegisterClick: () => void;
  user: { name: string } | null;
  onLogout: () => void;
}

export function Navigation({ activeTab, onTabChange, onRegisterClick, user, onLogout }: NavigationProps) {
  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-20">
          <div className="flex items-center space-x-12">
            <div className="flex-shrink-0 flex items-center">
              <Trophy className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Contests.kz</span>
            </div>
            <div className="flex space-x-8">
              <button
                onClick={() => onTabChange('home')}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                  activeTab === 'home'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5 mr-2" />
                Главная
              </button>
              <button
                onClick={() => onTabChange('contests')}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                  activeTab === 'contests'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Trophy className="w-5 h-5 mr-2" />
                Конкурсы
              </button>
              <button
                onClick={() => onTabChange('ideas')}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                  activeTab === 'ideas'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Lightbulb className="w-5 h-5 mr-2" />
                Идеи
              </button>
              <button
                onClick={() => onTabChange('contacts')}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                  activeTab === 'contacts'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Phone className="w-5 h-5 mr-2" />
                Контакты
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900 font-medium">{user.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center px-6 py-2 text-red-600 font-medium hover:text-red-700 transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Выйти
                </button>
              </>
            ) : (
              <>
                <button className="px-6 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200">
                  Войти
                </button>
                <button 
                  onClick={onRegisterClick}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors duration-200"
                >
                  Регистрация
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}