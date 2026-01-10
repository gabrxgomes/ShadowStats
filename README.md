# ShadowStats

**Privacy-First Trading Analytics for Solana**

A privacy-preserving trading analytics platform that allows Solana traders to analyze their performance and generate verifiable proof of their statistics without exposing their wallet address or transaction details.

Built for [Solana Privacy Hack 2026](https://solana.com/privacyhack) - Track 03 (Open Category)

---

## Features

- **Private Analytics**: Analyze trading history without exposing your wallet
- **ZK Proofs**: Generate verifiable performance reports using Light Protocol
- **Comprehensive Metrics**: Volume, win rate, trade count, token statistics
- **Privacy Score**: Understand your wallet's exposure level
- **Shareable Reports**: Create public, verifiable reports of your performance

---

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Zustand
- **Runtime**: Bun
- **Database**: Supabase (PostgreSQL)
- **Blockchain**: Helius RPC, Light Protocol, @solana/web3.js
- **Charts**: Recharts
- **Testing**: Vitest, Playwright
- **Hosting**: Vercel

---

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.0+
- Node.js v20+ (for compatibility)
- Solana wallet (Phantom, Solflare, or Backpack)

### Installation

```bash
# Clone the repository
git clone https://github.com/gabrxgomes/ShadowStats.git
cd ShadowStats

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local

# Configure your environment variables in .env.local

# Run development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Helius
HELIUS_API_KEY=your-helius-api-key
NEXT_PUBLIC_HELIUS_RPC_URL=your-helius-rpc-url

# Solana
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Development Commands

```bash
bun dev              # Start development server
bun build            # Build for production
bun start            # Start production server
bun lint             # Run ESLint
bun lint:fix         # Fix ESLint errors
bun format           # Format code with Prettier
bun typecheck        # Run TypeScript check
bun test             # Run all tests
bun test:unit        # Run unit tests
bun test:e2e         # Run E2E tests
```

---

## Project Structure

```
shadowstats/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/             # React components
│   ├── ui/                # Base UI components
│   ├── charts/            # Chart components
│   ├── wallet/            # Wallet components
│   ├── analytics/         # Analytics components
│   └── report/            # Report components
├── lib/                   # Utilities and integrations
│   ├── solana/           # Solana utilities
│   ├── helius/           # Helius SDK wrapper
│   ├── light/            # Light Protocol utilities
│   ├── supabase/         # Supabase client
│   └── utils/            # General utilities
├── hooks/                # Custom React hooks
├── stores/               # Zustand stores
├── types/                # TypeScript types
└── tests/                # Test files
```

---

## How It Works

1. **Connect Wallet**: Connect your Solana wallet (Phantom, Solflare, or Backpack)
2. **Analyze Transactions**: Fetch and parse your trading history using Helius Enhanced APIs
3. **View Analytics**: See comprehensive metrics including volume, win rate, and token statistics
4. **Generate Report**: Create a privacy report with ZK proofs using Light Protocol
5. **Share Privately**: Share your verifiable performance report without exposing your wallet

---

## Hackathon Bounties

This project targets the following bounties:

- **Track 03 - Open Category**: $15,000 (Light Protocol ZK Compression)
- **Helius Bounty**: $5,000 (Helius RPC and Enhanced APIs)
- **Encrypt.trade Bounty**: $1,000 (Educational content)

---

## Contributing

This is a hackathon project. Contributions are welcome after the hackathon ends.

---

## License

MIT

---

## Links

- **Repository**: https://github.com/gabrxgomes/ShadowStats
- **Hackathon**: https://solana.com/privacyhack
- **Demo**: (Coming soon)

---

Built with ⚡ by Gabriel Gomes for Solana Privacy Hack 2026
