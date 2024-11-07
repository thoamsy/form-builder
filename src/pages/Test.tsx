import React, { useState } from 'react';

const WatermarkDemo = () => {
  const [showWatermarks, setShowWatermarks] = useState(false);
  const [useOverflowHidden, setUseOverflowHidden] = useState(false);

  // 生成多个水印
  const watermarks = Array.from({ length: 100 }, (_, i) => (
    <div
      key={i}
      className="fixed text-gray-200 pointer-events-none select-none"
      style={{
        left: `${(i % 10) * 200}px`,
        top: `${Math.floor(i / 10) * 100}px`,
        transform: 'rotate(-45deg)',
      }}
    >
      Watermark
    </div>
  ));

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setShowWatermarks(!showWatermarks)}
        >
          {showWatermarks ? '隐藏水印' : '显示水印'}
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => setUseOverflowHidden(!useOverflowHidden)}
        >
          {useOverflowHidden ? '移除 overflow:hidden' : '添加 overflow:hidden'}
        </button>
      </div>

      <div
        className={`relative border-2 border-gray-300 rounded-lg ${
          useOverflowHidden ? 'overflow-hidden' : ''
        }`}
        style={{ width: '800px', height: '400px' }}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">主要内容区域</h2>
          <p>这是页面的主要内容。注意观察当添加水印时页面的变化。</p>
          <p className="mt-2">特别注意右侧和底部是否出现滚动条。</p>
        </div>

        {showWatermarks && watermarks}
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">当前状态：</h3>
        <p>水印: {showWatermarks ? '显示' : '隐藏'}</p>
        <p>overflow:hidden: {useOverflowHidden ? '启用' : '禁用'}</p>
      </div>
    </div>
  );
};

export default WatermarkDemo;
