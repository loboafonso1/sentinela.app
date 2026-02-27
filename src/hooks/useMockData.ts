import { useState, useCallback } from "react";
import { addXpEvent, clearXpLog } from "./useXpLog";

export interface UserData {
  name: string;
  avatar: string;
  level: string;
  xp: number;
  xpNextLevel: number;
  streak: number;
  totalMissions: number;
  consecutiveDays: number;
  completionRate: number;
  todayCompleted: boolean;
  joinDate: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface WeeklyData {
  day: string;
  value: number;
}

const MOCK_KEY = "sentinela_elite_mock";

function getStoredData(): Partial<UserData> {
  try {
    const raw = localStorage.getItem(MOCK_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function storeData(data: Partial<UserData>) {
  localStorage.setItem(MOCK_KEY, JSON.stringify(data));
}

export function useMockData() {
  const stored = getStoredData();

  const defaultUser: UserData = {
    name: stored.name || localStorage.getItem("sentinela_user_name") || "Sentinela",
    avatar: stored.avatar || "",
    level: stored.level || "Iniciante",
    xp: stored.xp ?? 0,
    xpNextLevel: 500,
    streak: stored.streak ?? 5,
    totalMissions: stored.totalMissions ?? 12,
    consecutiveDays: stored.consecutiveDays ?? 5,
    completionRate: stored.completionRate ?? 0,
    todayCompleted: stored.todayCompleted ?? false,
    joinDate: stored.joinDate || "2026-01-15",
  };

  const [userData, setUserData] = useState<UserData>(defaultUser);

  const completeMission = useCallback((score?: number) => {
    setUserData(prev => {
      const newXp = prev.xp + 100;
      const levelUp = newXp >= prev.xpNextLevel;
      const newData: UserData = {
        ...prev,
        xp: levelUp ? newXp - prev.xpNextLevel : newXp,
        xpNextLevel: levelUp ? prev.xpNextLevel + 200 : prev.xpNextLevel,
        level: levelUp
          ? prev.level === "Iniciante" ? "Intermediário" : "Elite"
          : prev.level,
        streak: prev.streak + 1,
        totalMissions: prev.totalMissions + 1,
        consecutiveDays: prev.consecutiveDays + 1,
        completionRate: Math.min(100, prev.completionRate + 2),
        todayCompleted: true,
      };
      storeData(newData);
      addXpEvent(100);
      return newData;
    });
  }, []);

  const resetApp = useCallback(() => {
    const keepLogin = localStorage.getItem("sentinela_logged_in");
    localStorage.removeItem(MOCK_KEY);
    localStorage.removeItem("sentinela_user_name");
    localStorage.removeItem("sentinela_daily_quiz");
    localStorage.removeItem("sentinela_module_progress");
    clearXpLog();
    if (keepLogin) localStorage.setItem("sentinela_logged_in", keepLogin);
    const fresh: UserData = {
      name: "Sentinela",
      avatar: "",
      level: "Iniciante",
      xp: 0,
      xpNextLevel: 500,
      streak: 0,
      totalMissions: 0,
      consecutiveDays: 0,
      completionRate: 0,
      todayCompleted: false,
      joinDate: new Date().toISOString().slice(0, 10),
    };
    setUserData(fresh);
    storeData(fresh);
  }, []);

  const updateName = useCallback((name: string) => {
    setUserData(prev => {
      const newData = { ...prev, name };
      storeData(newData);
      localStorage.setItem("sentinela_user_name", name);
      return newData;
    });
  }, []);

  const resetToday = useCallback(() => {
    setUserData(prev => {
      const newData = { ...prev, todayCompleted: false };
      storeData(newData);
      return newData;
    });
  }, []);

  const weeklyData: WeeklyData[] = [
    { day: "Seg", value: 65 },
    { day: "Ter", value: 80 },
    { day: "Qua", value: 45 },
    { day: "Qui", value: 20 },
    { day: "Sex", value: 90 },
    { day: "Sáb", value: 30 },
    { day: "Dom", value: 10 },
  ];

  const progressData = [
    { name: "Sem 1", xp: 200 },
    { name: "Sem 2", xp: 450 },
    { name: "Sem 3", xp: 800 },
    { name: "Sem 4", xp: 1200 },
    { name: "Sem 5", xp: 1800 },
    { name: "Sem 6", xp: 2500 },
  ];

  const achievements: Achievement[] = [
    { id: "1", title: "Primeiro Passo", description: "Complete sua primeira missão", icon: "🎯", unlocked: true, unlockedAt: "2026-01-15" },
    { id: "2", title: "Constância", description: "3 dias consecutivos", icon: "🔥", unlocked: true, unlockedAt: "2026-01-18" },
    { id: "3", title: "Dedicado", description: "7 dias consecutivos", icon: "⭐", unlocked: userData.consecutiveDays >= 7 },
    { id: "4", title: "Sentinela Bronze", description: "Alcance nível Intermediário", icon: "🛡️", unlocked: userData.level !== "Iniciante" },
    { id: "5", title: "Sentinela Prata", description: "Alcance nível Elite", icon: "⚔️", unlocked: userData.level === "Elite" },
    { id: "6", title: "Maratonista", description: "30 dias consecutivos", icon: "🏆", unlocked: false },
    { id: "7", title: "Mestre do Discernimento", description: "100 missões completas", icon: "👑", unlocked: false },
    { id: "8", title: "Inabalável", description: "90 dias consecutivos", icon: "💎", unlocked: false },
  ];

  return { userData, completeMission, updateName, resetToday, weeklyData, progressData, achievements, resetApp };
}
