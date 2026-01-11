export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          wallet_address: string
          created_at: string
          updated_at: string
          last_analysis_at: string | null
          settings: UserSettings
        }
        Insert: {
          id?: string
          wallet_address: string
          created_at?: string
          updated_at?: string
          last_analysis_at?: string | null
          settings?: UserSettings
        }
        Update: {
          id?: string
          wallet_address?: string
          created_at?: string
          updated_at?: string
          last_analysis_at?: string | null
          settings?: UserSettings
        }
      }
      reports: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          created_at?: string
          expires_at?: string | null
          is_public?: boolean
          volume_range: string
          trade_count_range: string
          win_rate_range: string
          avg_trade_size_range: string
          trading_period_days: number
          proof_hash: string
          compressed_account_address?: string | null
          verification_tx?: string | null
          wallet_hash: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          created_at?: string
          expires_at?: string | null
          is_public?: boolean
          volume_range?: string
          trade_count_range?: string
          win_rate_range?: string
          avg_trade_size_range?: string
          trading_period_days?: number
          proof_hash?: string
          compressed_account_address?: string | null
          verification_tx?: string | null
          wallet_hash?: string
        }
      }
      analytics_cache: {
        Row: {
          id: string
          user_id: string
          cached_at: string
          valid_until: string
          tx_count: number
          last_tx_signature: string
          analytics_data: AnalyticsData
        }
        Insert: {
          id?: string
          user_id: string
          cached_at?: string
          valid_until: string
          tx_count: number
          last_tx_signature: string
          analytics_data: AnalyticsData
        }
        Update: {
          id?: string
          user_id?: string
          cached_at?: string
          valid_until?: string
          tx_count?: number
          last_tx_signature?: string
          analytics_data?: AnalyticsData
        }
      }
    }
  }
}

export interface UserSettings {
  defaultReportExpiry?: number
  preferredCurrency?: string
  notifications?: boolean
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
