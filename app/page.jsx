"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Check, X, Trophy, RotateCcw } from 'lucide-react';

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
  const [settings, setSettings] = useState(null);

  const defaultSettings = {
    site_title: "Luminar",
    site_subtitle: "luminar test",
    primary_color: "#3b82f6",
    secondary_color: "#a855f7",
    accent_color: "#ec4899",
    background_color_1: "#0f172a",
    background_color_2: "#581c87",
    background_color_3: "#0f172a",
    text_color: "#ffffff",
    subtitle_color: "#d1d5db",
    card_background_color: "rgba(255,255,255,0.05)",
    card_border_color: "rgba(255,255,255,0.1)",
    card_border_radius: "16px",
    card_padding: "32px",
    card_border_width: "1px",
    card_hover_scale: "1.05",
    card_shadow: "0 20px 50px rgba(0,0,0,0.3)",
    card_hover_shadow: "0 25px 60px rgba(168,85,247,0.2)",
    language_icon_size: "text-5xl",
    language_name_color: "#ffffff",
    language_code_color: "#9ca3af",
    max_width: "max-w-6xl",
    padding: "p-8",
    gap_between_cards: "gap-6",
    header_margin_bottom: "mb-16",
    enable_animations: true,
    card_animation_delay: 100,
    hover_transition_duration: "300ms",
    button_border_radius: "rounded-2xl",
    questions_per_test: 10,
    font_family: "Inter",
    title_font_size: "text-6xl",
    subtitle_font_size: "text-xl",
    question_text_size: "text-7xl",
    instruction_text: "Translate this word",
    input_border_radius: "rounded-2xl",
    input_padding: "px-8 py-6",
    input_text_size: "text-2xl",
    correct_color: "#4ade80",
    incorrect_color: "#f87171",
    feedback_duration: 1500,
    show_progress_bar: true,
    trophy_icon_color: "#fbbf24",
    test_complete_title: "Test Complete!",
    restart_button_text: "Try Another Language"
  };

  const s = settings || defaultSettings;

  useEffect(() => {
    fetchSettings();
    fetchLanguages();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${DIRECTUS_URL}/items/site_settings`);
      const data = await response.json();
      if (data.data) {
        setSettings({ ...defaultSettings, ...data.data });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${DIRECTUS_URL}/items/languages?filter[status][_eq]=published&sort=sort_order`);
      const data = await response.json();
      setLanguages(data.data || []);
    } catch (error) {
      console.error('Error fetching languages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWords = async (languageId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${DIRECTUS_URL}/items/words?filter[language][_eq]=${languageId}&filter[status][_eq]=published&limit=${s.questions_per_test}`
      );
      const data = await response.json();
      const shuffled = (data.data || []).sort(() => Math.random() - 0.5);
      setWords(shuffled);
      setStage('test');
    } catch (error) {
      console.error('Error fetching words:', error);
      alert('Failed to load words.');
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
    }, s.feedback_duration);
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

  const bgGradient = `linear-gradient(to bottom right, ${s.background_color_1}, ${s.background_color_2}, ${s.background_color_3})`;

  const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&family=Poppins:wght@300;400;600;700;800;900&display=swap');
    
    * { font-family: '${s.font_family}', sans-serif; }
    
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
      background: linear-gradient(to bottom, ${s.primary_color}, ${s.secondary_color}); 
      border-radius: 10px; 
    }
  `;

  if (stage === 'language-select') {
    return (
      <>
        <style>{customStyles}</style>
        <div className={`min-h-screen ${s.padding}`} style={{ background: bgGradient }}>
          <div className={`${s.max_width} mx-auto`}>
            <div className={`text-center ${s.header_margin_bottom} ${s.enable_animations ? 'animate-fade-in' : ''}`}>
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div 
                    className="absolute inset-0 rounded-full blur-xl opacity-50"
                    style={{ 
                      background: `linear-gradient(to right, ${s.primary_color}, ${s.secondary_color})`,
                      animation: s.enable_animations ? 'pulse 2s infinite' : 'none'
                    }}
                  ></div>
                  <BookOpen className="w-20 h-20 relative z-10" style={{ color: s.text_color }} />
                </div>
              </div>
              <h1 
                className={`${s.title_font_size} sm:text-7xl font-black mb-4 tracking-tight`}
                style={{ color: s.text_color }}
              >
                {s.site_title}
              </h1>
              <p className={`${s.subtitle_font_size} sm:text-2xl font-light`} style={{ color: s.subtitle_color }}>
                {s.site_subtitle}
              </p>
            </div>

            {loading ? (
              <div className="text-center">
                <div className="relative inline-block">
                  <div 
                    className="rounded-full h-16 w-16 border-4 border-t-transparent animate-spin"
                    style={{ borderColor: s.secondary_color }}
                  ></div>
                </div>
                <p className="mt-6 text-lg" style={{ color: s.subtitle_color }}>Loading languages...</p>
              </div>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${s.gap_between_cards}`}>
                {languages.map((language, index) => (
                  <button
                    key={language.id}
                    onClick={() => handleLanguageSelect(language)}
                    style={{ 
                      animationDelay: s.enable_animations ? `${index * s.card_animation_delay}ms` : '0ms',
                      backgroundColor: s.card_background_color,
                      borderColor: s.card_border_color,
                      borderWidth: s.card_border_width,
                      borderRadius: s.card_border_radius,
                      padding: s.card_padding,
                      boxShadow: s.card_shadow,
                      transitionDuration: s.hover_transition_duration,
                    }}
                    className={`group relative backdrop-blur-lg border transform transition-all ${s.enable_animations ? 'animate-slide-up' : ''}`}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = `scale(${s.card_hover_scale}) translateY(-8px)`;
                      e.currentTarget.style.boxShadow = s.card_hover_shadow;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1) translateY(0)';
                      e.currentTarget.style.boxShadow = s.card_shadow;
                    }}
                  >
                    <div className="relative z-10">
                      <div className={`${s.language_icon_size} mb-6 transition-transform duration-300 group-hover:scale-110`}>
                        🌐
                      </div>
                      <h3 
                        className="text-3xl font-bold mb-2"
                        style={{ color: s.language_name_color }}
                      >
                        {language.name}
                      </h3>
                      <p className="text-sm uppercase tracking-widest font-semibold" style={{ color: s.language_code_color }}>
                        {language.code}
                      </p>
                    </div>
                  </button>
                ))}
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
            {s.show_progress_bar && (
              <div className="mb-8 backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-3xl font-bold" style={{ color: s.text_color }}>
                    {selectedLanguage.name}
                  </h2>
                  <span className="font-semibold px-4 py-2 bg-white/5 rounded-lg border border-white/10" style={{ color: s.text_color }}>
                    {currentWordIndex + 1} / {words.length}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${progress}%`,
                      background: `linear-gradient(to right, ${s.primary_color}, ${s.secondary_color})`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            <div className="backdrop-blur-lg border border-white/10 shadow-2xl p-12 rounded-3xl bg-white/5">
              <div className="text-center mb-12">
                <p className="mb-6 text-lg font-light tracking-wide" style={{ color: s.subtitle_color }}>
                  {s.instruction_text}
                </p>
                <div className="relative inline-block">
                  <h3 className={`${s.question_text_size} font-black tracking-tight`} style={{ color: s.text_color }}>
                    {currentWord.word}
                  </h3>
                </div>
              </div>

              <div className="space-y-6">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                  placeholder="Type your answer..."
                  disabled={feedback !== null}
                  autoFocus
                  className={`w-full ${s.input_padding} ${s.input_text_size} ${s.input_border_radius} focus:outline-none transition-all placeholder-gray-400 disabled:cursor-not-allowed backdrop-blur-sm font-medium bg-white/5`}
                  style={{ 
                    borderWidth: '2px',
                    borderColor: feedback ? (feedback === 'correct' ? s.correct_color : s.incorrect_color) : 'rgba(255,255,255,0.2)',
                    color: s.text_color
                  }}
                />

                {feedback && (
                  <div
                    className={`p-6 ${s.button_border_radius} flex items-center justify-center space-x-4 backdrop-blur-lg border ${s.enable_animations ? 'animate-fade-in' : ''}`}
                    style={{
                      backgroundColor: feedback === 'correct' ? `${s.correct_color}1a` : `${s.incorrect_color}1a`,
                      borderColor: feedback === 'correct' ? `${s.correct_color}4d` : `${s.incorrect_color}4d`,
                      color: feedback === 'correct' ? s.correct_color : s.incorrect_color
                    }}
                  >
                    {feedback === 'correct' ? (
                      <>
                        <Check className="w-8 h-8" />
                        <span className="font-bold text-xl">Correct!</span>
                      </>
                    ) : (
                      <>
                        <X className="w-8 h-8" />
                        <div>
                          <span className="font-bold text-xl block">Incorrect</span>
                          <span className="text-sm" style={{ color: s.subtitle_color }}>
                            The answer was: <span style={{ color: s.correct_color }}>{currentWord.translation}</span>
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <button
                  onClick={handleSubmitAnswer}
                  disabled={!userAnswer.trim() || feedback !== null}
                  className={`w-full py-5 ${s.button_border_radius} font-bold text-xl transition-all transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50`}
                  style={{ 
                    background: (!userAnswer.trim() || feedback !== null) ? '#4b5563' : `linear-gradient(to right, ${s.primary_color}, ${s.secondary_color})`,
                    color: s.text_color
                  }}
                >
                  Submit Answer
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
              <div className={`text-center mb-12 ${s.enable_animations ? 'animate-fade-in' : ''}`}>
                <Trophy className="w-24 h-24 mx-auto mb-6" style={{ color: s.trophy_icon_color }} />
                <h2 className="text-6xl font-black mb-6 tracking-tight" style={{ color: s.text_color }}>
                  {s.test_complete_title}
                </h2>
                <p className="text-3xl font-bold" style={{ color: s.primary_color }}>
                  {percentage}% Score
                </p>
                <p className="text-lg mt-2" style={{ color: s.subtitle_color }}>in {selectedLanguage.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <div 
                  className="backdrop-blur-lg rounded-2xl p-8 text-center border transform hover:scale-105 transition-all"
                  style={{ backgroundColor: `${s.correct_color}1a`, borderColor: `${s.correct_color}4d` }}
                >
                  <Check className="w-16 h-16 mx-auto mb-4" style={{ color: s.correct_color }} />
                  <p className="text-5xl font-black mb-2" style={{ color: s.correct_color }}>{correctCount}</p>
                  <p className="text-lg font-semibold" style={{ color: s.subtitle_color }}>Correct</p>
                </div>
                <div 
                  className="backdrop-blur-lg rounded-2xl p-8 text-center border transform hover:scale-105 transition-all"
                  style={{ backgroundColor: `${s.incorrect_color}1a`, borderColor: `${s.incorrect_color}4d` }}
                >
                  <X className="w-16 h-16 mx-auto mb-4" style={{ color: s.incorrect_color }} />
                  <p className="text-5xl font-black mb-2" style={{ color: s.incorrect_color }}>{incorrectCount}</p>
                  <p className="text-lg font-semibold" style={{ color: s.subtitle_color }}>Incorrect</p>
                </div>
              </div>

              <div className="space-y-3 mb-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center" style={{ color: s.text_color }}>
                  <span 
                    className="w-1 h-8 rounded-full mr-3"
                    style={{ background: `linear-gradient(to bottom, ${s.primary_color}, ${s.secondary_color})` }}
                  ></span>
                  Review Your Answers
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {answers.map((answer, index) => (
                    <div
                      key={index}
                      style={{ animationDelay: s.enable_animations ? `${index * 50}ms` : '0ms' }}
                      className={`backdrop-blur-lg p-5 rounded-xl border ${s.enable_animations ? 'animate-slide-up' : ''}`}
                      style={{
                        backgroundColor: answer.isCorrect ? `${s.correct_color}0d` : `${s.incorrect_color}0d`,
                        borderColor: answer.isCorrect ? `${s.correct_color}4d` : `${s.incorrect_color}4d`
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          {answer.isCorrect ? (
                            <Check className="w-6 h-6 flex-shrink-0" style={{ color: s.correct_color }} />
                          ) : (
                            <X className="w-6 h-6 flex-shrink-0" style={{ color: s.incorrect_color }} />
                          )}
                          <div className="flex-1">
                            <span className="font-bold text-lg block mb-1" style={{ color: s.text_color }}>
                              {answer.word.word}
                            </span>
                            <span className="text-sm" style={{ color: s.subtitle_color }}>
                              Your answer: <span style={{ color: answer.isCorrect ? s.correct_color : s.incorrect_color }}>
                                {answer.userAnswer}
                              </span>
                            </span>
                          </div>
                        </div>
                        {!answer.isCorrect && (
                          <div className="text-right">
                            <p className="font-bold text-sm" style={{ color: s.correct_color }}>
                              ✓ {answer.word.translation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleRestart}
                className={`w-full py-5 ${s.button_border_radius} font-bold text-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg`}
                style={{ 
                  background: `linear-gradient(to right, ${s.primary_color}, ${s.secondary_color})`,
                  color: s.text_color
                }}
              >
                <RotateCcw className="w-6 h-6" />
                <span>{s.restart_button_text}</span>
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
