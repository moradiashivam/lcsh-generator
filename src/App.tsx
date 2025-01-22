import React, { useState, useEffect } from 'react';
import { Book, Loader2, AlertCircle, Key, Copy, Check, Moon, Sun } from 'lucide-react';
import { LCSHResponse, APIError } from './types';
import { ParticlesBackground } from './components/ParticlesBackground';

function App() {
  const [text, setText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [headings, setHeadings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const savedApiKey = localStorage.getItem('deepseekApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    localStorage.setItem('deepseekApiKey', newApiKey);
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const generateHeadings = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    if (!apiKey.trim()) {
      setError('Please enter your DeepSeek API key');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const messages = [
        {
          role: "system",
          content: "You are a Library of Congress Subject Headings (LCSH) expert. Your task is to analyze text and suggest relevant LCSH terms. Always respond with valid JSON."
        },
        {
          role: "user",
          content: `Analyze the following text and suggest the top 1-5 Library of Congress Subject Headings (LCSH) that best represent its content. Return ONLY a JSON object with a single key 'Library of Congress Subject Headings' containing an array of strings. Example format: {"Library of Congress Subject Headings": ["Heading 1", "Heading 2"]}

Text: ${text}`
        }
      ];

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages,
          temperature: 0.7,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate headings');
      }

      const responseData = await response.json();
      const content = responseData.choices[0].message.content.trim();
      
      let jsonContent;
      try {
        jsonContent = JSON.parse(content);
      } catch (e) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonContent = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid response format');
        }
      }

      if (!jsonContent['Library of Congress Subject Headings']) {
        throw new Error('Response missing required heading data');
      }

      setHeadings(jsonContent['Library of Congress Subject Headings']);
    } catch (err) {
      setError((err as APIError).message || 'An error occurred while generating headings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <ParticlesBackground isDarkMode={isDarkMode} />
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="relative mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient bg-[length:200%_200%] shadow-lg">
          <div className="absolute inset-0 bg-white/10 dark:bg-black/10 rounded-2xl backdrop-blur-sm"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 dark:bg-white/10 rounded-xl shadow-inner">
                <Book className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1 tracking-tight">
                  LCSH Generator
                </h1>
                <p className="text-blue-100 dark:text-blue-200 text-sm sm:text-base">
                  Generate Library of Congress Subject Headings with AI
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 rounded-xl bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 
                       transition-all duration-200 shadow-inner transform hover:scale-105"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-6 h-6 text-yellow-200" />
              ) : (
                <Moon className="w-6 h-6 text-blue-100" />
              )}
            </button>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 transition-all duration-200">
          <div className="mb-6">
            <label 
              htmlFor="apiKey" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              DeepSeek API Key
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={handleApiKeyChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                         placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                placeholder="Enter your DeepSeek API key"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 dark:text-gray-400 
                         hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <Key className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Your API key will be saved in your browser
            </p>
          </div>

          <div className="mb-6">
            <label 
              htmlFor="text" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Enter your text
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                       placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
              placeholder="Enter the text you want to analyze..."
            />
          </div>

          <button
            onClick={generateHeadings}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg
                     hover:from-blue-700 hover:via-purple-700 hover:to-pink-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center transition-all duration-200
                     transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Generating...
              </>
            ) : (
              'Generate LCSH'
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {headings.length > 0 && (
            <div className="mt-6 p-6 bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 
                          dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 
                          rounded-xl shadow-inner transition-all duration-200">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Book className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Generated Subject Headings
              </h2>
              <ul className="space-y-3">
                {headings.map((heading, index) => (
                  <li 
                    key={index}
                    className="relative group transform transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3 p-4 
                                  bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm 
                                  rounded-lg shadow-sm 
                                  border border-indigo-100/50 dark:border-indigo-500/20 
                                  transition-all duration-200 
                                  hover:shadow-md hover:bg-white/95 dark:hover:bg-gray-800/95">
                      <span className="flex-grow font-medium text-gray-800 dark:text-gray-200">
                        {heading}
                      </span>
                      <button
                        onClick={() => copyToClipboard(heading, index)}
                        className="flex items-center justify-center w-8 h-8 rounded-md 
                                 bg-gray-50 dark:bg-gray-700 
                                 hover:bg-gray-100 dark:hover:bg-gray-600 
                                 transition-all duration-200
                                 transform hover:scale-105"
                        title="Copy heading"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <footer className="mt-12 p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Developer</h3>
              <p className="text-gray-700 dark:text-gray-300">Shivam Vallabhbhai Moradia</p>
              <p className="text-gray-600 dark:text-gray-400">College Librarian</p>
              <p className="text-gray-600 dark:text-gray-400">St. Xavier's College (Autonomous) Ahmedabad</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Mentor</h3>
              <p className="text-gray-700 dark:text-gray-300">Dr. Meghna Vyas</p>
              <p className="text-gray-600 dark:text-gray-400">Associate Professor</p>
              <p className="text-gray-600 dark:text-gray-400">Sardar Patel University, Vallabhvidhyanagar</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} LCSH Generator. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;