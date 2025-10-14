"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Check, X, Trophy, RotateCcw } from "lucide-react";
import { apply, setAttr } from "@directus/visual-editing";

const DIRECTUS_URL = "http://luminar-edu.nl";

const LuminarLearningApp = () => {
  const [stage, setStage] = useState("language-select"); // language-select, test, results
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Fetch languages on mount
  useEffect(() => {
    fetchLanguages();
  }, []);

  // Apply Directus Visual Editing after DOM updates
  useEffect(() => {
    if (languages.length > 0) {
      (async () => {
        await apply({ directusUrl: DIRECTUS_URL });
      })();
    }
  }, [languages, words]);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${DIRECTUS_URL}/items/languages?filter[status][_eq]=published`
      );
      const data = await response.json();
      setLanguages(data.data || []);
    } catch (error) {
      console.error("Error fetching languages:", error);
      alert("Failed to load languages. Please check your Directus setup.");
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
      setStage("test");
    } catch (error) {
      console.error("Error fetching words:", error);
      alert("Failed to load words. Please check your Directus setup.");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setCurrentWordIndex(0);
    setAnswers([]);
    setUserAnswer("");
    fetchWords(language.id);
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;

    const currentWord = words[currentWordIndex];
    const isCorrect =
      userAnswer.trim().toLowerCase() === currentWord.translation.toLowerCase();

    setAnswers([...answers, { word: currentWord, userAnswer, isCorrect }]);
    setFeedback(isCorrect ? "correct" : "incorrect");

    setTimeout(() => {
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        setUserAnswer("");
        setFeedback(null);
      } else {
        setStage("results");
        setFeedback(null);
      }
    }, 1500);
  };

  const handleRestart = () => {
    setStage("language-select");
    setSelectedLanguage(null);
    setWords([]);
    setCurrentWordIndex(0);
    setUserAnswer("");
    setAnswers([]);
    setFeedback(null);
  };

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const incorrectCount = answers.length - correctCount;

  // Language Selection Screen
  if (stage === "language-select") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-16 h-16 text-indigo-600" />
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Luminar Learning
            </h1>
            <p className="text-xl text-gray-600">
              Choose a language to start learning!
            </p>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading languages...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {languages.map((language) => (
                <button
                  key={language.id}
                  onClick={() => handleLanguageSelect(language)}
                  className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <div className="text-4xl mb-4">🌐</div>
                  <h3
                    className="text-2xl font-bold text-gray-800 mb-2"
                    data-directus={setAttr({
                      collection: "languages",
                      item: language.id,
                      fields: "name",
                      mode: "popover",
                    })}
                  >
                    {language.name}
                  </h3>
                  <p className="text-gray-500 text-sm uppercase tracking-wide">
                    {language.code}
                  </p>
                </button>
              ))}
            </div>
          )}

          {!loading && languages.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-600 mb-4">
                No languages found. Please add languages in Directus.
              </p>
              <a
                href={`${DIRECTUS_URL}/admin`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Go to Directus Admin
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Test Screen
  if (stage === "test" && words.length > 0) {
    const currentWord = words[currentWordIndex];
    const progress = ((currentWordIndex + 1) / words.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedLanguage.name}
              </h2>
              <span className="text-gray-600">
                Question {currentWordIndex + 1} of {words.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <p className="text-gray-600 mb-4">Translate this word:</p>
              <h3
                className="text-5xl font-bold text-indigo-600 mb-8"
                data-directus={setAttr({
                  collection: "words",
                  item: currentWord.id,
                  fields: "word",
                  mode: "popover",
                })}
              >
                {currentWord.word}
              </h3>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmitAnswer()}
                placeholder="Type your answer..."
                disabled={feedback !== null}
                className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 transition-colors disabled:bg-gray-100"
              />

              {feedback && (
                <div
                  className={`p-4 rounded-lg flex items-center justify-center space-x-3 ${
                    feedback === "correct"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {feedback === "correct" ? (
                    <>
                      <Check className="w-6 h-6" />
                      <span className="font-semibold">Correct!</span>
                    </>
                  ) : (
                    <>
                      <X className="w-6 h-6" />
                      <span className="font-semibold">
                        Incorrect. The answer was: {currentWord.translation}
                      </span>
                    </>
                  )}
                </div>
              )}

              <button
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim() || feedback !== null}
                className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (stage === "results") {
    const percentage = Math.round((correctCount / answers.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Test Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You scored {percentage}% in {selectedLanguage.name}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <Check className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-green-600">{correctCount}</p>
                <p className="text-gray-600">Correct</p>
              </div>
              <div className="bg-red-50 rounded-lg p-6 text-center">
                <X className="w-12 h-12 text-red-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-red-600">{incorrectCount}</p>
                <p className="text-gray-600">Incorrect</p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Review Your Answers:
              </h3>
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg flex items-center justify-between ${
                    answer.isCorrect ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {answer.isCorrect ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-semibold text-gray-800">{answer.word.word}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">Your answer: {answer.userAnswer}</p>
                    {!answer.isCorrect && (
                      <p className="text-green-600 text-sm font-semibold">
                        Correct: {answer.word.translation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleRestart}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Try Another Language</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LuminarLearningApp;
