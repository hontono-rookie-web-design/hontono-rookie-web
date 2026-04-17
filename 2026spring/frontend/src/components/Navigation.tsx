"use client";

import Link from "next/link";
import { Menu, Home, Music, Vote, Star } from "lucide-react";
import { useState } from "react";

export default function Navigation({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeDrawer = () => setIsOpen(false);

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="main-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        onChange={(e) => setIsOpen(e.target.checked)}
      />

      <div className="drawer-content flex flex-col min-h-screen relative">
        {/* Navbar */}
        <div className="navbar bg-white/80 backdrop-blur-md border-b border-mint/10 sticky top-0 z-50 px-4">
          <div className="flex-none lg:hidden">
            <label htmlFor="main-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost text-mint">
              <Menu size={24} />
            </label>
          </div>
          <div className="flex-1 lg:ml-4">
            <Link href="/" className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-mint to-skyblue">
              本当のルーキー祭り
            </Link>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>

      <div className="drawer-side z-[100]">
        <label htmlFor="main-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-72 min-h-full bg-base-100 text-slate-700 border-r border-mint/10 shadow-sm">
          <div className="mb-6 mt-2 px-2">
            <h2 className="text-2xl font-bold text-slate-800">本当のルーキー祭り<br /><span className="text-lg text-mint">2026春</span></h2>
          </div>

          <li className="mb-2">
            <Link href="/" onClick={closeDrawer} className="font-semibold"><Home className="w-5 h-5 mr-3 text-slate-400" /> トップページ</Link>
          </li>



          <li className="menu-title mt-4 text-skyblue font-bold tracking-widest text-xs uppercase">投稿作品</li>
          <li><Link href="/submissions/songs/rookie" onClick={closeDrawer}><Music className="w-4 h-4 mr-3 text-slate-400" /> 楽曲一覧 ルーキー</Link></li>
          <li><Link href="/submissions/songs/opening" onClick={closeDrawer}><Music className="w-4 h-4 mr-3 text-slate-400" /> 楽曲一覧 opステージ</Link></li>
          <li><Link href="/submissions/songs/extra" onClick={closeDrawer}><Music className="w-4 h-4 mr-3 text-slate-400" /> 楽曲一覧 exステージ</Link></li>

          <li className="menu-title mt-4 text-cherry font-bold tracking-widest text-xs uppercase">人気投票</li>
          <li><Link href="/submissions/vote/preliminaries" onClick={closeDrawer}><Vote className="w-4 h-4 mr-3 text-slate-400" /> 人気投票 予選</Link></li>
          <li><Link href="/submissions/vote/semifinals" onClick={closeDrawer}><Vote className="w-4 h-4 mr-3 text-slate-400" /> 人気投票 準決勝</Link></li>
          <li><Link href="/submissions/vote/finals" onClick={closeDrawer}><Vote className="w-4 h-4 mr-3 text-slate-400" /> 人気投票 決勝</Link></li>
          <li><Link href="/submissions/vote/extra" onClick={closeDrawer}><Vote className="w-4 h-4 mr-3 text-slate-400" /> 人気投票 EXステージ</Link></li>

          <li className="menu-title mt-4 text-yellow-500 font-bold tracking-widest text-xs uppercase">二次創作</li>
          <li><Link href="/derivative/streams" onClick={closeDrawer}><Star className="w-4 h-4 mr-3 text-slate-400" /> 紹介配信</Link></li>
          <li><Link href="/derivative/articles" onClick={closeDrawer}><Star className="w-4 h-4 mr-3 text-slate-400" /> note記事</Link></li>
          <li><Link href="/derivative/illustrations" onClick={closeDrawer}><Star className="w-4 h-4 mr-3 text-slate-400" /> 二次創作 イラスト</Link></li>
          <li><Link href="/derivative/arrangements" onClick={closeDrawer}><Star className="w-4 h-4 mr-3 text-slate-400" /> 二次創作 アレンジ</Link></li>
          <li><Link href="/derivative/coversongs" onClick={closeDrawer}><Star className="w-4 h-4 mr-3 text-slate-400" /> 二次創作 歌ってみた</Link></li>
          <li><Link href="/derivative/others" onClick={closeDrawer}><Star className="w-4 h-4 mr-3 text-slate-400" /> 二次創作 その他</Link></li>


        </ul>
      </div>
    </div>
  );
}
