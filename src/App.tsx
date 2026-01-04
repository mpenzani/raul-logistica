import { raulLessons } from './data/raulLessons';
import { alexandreLessons } from './data/alexandreLessons';
import { joseeduardoLessons } from './data/joseeduardoLessons';
import { ellenLessons } from './data/ellenLessons';
import { fabianoLessons } from './data/fabianoLessons'; 
import { demoLessons } from "./data/demoLessons";
import { useState, useRef, useCallback, useEffect } from 'react';

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
  const urlParams = new URLSearchParams(window.location.search);
  const lead = urlParams.get('lead') || 'demo';

  // 🎤 GRAVADOR STATE
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const addXP = useCallback(() => {
    const progressKey = `progress-${lead}`;
    const progress = JSON.parse(localStorage.getItem(progressKey) || '{"totalXP":0,"streak":0}');
    const newProgress = {
      ...progress,
      totalXP: (progress.totalXP || 0) + 10,
      streak: (progress.streak || 0) + 1
    };
    localStorage.setItem(progressKey, JSON.stringify(newProgress));
  }, [lead]);

  const startSpeaking = async () => {
    if (location.protocol !== 'https:') {
      alert('❌ GH Pages HTTPS obrigatório para microfone!');
      return;
    }
    if (!navigator.mediaDevices) {
      alert('❌ Navegador sem suporte (use Chrome/Safari atualizado)');
      return;
    }

    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ 
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 } 
      });

      const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'];
      let mimeType = mimeTypes.find(mt => MediaRecorder.isTypeSupported(mt)) || 'audio/webm';
      
      const recorder = new MediaRecorder(streamRef.current, { mimeType });
      recorderRef.current = recorder;

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        setAudioUrl(URL.createObjectURL(blob));
        addXP();
        setIsRecording(false);
        chunks.length = 0;
        alert('✅ +10XP! Ouça sua gravação abaixo.');
      };

      recorder.onerror = () => {
        alert('❌ Erro interno. Tente Chrome/HTTPS.');
        stopSpeaking();
      };

      recorder.start(250);
      setIsRecording(true);
    } catch (err: any) {
      console.error('Media Error:', err.name, err.message);
      const msg = err.name === 'NotAllowedError' ? 'Permita microfone!' : 
                  err.name === 'NotFoundError' ? 'Sem microfone detectado' : 
                  'Erro desconhecido. Teste outro device.';
      alert(`❌ ${msg}`);
    }
  };

  const stopSpeaking = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder?.state === 'recording') {
      recorder.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    recorderRef.current = null;
    setIsRecording(false);
  }, []);

  useEffect(() => () => stopSpeaking(), [stopSpeaking]);

  let lessonsData: Lesson[] = [];
  let headerTitle = '';
  let progressBarLabel = '';
  let footerText = '';
  let completionText = '';
  let instructionBox = '';

  const loadLessons = (rawLessons: any[], title: string, label: string, footer: string, complete: string, instr: string) => {
    lessonsData = rawLessons.map((l: any): Lesson => ({
      id: l.id,
      titulo: l.titulo,
      descricao: l.descricao || '',
      emoji: l.emoji || '📚',
      frase: l.frase || l.titulo || `Pratique ${lead} dia ${l.id}!`,
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
      <div style={{background:'rgba(255,255,255,0.2)', backdropFilter:'blur(20px)', borderRadius:'2rem', padding:'1.5rem', marginBottom:'2rem', textAlign:'center'}}>
        <div style={{color:'white', fontSize:'2rem', fontWeight:'bold'}}>{headerTitle} Lv.{level}</div>
        <div style={{display:'flex', gap:'1.5rem', justifyContent:'center', color:'white', flexWrap:'wrap'}}>
          <span>🔥 {streak} DIAS SEGUIDOS</span>
          <span>⭐ {totalXP} XP</span>
          <span>📊 {currentLesson}/{total}</span>
        </div>
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
            {completed.length}/{total} lições ({Math.round((completed.length / total) * 100)}%)
          </div>
        </div>
      </div>

      {currentLesson === 1 && (
        <div style={{background:'rgba(255,255,255,0.95)', borderRadius:'1.5rem', padding:'1.5rem', marginBottom:'2rem', maxWidth:'450px', margin:'0 auto 2rem', boxShadow:'0 10px 30px rgba(0,0,0,0.2)'}}>
          <div style={{fontSize:'1rem', color:'#1f2937', lineHeight:'1.6', textAlign:'center', fontWeight:'500'}}>
            {instructionBox}
          </div>
        </div>
      )}

      {!isDone ? (
        <div style={{background:'white', borderRadius:'3rem', boxShadow:'0 40px 80px rgba(0,0,0,0.3)', padding:'3rem 2rem', maxWidth:'450px', margin:'0 auto'}}>
          <div style={{textAlign:'center', marginBottom:'2rem'}}>
            <div style={{fontSize:'3rem', marginBottom:'0.5rem'}}>{current?.emoji}</div>
            <div style={{fontSize:'1.5rem', fontWeight:'bold', color:'#1f2937', marginBottom:'0.5rem'}}>
              {current?.titulo}
            </div>
            <div style={{fontSize:'0.95rem', color:'#6b7280', lineHeight:'1.5'}}>
              {current?.descricao}
            </div>
          </div>

          {current?.instructionBox && (
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              marginBottom: '2rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              <h3 style={{fontSize: '1.3rem', marginBottom: '1rem'}}>
                {current.instructionBox.title}
              </h3>
              <div style={{background: 'rgba(255,255,255,0.15)', padding: '1.5rem', borderRadius: '0.75rem'}}>
                {current.instructionBox.steps.map((step, idx) => (
                  <div key={idx} style={{marginBottom: '0.75rem', fontSize: '1rem', lineHeight: '1.6'}}>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

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

          <div style={{display:'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', margin:'2rem 0', padding:'2rem', background:'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius:'2rem', border:'4px solid #10b981'}}>
            <button 
              onClick={isRecording ? stopSpeaking : startSpeaking}
              disabled={!current}
              style={{
                padding: '1.25rem 3rem',
                borderRadius: '3rem',
                fontWeight: 'bold',
                border: 'none',
                fontSize: '1.15rem',
                transition: 'all 0.2s',
                cursor: current ? 'pointer' : 'not-allowed',
                ...(isRecording ? 
                  {background: '#ef4444', color: 'white', boxShadow: '0 10px 30px rgba(239,68,68,0.4)', transform: 'scale(1.02)'} : 
                  {background: '#10b981', color: 'white', boxShadow: '0 10px 30px rgba(16,185,129,0.4)'}
                )
              }}
            >
              🎤 {isRecording ? '⏹️ Parar Gravação' : '🗣️ Gravar Minha Fala (+10XP)'}
            </button>
            {audioUrl && (
              <div style={{width: '100%', textAlign: 'center'}}>
                <audio controls src={audioUrl} style={{width: '100%', maxWidth: '300px', margin: '0.5rem 0'}} />
                <button 
                  onClick={() => { 
                    setAudioUrl(null); 
                    if (audioUrl) URL.revokeObjectURL(audioUrl);
                  }}
                  style={{marginTop: '0.5rem', color: '#ef4444', fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer'}}
                >
                  🔄 Nova Gravação
                </button>
              </div>
            )}
          </div>

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

          {!current?.practicePhrase && current?.frase && (
            <div style={{background:'linear-gradient(135deg, #3b82f6, #1d4ed8)', color:'white', padding:'2rem', borderRadius:'2rem', marginBottom:'2rem', textAlign:'center'}}>
              <div style={{fontSize:'0.9rem', marginBottom:'0.5rem', opacity:0.9, fontWeight:'600'}}>FRASE DO DIA</div>
              <div style={{fontSize:'1.5rem', fontWeight:'bold', marginBottom:'1rem'}}>"{current.frase}"</div>
              <div style={{fontSize:'0.95rem', opacity:0.95}}>📝 Copie em voz alta depois do vídeo</div>
            </div>
          )}

          <button 
            onClick={handleClick}
            disabled={!current}
            style={{
              width:'100%',
              background:'linear-gradient(135deg, #f59e0b, #d97706)',
              color:'white',
              border:'none',
              padding:'1.5rem',
              borderRadius:'1.5rem',
              fontSize:'1.2rem',
              fontWeight:'bold',
              cursor: current ? 'pointer' : 'not-allowed',
              boxShadow:'0 10px 30px rgba(245,158,11,0.4)',
              transition:'transform 0.2s'
            }}
            onMouseOver={(e) => current && (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => current && (e.currentTarget.style.transform = 'scale(1)')}
          >
            ✅ COMPLETEI O EXERCÍCIO (+{current?.xp}XP)
          </button>

          {streak > 0 && (
            <div style={{textAlign:'center', marginTop:'1rem', color:'#059669', fontWeight:'600', fontSize:'0.9rem'}}>
              🔥 Streak bonus: +{streak * 10}XP extra!
            </div>
          )}

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
              🚀 Tá gostando?
            </div>
            <div style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem', textAlign: 'center', opacity: 0.95}}>
              Plano completo 30 dias!
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
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
              }}
            >
              💬 QUERO 30 DIAS
            </button>
          </div>
        </div>
      ) : (
        <div style={{background:'white', borderRadius:'3rem', boxShadow:'0 40px 80px rgba(0,0,0,0.3)', padding:'3rem 2rem', maxWidth:'450px', margin:'0 auto', textAlign:'center'}}>
          <div style={{fontSize:'5rem', marginBottom:'1rem'}}>🎉</div>
          <div style={{fontSize:'2rem', fontWeight:'bold', color:'#10b981', marginBottom:'1rem'}}>
            {completionText}
          </div>
          <div style={{fontSize:'1.1rem', color:'#6b7280', marginBottom:'2rem'}}>
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
            🔄 Recomeçar
          </button>
        </div>
      )}

      <div style={{textAlign: 'center', color: 'white', marginTop: '2rem', fontSize: '0.85rem', opacity: 0.8}}>
        {footerText}
      </div>
    </div>
  );
}

export default App;
