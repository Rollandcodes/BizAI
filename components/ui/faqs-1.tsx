import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type FaqDictionary = {
  faqTitle: string;
  faqDescription: string;
};

type Props = {
  dictionary: FaqDictionary;
};

export function FaqsSection({ dictionary }: Props) {
  const questions = [
    {
      id: 'item-1',
      title: 'Do I need technical knowledge?',
      content: 'No. CypAI installs easily with one line of code.',
    },
    {
      id: 'item-2',
      title: 'Which languages does the AI support?',
      content: 'The AI can communicate in English, Turkish, and many other languages.',
    },
    {
      id: 'item-3',
      title: 'Can it connect to WhatsApp?',
      content: 'Yes. WhatsApp integration is available on the Business plan.',
    },
    {
      id: 'item-4',
      title: 'How long does setup take?',
      content: 'Setup typically takes 24 hours. We configure your AI, train it, and test before going live.',
    },
    {
      id: 'item-5',
      title: 'How is customer data protected?',
      content: 'We use secure infrastructure and encrypted transport to protect customer conversations and lead data.',
    },
  ];

  return (
    <section id="faq" className="mx-auto w-full max-w-3xl space-y-7 px-4 pt-16 pb-20">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold md:text-4xl">{dictionary.faqTitle}</h2>
        <p className="text-muted-foreground max-w-2xl">{dictionary.faqDescription}</p>
      </div>
      <Accordion
        type="single"
        collapsible
        className="bg-card w-full -space-y-px rounded-lg"
        defaultValue="item-1"
      >
        {questions.map((item) => (
          <AccordionItem
            value={item.id}
            key={item.id}
            data-testid="faq-item"
            className="relative border-x first:rounded-t-lg first:border-t last:rounded-b-lg last:border-b"
          >
            <AccordionTrigger data-testid="faq-question" className="px-4 py-4 text-[15px] leading-6 hover:no-underline">
              {item.title}
            </AccordionTrigger>
            <AccordionContent data-testid="faq-answer" className="text-muted-foreground pb-4 px-4">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
