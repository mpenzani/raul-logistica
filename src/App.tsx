import { raulLessons } from './data/raulLessons';
import { alexandreLessons } from './data/alexandreLessons';
import { joseeduardoLessons } from './data/joseeduardoLessons';
import { ellenLessons } from './data/ellenLessons';
import { fabianoLessons } from './data/fabianoLessons'; 
import { demoLessons } from "./data/demoLessons";
 // ✅ TAREFA 10

interface Lesson {
  id: number;
  titulo: string;
  descricao: string;
  emoji: string;
  frase: string;
  video?: string;
  instructionBox?: {
    title: string;
    steps: string[];
  };
  practicePhrase?: string;
  practiceContext?: string;
  xp: number;
}

function App() {
  // 🔑 MULTI-LEAD DINÂMICO + DEMO
  const urlParams = new URLSearchParams(window.location.search);
  const lead = urlParams.get('lead') || 'demo'; // DEFAULT DEMO
  
  // 🔧 CARREGA + FIX AUTO-FRASE TODOS LEADS
let lessonsData: Lesson[] = [];
let headerTitle = '';
let progressBarLabel = '';
let footerText = '';
let completionText = '';
let instructionBox = '';

// FUNÇÃO FIX UNIVERSAL (resolve TS2322 missing frase)
const loadLessons = (rawLessons: any[], title: string, label: string, footer: string, complete: string, instr: string) => {
  lessonsData = rawLessons.map((l: any): Lesson => ({
    id: l.id,
    titulo: l.titulo,
    descricao: l.descricao || '',
    emoji: l.emoji || '📚',
    frase: l.frase || l.titulo || `Pratique logística dia ${l.id}!`,  // ✅ FIX OBRIGATÓRIO
    video: l.video || l.videoId,
    instructionBox: l.instructionBox,
    practicePhrase: l.practicePhrase,
    practiceContext: l.practiceContext,
    xp: l.xp || 100
  }));
  headerTitle = title;
  progressBarLabel = label;
  footerText = footer;
  completionText = complete;
  instructionBox = instr;
};

if (lead === 'joseeduardo') {
  loadLessons(joseeduardoLessons, '🎯 ZÉ VITTI Lapidação PRO', 'NATURALIDADE NATIVA',
    '10-20min/dia • Trabalho + Faculdade • José Eduardo Vitti', 'ZÉ VITTI NATIVO!',
    '🎯 7 dias prático. Execute TUDO antes "COMPLETEI".');
} else if (lead === 'ellen') {
  loadLessons(ellenLessons, '📚 ELLEN Estrutura Rápida', 'GRAMÁTICA AUTOMÁTICA',
    '20-30min/dia • Desbloqueio • Ellen Penzani', 'ELLEN FLUENTE!',
    '📚 7 dias gramática pra FALAR.');
} else if (lead === 'fabiano') {
  loadLessons(fabianoLessons, '🗣️ FABIANO Fala Fluida', 'CONVERSAÇÃO SEM TRAVAR',
    '25-30min/dia • Fabiano Araujo', 'FABIANO FLUENTE!',
    '🗣️ 7 dias shadowing. Grave WhatsApp.');
} else if (lead === 'raul') {
  loadLessons(raulLessons, '🚚 RAUL Logística Fluente', 'LOGÍSTICA GLOBAL',
    '15-25min 3x/semana MANHÃ • Raul Sanchez Logística', 'RAUL GLOBAL!',
    '🚚 7 dias logística: rotas/export/contratos. Shadowing frases carreira.');
} else if (lead === 'demo') {
  loadLessons(demoLessons, '🚀 DEMO 30 DIAS - TESTE AGORA', 'PROGRESSO DEMO',
    'Teste completo • Hotmart 6731344', 'DEMO COMPLETO!',
    '🚀 Teste 30 dias personalizados.');
} else {
  loadLessons(alexandreLessons, '🧑‍🌾 XANDÃO AGRO EXPORT', 'FAZENDA EXPORTADORA',
    '21min/dia • Alexandre Ferreira', 'XANDÃO EXPORTADOR!',
    '🌾 Shadowing 20x agro vídeos.');
}

// PROGRESSO ISOLADO POR LEAD (inalterado)
const progressKey = `progress-${lead}`;
const progress = JSON.parse(localStorage.getItem(progressKey) || '{"current":1,"completed":[],"totalXP":0,"streak":0}');
const currentLesson = progress.current;
const completed = progress.completed || [];
const totalXP = progress.totalXP || 0;
const streak = progress.streak || 0;
const total = lessonsData.length;
const current = lessonsData[currentLesson - 1];
const isDone = currentLesson > total;
const level = Math.floor(totalXP / 1000) + 1;

const handleClick = () => {
  if (currentLesson <= total && !completed.includes(currentLesson)) {
    const xpGain = current!.xp + (streak * 10);
    const newProgress = {
      current: currentLesson + 1,
      completed: [...completed, currentLesson],
      totalXP: totalXP + xpGain,
      streak: streak + 1
    };
    localStorage.setItem(progressKey, JSON.stringify(newProgress));
    window.location.reload();
  }
};

  return (
    <div style={{minHeight:'100vh', background:'linear-gradient(135deg, #10b981, #059669)', padding:'1rem', fontFamily:'system-ui'}}>
      {/* HEADER DINÂMICO */}
      <div style={{background:'rgba(255,255,255,0.2)', backdropFilter:'blur(20px)', borderRadius:'2rem', padding:'1.5rem', marginBottom:'2rem', textAlign:'center'}}>
        <div style={{color:'white', fontSize:'2rem', fontWeight:'bold'}}>{headerTitle} Lv.{level}</div>
        <div style={{display:'flex', gap:'1.5rem', justifyContent:'center', color:'white', flexWrap:'wrap'}}>
          <span>🔥 {streak} DIAS SEGUIDOS</span>
          <span>⭐ {totalXP} XP</span>
          <span>📊 {currentLesson}/{total}</span>
        </div>
        
        {/* 📊 BARRA DE PROGRESSO */}
        <div style={{marginTop:'1.5rem'}}>
          <div style={{fontSize:'0.85rem', color:'white', marginBottom:'0.5rem', fontWeight:'600', opacity:0.9}}>
            {progressBarLabel}
          </div>
          <div style={{width:'100%', height:'12px', background:'rgba(255,255,255,0.2)', borderRadius:'10px', overflow:'hidden'}}>
            <div style={{
              width: `${(completed.length / total) * 100}%`,
              height:'100%',
              background:'linear-gradient(90deg, #fbbf24, #f59e0b)',
              borderRadius:'10px',
              transition:'width 0.5s ease'
            }} />
          </div>
          <div style={{fontSize:'0.75rem', color:'white', marginTop:'0.3rem', opacity:0.8}}>
            {completed.length}/{total} lições completas ({Math.round((completed.length / total) * 100)}%)
          </div>
        </div>
      </div>

      {/* CAIXA INSTRUÇÕES DIA 1 */}
      {currentLesson === 1 && (
        <div style={{background:'rgba(255,255,255,0.95)', borderRadius:'1.5rem', padding:'1.5rem', marginBottom:'2rem', maxWidth:'450px', margin:'0 auto 2rem', boxShadow:'0 10px 30px rgba(0,0,0,0.2)'}}>
          <div style={{fontSize:'1rem', color:'#1f2937', lineHeight:'1.6', textAlign:'center', fontWeight:'500'}}>
            {instructionBox}
          </div>
        </div>
      )}

      {/* LIÇÃO PRINCIPAL */}
      {!isDone ? (
        <div style={{background:'white', borderRadius:'3rem', boxShadow:'0 40px 80px rgba(0,0,0,0.3)', padding:'3rem 2rem', maxWidth:'450px', margin:'0 auto'}}>
          
          {/* TÍTULO LIÇÃO */}
          <div style={{textAlign:'center', marginBottom:'2rem'}}>
            <div style={{fontSize:'3rem', marginBottom:'0.5rem'}}>{current?.emoji}</div>
            <div style={{fontSize:'1.5rem', fontWeight:'bold', color:'#1f2937', marginBottom:'0.5rem'}}>
              {current?.titulo}
            </div>
            <div style={{fontSize:'0.95rem', color:'#6b7280', lineHeight:'1.5'}}>
              {current?.descricao}
            </div>
          </div>

          {/* INSTRUCTIONBOX */}
          {current?.instructionBox && (
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              marginBottom: '2rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              <h3 style={{fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                {current.instructionBox.title}
              </h3>
              <div style={{background: 'rgba(255,255,255,0.15)', padding: '1.5rem', borderRadius: '0.75rem', backdropFilter: 'blur(10px)'}}>
                {current.instructionBox.steps.map((step, idx) => (
                  <div key={idx} style={{
                    marginBottom: '0.75rem',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    paddingLeft: '0.5rem'
                  }}>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FRASE PRÁTICA */}
          {current?.practicePhrase && (
            <div style={{
              background: '#f8fafc',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '3px solid #10b981',
              marginBottom: '1.5rem'
            }}>
              <div style={{fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#059669'}}>
                {current.practicePhrase}
              </div>
              <div style={{fontSize: '0.95rem', color: '#475569', lineHeight: '1.5'}}>
                {current.practiceContext}
              </div>
            </div>
          )}

          {/* VIDEO PLAYER */}
          {!current?.instructionBox && current?.video && (
            <div style={{position:'relative', width:'100%', height:220, marginBottom:'2rem', borderRadius:'1.5rem', overflow:'hidden', boxShadow:'0 20px 40px rgba(0,0,0,0.2)'}}>
              <iframe 
                src={current.video}
                style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', border:'none'}}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* FRASE EXEMPLO */}
          {!current?.practicePhrase && current?.frase && (
            <div style={{background:'linear-gradient(135deg, #3b82f6, #1d4ed8)', color:'white', padding:'2rem', borderRadius:'2rem', marginBottom:'2rem', textAlign:'center'}}>
              <div style={{fontSize:'0.9rem', marginBottom:'0.5rem', opacity:0.9, fontWeight:'600'}}>FRASE DO DIA</div>
              <div style={{fontSize:'1.5rem', fontWeight:'bold', marginBottom:'1rem'}}>"{current.frase}"</div>
              <div style={{fontSize:'0.95rem', opacity:0.95}}>📝 Copie em voz alta depois do vídeo</div>
            </div>
          )}

          {/* BOTÃO AÇÃO */}
          <button 
            onClick={handleClick}
            style={{
              width:'100%',
              background:'linear-gradient(135deg, #f59e0b, #d97706)',
              color:'white',
              border:'none',
              padding:'1.5rem',
              borderRadius:'1.5rem',
              fontSize:'1.2rem',
              fontWeight:'bold',
              cursor:'pointer',
              boxShadow:'0 10px 30px rgba(245,158,11,0.4)',
              transition:'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            ✅ COMPLETEI O EXERCÍCIO (+{current?.xp}XP)
          </button>

          {/* GANHO XP COM STREAK */}
          {streak > 0 && (
            <div style={{textAlign:'center', marginTop:'1rem', color:'#059669', fontWeight:'600', fontSize:'0.9rem'}}>
              🔥 Streak bonus: +{streak * 10}XP extra!
            </div>
          )}

          {/* 💰 CTA VENDA 30 DIAS */}
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '1.5rem',
            marginTop: '2rem',
            boxShadow: '0 20px 40px rgba(245,158,11,0.3)',
            border: '3px solid rgba(255,255,255,0.3)'
          }}>
            <div style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center'}}>
              🚀 Tá gostando do app?
            </div>
            <div style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem', textAlign: 'center', opacity: 0.95}}>
              Imagine o que você pode alcançar com o <strong>plano completo de 30 dias</strong>!
            </div>
            <button
              onClick={() => {
                const whatsappNumber = '5519997705848';
                const message = encodeURIComponent(`Olá! Testei o app ${lead} e quero meu plano de 30 dias! 🚀`);
                window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
              }}
              style={{
                width: '100%',
                background: 'white',
                color: '#d97706',
                border: 'none',
                padding: '1.25rem',
                borderRadius: '1rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
              }}
            >
              💬 QUERO MEU PLANO DE 30 DIAS
            </button>
          </div>

        </div>
      ) : (
      /* TELA CONCLUSÃO */
      <div style={{background:'white', borderRadius:'3rem', boxShadow:'0 40px 80px rgba(0,0,0,0.3)', padding:'3rem 2rem', maxWidth:'450px', margin:'0 auto', textAlign:'center'}}>
        <div style={{fontSize:'5rem', marginBottom:'1rem'}}>🎉</div>
        <div style={{fontSize:'2rem', fontWeight:'bold', color:'#10b981', marginBottom:'1rem'}}>
          {completionText}
        </div>
        <div style={{fontSize:'1.1rem', color:'#6b7280', marginBottom:'2rem', lineHeight:'1.6'}}>
          Você completou os 7 dias! 🚀<br/>
          Total: {totalXP} XP | Level {level}
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem(progressKey);
            window.location.reload();
          }}
          style={{
            background:'linear-gradient(135deg, #10b981, #059669)',
            color:'white',
            border:'none',
            padding:'1rem 2rem',
            borderRadius:'1rem',
            fontSize:'1rem',
            fontWeight:'bold',
            cursor:'pointer'
          }}
        >
          🔄 Recomeçar Jornada
        </button>
      </div>
      )}

      {/* FOOTER */}
      <div style={{textAlign:'center', color:'white', marginTop:'2rem', fontSize:'0.85rem', opacity:0.8}}>
        {footerText}
      </div>
    </div>
  );
}

export default App;
