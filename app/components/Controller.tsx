'use client';

import { useState } from 'react';

type MenuOption = 'Visibility' | 'Streams' | 'Leaderboard';

interface ControllerProps {
  selectedMenu?: MenuOption;
  onMenuChange?: (menu: MenuOption) => void;
}

export default function Controller({ selectedMenu = 'Leaderboard', onMenuChange }: ControllerProps) {
  const [activeMenu, setActiveMenu] = useState<MenuOption>(selectedMenu);

  const handleMenuClick = (menu: MenuOption) => {
    setActiveMenu(menu);
    onMenuChange?.(menu);
  };

  const menus: MenuOption[] = ['Visibility', 'Streams', 'Leaderboard'];

  return (
    <div 
      className="pl-2.5 pr-5 py-2.5 bg-black-turtle rounded-full shadow-black-turtle outline outline-black-highlight/10 outline-offset-[-0.60px] inline-flex justify-center items-center gap-5"
    >
      {/* Left side - "What's Included" indicator */}
      <div 
        className="bg-black-highlight/0 rounded-full shadow-[0px_4px_21.95px_0px_rgba(0,0,0,0.20)] shadow-[inset_0px_0px_10px_0px_rgba(115,243,108,0.16)] outline outline-white/40 outline-offset-[-0.55px] flex justify-start items-center gap-2.5"
      >
        {/* Circular indicator with gradient */}
        <div 
          className="w-20 h-20 relative bg-gradient-to-r from-black-turtle/60 to-green-turtle/0 rounded-full shadow-[inset_0px_0px_6px_0px_rgba(115,243,108,1.00)] outline outline-white/40 outline-offset-[-1.39px] overflow-hidden"
        >
          <div className="w-16 h-20 left-0 top-[17px] absolute bg-gradient-to-b from-green-turtle to-green-turtle/0"></div>
        </div>
        
        {/* Text label */}
        <div className="pl-2.5 pr-7 py-3.5 inline-flex flex-col justify-start items-start gap-2.5">
          <div className="w-20 h-5 bg-green-turtle"></div>
          <div className="w-24 h-2.5 justify-center text-green-turtle text-xs font-semibold font-dm-sans leading-5">
            What's Included
          </div>
        </div>
      </div>

      {/* Right side - Menu options */}
      <div className="w-[454.14px] rounded-md shadow-[0px_4px_6px_0px_rgba(0,0,0,0.09)] flex justify-end items-start gap-10 overflow-hidden">
        <div className="p-[5px] flex justify-start items-start gap-4">
          {menus.map((menu) => {
            const isSelected = activeMenu === menu;
            return (
              <button
                key={menu}
                onClick={() => handleMenuClick(menu)}
                className={`h-10 px-2.5 py-1.5 rounded-full flex justify-start items-center gap-[5px] transition-all ${
                  isSelected
                    ? 'pl-6 pr-2.5 bg-black-turtle shadow-green-turtle outline outline-1 outline-offset-[-1px] outline-green-turtle'
                    : ''
                }`}
              >
                <div
                  className={`justify-start text-xs font-medium font-dm-sans leading-5 ${
                    isSelected ? 'text-green-turtle' : 'text-white-turtle/50'
                  }`}
                >
                  {menu}
                </div>
                {isSelected && (
                  <div className="w-5 h-5 relative">
                    <div className="w-4 h-4 left-[1px] top-[1px] absolute">
                      {/* Outer glow circle */}
                      <div className="w-3 h-3 left-[2.65px] top-[3px] absolute opacity-60 rounded-full shadow-[0px_0px_18.03px_0px_rgba(0,0,0,0.40)] shadow-[0px_0px_9.02px_0px_rgba(115,243,108,1.00)] shadow-[0px_3.61px_9.02px_0px_rgba(115,243,108,1.00)] border border-green-turtle"></div>
                      {/* Inner bright dot */}
                      <div className="w-2 h-2 left-[4.80px] top-[5.15px] absolute bg-green-turtle rounded-full shadow-[0px_0px_18.03px_0px_rgba(115,243,108,1.00)] shadow-[0px_0px_36.07px_0px_rgba(115,243,108,1.00)]"></div>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
