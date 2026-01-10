# ShadowStats - Claude Code Instructions

## Project Context

You are building ShadowStats, a privacy-first trading analytics platform for Solana. This is a hackathon project for the Solana Privacy Hack 2026 (Track 03 - Open Category).

**Target Bounties:**
- Track 03 - Open Category: $15,000 (Light Protocol)
- Helius Bounty: $5,000 (Helius RPC integration)
- Encrypt.trade Bounty: $1,000 (educational content)

**Deadline:** February 1, 2026

---

## Core Requirements

### Hackathon Submission Requirements
1. Open source code on GitHub (public repository)
2. Integrate with Solana using privacy-preserving technology
3. Deploy to Solana devnet or mainnet
4. Demo video (maximum 3 minutes)
5. Documentation on how to run and use the project

### Technical Requirements
- Must use Light Protocol for ZK compression/privacy features
- Must use Helius RPC and Enhanced APIs for transaction data
- Must use Supabase for database and authentication
- Must deploy on Vercel

---

## Tech Stack (Do Not Deviate)

```
Frontend:       Next.js 14 (App Router), TypeScript, Tailwind CSS
State:          Zustand
Forms:          React Hook Form + Zod
Charts:         Recharts
Wallet:         @solana/wallet-adapter-react
Runtime:        Bun
Database:       Supabase (PostgreSQL)
Auth:           Supabase Auth (wallet signature)
Blockchain:     Helius RPC, Light Protocol, @solana/web3.js
Hosting:        Vercel
CI/CD:          GitHub Actions
Testing:        Vitest + Playwright
```

---

## Design System Rules

### Colors (Solana Theme - Dark)
```
Primary:        #14F195 (Solana green)
Secondary:      #9945FF (Solana purple)
Background:     #0D0D0D (main), #141414 (cards), #1A1A1A (elevated)
Border:         #2A2A2A (default), #3A3A3A (hover)
Text:           #FFFFFF (primary), #A0A0A0 (secondary), #666666 (tertiary)
Success:        #14F195
Warning:        #FFB800
Error:          #FF4D4D
```

### Typography
```
Font:           Inter (sans), JetBrains Mono (mono)
Sizes:          text-xs (12), text-sm (14), text-base (16), text-lg (18), text-xl (20), text-2xl (24)
Weights:        normal (400), medium (500), semibold (600), bold (700)
```

### Component Styling Rules
1. NO emojis anywhere in the UI
2. NO default exports (except page.tsx files)
3. Use Tailwind classes only, NO inline styles
4. All components must be responsive
5. Use semantic HTML
6. All interactive elements must have hover/focus states
7. Loading states with skeleton components
8. Error states with clear messaging

---

## Code Style Rules (Enforce Strictly)

### TypeScript
1. Strict mode always enabled
2. NO `any` types - use `unknown` and narrow
3. Explicit return types on all functions
4. Interface over type when possible
5. Props interface defined above component

### Imports
Order imports as follows:
```typescript
// 1. React/Next
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. External libraries
import { Connection } from '@solana/web3.js'

// 3. Internal modules (@/)
import { analyzeWallet } from '@/lib/analytics'

// 4. Components
import { Button } from '@/components/ui/button'

// 5. Types
import type { Analytics } from '@/types'
```

### Naming Conventions
```
Components:     PascalCase.tsx       (StatsCard.tsx)
Utilities:      kebab-case.ts        (format-date.ts)
Types:          kebab-case.ts        (analytics.ts)
Hooks:          use-*.ts             (use-analytics.ts)
Stores:         *-store.ts           (analytics-store.ts)
Constants:      SCREAMING_SNAKE      (MAX_TRANSACTIONS)
```

### Forbidden Patterns
```typescript
// NEVER DO:
const data: any = ...              // Use unknown + type narrowing
<div style={{ color: 'red' }}>    // Use Tailwind classes
console.log('debug')              // Remove all console.logs
export default function ...        // Use named exports
if (count > 1000)                 // Use constants, not magic numbers
const x = a ? b ? c : d : e       // No nested ternaries
const value = data!.property      // No non-null assertions
```

---

## Git Workflow Rules

### Branch Names
```
feature/[feature-name]    Feature branches
fix/[bug-name]            Bug fixes
refactor/[area]           Refactoring
```

### Commit Messages (Conventional Commits)
Format: `<type>(<scope>): <description>`

Types: feat, fix, docs, style, refactor, test, chore, perf, ci

Scopes: ui, api, lib, db, auth, analytics, report, wallet, light, helius

Examples:
```
feat(analytics): add win rate calculation
fix(wallet): resolve connection timeout on mobile
test(api): add integration tests for /api/analyze
chore(deps): update @solana/web3.js to 1.91.0
```

### Commit Rules
1. One logical change per commit
2. All commits must pass lint and typecheck
3. No WIP commits on main branch
4. No secrets or API keys in commits
5. Tests must pass before committing

---

## File Structure (Follow Exactly)

```
shadowstats/
├── .github/workflows/         # CI/CD
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── dashboard/
│   │   ├── report/[id]/
│   │   └── api/
│   ├── components/
│   │   ├── ui/               # Base components
│   │   ├── charts/           # Chart components
│   │   ├── wallet/           # Wallet components
│   │   ├── analytics/        # Analytics components
│   │   └── report/           # Report components
│   ├── lib/
│   │   ├── solana/           # Solana utilities
│   │   ├── helius/           # Helius SDK wrapper
│   │   ├── light/            # Light Protocol utilities
│   │   ├── supabase/         # Supabase client
│   │   └── utils/            # General utilities
│   ├── hooks/                # Custom hooks
│   ├── stores/               # Zustand stores
│   └── types/                # TypeScript types
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/
├── .env.example
├── DEVLOG.md                 # NOT COMMITTED
└── README.md
```

---

## API Route Template

```typescript
// src/app/api/[route]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const requestSchema = z.object({
  // Define schema
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const data = requestSchema.parse(body)

    // Implementation

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## Component Template

```typescript
// src/components/[category]/[name].tsx
import type { ReactNode } from 'react'

interface ComponentNameProps {
  // Props definition
}

export function ComponentName({ prop1, prop2 }: ComponentNameProps): JSX.Element {
  return (
    <div className="...">
      {/* Implementation */}
    </div>
  )
}
```

---

## Testing Requirements

### Unit Tests
- All utility functions must have tests
- All hooks must have tests
- Minimum 80% coverage for lib/

### Integration Tests
- All API routes must have tests
- Test success and error cases

### E2E Tests
- Wallet connection flow
- Analytics dashboard flow
- Report generation flow

---

## Documentation Requirements

### Every Commit Must Include
1. Clear commit message following convention
2. Updated types if API changed
3. Updated tests if logic changed

### Code Documentation
- JSDoc for all public functions
- Inline comments for complex logic only
- README updated for new features

---

## DEVLOG.md Rules

The DEVLOG.md file is for internal tracking only and must NOT be committed.

For each implementation session, record:
1. What was completed
2. Issues encountered and solutions
3. Technical decisions made
4. Time spent

---

## Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
HELIUS_API_KEY=
NEXT_PUBLIC_HELIUS_RPC_URL=
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Commands Reference

```bash
bun dev                    # Start dev server
bun build                  # Build for production
bun lint                   # Run ESLint
bun lint:fix               # Fix ESLint errors
bun format                 # Run Prettier
bun typecheck              # Run TypeScript check
bun test                   # Run all tests
bun test:unit              # Run unit tests
bun test:e2e               # Run E2E tests
```

---

## Implementation Order

Follow this exact order:

### Phase 1: Foundation (Day 1-2)
1. Initialize Next.js project with Bun
2. Configure Tailwind with Solana theme
3. Set up GitHub repository with CI/CD
4. Create base UI components (Button, Card, Input)
5. Set up Supabase project and schema

### Phase 2: Wallet (Day 3)
1. Implement wallet adapter provider
2. Create connect button and modal
3. Implement signature-based auth
4. Integrate with Supabase auth

### Phase 3: Analytics (Day 4-6)
1. Set up Helius SDK
2. Implement transaction fetching
3. Create transaction parser
4. Build analytics calculations
5. Create dashboard UI

### Phase 4: Privacy (Day 7-9)
1. Implement privacy score
2. Set up Light Protocol
3. Create report generation
4. Implement report verification
5. Build public report page

### Phase 5: Polish (Day 10-12)
1. Write tests
2. Improve error handling
3. Add loading states
4. Mobile responsiveness
5. Documentation

### Phase 6: Submit (Day 13)
1. Record demo video
2. Final testing
3. Submit to hackathon

---

## Critical Reminders

1. NO emojis in code or UI
2. NO console.logs in committed code
3. NO any types
4. NO inline styles
5. NO magic numbers
6. ALL commits must have proper messages
7. DEVLOG.md must NOT be committed
8. Tests before merging to main
9. Use Light Protocol for privacy features
10. Use Helius for all blockchain data

---

## When Starting Each Session

1. Pull latest from main
2. Create feature branch
3. Open DEVLOG.md
4. Work on implementation
5. Write tests
6. Commit with proper message
7. Update DEVLOG.md
8. Push and create PR (if ready)

---

*Follow these instructions precisely. When in doubt, ask for clarification before proceeding.*
