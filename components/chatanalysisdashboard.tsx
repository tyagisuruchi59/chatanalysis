import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

const ChatAnalysisDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [file, setFile] = useState(null);
  const [languageViewMode, setLanguageViewMode] = useState('table');
  const [chatData, setChatData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  const analyzeFile = (fileContent) => {
    const lines = fileContent.split('\n');
    const analysis = {
      totalMessages: 0,
      messageTypes: {
        text: 0,
        links: 0,
        images: 0,
        gifs: 0,
        videos: 0,
        stickers: 0,
        audioFiles: 0,
        documents: 0,
        otherFiles: 0
      },
      editedMessages: 0,
      messagesByDate: {},
      sentimentData: [],
      languageStats: {},
      emojiCounts: {},
      wordCounts: {},  // Add a word count property
      timeline: []
    };

    // Process each line
    lines.forEach(line => {
      if (!line.trim()) return;

      analysis.totalMessages++;

      // Detect message types
      if (line.includes('http')) analysis.messageTypes.links++;
      if (line.includes('.jpg') || line.includes('.png')) analysis.messageTypes.images++;
      if (line.includes('.gif')) analysis.messageTypes.gifs++;
      if (line.includes('.mp4') || line.includes('.mov')) analysis.messageTypes.videos++;
      if (line.includes('.mp3') || line.includes('.wav')) analysis.messageTypes.audioFiles++;
      if (line.includes('.pdf') || line.includes('.doc')) analysis.messageTypes.documents++;

      // Count edited messages
      if (line.includes('(edited)')) analysis.editedMessages++;

      // Extract emojis
      const emojiRegex = /[\u{1F300}-\u{1F9FF}]/gu;
      const emojis = line.match(emojiRegex) || [];
      emojis.forEach(emoji => {
        analysis.emojiCounts[emoji] = (analysis.emojiCounts[emoji] || 0) + 1;
      });

      // Word Frequency Analysis
      const words = line
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
        .split(/\s+/); // Split by spaces
      words.forEach(word => {
        if (word) {
          analysis.wordCounts[word] = (analysis.wordCounts[word] || 0) + 1;
        }
      });

      // Sentiment Analysis
      const positiveWords = ['happy', 'great', 'good', 'love', '😊', '👍'];
      const negativeWords = ['sad', 'bad', 'hate', 'awful', '😢', '👎'];

      const sentiment = positiveWords.some(word => line.toLowerCase().includes(word)) ? 1 :
        negativeWords.some(word => line.toLowerCase().includes(word)) ? -1 : 0;

      analysis.sentimentData.push(sentiment);
    });

    // Calculate message timeline (simplified for demo)
    const timelineData = [
      { month: 'Jan', messages: Math.floor(analysis.totalMessages * 0.1) },
      { month: 'Feb', messages: Math.floor(analysis.totalMessages * 0.15) },
      { month: 'Mar', messages: Math.floor(analysis.totalMessages * 0.2) },
      { month: 'Apr', messages: Math.floor(analysis.totalMessages * 0.12) },
      { month: 'May', messages: Math.floor(analysis.totalMessages * 0.18) },
      { month: 'Jun', messages: Math.floor(analysis.totalMessages * 0.25) },
    ];
    return {
      ...analysis,
      timelineData,
      avgMessagesPerDay: (analysis.totalMessages / 30).toFixed(2),
      longestInactivePeriod: "calculating...",
      longestConversation: "calculating...",
      mostActive: {
        year: new Date().getFullYear().toString(),
        month: new Date().toLocaleString('default', { month: 'long' }),
        day: new Date().toLocaleDateString(),
        hour: new Date().toLocaleTimeString()
      }
    };
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const analysisResults = analyzeFile(content);
      setChatData(analysisResults);
      setLoading(false);
    };
    reader.readAsText(selectedFile);
  };

  // Chart colors
  const COLORS = ['#60A5FA', '#34D399', '#F87171', '#FBBF24', '#A78BFA'];

  const renderOverviewSection = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Upload Chat Data</h3>
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".txt,.csv,.json"
          className="mt-2 border border-gray-700 rounded-lg p-2 w-full bg-gray-700 text-gray-100"
        />
        {file && (
          <p className="text-sm text-gray-400 mt-2">
            Uploaded File: {file.name}
          </p>
        )}
        {loading && (
          <p className="text-sm text-blue-400 mt-2">
            Analyzing file content...
          </p>
        )}
      </div>

      {chatData && (
        <>
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Message Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p>Total messages: {chatData.totalMessages.toLocaleString()}</p>
                <p>✏️ Text messages: {chatData.messageTypes.text.toLocaleString()}</p>
                <p>🔗 With links: {chatData.messageTypes.links.toLocaleString()}</p>
                <p>📷 With images: {chatData.messageTypes.images.toLocaleString()}</p>
                <p>👾 With GIFs: {chatData.messageTypes.gifs.toLocaleString()}</p>
                <p>Edited messages: {chatData.editedMessages.toLocaleString()}</p>
                <p>Average messages per day: {chatData.avgMessagesPerDay}</p>
                <p>Most active month: {chatData.mostActive.month}</p>
                <p>Most active day: {chatData.mostActive.day}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Messages Over Time</h3>
            <div className="h-64">
              <LineChart width={800} height={240} data={chatData.timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Line
                  type="monotone"
                  dataKey="messages"
                  stroke="#60A5FA"
                  strokeWidth={2}
                />
              </LineChart>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderSentimentSection = () => {
    if (!chatData) {
      return (
        <div className="text-center text-gray-400 mt-10">
          Please upload a file to view sentiment analysis
        </div>
      );
    }
  
    // Calculate sentiment counts
    const positiveCount = chatData.sentimentData.filter(s => s > 0).length;
    const negativeCount = chatData.sentimentData.filter(s => s < 0).length;
    const neutralCount = chatData.sentimentData.filter(s => s === 0).length;
    const total = chatData.sentimentData.length;
  
    // Prepare monthly sentiment data
    const monthlySentiment = chatData.timelineData.map(item => ({
      month: item.month,
      positive: Math.floor(item.messages * 0.3),
      negative: Math.floor(item.messages * -0.2),
    }));
  
    // Colors for the charts
    const COLORS = ['#22c55e', '#ef4444', '#06b6d4'];
  
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Sentiment Analysis</h2>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sentiment Overview Card */}
          <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Sentiment Overview</h3>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Positive messages</span>
                <span className="text-green-500">{positiveCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Negative messages</span>
                <span className="text-red-500">{negativeCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Neutral messages</span>
                <span className="text-cyan-500">{neutralCount.toLocaleString()}</span>
              </div>
            </div>
  
            <div className="h-64">
              <PieChart width={450} height={450}>
                <Pie
                  data={[
                    { name: 'Positive', value: positiveCount, percentage: ((positiveCount/total)*100).toFixed(1) },
                    { name: 'Negative', value: negativeCount, percentage: ((negativeCount/total)*100).toFixed(1) },
                    { name: 'Neutral', value: neutralCount, percentage: ((neutralCount/total)*100).toFixed(1) }
                  ]}
                  cx="30%"
                  cy="30%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', border: 'black' }}
                  formatter={(value) => value.toLocaleString()}
                />
              </PieChart>
            </div>
          </div>
  
          {/* Sentiment Over Time Chart */}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Sentiment over time</h3>
            <div className="h-[400px]">
              <BarChart
                width={700}
                height={400}
                data={monthlySentiment}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  axisLine={{ stroke: '#4B5563' }}
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  axisLine={{ stroke: '#4B5563' }}
                  tick={{ fill: '#9CA3AF' }}
                  ticks={[-30, -20, -10, 0, 10, 20, 30, 40, 50]}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Bar dataKey="positive" fill="#22c55e" />
                <Bar dataKey="negative" fill="#ef4444" />
              </BarChart>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLanguageSection = () => {
    if (!chatData) {
      return (
        <div className="text-center text-gray-400 mt-10">
          Please upload a file to view language analysis
        </div>
      );
    }

    // Calculate language statistics
    const totalWords = Object.values(chatData.wordCounts).reduce((a, b) => a + b, 0);
    const uniqueWords = Object.keys(chatData.wordCounts).length;
    const avgWordsPerMessage = (totalWords / chatData.totalMessages).toFixed(2);

    const TableView = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Statistics */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Language Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total words used</span>
              <span>{totalWords.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Unique words used</span>
              <span>{uniqueWords.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Average words per message</span>
              <span>{avgWordsPerMessage}</span>
            </div>
            <div className="flex justify-between">
              <span>Languages used</span>
              <span>English</span>
            </div>
            <div className="flex justify-between">
              <span>Unreliable to detect</span>
              <span>{Math.floor(totalWords * 0.1).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Word Frequency Table */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Most Used Words</h3>
          <div className="space-y-2">
            {Object.entries(chatData.wordCounts)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([word, count], index) => (
                <div key={word} className="flex justify-between items-center">
                  <span className="text-gray-300">#{index + 1} {word}</span>
                  <span className="text-gray-400">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    );

    const WordCloudView = () => {
      // Prepare data for visualization
      const wordCloudData = Object.entries(chatData.wordCounts)
        .map(([text, value]) => ({
          name: text,
          value,
          fill: `hsl(${Math.random() * 360}, 70%, 50%)`
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 20);

      return (
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="h-[500px] w-full">
            <PieChart width={800} height={500}>
              <Pie
                data={wordCloudData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={200}
                labelLine={false}
                label={({ name, value }) => `${name} (${value})`}
              >
                {wordCloudData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                itemStyle={{ color: '#9CA3AF' }}
              />
            </PieChart>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        {/* View Toggle */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Language Analysis</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setLanguageViewMode('table')}
              className={`px-4 py-2 rounded-lg ${
                languageViewMode === 'table'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setLanguageViewMode('wordcloud')}
              className={`px-4 py-2 rounded-lg ${
                languageViewMode === 'wordcloud'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Word Cloud
            </button>
          </div>
        </div>

        {/* Content */}
        {languageViewMode === 'table' ? <TableView /> : <WordCloudView />}
      </div>
    );
  };


  const renderEmojiSection = () => (
    chatData ? (
      <div>
        <h2 className="text-2xl font-bold mb-4">Emoji Analysis</h2>
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Most Used Emojis</h3>
              <div className="space-y-2">
                {Object.entries(chatData.emojiCounts)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([emoji, count]) => (
                    <div key={emoji} className="flex justify-between items-center">
                      <span className="text-2xl">{emoji}</span>
                      <span>{count}</span>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Emoji Usage Over Time</h3>
              {/* Add emoji usage timeline here */}
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center text-gray-400 mt-10">
        Please upload a file to view emoji analysis
      </div>
    )
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-900">
      {/* Main Content */}
      <div className="bg-gray-900 flex-grow h-full overflow-auto text-gray-100">
        {/* Header Section */}
        <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Chat Analysis Dashboard</h2>
          <div className="flex space-x-2">
            {['overview', 'sentiment', 'language', 'emoji'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-red-400 hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="p-8 h-full">
          {activeTab === 'overview' && renderOverviewSection()}
          {activeTab === 'sentiment' && renderSentimentSection()}
          {activeTab === 'language' && renderLanguageSection()}
          {activeTab === 'emoji' && renderEmojiSection()}
        </div>
      </div>
    </div>
  );
};

export default ChatAnalysisDashboard;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
// import { BarChart, Bar } from 'recharts';
// import { PieChart, Pie, Cell } from 'recharts';

// const API_BASE_URL = 'http://localhost:5000';

// const ChatAnalysisDashboard = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('overview');
//   const [file, setFile] = useState(null);
//   const [languageViewMode, setLanguageViewMode] = useState('table');
//   const [chatData, setChatData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleLogout = () => {
//     navigate('/');
//   };

//   const analyzeChatData = async (messages) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/analyze`, { messages });
//       return response.data;
//     } catch (error) {
//       console.error('Error analyzing chat data:', error);
//       throw error;
//     }
//   };

//   const analyzeFile = (fileContent) => {
//     const lines = fileContent.split('\n');
//     const analysis = {
//       totalMessages: 0,
//       messageTypes: {
//         text: 0,
//         links: 0,
//         images: 0,
//         gifs: 0,
//         videos: 0,
//         stickers: 0,
//         audioFiles: 0,
//         documents: 0,
//         otherFiles: 0
//       },
//       editedMessages: 0,
//       messagesByDate: {},
//       sentimentData: [],
//       languageStats: {},
//       emojiCounts: {},
//       wordCounts: {},
//       timeline: []
//     };

//     // Existing file analysis logic remains the same
//     lines.forEach(line => {
//       // ... (previous implementation)
//     });

//     return analysis;
//   };

//   const handleFileUpload = async (event) => {
//     const selectedFile = event.target.files?.[0];
//     if (!selectedFile) return;

//     setFile(selectedFile);
//     setLoading(true);

//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       const content = e.target.result;
//       const lines = content.split('\n').filter(line => line.trim() !== '');

//       try {
//         const apiResults = await analyzeChatData(lines);
//         const fileAnalysis = analyzeFile(content);

//         const combinedResults = {
//           ...fileAnalysis,
//           apiSentiments: {
//             sentiment: apiResults.sentiment,
//             sentimentCounts: apiResults.sentimentCounts
//           }
//         };

//         setChatData(combinedResults);
//       } catch (error) {
//         console.error('Analysis error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     reader.readAsText(selectedFile);
//   };

//   // Render methods (Overview, Sentiment, Language, Emoji) remain largely the same
//   // Key modifications would be in sentiment rendering to use apiSentiments

//   const renderSentimentSection = () => {
//     if (!chatData) {
//       return (
//         <div className="text-center text-gray-400 mt-10">
//           Please upload a file to view sentiment analysis
//         </div>
//       );
//     }

//     const sentimentData = chatData.apiSentiments?.sentimentCounts || {
//       positive: 0,
//       negative: 0,
//       neutral: 0
//     };

//     const total = sentimentData.positive + sentimentData.negative + sentimentData.neutral;

//     // Rest of the rendering logic remains similar to previous implementation
//     return (
//       <div className="space-y-6">
//         {/* Sentiment overview and charts */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold">Sentiment Analysis</h2>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg">
//             <h3 className="text-lg font-semibold mb-4">Sentiment Overview</h3>
//             <div className="space-y-2 mb-6">
//               <div className="flex justify-between">
//                 <span>Positive messages</span>
//                 <span className="text-green-500">
//                   {sentimentData.positive.toLocaleString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Negative messages</span>
//                 <span className="text-red-500">
//                   {sentimentData.negative.toLocaleString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Neutral messages</span>
//                 <span className="text-cyan-500">
//                   {sentimentData.neutral.toLocaleString()}
//                 </span>
//               </div>
//             </div>

//             {/* Pie Chart and other visualization components */}
//             <PieChart width={450} height={450}>
//               <Pie
//                 data={[
//                   { 
//                     name: 'Positive', 
//                     value: sentimentData.positive, 
//                     percentage: ((sentimentData.positive/total)*100).toFixed(1) 
//                   },
//                   { 
//                     name: 'Negative', 
//                     value: sentimentData.negative, 
//                     percentage: ((sentimentData.negative/total)*100).toFixed(1) 
//                   },
//                   { 
//                     name: 'Neutral', 
//                     value: sentimentData.neutral, 
//                     percentage: ((sentimentData.neutral/total)*100).toFixed(1) 
//                   }
//                 ]}
//                 cx="30%"
//                 cy="30%"
//                 innerRadius={50}
//                 outerRadius={80}
//                 dataKey="value"
//               >
//                 {['#22c55e', '#ef4444', '#06b6d4'].map((color, index) => (
//                   <Cell key={`cell-${index}`} fill={color} />
//                 ))}
//               </Pie>
//             </PieChart>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="flex h-screen w-screen overflow-hidden bg-gray-900">
//       <div className="bg-gray-900 flex-grow h-full overflow-auto text-gray-100">
//         <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
//           <h2 className="text-2xl font-bold">Chat Analysis Dashboard</h2>
//           <div className="flex space-x-2">
//             {['overview', 'sentiment', 'language', 'emoji'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-4 py-2 rounded-lg ${
//                   activeTab === tab
//                     ? 'bg-blue-500 text-white'
//                     : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                 }`}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 rounded-lg text-red-400 hover:bg-gray-700"
//             >
//               Logout
//             </button>
//           </div>
//         </div>

//         <div className="p-8 h-full">
//           {activeTab === 'overview' && renderOverviewSection()}
//           {activeTab === 'sentiment' && renderSentimentSection()}
//           {activeTab === 'language' && renderLanguageSection()}
//           {activeTab === 'emoji' && renderEmojiSection()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatAnalysisDashboard;

// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
// // import { BarChart, Bar } from 'recharts';
// // import { PieChart, Pie, Cell } from 'recharts';

// // const API_BASE_URL = 'http://localhost:5000';

// // const ChatAnalysisDashboard = () => {
// //   const navigate = useNavigate();
// //   const [activeTab, setActiveTab] = useState('overview');
// //   const [file, setFile] = useState(null);
// //   const [languageViewMode, setLanguageViewMode] = useState('table');
// //   const [chatData, setChatData] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   const handleLogout = () => {
// //     navigate('/');
// //   };

// //   const analyzeChatData = async (messages) => {
// //     try {
// //       const response = await axios.post(`${API_BASE_URL}/analyze`, { messages });
// //       return response.data;
// //     } catch (error) {
// //       console.error('Error analyzing chat data:', error);
// //       throw error;
// //     }
// //   };

// //   const analyzeFile = (fileContent) => {
// //     const lines = fileContent.split('\n');
// //     const analysis = {
// //       totalMessages: 0,
// //       messageTypes: {
// //         text: 0,
// //         links: 0,
// //         images: 0,
// //         gifs: 0,
// //         videos: 0,
// //         stickers: 0,
// //         audioFiles: 0,
// //         documents: 0,
// //         otherFiles: 0
// //       },
// //       editedMessages: 0,
// //       messagesByDate: {},
// //       sentimentData: [],
// //       languageStats: {},
// //       emojiCounts: {},
// //       wordCounts: {},
// //       timeline: []
// //     };

// //     lines.forEach(line => {
// //       if (!line.trim()) return;

// //       analysis.totalMessages++;

// //       if (line.includes('http')) analysis.messageTypes.links++;
// //       if (line.includes('.jpg') || line.includes('.png')) analysis.messageTypes.images++;
// //       if (line.includes('.gif')) analysis.messageTypes.gifs++;
// //       if (line.includes('.mp4') || line.includes('.mov')) analysis.messageTypes.videos++;
// //       if (line.includes('.mp3') || line.includes('.wav')) analysis.messageTypes.audioFiles++;
// //       if (line.includes('.pdf') || line.includes('.doc')) analysis.messageTypes.documents++;

// //       if (line.includes('(edited)')) analysis.editedMessages++;

// //       const emojiRegex = /[\u{1F300}-\u{1F9FF}]/gu;
// //       const emojis = line.match(emojiRegex) || [];
// //       emojis.forEach(emoji => {
// //         analysis.emojiCounts[emoji] = (analysis.emojiCounts[emoji] || 0) + 1;
// //       });

// //       const words = line
// //         .toLowerCase()
// //         .replace(/[^a-zA-Z0-9\s]/g, '')
// //         .split(/\s+/);
// //       words.forEach(word => {
// //         if (word) {
// //           analysis.wordCounts[word] = (analysis.wordCounts[word] || 0) + 1;
// //         }
// //       });

// //       const positiveWords = ['happy', 'great', 'good', 'love', '😊', '👍'];
// //       const negativeWords = ['sad', 'bad', 'hate', 'awful', '😢', '👎'];

// //       const sentiment = positiveWords.some(word => line.toLowerCase().includes(word)) ? 1 :
// //         negativeWords.some(word => line.toLowerCase().includes(word)) ? -1 : 0;

// //       analysis.sentimentData.push(sentiment);
// //     });

// //     const timelineData = [
// //       { month: 'Jan', messages: Math.floor(analysis.totalMessages * 0.1) },
// //       { month: 'Feb', messages: Math.floor(analysis.totalMessages * 0.15) },
// //       { month: 'Mar', messages: Math.floor(analysis.totalMessages * 0.2) },
// //       { month: 'Apr', messages: Math.floor(analysis.totalMessages * 0.12) },
// //       { month: 'May', messages: Math.floor(analysis.totalMessages * 0.18) },
// //       { month: 'Jun', messages: Math.floor(analysis.totalMessages * 0.25) },
// //     ];
// //     return {
// //       ...analysis,
// //       timelineData,
// //       avgMessagesPerDay: (analysis.totalMessages / 30).toFixed(2),
// //       longestInactivePeriod: "calculating...",
// //       longestConversation: "calculating...",
// //       mostActive: {
// //         year: new Date().getFullYear().toString(),
// //         month: new Date().toLocaleString('default', { month: 'long' }),
// //         day: new Date().toLocaleDateString(),
//         hour: new Date().toLocaleTimeString()
//       }
//     };
//   };

//   const handleFileUpload = async (event) => {
//     const selectedFile = event.target.files?.[0];
//     if (!selectedFile) return;

//     setFile(selectedFile);
//     setLoading(true);

//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       const content = e.target.result;
//       const lines = content.split('\n').filter(line => line.trim() !== '');

//       try {
//         const apiResults = await analyzeChatData(lines);
//         const fileAnalysis = analyzeFile(content);

//         const combinedResults = {
//           ...fileAnalysis,
//           apiSentiments: {
//             sentiment: apiResults.sentiment,
//             sentimentCounts: apiResults.sentimentCounts
//           }
//         };

//         setChatData(combinedResults);
//       } catch (error) {
//         console.error('Analysis error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     reader.readAsText(selectedFile);
//   };

//   const renderOverviewSection = () => (
//     <div className="space-y-6">
//       <div className="bg-gray-800 p-4 rounded-lg shadow mb-6">
//         <h3 className="text-lg font-semibold mb-2">Upload Chat Data</h3>
//         <input
//           type="file"
//           onChange={handleFileUpload}
//           accept=".txt,.csv,.json"
//           className="mt-2 border border-gray-700 rounded-lg p-2 w-full bg-gray-700 text-gray-100"
//         />
//         {file && (
//           <p className="text-sm text-gray-400 mt-2">
//             Uploaded File: {file.name}
//           </p>
//         )}
//         {loading && (
//           <p className="text-sm text-blue-400 mt-2">
//             Analyzing file content...
//           </p>
//         )}
//       </div>

//       {chatData && (
//         <>
//           <div className="bg-gray-800 p-6 rounded-lg shadow">
//             <h3 className="text-xl font-bold mb-4">Message Statistics</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <p>Total messages: {chatData.totalMessages.toLocaleString()}</p>
//                 <p>✏️ Text messages: {chatData.messageTypes.text.toLocaleString()}</p>
//                 <p>🔗 With links: {chatData.messageTypes.links.toLocaleString()}</p>
//                 <p>📷 With images: {chatData.messageTypes.images.toLocaleString()}</p>
//                 <p>👾 With GIFs: {chatData.messageTypes.gifs.toLocaleString()}</p>
//                 <p>Edited messages: {chatData.editedMessages.toLocaleString()}</p>
//                 <p>Average messages per day: {chatData.avgMessagesPerDay}</p>
//                 <p>Most active month: {chatData.mostActive.month}</p>
//                 <p>Most active day: {chatData.mostActive.day}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gray-800 p-6 rounded-lg shadow">
//             <h3 className="text-xl font-bold mb-4">Messages Over Time</h3>
//             <div className="h-64">
//               <LineChart width={800} height={240} data={chatData.timelineData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="month" stroke="#9CA3AF" />
//                 <YAxis stroke="#9CA3AF" />
//                 <Tooltip
//                   contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
//                   labelStyle={{ color: '#9CA3AF' }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="messages"
//                   stroke="#60A5FA"
//                   strokeWidth={2}
//                 />
//               </LineChart>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );

//   const renderSentimentSection = () => {
//     if (!chatData) {
//       return (
//         <div className="text-center text-gray-400 mt-10">
//           Please upload a file to view sentiment analysis
//         </div>
//       );
//     }

//     const sentimentData = chatData.apiSentiments?.sentimentCounts || {
//       positive: 0,
//       negative: 0,
//       neutral: 0
//     };

//     const total = sentimentData.positive + sentimentData.negative + sentimentData.neutral;

//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold">Sentiment Analysis</h2>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg">
//             <h3 className="text-lg font-semibold mb-4">Sentiment Overview</h3>
//             <div className="space-y-2 mb-6">
//               <div className="flex justify-between">
//                 <span>Positive messages</span>
//                 <span className="text-green-500">
//                   {sentimentData.positive.toLocaleString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Negative messages</span>
//                 <span className="text-red-500">
//                   {sentimentData.negative.toLocaleString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Neutral messages</span>
//                 <span className="text-cyan-500">
//                   {sentimentData.neutral.toLocaleString()}
//                 </span>
//               </div>
//             </div>

//             <div className="h-64">
//               <PieChart width={450} height={450}>
//                 <Pie
//                   data={[
//                     {
//                       name: 'Positive',
//                       value: sentimentData.positive,
//                       percentage: ((sentimentData.positive/total)*100).toFixed(1)
//                     },
//                     {
//                       name: 'Negative',
//                       value: sentimentData.negative,
//                       percentage: ((sentimentData.negative/total)*100).toFixed(1)
//                     },
//                     {
//                       name: 'Neutral',
//                       value: sentimentData.neutral,
//                       percentage: ((sentimentData.neutral/total)*100).toFixed(1)
//                     }
//                   ]}
//                   cx="30%"
//                   cy="30%"
//                   innerRadius={50}
//                   outerRadius={80}
//                   dataKey="value"
//                   labelLine={false}
//                   label={({ name, percentage }) => `${name}: ${percentage}%`}
//                 >
//                   {['#22c55e', '#ef4444', '#06b6d4'].map((color, index) => (
//                     <Cell key={`cell-${index}`} fill={color} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   contentStyle={{ backgroundColor: 'white', border: 'black' }}
//                   formatter={(value) => value.toLocaleString()}
//                 />
//               </PieChart>
//             </div>
//           </div>

//           <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg">
//             <h3 className="text-lg font-semibold mb-4">Sentiment over time</h3>
//             <div className="h-[400px]">
//               <BarChart
//                 width={700}
//                 height={400}
//                 data={chatData.timelineData.map(item => ({
//                   month: item.month,
//                   positive: Math.floor(item.messages * 0.3),
//                   negative: Math.floor(item.messages * -0.2),
//                 }))}
//                 margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
//                 <XAxis
//                   dataKey="month"
//                   stroke="#9CA3AF"
//                   axisLine={{ stroke: '#4B5563' }}
//                   tick={{ fill: '#9CA3AF' }}
//                 />
//                 <YAxis
//                   stroke="#9CA3AF"
//                   axisLine={{ stroke: '#4B5563' }}
//                   tick={{ fill: '#9CA3AF' }}
//                   ticks={[-30, -20, -10, 0, 10, 20, 30, 40, 50]}
//                 />
//                 <Tooltip
//                   contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
//                   labelStyle={{ color: '#9CA3AF' }}
//                 />
//                 <Bar dataKey="positive" fill="#22c55e" />
//                 <Bar dataKey="negative" fill="#ef4444" />
//               </BarChart>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderLanguageSection = () => {
//     if (!chatData) {
//       return (
//         <div className="text-center text-gray-400 mt-10">
//           Please upload a file to view language analysis
//         </div>
//       );
//     }

//     const totalWords = Object.values(chatData.wordCounts).reduce((a, b) => a + b, 0);
//     const uniqueWords = Object.keys(chatData.wordCounts).length;
//     const avgWordsPerMessage = (totalWords / chatData.totalMessages).toFixed(2);

//     const TableView = () => (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-gray-800 p-6 rounded-lg">
//           <h3 className="text-lg font-semibold mb-4">Language Statistics</h3>
//           <div className="space-y-2">
//             <div className="flex justify-between">
//               <span>Total words used</span>
//               <span>{totalWords.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Unique words used</span>
//               <span>{uniqueWords.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Average words per message</span>
//               <span>{avgWordsPerMessage}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Languages used</span>
//               <span>English</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Unreliable to detect</span>
//               <span>{Math.floor(totalWords * 0.1).toLocaleString()}</span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gray-800 p-6 rounded-lg">
//           <h3 className="text-lg font-semibold mb-4">Most Used Words</h3>
//           <div className="space-y-2">
//             {Object.entries(chatData.wordCounts)
//               .sort(([, a], [, b]) => b - a)
//               .slice(0, 10)
//               .map(([word, count], index) => (
//                 <div key={word} className="flex justify-between items-center">
//                   <span className="text-gray-300">#{index + 1} {word}</span>
//                   <span className="text-gray-400">{count}</span>
//                 </div>
//               ))}
//           </div>
//         </div>
//       </div>
//     );

//     const WordCloudView = () => {
//       const wordCloudData = Object.entries(chatData.wordCounts)
//         .map(([text, value]) => ({
//           name: text,
//           value,
//           fill: `hsl(${Math.random() * 360}, 70%, 50%)`
//         }))
//         .sort((a, b) => b.value - a.value)
//         .slice(0, 20);

//       return (
//         <div className="bg-gray-800 p-6 rounded-lg">
//           <div className="h-[500px] w-full">
//             <PieChart width={800} height={500}>
//               <Pie
//                 data={wordCloudData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={200}
//                 labelLine={false}
//                 label={({ name, value }) => `${name} (${value})`}
//               >
//                 {wordCloudData.map((entry) => (
//                   <Cell key={entry.name} fill={entry.fill} />
//                 ))}
//               </Pie>
//               <Tooltip
//                 contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
//                 itemStyle={{ color: '#9CA3AF' }}
//               />
//             </PieChart>
//           </div>
//         </div>
//       );
//     };

//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold">Language Analysis</h2>
//           <div className="flex space-x-2">
//             <button
//               onClick={() => setLanguageViewMode('table')}
//               className={`px-4 py-2 rounded-lg ${
//                 languageViewMode === 'table'
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//               }`}
//             >
//               Table View
//             </button>
//             <button
//               onClick={() => setLanguageViewMode('wordcloud')}
//               className={`px-4 py-2 rounded-lg ${
//                 languageViewMode === 'wordcloud'
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//               }`}
//             >
//               Word Cloud
//             </button>
//           </div>
//         </div>

//         {languageViewMode === 'table' ? <TableView /> : <WordCloudView />}
//       </div>
//     );
//   };

//   const renderEmojiSection = () => (
//     chatData ? (
//       <div>
//         <h2 className="text-2xl font-bold mb-4">Emoji Analysis</h2>
//         <div className="bg-gray-800 p-6 rounded-lg shadow">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Most Used Emojis</h3>
//               <div className="space-y-2">
//                 {Object.entries(chatData.emojiCounts)
//                   .sort(([, a], [, b]) => b - a)
//                   .slice(0, 10)
//                   .map(([emoji, count]) => (
//                     <div key={emoji} className="flex justify-between items-center">
//                       <span className="text-2xl">{emoji}</span>
//                       <span>{count}</span>
//                     </div>
//                   ))}
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Emoji Usage Over Time</h3>
//               {/* Add emoji usage timeline here */}
//             </div>
//           </div>
//         </div>
//       </div>
//     ) : (
//       <div className="text-center text-gray-400 mt-10">
//         Please upload a file to view emoji analysis
//       </div>
//     )
//   );

//   return (
//     <div className="flex h-screen w-screen overflow-hidden bg-gray-900">
//       <div className="bg-gray-900 flex-grow h-full overflow-auto text-gray-100">
//         <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
//           <h2 className="text-2xl font-bold">Chat Analysis Dashboard</h2>
//           <div className="flex space-x-2">
//             {['overview', 'sentiment', 'language', 'emoji'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-4 py-2 rounded-lg ${
//                   activeTab === tab
//                     ? 'bg-blue-500 text-white'
//                     : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                 }`}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 rounded-lg text-red-400 hover:bg-gray-700"
//             >
//               Logout
//             </button>
//           </div>
//         </div>

//         <div className="p-8 h-full">
//           {activeTab === 'overview' && renderOverviewSection()}
//           {activeTab === 'sentiment' && renderSentimentSection()}
//           {activeTab === 'language' && renderLanguageSection()}
//           {activeTab === 'emoji' && renderEmojiSection()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatAnalysisDashboard;
