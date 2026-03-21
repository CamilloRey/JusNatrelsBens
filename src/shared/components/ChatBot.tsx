import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useData } from '@/app/providers/DataContext';
import { C } from '@/shared/constants/colors';
import { Icon } from '@/shared/ui/Icon';

interface ChatMsg {
  from: 'bot' | 'user';
  text: string;
}

interface ChatResponse {
  keywords: readonly string[];
  response: string;
}

function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function ChatBot() {
  const { t, i18n } = useTranslation();
  const { locations, events, products, ingredients, settings } = useData();

  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isEnglish = i18n.language?.startsWith('en');

  const activeLocations = useMemo(
    () => locations.filter((location) => location.active).slice(0, 5),
    [locations]
  );

  const upcomingEvents = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return events
      .filter((event) => event.active && event.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3);
  }, [events]);

  const highlightedProducts = useMemo(
    () => products.filter((product) => product.available).slice(0, 5),
    [products]
  );

  const activeIngredients = useMemo(
    () => ingredients.filter((ingredient) => ingredient.active).slice(0, 6),
    [ingredients]
  );

  useEffect(() => {
    setMsgs([{ from: 'bot', text: t('chatbot.responses.0.response') }]);
  }, [t]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const getDynamicResponse = (rawText: string): string | null => {
    const text = normalize(rawText);

    if (/(ou acheter|ou trouver|point de vente|where buy|store|location|magasin)/.test(text)) {
      if (activeLocations.length === 0) {
        return isEnglish
          ? 'No active store locations right now. Please contact us on WhatsApp for updates.'
          : 'Aucun point de vente actif pour le moment. Contactez-nous sur WhatsApp pour une mise a jour.';
      }

      const lines = activeLocations.map((location) => `- ${location.name}: ${location.address}`);
      return isEnglish
        ? `Current store locations:\n${lines.join('\n')}`
        : `Points de vente actuels:\n${lines.join('\n')}`;
    }

    if (/(event|evenement|agenda|marche|festival)/.test(text)) {
      if (upcomingEvents.length === 0) {
        return isEnglish
          ? 'No upcoming events are scheduled right now.'
          : "Aucun evenement a venir n'est programme pour le moment.";
      }

      const lines = upcomingEvents.map((event) => `- ${event.title} (${event.date}) @ ${event.location}`);
      return isEnglish
        ? `Next events:\n${lines.join('\n')}`
        : `Prochains evenements:\n${lines.join('\n')}`;
    }

    if (/(ingredient|bienfait|benefit|composition)/.test(text)) {
      if (activeIngredients.length === 0) {
        return isEnglish
          ? 'No ingredient data is available yet.'
          : "Aucune fiche ingredient n'est disponible pour le moment.";
      }

      const lines = activeIngredients.map((ingredient) => `- ${ingredient.name}`);
      return isEnglish
        ? `Main ingredients right now:\n${lines.join('\n')}`
        : `Ingredients principaux actuellement:\n${lines.join('\n')}`;
    }

    if (/(prix|price|tarif|combien|cost|cout)/.test(text)) {
      if (highlightedProducts.length === 0) {
        return isEnglish ? 'Pricing is being updated.' : 'Les prix sont en cours de mise a jour.';
      }

      const lines = highlightedProducts.map((product) => `- ${product.name}: ${product.price.toFixed(2)}$`);
      return isEnglish ? `Current prices:\n${lines.join('\n')}` : `Prix actuels:\n${lines.join('\n')}`;
    }

    if (/(sans sucre|no sugar|diabete|diabete)/.test(text)) {
      const sugarFree = highlightedProducts.filter((product) =>
        normalize(product.name).includes('sans sucre')
      );

      if (sugarFree.length === 0) {
        return isEnglish
          ? 'We do have low-sugar options. Ask us directly on WhatsApp for stock.'
          : 'Nous avons des options sans sucre. Ecrivez-nous sur WhatsApp pour le stock exact.';
      }

      const lines = sugarFree.map((product) => `- ${product.name}`);
      return isEnglish
        ? `Sugar-free options:\n${lines.join('\n')}`
        : `Options sans sucre:\n${lines.join('\n')}`;
    }

    if (/(contact|whatsapp|email|courriel|telephone|phone)/.test(text)) {
      const email = settings.email || 'info@lesjusnaturelsbens.com';
      const phone = settings.phone || '+1 (514) 555-0123';
      return isEnglish
        ? `Contact us at ${email} or ${phone}. WhatsApp is available from the floating button.`
        : `Contactez-nous a ${email} ou ${phone}. WhatsApp est accessible via le bouton flottant.`;
    }

    return null;
  };

  const getResponse = (rawText: string): string => {
    const dynamicResponse = getDynamicResponse(rawText);
    if (dynamicResponse) return dynamicResponse;

    const lower = normalize(rawText);
    const responses = t('chatbot.responses', { returnObjects: true }) as ChatResponse[];

    for (const response of responses) {
      if (response.keywords.some((keyword) => lower.includes(normalize(keyword)))) {
        return response.response;
      }
    }

    return t('chatbot.fallback');
  };

  const quickQuestions = isEnglish
    ? [
        'Where can I buy?',
        'What are your ingredients?',
        'Any upcoming events?',
        'What are your prices?',
        'Do you have no sugar options?',
        'How can I contact you?',
      ]
    : [
        'Ou acheter ?',
        'Quels ingredients utilisez-vous ?',
        'Quels evenements arrivent bientot ?',
        'Quels sont vos prix ?',
        'Avez-vous des options sans sucre ?',
        'Comment vous contacter ?',
      ];

  const sendMsg = (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    setMsgs((prev) => [...prev, { from: 'user', text }]);
    setInput('');
    setTyping(true);

    window.setTimeout(() => {
      const response = getResponse(text);
      setMsgs((prev) => [...prev, { from: 'bot', text: response }]);
      setTyping(false);
    }, 450);
  };

  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          position: 'fixed',
          bottom: 96,
          right: 24,
          zIndex: 1000,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'var(--brand-primary)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(90, 185, 55, 0.3)',
          transition: 'transform 0.3s',
          transform: open ? 'rotate(180deg)' : 'none',
        }}
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {msgs.length <= 1 && !open && (
        <div style={{ position: 'fixed', bottom: 154, right: 24, zIndex: 999, background: '#fff', borderRadius: 12, padding: '10px 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', maxWidth: 220, fontSize: 13, color: C.dark, animation: 'bounceIn 0.5s ease', border: `1px solid ${C.border}` }}>
          <div style={{ position: 'absolute', bottom: -6, right: 18, width: 12, height: 12, background: '#fff', transform: 'rotate(45deg)', borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }} />
          {t('chatbot.tooltip')}<br />{t('chatbot.tooltipSub')}
        </div>
      )}

      {open && (
        <div className="chat-bubble" style={{ position: 'fixed', bottom: 160, right: 24, zIndex: 1001, width: 370, maxHeight: 500, borderRadius: 20, overflow: 'hidden', background: '#fff', boxShadow: '0 12px 40px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', border: `1px solid ${C.border}` }}>
          <div style={{ background: 'linear-gradient(135deg, var(--brand-primary), var(--accent-primary))', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              <Icon type="send" size={20} color="#fff" />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>{t('chatbot.title')}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{t('chatbot.subtitle')}</p>
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '16px 16px 8px', maxHeight: 300, background: C.cream }}>
            {msgs.map((message, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: message.from === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10, animation: 'fadeUp 0.3s ease' }}>
                <div style={{ maxWidth: '86%', padding: '10px 14px', borderRadius: message.from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: message.from === 'user' ? 'var(--brand-primary)' : '#fff', color: message.from === 'user' ? '#fff' : C.dark, fontSize: 13, lineHeight: 1.55, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', whiteSpace: 'pre-line' }}>
                  {message.text}
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ display: 'flex', gap: 4, padding: '10px 14px', background: '#fff', borderRadius: 14, width: 'fit-content', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                {[0, 1, 2].map((item) => (
                  <div key={item} style={{ width: 8, height: 8, borderRadius: '50%', background: C.muted, animation: `pulse 1s ease-in-out ${item * 0.2}s infinite` }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {msgs.length <= 2 && (
            <div style={{ padding: '4px 10px 8px', display: 'flex', gap: 6, flexWrap: 'wrap', background: C.cream }}>
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => sendMsg(question)}
                  style={{
                    padding: '6px 11px',
                    borderRadius: 20,
                    border: `1px solid ${C.border}`,
                    background: '#fff',
                    color: C.dark,
                    fontSize: 11,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <div style={{ padding: '10px 12px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8, background: '#fff' }}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && sendMsg(input)}
              placeholder={t('chatbot.placeholder')}
              style={{ flex: 1, padding: '10px 14px', borderRadius: 24, border: `1px solid ${C.border}`, fontSize: 14, outline: 'none', background: C.cream }}
            />
            <button
              onClick={() => sendMsg(input)}
              disabled={!input.trim()}
              style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: input.trim() ? C.hibiscus : '#e5e7eb', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
            >
              <Icon type="send" size={16} color={input.trim() ? '#fff' : '#9ca3af'} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
