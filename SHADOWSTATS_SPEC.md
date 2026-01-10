# ShadowStats - Project Specification

## Solana Privacy Hack 2026 | Track 03 - Categoria Aberta

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technical Stack](#technical-stack)
3. [Architecture](#architecture)
4. [Features Specification](#features-specification)
5. [Design System](#design-system)
6. [Database Schema](#database-schema)
7. [API Specification](#api-specification)
8. [CI/CD Pipeline](#cicd-pipeline)
9. [Git Workflow](#git-workflow)
10. [Development Rules](#development-rules)
11. [Testing Strategy](#testing-strategy)
12. [Deployment](#deployment)
13. [Documentation Requirements](#documentation-requirements)

---

## Project Overview

### Vision

ShadowStats is a privacy-first trading analytics platform for Solana. It allows traders to analyze their trading history and generate verifiable proof of their performance without exposing their wallet address or transaction details.

### Problem Statement

Crypto traders face a fundamental privacy dilemma: analyzing trading performance requires exposing wallet addresses, which reveals trading strategies, portfolio size, and transaction patterns to competitors, front-runners, and malicious actors.

### Solution

A platform that:
- Fetches and analyzes trading data locally
- Generates ZK proofs of trading statistics
- Produces shareable "Privacy Reports" that verify performance claims without revealing the wallet
- Uses Light Protocol for compressed, privacy-preserving state

### Target Bounties

| Bounty | Prize | Integration |
|--------|-------|-------------|
| Track 03 - Open | $15,000 | Light Protocol ZK Compression |
| Helius | $5,000 | Helius RPC and Enhanced APIs |
| Encrypt.trade | $1,000 | Educational content (separate) |

### Hackathon Requirements Checklist

- [ ] Open source code (GitHub public repository)
- [ ] Solana integration with privacy-preserving technology
- [ ] Deployed to Solana devnet or mainnet
- [ ] Demo video (maximum 3 minutes)
- [ ] Documentation on how to run and use the project

---

## Technical Stack

### Frontend

```
Framework:      Next.js 14 (App Router)
Language:       TypeScript 5.x
Styling:        Tailwind CSS 3.x
State:          Zustand
Forms:          React Hook Form + Zod
Charts:         Recharts
Wallet:         @solana/wallet-adapter-react
```

### Backend

```
Runtime:        Bun 1.x
Framework:      Hono (lightweight, fast)
Language:       TypeScript 5.x
Validation:     Zod
```

### Database

```
Provider:       Supabase
Database:       PostgreSQL 15
Auth:           Supabase Auth (wallet signature)
Storage:        Supabase Storage (reports)
Realtime:       Supabase Realtime (optional)
```

### Blockchain

```
Network:        Solana (Devnet → Mainnet)
RPC:            Helius (primary), Triton (fallback)
Privacy:        Light Protocol (@lightprotocol/stateless.js)
Tokens:         @lightprotocol/compressed-token
Web3:           @solana/web3.js
```

### Infrastructure

```
Hosting:        Vercel (frontend)
API:            Vercel Serverless / Railway
CI/CD:          GitHub Actions
Monitoring:     Vercel Analytics
```

### Development Tools

```
Package Manager: Bun
Linting:         ESLint + Prettier
Testing:         Vitest + Testing Library
E2E:             Playwright
Git Hooks:       Husky + lint-staged
```

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│  Next.js 14 App Router                                              │
│  ├── /app                                                           │
│  │   ├── page.tsx              (Landing)                            │
│  │   ├── /dashboard            (Main analytics)                     │
│  │   ├── /report/[id]          (Public report view)                 │
│  │   └── /api                  (API routes)                         │
│  ├── /components                                                    │
│  │   ├── /ui                   (Base components)                    │
│  │   ├── /charts               (Recharts wrappers)                  │
│  │   ├── /wallet               (Wallet connection)                  │
│  │   └── /analytics            (Stats displays)                     │
│  └── /lib                                                           │
│      ├── /solana               (Blockchain utils)                   │
│      ├── /helius               (Helius SDK wrapper)                 │
│      ├── /light                (Light Protocol utils)               │
│      └── /supabase             (Database client)                    │
├─────────────────────────────────────────────────────────────────────┤
│                           SERVICE LAYER                              │
├─────────────────────────────────────────────────────────────────────┤
│  API Routes (Next.js)                                               │
│  ├── /api/analyze              (Fetch + analyze transactions)       │
│  ├── /api/report/generate      (Create privacy report)              │
│  ├── /api/report/verify        (Verify ZK proof)                    │
│  └── /api/auth                 (Wallet auth)                        │
├─────────────────────────────────────────────────────────────────────┤
│                           DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│  Supabase                      │  Blockchain                        │
│  ├── reports (table)           │  ├── Helius RPC                    │
│  ├── users (table)             │  ├── Helius Enhanced API           │
│  └── analytics_cache (table)   │  └── Light Protocol                │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
1. User connects wallet
   └── Wallet Adapter → Sign message → Verify signature

2. User requests analysis
   └── Frontend → API Route → Helius Enhanced API
       └── Parse transactions → Calculate stats → Return to frontend

3. User generates Privacy Report
   └── Frontend → API Route → Light Protocol
       └── Create compressed account → Generate ZK proof
           └── Store proof hash in Supabase → Return shareable link

4. Third party verifies report
   └── Load report page → Fetch proof from Supabase
       └── Verify against Light Protocol → Display verified stats
```

### Directory Structure

```
shadowstats/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── cd.yml
│       └── test.yml
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── report/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── api/
│   │       ├── analyze/
│   │       │   └── route.ts
│   │       ├── report/
│   │       │   ├── generate/
│   │       │   │   └── route.ts
│   │       │   └── verify/
│   │       │       └── route.ts
│   │       └── auth/
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── toast.tsx
│   │   ├── charts/
│   │   │   ├── performance-chart.tsx
│   │   │   ├── volume-chart.tsx
│   │   │   └── distribution-chart.tsx
│   │   ├── wallet/
│   │   │   ├── wallet-provider.tsx
│   │   │   ├── connect-button.tsx
│   │   │   └── wallet-modal.tsx
│   │   ├── analytics/
│   │   │   ├── stats-card.tsx
│   │   │   ├── trade-summary.tsx
│   │   │   └── privacy-score.tsx
│   │   └── report/
│   │       ├── report-generator.tsx
│   │       ├── report-preview.tsx
│   │       └── report-share.tsx
│   ├── lib/
│   │   ├── solana/
│   │   │   ├── connection.ts
│   │   │   ├── utils.ts
│   │   │   └── constants.ts
│   │   ├── helius/
│   │   │   ├── client.ts
│   │   │   ├── parser.ts
│   │   │   └── types.ts
│   │   ├── light/
│   │   │   ├── client.ts
│   │   │   ├── proof.ts
│   │   │   └── types.ts
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── types.ts
│   │   └── utils/
│   │       ├── analytics.ts
│   │       ├── format.ts
│   │       └── validation.ts
│   ├── hooks/
│   │   ├── use-wallet-auth.ts
│   │   ├── use-analytics.ts
│   │   └── use-report.ts
│   ├── stores/
│   │   ├── analytics-store.ts
│   │   └── ui-store.ts
│   └── types/
│       ├── analytics.ts
│       ├── report.ts
│       └── api.ts
├── tests/
│   ├── unit/
│   │   ├── lib/
│   │   └── components/
│   ├── integration/
│   │   └── api/
│   └── e2e/
│       └── flows/
├── public/
│   ├── fonts/
│   └── images/
├── scripts/
│   ├── setup-db.ts
│   └── seed-data.ts
├── .env.example
├── .env.local (not committed)
├── .eslintrc.json
├── .prettierrc
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── package.json
├── bun.lockb
├── DEVLOG.md (not committed)
└── README.md
```

---

## Features Specification

### MVP Features (Hackathon Scope)

#### F1: Wallet Connection
- Connect Phantom, Solflare, Backpack wallets
- Sign message for authentication
- Persist session

#### F2: Transaction Analysis
- Fetch last 1000 transactions via Helius
- Parse swap transactions (Jupiter, Raydium, Orca)
- Calculate metrics:
  - Total volume (in USD)
  - Number of trades
  - Win rate (profitable vs unprofitable swaps)
  - Average trade size
  - Most traded tokens
  - Trading frequency

#### F3: Analytics Dashboard
- Overview stats cards
- Performance chart (PnL over time)
- Volume distribution chart
- Token allocation chart
- Trading activity heatmap

#### F4: Privacy Score
- Calculate how "exposed" the wallet is
- Factors: number of public txs, value exposed, counterparty diversity
- Display score 0-100

#### F5: Privacy Report Generation
- Select stats to include in report
- Generate ZK proof via Light Protocol
- Create compressed account with stats ranges
- Store proof reference in Supabase
- Generate shareable link

#### F6: Report Verification
- Public page for report viewing
- Verify ZK proof on-chain
- Display verified stats with confidence indicator

### Post-Hackathon Features (Future)

- Historical data beyond 1000 txs
- Multi-wallet aggregation
- Export to PDF
- API for third-party integrations
- Mobile app

---

## Design System

### Color Palette

```css
/* Solana-inspired dark theme */
:root {
  /* Primary - Solana gradient colors */
  --color-primary-400: #14F195;      /* Solana green */
  --color-primary-500: #00D18C;
  --color-primary-600: #00B377;
  
  /* Secondary - Solana purple */
  --color-secondary-400: #9945FF;    /* Solana purple */
  --color-secondary-500: #7B2FE8;
  --color-secondary-600: #5E1FBF;
  
  /* Accent - Solana gradient mix */
  --color-accent-400: #00C2FF;
  --color-accent-500: #00A3D9;
  
  /* Backgrounds */
  --color-bg-primary: #0D0D0D;       /* Main background */
  --color-bg-secondary: #141414;     /* Cards */
  --color-bg-tertiary: #1A1A1A;      /* Elevated elements */
  --color-bg-hover: #242424;         /* Hover states */
  
  /* Borders */
  --color-border-default: #2A2A2A;
  --color-border-hover: #3A3A3A;
  --color-border-focus: #14F195;
  
  /* Text */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #A0A0A0;
  --color-text-tertiary: #666666;
  --color-text-inverse: #0D0D0D;
  
  /* Semantic */
  --color-success: #14F195;
  --color-warning: #FFB800;
  --color-error: #FF4D4D;
  --color-info: #00C2FF;
}
```

### Typography

```css
/* Font stack - System fonts with Inter as primary */
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
}

/* Scale */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing

```css
/* 4px base unit */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Border Radius

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
--shadow-glow-green: 0 0 20px rgba(20, 241, 149, 0.3);
--shadow-glow-purple: 0 0 20px rgba(153, 69, 255, 0.3);
```

### Component Styles

#### Buttons

```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, #14F195 0%, #9945FF 100%);
  color: #0D0D0D;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  box-shadow: 0 0 20px rgba(20, 241, 149, 0.4);
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #FFFFFF;
  border: 1px solid #2A2A2A;
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  border-color: #14F195;
  color: #14F195;
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: #A0A0A0;
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: #1A1A1A;
  color: #FFFFFF;
}
```

#### Cards

```css
.card {
  background: #141414;
  border: 1px solid #2A2A2A;
  border-radius: 12px;
  padding: 24px;
}

.card:hover {
  border-color: #3A3A3A;
}

.card-highlight {
  background: linear-gradient(135deg, rgba(20, 241, 149, 0.05) 0%, rgba(153, 69, 255, 0.05) 100%);
  border: 1px solid rgba(20, 241, 149, 0.2);
}
```

#### Inputs

```css
.input {
  background: #1A1A1A;
  border: 1px solid #2A2A2A;
  border-radius: 8px;
  padding: 12px 16px;
  color: #FFFFFF;
  font-size: 14px;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #14F195;
  box-shadow: 0 0 0 3px rgba(20, 241, 149, 0.1);
}

.input::placeholder {
  color: #666666;
}
```

### Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#14F195',
          500: '#00D18C',
          600: '#00B377',
        },
        secondary: {
          400: '#9945FF',
          500: '#7B2FE8',
          600: '#5E1FBF',
        },
        accent: {
          400: '#00C2FF',
          500: '#00A3D9',
        },
        bg: {
          primary: '#0D0D0D',
          secondary: '#141414',
          tertiary: '#1A1A1A',
          hover: '#242424',
        },
        border: {
          default: '#2A2A2A',
          hover: '#3A3A3A',
          focus: '#14F195',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A0A0A0',
          tertiary: '#666666',
        },
        success: '#14F195',
        warning: '#FFB800',
        error: '#FF4D4D',
        info: '#00C2FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(20, 241, 149, 0.3)',
        'glow-purple': '0 0 20px rgba(153, 69, 255, 0.3)',
      },
      backgroundImage: {
        'gradient-solana': 'linear-gradient(135deg, #14F195 0%, #9945FF 100%)',
        'gradient-solana-subtle': 'linear-gradient(135deg, rgba(20, 241, 149, 0.1) 0%, rgba(153, 69, 255, 0.1) 100%)',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## Database Schema

### Supabase Tables

```sql
-- Users table (linked to wallet)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_analysis_at TIMESTAMP WITH TIME ZONE,
  settings JSONB DEFAULT '{}'::jsonb
);

-- Create index for wallet lookups
CREATE INDEX idx_users_wallet ON users(wallet_address);

-- Reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Report metadata
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_public BOOLEAN DEFAULT true,
  
  -- Stats ranges (what's shown publicly)
  volume_range TEXT NOT NULL,          -- e.g., "$10k-$50k"
  trade_count_range TEXT NOT NULL,     -- e.g., "100-500"
  win_rate_range TEXT NOT NULL,        -- e.g., "60-70%"
  avg_trade_size_range TEXT NOT NULL,  -- e.g., "$100-$500"
  trading_period_days INTEGER NOT NULL,
  
  -- ZK Proof data
  proof_hash TEXT NOT NULL,
  compressed_account_address TEXT,
  verification_tx TEXT,
  
  -- Privacy metadata
  wallet_hash TEXT NOT NULL,           -- Hash of wallet, not actual address
  
  CONSTRAINT unique_proof UNIQUE(proof_hash)
);

-- Create indexes
CREATE INDEX idx_reports_user ON reports(user_id);
CREATE INDEX idx_reports_proof ON reports(proof_hash);
CREATE INDEX idx_reports_created ON reports(created_at DESC);

-- Analytics cache (optional, for faster repeat analysis)
CREATE TABLE analytics_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Cache metadata
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  tx_count INTEGER NOT NULL,
  last_tx_signature TEXT,
  
  -- Cached analytics (encrypted or hashed)
  analytics_data JSONB NOT NULL,
  
  CONSTRAINT one_cache_per_user UNIQUE(user_id)
);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_cache ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Anyone can read public reports" ON reports
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can read own reports" ON reports
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create reports" ON reports
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own cache" ON analytics_cache
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own cache" ON analytics_cache
  FOR ALL USING (user_id = auth.uid());
```

### TypeScript Types

```typescript
// src/types/database.ts
export interface User {
  id: string
  wallet_address: string
  created_at: string
  updated_at: string
  last_analysis_at: string | null
  settings: UserSettings
}

export interface UserSettings {
  defaultReportExpiry?: number  // days
  preferredCurrency?: string
  notifications?: boolean
}

export interface Report {
  id: string
  user_id: string
  title: string | null
  created_at: string
  expires_at: string | null
  is_public: boolean
  volume_range: string
  trade_count_range: string
  win_rate_range: string
  avg_trade_size_range: string
  trading_period_days: number
  proof_hash: string
  compressed_account_address: string | null
  verification_tx: string | null
  wallet_hash: string
}

export interface AnalyticsCache {
  id: string
  user_id: string
  cached_at: string
  valid_until: string
  tx_count: number
  last_tx_signature: string
  analytics_data: AnalyticsData
}

export interface AnalyticsData {
  totalVolume: number
  tradeCount: number
  winRate: number
  avgTradeSize: number
  profitLoss: number
  topTokens: TokenStat[]
  tradingDays: number
  firstTradeDate: string
  lastTradeDate: string
}

export interface TokenStat {
  mint: string
  symbol: string
  volume: number
  trades: number
}
```

---

## API Specification

### Endpoints

#### POST /api/auth

Authenticate user with wallet signature.

```typescript
// Request
{
  wallet: string
  signature: string
  message: string
}

// Response 200
{
  user: User
  token: string
}

// Response 401
{
  error: "Invalid signature"
}
```

#### POST /api/analyze

Analyze wallet transactions.

```typescript
// Request
{
  wallet: string
  limit?: number       // default 1000
  refresh?: boolean    // force refresh cache
}

// Response 200
{
  analytics: AnalyticsData
  cached: boolean
  analyzedAt: string
}

// Response 400
{
  error: "Invalid wallet address"
}
```

#### POST /api/report/generate

Generate privacy report with ZK proof.

```typescript
// Request
{
  wallet: string
  title?: string
  expiresInDays?: number
  includeStats: {
    volume: boolean
    tradeCount: boolean
    winRate: boolean
    avgTradeSize: boolean
  }
}

// Response 200
{
  report: Report
  shareUrl: string
}

// Response 500
{
  error: "Failed to generate proof"
}
```

#### GET /api/report/[id]

Get report by ID.

```typescript
// Response 200
{
  report: Report
  verified: boolean
  verifiedAt: string
}

// Response 404
{
  error: "Report not found"
}
```

#### POST /api/report/verify

Verify report ZK proof.

```typescript
// Request
{
  reportId: string
}

// Response 200
{
  valid: boolean
  verifiedAt: string
  onChainProof: string
}
```

---

## CI/CD Pipeline

### GitHub Actions Workflows

#### ci.yml - Continuous Integration

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '20'
  BUN_VERSION: 'latest'

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: ${{ env.BUN_VERSION }}
      
      - name: Install dependencies
        run: bun install --frozen-lockfile
      
      - name: Run ESLint
        run: bun run lint
      
      - name: Run Prettier check
        run: bun run format:check

  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: ${{ env.BUN_VERSION }}
      
      - name: Install dependencies
        run: bun install --frozen-lockfile
      
      - name: Run TypeScript check
        run: bun run typecheck

  test-unit:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: ${{ env.BUN_VERSION }}
      
      - name: Install dependencies
        run: bun install --frozen-lockfile
      
      - name: Run unit tests
        run: bun run test:unit
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  test-integration:
    name: Integration Tests
    runs-on: ubuntu-latest
    env:
      NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      HELIUS_API_KEY: ${{ secrets.HELIUS_API_KEY }}
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: ${{ env.BUN_VERSION }}
      
      - name: Install dependencies
        run: bun install --frozen-lockfile
      
      - name: Run integration tests
        run: bun run test:integration

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test-unit]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: ${{ env.BUN_VERSION }}
      
      - name: Install dependencies
        run: bun install --frozen-lockfile
      
      - name: Build application
        run: bun run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: .next/
```

#### cd.yml - Continuous Deployment

```yaml
# .github/workflows/cd.yml
name: CD

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  deploy-preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    if: github.ref != 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
      
      - name: Install Vercel CLI
        run: bun add -g vercel@latest
      
      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy to Preview
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}

  deploy-production:
    name: Deploy Production
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
      
      - name: Install Vercel CLI
        run: bun add -g vercel@latest
      
      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy to Production
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Notify deployment
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.repos.createCommitComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              commit_sha: context.sha,
              body: 'Deployed to production'
            })
```

#### test.yml - E2E Tests

```yaml
# .github/workflows/test.yml
name: E2E Tests

on:
  deployment_status:

jobs:
  e2e:
    name: Playwright Tests
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success'
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
      
      - name: Install dependencies
        run: bun install --frozen-lockfile
      
      - name: Install Playwright browsers
        run: bunx playwright install --with-deps chromium
      
      - name: Run E2E tests
        run: bun run test:e2e
        env:
          PLAYWRIGHT_BASE_URL: ${{ github.event.deployment_status.target_url }}
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Git Workflow

### Branch Strategy

```
main                 Production branch (protected)
├── develop          Development branch (default)
│   ├── feature/*    Feature branches
│   ├── fix/*        Bug fix branches
│   └── refactor/*   Refactoring branches
```

### Commit Convention

Follow Conventional Commits specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

#### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, semicolons, etc) |
| `refactor` | Code refactoring |
| `test` | Adding or updating tests |
| `chore` | Build process, dependencies, etc |
| `perf` | Performance improvement |
| `ci` | CI/CD changes |

#### Scopes

| Scope | Description |
|-------|-------------|
| `ui` | UI components |
| `api` | API routes |
| `lib` | Library code |
| `db` | Database related |
| `auth` | Authentication |
| `analytics` | Analytics features |
| `report` | Report generation |
| `wallet` | Wallet integration |
| `light` | Light Protocol integration |
| `helius` | Helius integration |

#### Examples

```bash
feat(analytics): add win rate calculation

fix(wallet): resolve connection timeout on mobile

docs(readme): update installation instructions

test(api): add integration tests for /api/analyze

chore(deps): update @solana/web3.js to 1.91.0

refactor(lib): extract transaction parser to separate module
```

### Commit Checklist

Before each commit:

1. [ ] Code compiles without errors
2. [ ] All tests pass
3. [ ] Linting passes
4. [ ] No sensitive data (API keys, secrets)
5. [ ] Commit message follows convention
6. [ ] Changes are logically grouped

### Husky Configuration

```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

bunx lint-staged
```

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

bunx --no -- commitlint --edit ${1}
```

---

## Development Rules

### Code Style Rules

1. **TypeScript Strict Mode**: Always enabled, no `any` types allowed
2. **Explicit Return Types**: All functions must have explicit return types
3. **No Default Exports**: Use named exports only (except pages)
4. **Absolute Imports**: Use `@/` prefix for all imports
5. **Component Structure**: One component per file
6. **Props Interface**: Define props interface above component
7. **No Inline Styles**: Use Tailwind classes only
8. **No Magic Numbers**: Define constants for all values
9. **Error Handling**: Always handle errors with try/catch
10. **Comments**: Only for complex logic, code should be self-documenting

### File Naming

```
Components:     PascalCase.tsx      (StatsCard.tsx)
Utilities:      kebab-case.ts       (format-date.ts)
Types:          kebab-case.ts       (analytics.ts)
Hooks:          use-*.ts            (use-analytics.ts)
Stores:         *-store.ts          (analytics-store.ts)
Tests:          *.test.ts           (analytics.test.ts)
```

### Import Order

```typescript
// 1. React/Next
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 2. External libraries
import { Connection } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'

// 3. Internal modules (@/)
import { analyzeTransactions } from '@/lib/analytics'
import { useAnalytics } from '@/hooks/use-analytics'

// 4. Components
import { StatsCard } from '@/components/analytics/stats-card'
import { Button } from '@/components/ui/button'

// 5. Types
import type { AnalyticsData } from '@/types/analytics'

// 6. Styles (if any)
import './styles.css'
```

### Component Template

```typescript
// src/components/analytics/stats-card.tsx
import { Card } from '@/components/ui/card'
import type { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  icon?: ReactNode
}

export function StatsCard({ title, value, change, icon }: StatsCardProps): JSX.Element {
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <span className="text-text-secondary text-sm">{title}</span>
        {icon && <span className="text-text-tertiary">{icon}</span>}
      </div>
      <div className="mt-2">
        <span className="text-2xl font-semibold text-text-primary">{value}</span>
      </div>
      {change !== undefined && (
        <div className="mt-2">
          <span
            className={`text-sm ${
              isPositive ? 'text-success' : isNegative ? 'text-error' : 'text-text-tertiary'
            }`}
          >
            {isPositive ? '+' : ''}{change}%
          </span>
        </div>
      )}
    </Card>
  )
}
```

### API Route Template

```typescript
// src/app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { analyzeWallet } from '@/lib/analytics'
import { createServerClient } from '@/lib/supabase/server'

const requestSchema = z.object({
  wallet: z.string().min(32).max(44),
  limit: z.number().min(1).max(1000).default(1000),
  refresh: z.boolean().default(false),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { wallet, limit, refresh } = requestSchema.parse(body)

    const supabase = createServerClient()
    const analytics = await analyzeWallet(wallet, { limit, refresh })

    return NextResponse.json({
      analytics,
      cached: !refresh,
      analyzedAt: new Date().toISOString(),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Forbidden Patterns

```typescript
// NEVER do these:

// 1. Using 'any'
const data: any = response  // BAD
const data: unknown = response  // GOOD (then narrow type)

// 2. Inline styles
<div style={{ color: 'red' }}>  // BAD
<div className="text-error">   // GOOD

// 3. Console.log in production
console.log('debug')  // BAD (remove before commit)

// 4. Hardcoded secrets
const API_KEY = 'abc123'  // BAD
const API_KEY = process.env.API_KEY  // GOOD

// 5. Default exports (except pages)
export default function Component()  // BAD
export function Component()          // GOOD

// 6. Magic numbers
if (count > 1000)  // BAD
if (count > MAX_TRANSACTIONS)  // GOOD

// 7. Nested ternaries
const x = a ? b ? c : d : e  // BAD
// Use if/else or early returns

// 8. Non-null assertions
const value = data!.property  // BAD
const value = data?.property ?? defaultValue  // GOOD
```

---

## Testing Strategy

### Test Structure

```
tests/
├── unit/                    # Unit tests (isolated)
│   ├── lib/
│   │   ├── analytics.test.ts
│   │   ├── format.test.ts
│   │   └── validation.test.ts
│   └── components/
│       ├── stats-card.test.tsx
│       └── button.test.tsx
├── integration/             # Integration tests (with deps)
│   └── api/
│       ├── analyze.test.ts
│       └── report.test.ts
└── e2e/                     # End-to-end tests
    └── flows/
        ├── connect-wallet.spec.ts
        ├── view-analytics.spec.ts
        └── generate-report.spec.ts
```

### Unit Test Example

```typescript
// tests/unit/lib/analytics.test.ts
import { describe, it, expect } from 'vitest'
import { calculateWinRate, formatVolume } from '@/lib/utils/analytics'

describe('calculateWinRate', () => {
  it('returns 0 when no trades', () => {
    expect(calculateWinRate([])).toBe(0)
  })

  it('calculates correct win rate', () => {
    const trades = [
      { profit: 100 },
      { profit: -50 },
      { profit: 200 },
      { profit: -30 },
    ]
    expect(calculateWinRate(trades)).toBe(50)
  })

  it('returns 100 when all trades profitable', () => {
    const trades = [
      { profit: 100 },
      { profit: 50 },
    ]
    expect(calculateWinRate(trades)).toBe(100)
  })
})

describe('formatVolume', () => {
  it('formats thousands', () => {
    expect(formatVolume(1500)).toBe('$1.5K')
  })

  it('formats millions', () => {
    expect(formatVolume(1500000)).toBe('$1.5M')
  })

  it('formats with decimals', () => {
    expect(formatVolume(1234567)).toBe('$1.23M')
  })
})
```

### Integration Test Example

```typescript
// tests/integration/api/analyze.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createServer } from '@/test-utils/server'

describe('POST /api/analyze', () => {
  let server: ReturnType<typeof createServer>

  beforeAll(async () => {
    server = await createServer()
  })

  afterAll(async () => {
    await server.close()
  })

  it('returns analytics for valid wallet', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/analyze',
      payload: {
        wallet: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
        limit: 100,
      },
    })

    expect(response.statusCode).toBe(200)
    const body = JSON.parse(response.body)
    expect(body).toHaveProperty('analytics')
    expect(body.analytics).toHaveProperty('totalVolume')
    expect(body.analytics).toHaveProperty('tradeCount')
  })

  it('returns 400 for invalid wallet', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/analyze',
      payload: {
        wallet: 'invalid',
      },
    })

    expect(response.statusCode).toBe(400)
  })
})
```

### E2E Test Example

```typescript
// tests/e2e/flows/generate-report.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Generate Report Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
    // Mock wallet connection
    await page.evaluate(() => {
      window.mockWallet = {
        publicKey: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
        connected: true,
      }
    })
  })

  test('generates shareable report', async ({ page }) => {
    // Wait for analytics to load
    await expect(page.getByTestId('stats-card-volume')).toBeVisible()

    // Click generate report
    await page.getByRole('button', { name: 'Generate Report' }).click()

    // Fill report options
    await page.getByLabel('Report Title').fill('My Trading Performance')
    await page.getByLabel('Include Win Rate').check()
    await page.getByLabel('Include Volume').check()

    // Generate
    await page.getByRole('button', { name: 'Create Report' }).click()

    // Wait for report generation
    await expect(page.getByText('Report Generated')).toBeVisible({ timeout: 30000 })

    // Verify shareable link
    const shareLink = await page.getByTestId('share-link').textContent()
    expect(shareLink).toMatch(/\/report\/[a-f0-9-]+/)
  })
})
```

### Test Commands

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run tests/unit",
    "test:integration": "vitest run tests/integration",
    "test:e2e": "playwright test",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## Deployment

### Environment Variables

```bash
# .env.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Helius
HELIUS_API_KEY=xxx
NEXT_PUBLIC_HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=xxx

# Solana
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Vercel (set in dashboard)
# VERCEL_ORG_ID
# VERCEL_PROJECT_ID
# VERCEL_TOKEN
```

### Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "bun run build",
  "installCommand": "bun install",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_SOLANA_NETWORK": "mainnet-beta"
  }
}
```

### Deployment Checklist

#### Pre-deployment

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] API keys valid and not expired

#### Post-deployment

- [ ] Smoke test core flows
- [ ] Check error tracking
- [ ] Verify analytics working
- [ ] Test wallet connection
- [ ] Validate ZK proof generation

---

## Documentation Requirements

### README.md

Must include:
- Project description
- Tech stack
- Quick start guide
- Environment setup
- Development commands
- Testing instructions
- Deployment guide
- Links to demo and documentation

### DEVLOG.md (Not Committed)

Internal development log tracking:
- Implementation decisions
- Bug fixes and solutions
- Architecture changes
- Performance optimizations
- Lessons learned

Format:

```markdown
# Development Log

## [2026-01-12] Initial Setup

### Done
- Initialized Next.js project with Bun
- Configured Tailwind with Solana theme
- Set up Supabase project

### Issues
- Bun had compatibility issue with X package
- Solution: Used npm for that specific package

### Notes
- Decided to use Zustand over Redux for simplicity
- Light Protocol docs are sparse, using examples from GitHub

---

## [2026-01-13] Wallet Integration

### Done
- Implemented wallet adapter
- Added signature-based auth

### Issues
- Mobile wallets not triggering connection event
- Solution: Added manual polling fallback

### Notes
- Phantom mobile has different behavior than desktop
```

### Code Documentation

```typescript
/**
 * Analyzes wallet transactions and calculates trading metrics.
 *
 * @param wallet - The Solana wallet address to analyze
 * @param options - Analysis options
 * @param options.limit - Maximum number of transactions to fetch (default: 1000)
 * @param options.refresh - Force refresh cached data (default: false)
 * @returns Trading analytics including volume, win rate, and token stats
 *
 * @example
 * ```ts
 * const analytics = await analyzeWallet('DYw8...', { limit: 500 })
 * console.log(analytics.winRate) // 65.5
 * ```
 */
export async function analyzeWallet(
  wallet: string,
  options: AnalyzeOptions = {}
): Promise<AnalyticsData> {
  // Implementation
}
```

---

## Appendix: Quick Reference

### Useful Commands

```bash
# Development
bun dev                    # Start dev server
bun build                  # Build for production
bun start                  # Start production server

# Testing
bun test                   # Run all tests
bun test:unit              # Run unit tests
bun test:e2e               # Run E2E tests
bun test:coverage          # Generate coverage report

# Code Quality
bun lint                   # Run ESLint
bun lint:fix               # Fix ESLint errors
bun format                 # Run Prettier
bun format:check           # Check Prettier
bun typecheck              # Run TypeScript check

# Database
bun db:migrate             # Run migrations
bun db:seed                # Seed database
bun db:reset               # Reset database

# Deployment
bun deploy:preview         # Deploy to preview
bun deploy:production      # Deploy to production
```

### Key URLs

| Resource | URL |
|----------|-----|
| Hackathon | https://solana.com/privacyhack |
| Light Protocol Docs | https://zkcompression.com |
| Helius Docs | https://docs.helius.dev |
| Supabase Docs | https://supabase.com/docs |
| Solana Docs | https://solana.com/docs |

### Contact/Support

| Channel | Purpose |
|---------|---------|
| Discord (Solana) | Technical questions |
| Discord (Light Protocol) | ZK Compression help |
| GitHub Issues | Bug reports |

---

*Document Version: 1.0.0*
*Last Updated: 2026-01-10*
*Author: Gabriel*
