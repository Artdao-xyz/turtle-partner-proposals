'use client';

import { useState, useEffect } from 'react';

type MenuOption = 'Visibility' | 'Streams' | 'Leaderboard';

interface ControllerProps {
  selectedMenu?: MenuOption;
  onMenuChange?: (menu: MenuOption) => void;
}

export default function Controller({ selectedMenu = 'Visibility', onMenuChange }: ControllerProps) {
  const [activeMenu, setActiveMenu] = useState<MenuOption>(selectedMenu);

  // Sincronizar con el prop selectedMenu cuando cambia
  useEffect(() => {
    if (selectedMenu) {
      setActiveMenu(selectedMenu);
    }
  }, [selectedMenu]);

  const handleMenuClick = (menu: MenuOption) => {
    setActiveMenu(menu);
    onMenuChange?.(menu);
  };

  const menus: MenuOption[] = ['Visibility', 'Streams', 'Leaderboard'];

  return (
    <div 
      className="pl-2.5 pr-5 py-2.5 bg-black-turtle rounded-full outline outline-black-highlight/10 -outline-offset-1 inline-flex justify-center items-center gap-5"
      style={{
        boxShadow: 'var(--shadow-black-turtle)'
      }}
    >
      {/* Left side - "What's Included" indicator */}
      <div 
        className="bg-black-highlight/0 rounded-full outline outline-white/40 -outline-offset-1 flex justify-start items-center gap-2.5"
        style={{
          boxShadow: 'var(--shadow-black-turtle), inset 0px 0px 10px 0px rgba(115,243,108,0.16)'
        }}
      >
        {/* Circular indicator with gradient */}
        <div 
          className="w-20 h-20 relative bg-linear-to-r from-black-turtle/60 to-green-turtle/0 rounded-full outline outline-white/40 -outline-offset-1 overflow-hidden"
          style={{
            boxShadow: 'inset 0px 0px 6px 0px var(--green-turtle)'
          }}
        >
          <div 
            className="w-16 h-20 left-0 top-[17px] absolute bg-linear-to-b from-green-turtle to-green-turtle/0"
          ></div>
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
      <div className="w-[454px] rounded-md shadow-[0px_4px_6px_0px_rgba(0,0,0,0.09)] flex justify-end items-start gap-10 overflow-hidden">
        <div className="p-1 flex justify-start items-start gap-4">
          {menus.map((menu) => {
            const isSelected = activeMenu === menu;
            return (
              <button
                key={menu}
                onClick={() => handleMenuClick(menu)}
                className={`h-10 px-2.5 py-1.5 rounded-full flex justify-start items-center gap-1 transition-all ${
                  isSelected
                    ? 'pl-6 pr-2.5 bg-black-turtle outline outline-green-turtle'
                    : ''
                }`}
                style={isSelected ? {
                  boxShadow: 'var(--shadow-green-turtle)'
                } : {}}
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
                    <div className="w-4 h-4 left-px top-px absolute">
                      {/* Outer glow circle */}
                      <div 
                        className="w-3 h-3 left-[3px] top-[3px] absolute opacity-60 rounded-full border border-green-turtle"
                        style={{
                          boxShadow: '0px 0px 18px 0px rgba(0,0,0,0.40), 0px 0px 9px 0px var(--green-turtle), 0px 4px 9px 0px var(--green-turtle)'
                        }}
                      ></div>
                      {/* Inner bright dot */}
                      <div 
                        className="w-2 h-2 left-[5px] top-[5px] absolute bg-green-turtle rounded-full"
                        style={{
                          boxShadow: '0px 0px 18px 0px var(--green-turtle), 0px 0px 36px 0px var(--green-turtle)'
                        }}
                      ></div>
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
