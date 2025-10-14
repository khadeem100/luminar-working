"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Check, X, Trophy, RotateCcw } from 'lucide-react';

// Directus API configuration
const DIRECTUS_URL = 'https://luminar-edu.nl';

const LuminarLearningApp = () => {
  const [stage, setStage] = useState('language-select');
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);

  // Default settings fallback
  const defaultSettings = {
    site_title: "Luminar Learning",
    site_subtitle: "Select your language and start your journey",
    primary_color: "#3b82f6",
    secondary_color: "#a855f7",
    accent_color: "#ec4899",
    background_gradient_start: "#0f172a",
    background_gradient_middle: "#581c87",
    background_gradient_end: "#0f172a",
    language_selection_title: "Choose Your Language",
    test_instruction_text: "Translate this word",
    test_complete_title: "Test Complete!",
    correct_feedback_text: "Correct!",
    incorrect_feedback_text: "Incorrect",
    submit_button_text: "Submit Answer",
    restart_button_text: "Try Another Language",
    questions_per_test: 10,
    show_progress_bar: true,
    enable_animations: true,
    feedback_duration: 1500
  };

  const settings = siteSettings || defaultSettings;

  const customStyles = `
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fade-in 0.6s ease-out; }
    .animate-slide-up { animation: slide-up 0.6s ease-out forwards; opacity: 0; }
    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { 
      background: linear-gradient(to bottom, ${settings.primary_color}, ${settings.secondary_color}); 
      border-radius: 10px; 
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
      background: linear-gradient(to bottom, ${settings.primary_color}dd, ${settings.secondary_color}dd); 
    }
    :root {
      --primary: ${settings.primary_color};
      --secondary: ${settings.secondary_color};
      --accent: ${settings.accent_color};
    }
  `;

  useEffect(() => {
    fetchSiteSettings();
    fetchLanguages();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const response = await fetch(`${DIRECTUS_URL}/items/site_settings`);
      const data = await response.json();
      if (data.data) {
        setSiteSettings({ ...defaultSettings, ...data.data });
      }
    } catch (error) {
      console.error('Error fetching site settings:', error);
    }
  };

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${DIRECTUS_URL}/items/languages?filter[status][_eq]=published`);
      const data = await response.json();
      setLanguages(data.data || []);
    } catch (error) {
      console.error('Error fetching languages:', error);
      alert('Failed to load languages. Please check your Directus setup.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWords = async (languageId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${DIRECTUS_URL}/items/words?filter[language][_eq]=${languageId}&filter[status][_eq]=published&limit=${settings.questions_per_test}`
      );
      const data = await response.json();
      const shuffled = (data.data || []).sort(() => Math.random() - 0.5);
      setWords(shuffled);
      setStage('test');
    } catch (error) {
      console.error('Error fetching words:', error);
      alert('Failed to load words. Please check your Directus setup.');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setCurrentWordIndex(0);
    setAnswers([]);
    setUserAnswer('');
    fetchWords(language.id);
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;

    const currentWord = words[currentWordIndex];
    const isCorrect = userAnswer.trim().toLowerCase() === currentWord.translation.toLowerCase();

    setAnswers([...answers, { word: currentWord, userAnswer, isCorrect }]);
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    setTimeout(() => {
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        setUserAnswer('');
        setFeedback(null);
      } else {
        setStage('results');
        setFeedback(null);
      }
    }, settings.feedback_duration);
  };

  const handleRestart = () => {
    setStage('language-select');
    setSelectedLanguage(null);
    setWords([]);
    setCurrentWordIndex(0);
    setUserAnswer('');
    setAnswers([]);
    setFeedback(null);
  };

  const correctCount = answers.filter(a => a.isCorrect).length;
  const incorrectCount = answers.length - correctCount;

  const bgGradient = `linear-gradient(to bottom right, ${settings.background_gradient_start}, ${settings.background_gradient_middle}, ${settings.background_gradient_end})`;
  const textGradient = `linear-gradient(to right, ${settings.primary_color}, ${settings.secondary_color}, ${settings.accent_color})`;
  const buttonGradient = `linear-gradient(to right, ${settings.primary_color}, ${settings.secondary_color})`;

  if (stage === 'language-select') {
    return (
      <>
        <style>{customStyles}</style>
        <div className="min-h-screen p-4 sm:p-8" style={{ background: bgGradient }}>
          <div className="max-w-6xl mx-auto">
            <div className={`text-center mb-16 ${settings.enable_animations ? 'animate-fade-in' : ''}`}>
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div 
                    className="absolute inset-0 rounded-full blur-xl opacity-50"
                    style={{ background: buttonGradient, animation: settings.enable_animations ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none' }}
                  ></div>
                  <BookOpen className="w-20 h-20 text-white relative z-10" />
                </div>
              </div>
              <h1 
                className="text-6xl sm:text-7xl font-black mb-4 tracking-tight text-transparent bg-clip-text"
                style={{ backgroundImage: textGradient }}
              >
                {settings.site_title}
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 font-light">{settings.site_subtitle}</p>
            </div>

            {loading ? (
              <div className="text-center">
                <div className="relative inline-block">
                  <div 
                    className="rounded-full h-16 w-16 border-4 border-t-transparent"
                    style={{ 
                      borderColor: settings.secondary_color,
                      borderTopColor: 'transparent',
                      animation: 'spin 1s linear infinite'
                    }}
                  ></div>
                  <div 
                    className="absolute inset-0 rounded-full h-16 w-16 border-4 opacity-20"
                    style={{ 
                      borderColor: settings.secondary_color,
                      animation: settings.enable_animations ? 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none'
                    }}
                  ></div>
                </div>
                <p className="mt-6 text-gray-300 text-lg">Loading languages...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {languages.map((language, index) => (
                  <button
                    key={language.id}
                    onClick={() => handleLanguageSelect(language)}
                    style={{ 
                      animationDelay: settings.enable_animations ? `${index * 100}ms` : '0ms'
                    }}
                    className={`group relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/10 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 border border-white/10 shadow-xl ${settings.enable_animations ? 'animate-slide-up' : ''}`}
                  >
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(to bottom right, ${settings.primary_color}1a, ${settings.secondary_color}1a)` }}
                    ></div>
                    <div className="relative z-10">
                      <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🌐</div>
                      <h3 
                        className="text-3xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300"
                        style={{ backgroundImage: textGradient }}
                      >
                        {language.name}
                      </h3>
                      <p className="text-gray-400 text-sm uppercase tracking-widest font-semibold">{language.code}</p>
                    </div>
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                      style={{ background: buttonGradient }}
                    ></div>
                  </button>
                ))}
              </div>
            )}

            {!loading && languages.length === 0 && (
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
                <p className="text-gray-300 mb-4 text-lg">No languages found. Please add languages in Directus.</p>
                <a
                  href={`${DIRECTUS_URL}/admin`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                  style={{ background: buttonGradient }}
                >
                  Go to Directus Admin
                </a>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  if (stage === 'test' && words.length > 0) {
    const currentWord = words[currentWordIndex];
    const progress = ((currentWordIndex + 1) / words.length) * 100;

    return (
      <>
        <style>{customStyles}</style>
        <div className="min-h-screen p-4 sm:p-8" style={{ background: bgGradient }}>
          <div className="max-w-3xl mx-auto">
            {settings.show_progress_bar && (
              <div className="mb-8 backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <h2 
                    className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text"
                    style={{ backgroundImage: textGradient }}
                  >
                    {selectedLanguage.name}
                  </h2>
                  <span className="text-gray-300 font-semibold px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                    {currentWordIndex + 1} / {words.length}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-500 shadow-lg"
                    style={{ 
                      width: `${progress}%`,
                      background: `linear-gradient(to right, ${settings.primary_color}, ${settings.secondary_color}, ${settings.accent_color})`,
                      boxShadow: `0 0 20px ${settings.secondary_color}80`
                    }}
                  ></div>
                </div>
              </div>
            )}

            <div className="backdrop-blur-lg bg-white/5 rounded-3xl border border-white/10 p-8 sm:p-12 shadow-2xl">
              <div className="text-center mb-12">
                <p className="text-gray-400 mb-6 text-lg font-light tracking-wide">{settings.test_instruction_text}</p>
                <div className="relative inline-block">
                  <div 
                    className="absolute inset-0 rounded-2xl blur-2xl opacity-20"
                    style={{ 
                      background: buttonGradient,
                      animation: settings.enable_animations ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
                    }}
                  ></div>
                  <h3 className="text-5xl sm:text-7xl font-black text-white relative z-10 tracking-tight">
                    {currentWord.word}
                  </h3>
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                    placeholder="Type your answer..."
                    disabled={feedback !== null}
                    autoFocus
                    className="w-full px-8 py-6 text-xl sm:text-2xl bg-white/5 border-2 border-white/20 rounded-2xl focus:outline-none transition-all text-white placeholder-gray-400 disabled:bg-white/5 disabled:cursor-not-allowed backdrop-blur-sm font-medium"
                    style={{ borderColor: feedback ? (feedback === 'correct' ? '#4ade80' : '#f87171') : 'rgba(255,255,255,0.2)' }}
                    onFocus={(e) => e.target.style.borderColor = settings.secondary_color}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                  />
                </div>

                {feedback && (
                  <div
                    className={`p-6 rounded-2xl flex items-center justify-center space-x-4 backdrop-blur-lg border ${settings.enable_animations ? 'animate-fade-in' : ''} ${
                      feedback === 'correct'
                        ? 'bg-green-500/10 text-green-400 border-green-500/30'
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}
                  >
                    {feedback === 'correct' ? (
                      <>
                        <Check className="w-8 h-8" />
                        <span className="font-bold text-xl">{settings.correct_feedback_text}</span>
                      </>
                    ) : (
                      <>
                        <X className="w-8 h-8" />
                        <div>
                          <span className="font-bold text-xl block">{settings.incorrect_feedback_text}</span>
                          <span className="text-sm text-gray-300">The answer was: <span className="font-semibold text-green-400">{currentWord.translation}</span></span>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <button
                  onClick={handleSubmitAnswer}
                  disabled={!userAnswer.trim() || feedback !== null}
                  className="w-full text-white py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none shadow-lg disabled:opacity-50"
                  style={{ 
                    background: (!userAnswer.trim() || feedback !== null) ? '#4b5563' : buttonGradient,
                    boxShadow: (!userAnswer.trim() || feedback !== null) ? 'none' : `0 10px 30px ${settings.secondary_color}50`
                  }}
                >
                  {settings.submit_button_text}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (stage === 'results') {
    const percentage = Math.round((correctCount / answers.length) * 100);

    return (
      <>
        <style>{customStyles}</style>
        <div className="min-h-screen p-4 sm:p-8" style={{ background: bgGradient }}>
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-lg bg-white/5 rounded-3xl border border-white/10 p-8 sm:p-12 shadow-2xl">
              <div className={`text-center mb-12 ${settings.enable_animations ? 'animate-fade-in' : ''}`}>
                <div className="relative inline-block mb-6">
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-2xl opacity-30"
                    style={{ animation: settings.enable_animations ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none' }}
                  ></div>
                  <Trophy className="w-24 h-24 text-yellow-400 relative z-10" />
                </div>
                <h2 className="text-5xl sm:text-6xl font-black text-white mb-6 tracking-tight">{settings.test_complete_title}</h2>
                <p 
                  className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text"
                  style={{ backgroundImage: textGradient }}
                >
                  {percentage}% Score
                </p>
                <p className="text-gray-300 text-lg mt-2">in {selectedLanguage.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="backdrop-blur-lg bg-green-500/10 rounded-2xl p-8 text-center border border-green-500/30 transform hover:scale-105 transition-all">
                  <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <p className="text-5xl font-black text-green-400 mb-2">{correctCount}</p>
                  <p className="text-gray-300 text-lg font-semibold">Correct</p>
                </div>
                <div className="backdrop-blur-lg bg-red-500/10 rounded-2xl p-8 text-center border border-red-500/30 transform hover:scale-105 transition-all">
                  <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <p className="text-5xl font-black text-red-400 mb-2">{incorrectCount}</p>
                  <p className="text-gray-300 text-lg font-semibold">Incorrect</p>
                </div>
              </div>

              <div className="space-y-3 mb-10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span 
                    className="w-1 h-8 rounded-full mr-3"
                    style={{ background: `linear-gradient(to bottom, ${settings.primary_color}, ${settings.secondary_color})` }}
                  ></span>
                  Review Your Answers
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {answers.map((answer, index) => (
                    <div
                      key={index}
                      style={{ animationDelay: settings.enable_animations ? `${index * 50}ms` : '0ms' }}
                      className={`backdrop-blur-lg p-5 rounded-xl border ${settings.enable_animations ? 'animate-slide-up' : ''} ${
                        answer.isCorrect 
                          ? 'bg-green-500/5 border-green-500/30' 
                          : 'bg-red-500/5 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          {answer.isCorrect ? (
                            <Check className="w-6 h-6 text-green-400 flex-shrink-0" />
                          ) : (
                            <X className="w-6 h-6 text-red-400 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <span className="font-bold text-white text-lg block mb-1">{answer.word.word}</span>
                            <span className="text-gray-400 text-sm">Your answer: <span className={answer.isCorrect ? 'text-green-400' : 'text-red-400'}>{answer.userAnswer}</span></span>
                          </div>
                        </div>
                        {!answer.isCorrect && (
                          <div className="text-right">
                            <p className="text-green-400 font-bold text-sm">✓ {answer.word.translation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleRestart}
                className="w-full text-white py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg"
                style={{ 
                  background: buttonGradient,
                  boxShadow: `0 10px 30px ${settings.secondary_color}50`
                }}
              >
                <RotateCcw className="w-6 h-6" />
                <span>{settings.restart_button_text}</span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
};

export default LuminarLearningApp;
