import { ArrowRightIcon, PhoneCallIcon, RocketIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { LogoCloud } from '@/components/ui/logo-cloud-3'
import { cn } from '@/lib/utils'

export function HeroSection() {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <div
        aria-hidden="true"
        className="absolute inset-0 isolate hidden overflow-hidden contain-strict lg:block"
      >
        <div className="absolute inset-0 -top-14 isolate -z-10 bg-[radial-gradient(35%_80%_at_49%_0%,--theme(--color-foreground/.08),transparent)] contain-strict" />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 mx-auto hidden min-h-screen w-full max-w-5xl lg:block"
      >
        <div className="absolute inset-y-0 left-0 z-10 h-full w-px bg-foreground/15 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
        <div className="absolute inset-y-0 right-0 z-10 h-full w-px bg-foreground/15 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
      </div>

      <div className="relative flex flex-col items-center justify-center gap-5 px-4 pt-32 pb-24 md:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 size-full overflow-hidden"
        >
          <div className="absolute inset-y-0 left-4 w-px bg-linear-to-b from-transparent via-border to-border md:left-8" />
          <div className="absolute inset-y-0 right-4 w-px bg-linear-to-b from-transparent via-border to-border md:right-8" />
          <div className="absolute inset-y-0 left-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:left-12" />
          <div className="absolute inset-y-0 right-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:right-12" />
        </div>

        <a
          className={cn(
            'group mx-auto flex w-fit items-center gap-3 rounded-full border bg-card px-3 py-1 shadow',
            'fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards transition-all delay-500 duration-500 ease-out'
          )}
          href="#features"
        >
          <RocketIcon className="size-3 text-muted-foreground" />
          <span className="text-xs">shipped new features!</span>
          <span className="block h-5 border-l" />
          <ArrowRightIcon className="size-3 duration-150 ease-out group-hover:translate-x-1" />
        </a>

        <h1
          className={cn(
            'fade-in slide-in-from-bottom-10 animate-in text-balance fill-mode-backwards text-center text-4xl tracking-tight delay-100 duration-500 ease-out md:text-5xl lg:text-6xl',
            'text-shadow-[0_0px_50px_theme(--color-foreground/.2)]'
          )}
        >
          Building Teams Help <br /> You Scale and Lead
        </h1>

        <p className="fade-in slide-in-from-bottom-10 mx-auto max-w-md animate-in fill-mode-backwards text-center text-base text-foreground/80 tracking-wider delay-200 duration-500 ease-out sm:text-lg md:text-xl">
          Connecting you with world-class talent <br /> to scale, innovate and
          lead
        </p>

        <div className="fade-in slide-in-from-bottom-10 flex animate-in flex-row flex-wrap items-center justify-center gap-3 fill-mode-backwards pt-2 delay-300 duration-500 ease-out">
          <Button asChild className="rounded-full" size="lg" variant="secondary">
            <a href="#pricing">
              <PhoneCallIcon data-icon="inline-start" className="mr-2 size-4" />
              Book a Call
            </a>
          </Button>
          <Button asChild className="rounded-full" size="lg">
            <a href="/dashboard">
              Get started
              <ArrowRightIcon className="ms-2 size-4" data-icon="inline-end" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

export function LogosSection() {
  return (
    <section className="relative space-y-4 border-t pt-6 pb-10">
      <h2 className="text-center text-lg font-medium tracking-tight text-muted-foreground md:text-xl">
        Trusted by <span className="text-foreground">experts</span>
      </h2>
      <div className="relative z-10 mx-auto max-w-4xl">
        <LogoCloud logos={logos} />
      </div>
    </section>
  )
}

const logos = [
  {
    src: 'https://storage.efferd.com/logo/nvidia-wordmark.svg',
    alt: 'Nvidia Logo',
  },
  {
    src: 'https://storage.efferd.com/logo/supabase-wordmark.svg',
    alt: 'Supabase Logo',
  },
  {
    src: 'https://storage.efferd.com/logo/openai-wordmark.svg',
    alt: 'OpenAI Logo',
  },
  {
    src: 'https://storage.efferd.com/logo/turso-wordmark.svg',
    alt: 'Turso Logo',
  },
  {
    src: 'https://storage.efferd.com/logo/vercel-wordmark.svg',
    alt: 'Vercel Logo',
  },
  {
    src: 'https://storage.efferd.com/logo/github-wordmark.svg',
    alt: 'GitHub Logo',
  },
  {
    src: 'https://storage.efferd.com/logo/claude-wordmark.svg',
    alt: 'Claude AI Logo',
  },
  {
    src: 'https://storage.efferd.com/logo/clerk-wordmark.svg',
    alt: 'Clerk Logo',
  },
]