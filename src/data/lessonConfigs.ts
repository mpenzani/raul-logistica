export interface LessonConfig {
  leadName: string;
  appTitle: string;
  appSubtitle: string;
  primaryColor: string;
  painPoint: string;
}

export const lessonConfigs: Record<string, LessonConfig> = {
  anderson: {
    leadName: "Mr. Anderson",
    appTitle: "Inglês Anti-Procrastinação",
    appSubtitle: "7 dias pra criar o hábito",
    primaryColor: "#00FF41",
    painPoint: "Motivação e disciplina"
  },
  default: {
    leadName: "Aluno",
    appTitle: "Inglês 30 Dias",
    appSubtitle: "Sua jornada começa aqui",
    primaryColor: "#5B7EFF",
    painPoint: "Inglês fluente"
  },
  raul: {
    leadName: "Raul Fernando Sanchez",
    appTitle: "Logística Fluente",
    appSubtitle: "Sotaque zero + intercâmbio",
    primaryColor: "#FF6B35",
    painPoint: "Sotaque nativos/constância"
  }
};
