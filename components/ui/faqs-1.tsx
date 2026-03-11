import React from 'react';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';

export function FaqsSection() {
	return (
		<div className="mx-auto w-full max-w-3xl space-y-7 px-4 pt-16 pb-20">
			<div className="space-y-2">
				<h2 className="text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
				<p className="text-muted-foreground max-w-2xl">
					Everything you need to know about BizAI. Can't find the answer you're looking for? Feel
					free to reach out to our support team.
				</p>
			</div>
			<Accordion
				type="single"
				collapsible
				className="bg-card dark:bg-card/50 w-full -space-y-px rounded-lg"
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
			<p className="text-muted-foreground">
				Can't find what you're looking for? Contact our{' '}
				<a href="mailto:support@bizai.example.com" className="text-primary hover:underline">
					customer support team
				</a>
			</p>
		</div>
	);
}

const questions = [
	{
		id: 'item-1',
		title: 'How long does setup take?',
		content:
			'Setup typically takes 24 hours. We configure your AI, train it, and test before going live.',
	},
	{
		id: 'item-2',
		title: 'Do I need any technical knowledge to use BizAI?',
		content:
			'No technical knowledge required. We handle setup.',
	},
	{
		id: 'item-3',
		title: 'Which languages does the AI support?',
		content:
			'Languages: English, Turkish, Arabic, Russian.',
	},
	{
		id: 'item-4',
		title: 'Is WhatsApp integration available?',
		content:
			'WhatsApp integration: Yes, auto-replies and lead capture.',
	},
	{
		id: 'item-5',
		title: 'Do you offer a free trial?',
		content:
			'Yes. All plans include a 7-day trial so you can test performance before committing.',
	},
	{
		id: 'item-6',
		title: 'What if I need to cancel?',
		content:
			'You can cancel anytime with no penalties or cancellation fees. Your data remains accessible for 30 days after cancellation, giving you enough time to export anything you need.',
	},
	{
		id: 'item-7',
		title: 'How is my customer data protected?',
		content:
			'We use enterprise-grade encryption in transit and at rest. BizAI complies with GDPR, CCPA, and other major privacy regulations. All data is stored in secure US-based data centers.',
	},
	{
		id: 'item-8',
		title: 'Can I upgrade or downgrade my plan?',
		content:
			'Yes, you can change your plan at any time from your dashboard. Upgrades take effect immediately. Downgrades apply at the start of the next billing cycle, and we prorate any charges automatically.',
	},
];
