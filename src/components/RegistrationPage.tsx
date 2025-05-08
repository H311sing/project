import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface UserData {
  id: string;
  username: string;
  full_name: string;
  email: string;
}

interface RegistrationPageProps {
  onClose: () => void;
  onSuccess: (userData: UserData) => void;
}

export function RegistrationPage({ onClose, onSuccess }: RegistrationPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [isLoginView, setIsLoginView] = useState(false);

  // Анимация появления
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Таймер кулдауна
  useEffect(() => {
    if (cooldownTime <= 0) return;
    const timer = setInterval(() => {
      setCooldownTime(time => Math.max(0, time - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownTime]);

  // Валидация email
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Валидация пароля
  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return password.length >= minLength && hasUpperCase && hasNumber;
  };

  // Обработка регистрации
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Валидация
      if (!validateEmail(formData.email)) {
        throw new Error('Введите корректный email адрес');
      }

      if (!validatePassword(formData.password)) {
        throw new Error('Пароль должен содержать минимум 8 символов, 1 заглавную букву и 1 цифру');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Пароли не совпадают');
      }

      // Генерация username
      const username = formData.name.toLowerCase().replace(/\s+/g, '_');

      // Проверка существующего email
      const { data: existingEmail, error: emailError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', formData.email)
        .maybeSingle();

      if (emailError) throw emailError;
      if (existingEmail) {
        throw new Error('Пользователь с таким email уже существует');
      }

      // Проверка существующего username
      const { data: existingUsername, error: usernameError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (usernameError) throw usernameError;
      if (existingUsername) {
        throw new Error('Пользователь с таким именем уже существует. Попробуйте другое имя.');
      }

      // Регистрация в Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            username: username
          }
        }
      });

      if (authError) {
        if (authError.message.includes('rate_limit')) {
          setCooldownTime(30);
          throw new Error('Пожалуйста, подождите 30 секунд перед повторной попыткой');
        }
        throw authError;
      }

      // Создание профиля
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            username: username,
            full_name: formData.name,
            email: formData.email,
            updated_at: new Date().toISOString()
          });

        if (profileError) throw profileError;

        if (authData.session) {
          onSuccess({
            id: authData.user.id,
            username: username,
            full_name: formData.name,
            email: formData.email
          });
          toast.success('Регистрация успешна!');
        } else {
          toast.success('Проверьте ваш email для подтверждения регистрации!');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при регистрации');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработка входа
  const handleLogin = async () => {
    setLoginError('');
    setIsLoginLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      // Получаем данные профиля
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, full_name, email')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;
      if (!profile) throw new Error('Профиль пользователя не найден');

      onSuccess({
        id: profile.id,
        username: profile.username,
        full_name: profile.full_name,
        email: profile.email
      });
      toast.success('Вход выполнен успешно!');
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Ошибка при входе');
      console.error('Login error:', err);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const isButtonDisabled = isLoading || cooldownTime > 0;
  const buttonText = isLoading 
    ? 'Регистрация...' 
    : cooldownTime > 0 
      ? `Подождите ${cooldownTime} сек.` 
      : 'Зарегистрироваться';

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative transition-all duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-10'}`}>
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2"
          disabled={isLoading || isLoginLoading}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Назад</span>
        </button>

        <div className="text-center mb-8 mt-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLoginView ? 'Вход в аккаунт' : 'Регистрация'}
          </h2>
          <p className="text-gray-600">
            {isLoginView ? 'Войдите для участия в конкурсах' : 'Создайте аккаунт для участия в конкурсах'}
          </p>
        </div>

        {!isLoginView ? (
          <>
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Имя
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Введите ваше имя"
                    required
                    disabled={isButtonDisabled}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Введите ваш email"
                    required
                    disabled={isButtonDisabled}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Не менее 8 символов"
                    required
                    disabled={isButtonDisabled}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Минимум 8 символов, 1 заглавная буква и 1 цифра
                </p>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                  Подтвердите пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Повторите пароль"
                    required
                    disabled={isButtonDisabled}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isButtonDisabled}
                className={`w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-3 px-8 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center ${
                  isButtonDisabled ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-5 h-5" />
                    {buttonText}
                  </>
                ) : (
                  buttonText
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLoginView(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Уже есть аккаунт? Войти
              </button>
            </div>
          </>
        ) : (
          <>
            {loginError && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 text-sm">
                {loginError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loginEmail">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="loginEmail"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Введите ваш email"
                    required
                    disabled={isLoginLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loginPassword">
                  Пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="loginPassword"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Введите ваш пароль"
                    required
                    disabled={isLoginLoading}
                  />
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={isLoginLoading}
                className={`w-full bg-gray-800 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-gray-700 transition-all duration-300 flex items-center justify-center ${
                  isLoginLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoginLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-5 h-5" />
                    Вход...
                  </>
                ) : (
                  'Войти'
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLoginView(false)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Нет аккаунта? Зарегистрироваться
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}