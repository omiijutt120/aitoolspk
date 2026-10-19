import { Search, MessageCircle, Check, ArrowRight } from 'lucide-react';
export function Steps() {
  const steps = [
    {
      icon: Search,
      title: 'Find your fit',
      text: 'Explore tools and compare the exact plan, price and warranty.',
    },
    {
      icon: MessageCircle,
      title: 'Start a conversation',
      text: 'Open WhatsApp with your chosen offer’s details already filled in.',
    },
    {
      icon: Check,
      title: 'Confirm, then order',
      text: 'Confirm eligibility, availability, payment and delivery with the seller.',
    },
  ];
  return (
    <div className="steps">
      {steps.map((s, i) => (
        <article key={s.title}>
          <div className="step-top">
            <span className="step-icon">
              <s.icon size={21} />
            </span>
            <span className="step-number">0{i + 1}</span>
            {i < 2 && <ArrowRight className="step-arrow" size={18} />}
          </div>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </article>
      ))}
    </div>
  );
}
