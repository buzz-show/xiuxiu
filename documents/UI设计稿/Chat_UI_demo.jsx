import React, { useState } from 'react';
import { ChevronLeft, Send, Sparkles, PawPrint, MessageSquare, Info } from 'lucide-react';

const App = () => {
  const [inputValue, setInputValue] = useState('');

  // 模拟对话数据
  const initialMessage = {
    role: 'assistant',
    content: '你好！我是你的 AI 宠物助理。你可以问我关于宠物健康、饮食建议或日常护理的问题。今天天气不错，适合带你的宠物出去走走。',
  };

  return (
    <div className="flex flex-col h-screen bg-[#F9F7F2] text-[#333333] font-sans overflow-hidden">
      {/* 顶部导航栏 */}
      <header className="flex items-center justify-between px-4 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-[#8B7E74]" />
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-[#FF9F43] p-1.5 rounded-lg shadow-sm">
            <PawPrint size={18} className="text-white fill-current" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">AI 宠物助理</h1>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Info size={20} className="text-[#AFA49C]" />
        </button>
      </header>

      {/* 聊天内容区域 */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* AI 欢迎消息卡片 - 对应图2的“AI今日建议”风格 */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-[#EFE9E1] relative overflow-hidden group">
          <div className="flex items-start gap-4">
            <div className="bg-[#FFF4E5] p-3 rounded-2xl">
              <Sparkles size={24} className="text-[#FF9F43]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#FF9F43] font-bold text-sm uppercase tracking-wider">AI 智能分析</span>
                <span className="text-[10px] text-gray-400">刚刚</span>
              </div>
              <p className="text-[#555555] leading-relaxed text-[15px]">
                {initialMessage.content}
              </p>
            </div>
          </div>
          {/* 背景装饰微调 */}
          <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 transition-transform group-hover:scale-110">
            <PawPrint size={80} />
          </div>
        </div>

        {/* 居中的提示状态 - 对应图1原本的中心提示，但在图2风格下进行弱化处理 */}
        <div className="flex flex-col items-center justify-center py-10 opacity-40">
           <div className="flex gap-1 mb-3">
             <PawPrint size={20} className="text-[#8B7E74] fill-current" />
             <PawPrint size={20} className="text-[#8B7E74] fill-current -mt-2" />
           </div>
           <p className="text-sm font-medium">向 AI 助理问一个关于宠物的问题吧</p>
        </div>
      </main>

      {/* 底部输入区域 */}
      <footer className="p-4 bg-white/90 border-t border-[#F0EBE5] pb-8">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="问问宠物健康相关的问题..."
              className="w-full bg-[#F3F1ED] border-none rounded-[20px] py-4 px-6 pr-12 text-[15px] focus:ring-2 focus:ring-[#FF9F43]/20 transition-all outline-none placeholder:text-[#AFA49C]"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#AFA49C] hover:text-[#FF9F43] transition-colors">
              <MessageSquare size={20} />
            </button>
          </div>
          <button 
            className={`p-4 rounded-[20px] shadow-lg transition-all transform active:scale-95 ${
              inputValue.trim() ? 'bg-[#FF9F43] text-white' : 'bg-[#E5E0DA] text-[#AFA49C]'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-center text-[10px] text-[#AFA49C] mt-3 uppercase tracking-widest">
          AI 可能会产生误差，建议咨询专业兽医
        </p>
      </footer>
    </div>
  );
};

export default App;