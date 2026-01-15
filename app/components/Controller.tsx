'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type MenuOption = 'Visibility' | 'Streams' | 'Leaderboard';

interface ControllerProps {
  selectedMenu?: MenuOption;
  onMenuChange?: (menu: MenuOption) => void;
}

export default function Controller({ selectedMenu = 'Visibility', onMenuChange }: ControllerProps) {
  const [activeMenu, setActiveMenu] = useState<MenuOption>(selectedMenu);
  const [isDesktop, setIsDesktop] = useState(false);

  // Sincronizar con el prop selectedMenu cuando cambia
  useEffect(() => {
    setActiveMenu(selectedMenu);
  }, [selectedMenu]);

  // Detectar si estamos en desktop
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const handleMenuClick = (menu: MenuOption) => {
    setActiveMenu(menu);
    onMenuChange?.(menu);
  };

  const menus: MenuOption[] = ['Visibility', 'Streams', 'Leaderboard'];

  return (
    <div 
      className="lg:p-2.5 lg:bg-black-turtle lg:rounded-full lg:outline lg:outline-black-highlight/10 flex flex-col lg:flex-row justify-center items-center gap-5 lg:gap-5 lg:shadow"
      style={{
        boxShadow: isDesktop ? 'var(--shadow-black-turtle)' : undefined
      }}
    >
        {/* Logo - no background */}
        <Image src="/media/partner-logo.png" alt="Controller Logo" width={225} height={75} className='object-contain'/>
        

      {/* Menu options with separate background on mobile */}
      <div className="p-2.5 bg-black-turtle rounded-full outline outline-black-highlight/10 shadow lg:p-0 lg:bg-transparent lg:rounded-none lg:outline-none lg:shadow-none flex justify-center items-center gap-10"
      >
        <div className="p-1 flex items-center gap-4">
          {menus.map((menu) => {
            const isSelected = activeMenu === menu;
            return (
              <button
                key={menu}
                onClick={() => handleMenuClick(menu)}
                className={`h-10 px-2.5 py-1.5 rounded-full flex items-center gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? 'pl-6 pr-2.5 bg-black-turtle outline outline-green-turtle'
                    : ''
                }`}
                style={isSelected ? {
                  boxShadow: 'var(--shadow-green-turtle)'
                } : {}}
              >
                <span
                  className={`text-xs font-medium font-dm-sans leading-5 ${
                    isSelected ? 'text-green-turtle' : 'text-white-turtle/50'
                  }`}
                >
                  {menu}
                </span>
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
