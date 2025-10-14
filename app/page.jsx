"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Check, X, Trophy, RotateCcw } from 'lucide-react';

// Directus API configuration
const DIRECTUS_URL = 'http://luminar-edu.nl';

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
    .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #3b82f6, #a855f7); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #2563eb, #9333ea); }
  `;

  useEffect(() => {
    fetchLanguages();
  }, []);

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
        `${DIRECTUS_URL}/items/words?filter[language][_eq]=${languageId}&filter[status][_eq]=published&limit=10`
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
    }, 1500);
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

  if (stage === 'language-select') {
    return (
      <>
        <style>{customStyles}</style>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <BookOpen className="w-20 h-20 text-white relative z-10" />
                </div>
              </div>
              <h1 className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 tracking-tight">
                Luminar Learning
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 font-light">Select your language and start your journey</p>
            </div>

            {loading ? (
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
                  <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-purple-500 opacity-20"></div>
                </div>
                <p className="mt-6 text-gray-300 text-lg">Loading languages...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {languages.map((language, index) => (
                  <button
                    key={language.id}
                    onClick={() => handleLanguageSelect(language)}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/10 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 border border-white/10 hover:border-purple-500/50 shadow-xl hover:shadow-purple-500/20 animate-slide-up"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🌐</div>
                      <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                        {language.name}
                      </h3>
                      <p className="text-gray-400 text-sm uppercase tracking-widest font-semibold">{language.code}</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
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
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {selectedLanguage.name}
                </h2>
                <span className="text-gray-300 font-semibold px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                  {currentWordIndex + 1} / {words.length}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 shadow-lg shadow-purple-500/50"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="backdrop-blur-lg bg-white/5 rounded-3xl border border-white/10 p-8 sm:p-12 shadow-2xl">
              <div className="text-center mb-12">
                <p className="text-gray-400 mb-6 text-lg font-light tracking-wide">Translate this word</p>
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
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
                    className="w-full px-8 py-6 text-xl sm:text-2xl bg-white/5 border-2 border-white/20 rounded-2xl focus:outline-none focus:border-purple-500 transition-all text-white placeholder-gray-400 disabled:bg-white/5 disabled:cursor-not-allowed backdrop-blur-sm font-medium"
                  />
                </div>

                {feedback && (
                  <div
                    className={`p-6 rounded-2xl flex items-center justify-center space-x-4 backdrop-blur-lg animate-fade-in border ${
                      feedback === 'correct'
                        ? 'bg-green-500/10 text-green-400 border-green-500/30'
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}
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
                          <span className="text-sm text-gray-300">The answer was: <span className="font-semibold text-green-400">{currentWord.translation}</span></span>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <button
                  onClick={handleSubmitAnswer}
                  disabled={!userAnswer.trim() || feedback !== null}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-5 rounded-2xl font-bold text-xl hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-purple-500/50 disabled:opacity-50"
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-lg bg-white/5 rounded-3xl border border-white/10 p-8 sm:p-12 shadow-2xl">
              <div className="text-center mb-12 animate-fade-in">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                  <Trophy className="w-24 h-24 text-yellow-400 relative z-10" />
                </div>
                <h2 className="text-5xl sm:text-6xl font-black text-white mb-6 tracking-tight">Test Complete!</h2>
                <p className="text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold">
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
                  <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></span>
                  Review Your Answers
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {answers.map((answer, index) => (
                    <div
                      key={index}
                      style={{ animationDelay: `${index * 50}ms` }}
                      className={`backdrop-blur-lg p-5 rounded-xl border animate-slide-up ${
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
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-5 rounded-2xl font-bold text-xl hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/50"
              >
                <RotateCcw className="w-6 h-6" />
                <span>Try Another Language</span>
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
