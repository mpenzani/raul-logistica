import { useState, useEffect } from 'react';

const STORAGE_KEY = 'ingles30d_progress';

export function useProgress() {
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  // Carrega progresso ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setCompletedDays(JSON.parse(saved));
    }
  }, []);

  // Marca dia como concluído
  const markDayCompleted = (dayId: number) => {
    const updated = [...completedDays, dayId];
    setCompletedDays(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Verifica se dia está concluído
  const isDayCompleted = (dayId: number) => {
    return completedDays.includes(dayId);
  };

  // Reseta progresso (útil pra testar)
  const resetProgress = () => {
    setCompletedDays([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    completedDays,
    markDayCompleted,
    isDayCompleted,
    resetProgress
  };
}
