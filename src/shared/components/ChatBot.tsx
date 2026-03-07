import { useState, useEffect, useRef } from 'react';
import { C }    from '@/shared/constants/colors';
import { Icon } from '@/shared/ui/Icon';

const CHAT_RESPONSES = [
  { keywords: ['bonjour', 'salut', 'hello', 'hi', 'allô', 'allo'], response: "Bonjour ! 👋 Bienvenue chez Les Jus Naturels Ben's ! Comment puis-je vous aider ?" },
  { keywords: ['prix', 'coût', 'combien', 'tarif', 'cher'], response: 'Nos jus sont entre 7,99$ et 10,99$ selon le format. Nous offrons des bouteilles de 250ml, 354ml et 1L. Un excellent rapport qualité-prix pour du jus artisanal 100% naturel ! 🍹' },
  { keywords: ['acheter', 'où', 'trouver', 'magasin', 'point de vente', 'vente'], response: "Vous pouvez trouver nos jus au Marché Jean-Talon, au Marché Atwater et dans plusieurs épiceries à Montréal. Consultez notre page 'Où Acheter' pour la liste complète ! 📍" },
  { keywords: ['livraison', 'livrer', 'expédier', 'envoyer', 'commander'], response: 'Pour le moment, nos jus sont disponibles uniquement dans nos points de vente physiques à Montréal. Nous travaillons sur la livraison à domicile ! 🚚' },
  { keywords: ['sucre', 'sans sucre', 'diabète', 'santé', 'naturel', 'bio'], response: "Plusieurs de nos jus sont disponibles SANS sucre ajouté ! Ils sont 100% naturels, sans conservateurs et sans additifs. Parfaits pour une alimentation saine. 🌿" },
  { keywords: ['hibiscus', 'bissap', 'fleur'], response: "Notre jus d'hibiscus est une recette traditionnelle africaine ! Riche en antioxydants et en vitamine C, il aide à réguler la pression artérielle. Disponible nature, avec gingembre ou avec fraises. 🌺" },
  { keywords: ['gingembre', 'ginger'], response: "Le gingembre est un super-aliment ! Notre jus de gingembre aide à la digestion, renforce l'immunité et possède des propriétés anti-inflammatoires. Disponible avec citron (sucré ou sans sucre). 🫚" },
  { keywords: ['ananas', 'tropical'], response: "Notre jus d'ananas est une explosion tropicale ! Riche en bromélaïne, il aide à la digestion. Disponible nature, sucré ou en mélange passion. 🍍" },
  { keywords: ['contact', 'joindre', 'email', 'courriel', 'téléphone'], response: 'Vous pouvez nous contacter par courriel à info@lesjusnaturelsbens.com ou via WhatsApp. Nous répondons rapidement ! 📧' },
  { keywords: ['histoire', 'fondatrice', 'qui', 'entreprise'], response: "Les Jus Naturels Ben's, c'est l'histoire d'une femme qui a apporté les recettes de sa famille du Cameroun au Québec. Visitez notre page 'Notre Histoire' pour en savoir plus ! ❤️" },
  { keywords: ['merci', 'super', 'génial', 'excellent', 'parfait'], response: "Merci beaucoup ! N'hésitez pas si vous avez d'autres questions. Bonne dégustation ! 🙏🍹" },
];

interface ChatMsg { from: 'bot' | 'user'; text: string; }

function getResponse(text: string): string {
  const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const r of CHAT_RESPONSES) {
    if (r.keywords.some(k => lower.includes(k))) return r.response;
  }
  return "Merci pour votre message ! Pour une réponse personnalisée, contactez-nous à info@lesjusnaturelsbens.com ou via WhatsApp. Nous vous répondrons rapidement ! 📧";
}

export function ChatBot() {
  const [open,   setOpen]   = useState(false);
  const [msgs,   setMsgs]   = useState<ChatMsg[]>([{ from: 'bot', text: "Bonjour ! 👋 Je suis l'assistant Ben's. Comment puis-je vous aider ?" }]);
  const [input,  setInput]  = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const sendMsg = (text: string) => {
    if (!text.trim()) return;
    setMsgs(prev => [...prev, { from: 'user', text: text.trim() }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMsgs(prev => [...prev, { from: 'bot', text: getResponse(text) }]);
      setTyping(false);
    }, 800 + Math.random() * 700);
  };

  const quickQs = ["Où acheter ?", "C'est quoi le prix ?", "C'est sans sucre ?", "Votre histoire"];

  return (
    <>
      <button onClick={() => setOpen(!open)}
        style={{ position: 'fixed', bottom: 96, right: 24, zIndex: 1000, width: 52, height: 52, borderRadius: '50%', background: C.hibiscus, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(139,26,26,0.3)', transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'none' }}>
        {open ? (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>

      {msgs.length <= 1 && !open && (
        <div style={{ position: 'fixed', bottom: 154, right: 24, zIndex: 999, background: '#fff', borderRadius: 12, padding: '10px 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', maxWidth: 200, fontSize: 13, color: C.dark, animation: 'bounceIn 0.5s ease', border: `1px solid ${C.border}` }}>
          <div style={{ position: 'absolute', bottom: -6, right: 18, width: 12, height: 12, background: '#fff', transform: 'rotate(45deg)', borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }} />
          🍹 <strong>Une question ?</strong><br />Clavardez avec nous !
        </div>
      )}

      {open && (
        <div className="chat-bubble" style={{ position: 'fixed', bottom: 160, right: 24, zIndex: 1001, width: 360, maxHeight: 480, borderRadius: 20, overflow: 'hidden', background: '#fff', boxShadow: '0 12px 40px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', border: `1px solid ${C.border}` }}>
          <div style={{ background: `linear-gradient(135deg, ${C.hibiscus}, ${C.red})`, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🍹</div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>Les Jus Naturels Ben's</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', margin: 0 }}>En ligne · Répond instantanément</p>
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '16px 16px 8px', maxHeight: 280, background: C.cream }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10, animation: 'fadeUp 0.3s ease' }}>
                <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: m.from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: m.from === 'user' ? C.hibiscus : '#fff', color: m.from === 'user' ? '#fff' : C.dark, fontSize: 14, lineHeight: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', gap: 4, padding: '10px 14px', background: '#fff', borderRadius: 14, width: 'fit-content', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: C.muted, animation: `pulse 1s ease-in-out ${i * 0.2}s infinite` }} />)}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {msgs.length <= 2 && (
            <div style={{ padding: '4px 12px 8px', display: 'flex', gap: 6, flexWrap: 'wrap', background: C.cream }}>
              {quickQs.map(q => (
                <button key={q} onClick={() => sendMsg(q)}
                  style={{ padding: '6px 12px', borderRadius: 20, border: `1px solid ${C.border}`, background: '#fff', color: C.dark, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          <div style={{ padding: '10px 12px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8, background: '#fff' }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg(input)}
              placeholder="Tapez votre message..."
              style={{ flex: 1, padding: '10px 14px', borderRadius: 24, border: `1px solid ${C.border}`, fontSize: 14, outline: 'none', background: C.cream }} />
            <button onClick={() => sendMsg(input)} disabled={!input.trim()}
              style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: input.trim() ? C.hibiscus : '#e5e7eb', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
              <Icon type="send" size={16} color={input.trim() ? '#fff' : '#9ca3af'} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
