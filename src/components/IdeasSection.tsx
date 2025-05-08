import React, { useState, useEffect } from 'react';
import { Lightbulb, ArrowRight, ThumbsUp, MessageCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface Idea {
  id: number;
  title: string;
  description: string;
  author: string;
  likes_count: number;
  comments_count: number;
  isLiked: boolean;
  user_id: string | null;
  created_at: string;
}

interface Comment {
  id: number;
  idea_id: number;
  content: string;
  author: string;
  created_at: string;
}

export function IdeasSection() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newIdea, setNewIdea] = useState({ title: '', description: '' });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiking, setIsLiking] = useState<Record<number, boolean>>({});

  // Проверка сессии и загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Проверяем текущую сессию
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        // Загружаем идеи из базы данных
        const { data, error } = await supabase
          .from('ideas')
          .select(`
            id,
            title,
            description,
            likes_count,
            comments_count,
            user_id,
            created_at,
            profiles:user_id (username),
            likes:likes (user_id)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Форматируем данные идей
        const formattedIdeas = data.map((idea: any) => ({
          id: idea.id,
          title: idea.title,
          description: idea.description,
          author: idea.profiles?.username || 'Аноним',
          likes_count: idea.likes_count || 0,
          comments_count: idea.comments_count || 0,
          isLiked: session?.user ? idea.likes.some((like: any) => like.user_id === session.user.id) : false,
          user_id: idea.user_id,
          created_at: idea.created_at
        }));

        setIdeas(formattedIdeas);
        
        // Сохраняем в localStorage
        localStorage.setItem('ideas', JSON.stringify(formattedIdeas));
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        
        // Пробуем загрузить из localStorage
        const savedIdeas = localStorage.getItem('ideas');
        if (savedIdeas) {
          setIdeas(JSON.parse(savedIdeas));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Подписываемся на изменения аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Обработчик лайков
  const handleLike = async (id: number) => {
    try {
      setIsLiking(prev => ({ ...prev, [id]: true }));

      if (!user) {
        toast.error('Войдите в систему, чтобы ставить лайки');
        return;
      }

      const idea = ideas.find(i => i.id === id);
      if (!idea) return;

      if (idea.isLiked) {
        // Удаляем лайк
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('idea_id', id);

        await supabase
          .from('ideas')
          .update({ likes_count: idea.likes_count - 1 })
          .eq('id', id);

        setIdeas(ideas.map(i => 
          i.id === id ? { 
            ...i, 
            likes_count: i.likes_count - 1, 
            isLiked: false 
          } : i
        ));
      } else {
        // Добавляем лайк
        await supabase
          .from('likes')
          .insert([{ user_id: user.id, idea_id: id }]);

        await supabase
          .from('ideas')
          .update({ likes_count: idea.likes_count + 1 })
          .eq('id', id);

        setIdeas(ideas.map(i => 
          i.id === id ? { 
            ...i, 
            likes_count: i.likes_count + 1, 
            isLiked: true 
          } : i
        ));
      }

      // Обновляем localStorage
      localStorage.setItem('ideas', JSON.stringify(ideas));
    } catch (error) {
      console.error('Ошибка лайка:', error);
      toast.error('Ошибка при обработке лайка');
    } finally {
      setIsLiking(prev => ({ ...prev, [id]: false }));
    }
  };

  // Открытие модалки комментариев
  const openCommentsModal = async (idea: Idea) => {
    setSelectedIdea(idea);
    setIsCommentModalOpen(true);
    
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles:user_id (username)
        `)
        .eq('idea_id', idea.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setComments(data.map((comment: any) => ({
        id: comment.id,
        idea_id: idea.id,
        content: comment.content,
        author: comment.profiles?.username || 'Аноним',
        created_at: comment.created_at
      })));
    } catch (error) {
      console.error('Ошибка загрузки комментариев:', error);
      toast.error('Ошибка загрузки комментариев');
    }
  };

  // Добавление комментария
  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedIdea) return;

    try {
      if (!user) {
        toast.error('Войдите, чтобы комментировать');
        return;
      }

      const { data, error } = await supabase
        .from('comments')
        .insert([{
          idea_id: selectedIdea.id,
          user_id: user.id,
          content: newComment
        }])
        .select();

      if (error) throw error;

      // Обновляем счетчик комментариев
      await supabase
        .from('ideas')
        .update({ comments_count: selectedIdea.comments_count + 1 })
        .eq('id', selectedIdea.id);

      // Добавляем комментарий
      setComments([...comments, {
        id: data[0].id,
        idea_id: selectedIdea.id,
        content: newComment,
        author: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Аноним',
        created_at: new Date().toISOString()
      }]);

      // Обновляем список идей
      setIdeas(ideas.map(idea => 
        idea.id === selectedIdea.id ? { 
          ...idea, 
          comments_count: idea.comments_count + 1 
        } : idea
      ));

      setNewComment('');
      toast.success('Комментарий добавлен');
    } catch (error) {
      console.error('Ошибка добавления комментария:', error);
      toast.error('Ошибка при добавлении комментария');
    }
  };

  // Создание новой идеи
  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newIdea.title || !newIdea.description) {
      toast.error('Заполните все поля');
      return;
    }

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const isAnonymous = !authUser;

      const { data, error } = await supabase.from('ideas').insert([
        {
          title: newIdea.title,
          description: newIdea.description,
          user_id: authUser?.id || null,
          likes_count: 0,
          comments_count: 0,
          created_at: new Date().toISOString()
        }
      ]).select();

      if (error) throw error;

      const newIdeaObj: Idea = {
        id: data[0].id,
        title: newIdea.title,
        description: newIdea.description,
        author: isAnonymous ? 'Аноним' : (authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'Аноним'),
        likes_count: 0,
        comments_count: 0,
        isLiked: false,
        user_id: authUser?.id || null,
        created_at: new Date().toISOString()
      };

      setIdeas([newIdeaObj, ...ideas]);
      setNewIdea({ title: '', description: '' });
      setIsModalOpen(false);
      toast.success('Идея добавлена!');
      
      // Обновляем localStorage
      localStorage.setItem('ideas', JSON.stringify([newIdeaObj, ...ideas]));
    } catch (error) {
      console.error('Ошибка:', error);
      toast.error('Ошибка при добавлении идеи');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <section className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Банк идей</h2>
          <p className="text-xl text-gray-600">Делитесь идеями и получайте обратную связь</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {ideas.map(idea => (
            <div key={idea.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Lightbulb className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{idea.title}</h3>
                  <p className="text-gray-500 text-sm">Автор: {idea.author}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 line-clamp-3">{idea.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <button 
                    onClick={() => handleLike(idea.id)}
                    disabled={isLiking[idea.id]}
                    className={`flex items-center ${idea.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    <ThumbsUp className="mr-1" />
                    <span>{idea.likes_count}</span>
                    {isLiking[idea.id] && <span className="ml-1">...</span>}
                  </button>
                  <button 
                    onClick={() => openCommentsModal(idea)}
                    className="flex items-center text-gray-500"
                  >
                    <MessageCircle className="mr-1" />
                    <span>{idea.comments_count}</span>
                  </button>
                </div>
                <button 
                  onClick={() => openCommentsModal(idea)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Добавить идею
          </button>
        </div>
      </div>

      {/* Модалка добавления идеи */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Новая идея</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmitIdea}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Название</label>
                <input
                  type="text"
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Описание</label>
                <textarea
                  value={newIdea.description}
                  onChange={(e) => setNewIdea({...newIdea, description: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows={4}
                  required
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Опубликовать
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Модалка комментариев */}
      {isCommentModalOpen && selectedIdea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{selectedIdea.title}</h3>
              <button onClick={() => setIsCommentModalOpen(false)}>
                <X className="text-gray-500" />
              </button>
            </div>
            <p className="text-gray-700 mb-6">{selectedIdea.description}</p>
            
            <div className="flex-grow overflow-y-auto mb-4">
              <h4 className="font-medium mb-2">Комментарии ({selectedIdea.comments_count})</h4>
              {comments.length > 0 ? (
                <div className="space-y-3">
                  {comments.map(comment => (
                    <div key={comment.id} className="border-b pb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-gray-500">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Нет комментариев</p>
              )}
            </div>
            
            <div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                placeholder="Ваш комментарий..."
                rows={2}
              ></textarea>
              <button
                onClick={handleAddComment}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}