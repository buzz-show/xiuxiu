import React, { useState } from 'react';
import { ChevronLeft, Pencil, Plus, Trash2, ClipboardList, Home, Search, Box, User } from 'lucide-react';

const App = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 模拟宠物数据
  const petData = {
    name: "年糕",
    species: "其他",
    breed: "other",
    birthday: "2026-03-23",
    gender: "公"
  };

  return (
    <div className="flex flex-col h-screen bg-[#F9F7F2] text-[#333333] font-sans overflow-hidden">
      {/* 顶部导航栏 */}
      <header className="flex items-center justify-between px-4 py-4 bg-white sticky top-0 z-10">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-[#8B7E74]" />
        </button>
        <h1 className="text-lg font-bold tracking-tight">{petData.name}</h1>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#8B7E74]">
          <Pencil size={20} />
        </button>
      </header>

      {/* 内容区域 */}
      <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 space-y-6">
        {/* 头像区域 */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="w-32 h-32 bg-[#EFE9E1] rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
             {/* 这里放宠物头像图片 */}
             <div className="text-6xl">🐶</div>
          </div>
          <button className="text-xs text-[#AFA49C] hover:text-[#8B7E74]">点击更换头像</button>
        </div>

        {/* 基础信息卡片 */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-[#EFE9E1] space-y-4">
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#AFA49C]">种类</span>
            <span className="font-medium">{petData.species}</span>
          </div>
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#AFA49C]">品种</span>
            <span className="font-medium">{petData.breed}</span>
          </div>
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#AFA49C]">生日</span>
            <span className="font-medium">{petData.birthday}</span>
          </div>
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#AFA49C]">性别</span>
            <span className="font-medium">{petData.gender}</span>
          </div>
        </div>

        {/* 健康记录区域 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-lg font-bold">健康记录</h2>
            <button className="bg-[#F3F1ED] text-[#8B7E74] px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <Plus size={14} /> 添加
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-[24px] border border-dashed border-[#E5E0DA]">
            <ClipboardList size={48} className="text-[#E5E0DA] mb-3" />
            <p className="text-[#AFA49C] text-sm mb-1">暂无健康记录</p>
            <p className="text-[#D1CBC5] text-xs">点击「+ 添加」记录疫苗、驱虫、体检等</p>
          </div>
        </div>

        {/* 删除档案按钮 - 方案二实现 */}
        <div className="pt-6">
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="w-full py-4 flex items-center justify-center gap-2 text-[#FF5A5A] font-medium bg-white rounded-[20px] border border-[#FFE5E5] active:bg-[#FFF5F5] transition-colors"
          >
            <Trash2 size={18} />
            删除宠物档案
          </button>
          <p className="text-center text-[11px] text-[#D1CBC5] mt-3">
            删除后档案及所有健康记录将无法找回
          </p>
        </div>
      </main>

      {/* 底部导航栏 */}
      <nav className="h-20 bg-white/90 backdrop-blur-md border-t border-[#F0EBE5] flex items-center justify-around px-2 pb-2">
        <NavItem icon={<Home size={22} />} label="首页" active />
        <NavItem icon={<Search size={22} />} label="发现" />
        <NavItem icon={<Box size={22} />} label="物品" />
        <NavItem icon={<User size={22} />} label="我的" />
      </nav>

      {/* 二次确认弹窗 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-xs rounded-[32px] p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FFF5F5] rounded-full flex items-center justify-center mb-4">
                <Trash2 size={30} className="text-[#FF5A5A]" />
              </div>
              <h3 className="text-lg font-bold mb-2">确定删除档案？</h3>
              <p className="text-[#8B7E74] text-sm leading-relaxed mb-6">
                你将永久删除 <span className="text-[#333] font-bold">“{petData.name}”</span> 的所有资料，此操作不可撤销。
              </p>
              <div className="flex flex-col w-full gap-3">
                <button 
                  className="w-full py-3 bg-[#FF5A5A] text-white rounded-2xl font-bold shadow-md shadow-red-100 active:scale-95 transition-transform"
                  onClick={() => setShowDeleteModal(false)}
                >
                  确认删除
                </button>
                <button 
                  className="w-full py-3 bg-[#F3F1ED] text-[#8B7E74] rounded-2xl font-bold active:scale-95 transition-transform"
                  onClick={() => setShowDeleteModal(false)}
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex flex-col items-center gap-1 ${active ? 'text-[#FF9F43]' : 'text-[#D1CBC5]'}`}>
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </div>
);

export default App;