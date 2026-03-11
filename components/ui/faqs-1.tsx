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
						className="relative border-x first:rounded-t-lg first:border-t last:rounded-b-lg last:border-b"
					>
						<AccordionTrigger className="px-4 py-4 text-[15px] leading-6 hover:no-underline">
							{item.title}
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground pb-4 px-4">
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
			'Setup typically takes 24 hours. We configure your AI assistant, train it on your business information, and test everything before going live. You\'ll receive a confirmation email once your assistant is ready.',
	},
	{
		id: 'item-2',
		title: 'Do I need any technical knowledge to use BizAI?',
		content:
			'No technical knowledge required. After signing up, you simply copy and paste one line of code onto your website. We handle all the AI configuration and training for you.',
	},
	{
		id: 'item-3',
		title: 'What channels does the AI support?',
		content:
			'Our Starter plan covers website chat. The Pro plan adds WhatsApp integration. The Business plan includes phone support on top of chat and WhatsApp — so your customers can reach you anywhere.',
	},
	{
		id: 'item-4',
		title: 'Do you offer a free trial?',
		content:
			'Yes! All plans come with a 7-day free trial. No credit card required to get started. You can explore all features risk-free and only pay if you decide to continue.',
	},
	{
		id: 'item-5',
		title: 'What if I need to cancel?',
		content:
			'You can cancel anytime with no penalties or cancellation fees. Your data remains accessible for 30 days after cancellation, giving you enough time to export anything you need.',
	},
	{
		id: 'item-6',
		title: 'How is my customer data protected?',
		content:
			'We use enterprise-grade encryption in transit and at rest. BizAI complies with GDPR, CCPA, and other major privacy regulations. All data is stored in secure US-based data centers.',
	},
	{
		id: 'item-7',
		title: 'Can I upgrade or downgrade my plan?',
		content:
			'Yes, you can change your plan at any time from your dashboard. Upgrades take effect immediately. Downgrades apply at the start of the next billing cycle, and we prorate any charges automatically.',
	},
];
