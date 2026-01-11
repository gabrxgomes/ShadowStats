# Supabase Setup Guide

## Prerequisites

1. Create a Supabase account at https://supabase.com
2. Create a new project

## Database Setup

### 1. Run the Schema

In your Supabase project dashboard:

1. Go to **SQL Editor**
2. Copy the contents of `schema.sql`
3. Paste and execute the SQL

This will create:
- `users` table - Store user wallet addresses and settings
- `reports` table - Store privacy reports with ZK proofs
- `analytics_cache` table - Cache analytics data for performance

### 2. Configure Environment Variables

Add these to your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get these values from:
- Project URL: Project Settings → API
- Anon Key: Project Settings → API → `anon` key
- Service Role Key: Project Settings → API → `service_role` key

### 3. Row Level Security (RLS)

The schema includes RLS policies that:
- Users can only read/update their own data
- Public reports are visible to everyone
- Private reports are only visible to the owner

### 4. Test the Setup

```typescript
import { supabase } from '@/lib/supabase/client'

// Test connection
const { data, error } = await supabase.from('users').select('*').limit(1)
console.log('Supabase connected:', !error)
```

## Authentication Flow

1. User connects Solana wallet
2. User signs a message with their wallet
3. Backend verifies signature
4. Set wallet_address in Supabase auth context
5. RLS policies grant access based on wallet_address

## Tables Overview

### users
- Stores wallet addresses and user preferences
- Auto-creates on first wallet connection

### reports
- Stores privacy reports with ZK proofs
- Links to compressed accounts on Solana
- Publicly verifiable via proof_hash

### analytics_cache
- Caches analytics calculations
- Expires after set time (valid_until)
- One cache entry per user

## Notes

- All timestamps are in UTC
- UUIDs are auto-generated
- Indexes created for common queries
- RLS enabled for privacy and security
