// backend/src/routes/public.routes.ts
import { Router } from 'express'
import { prisma } from '../config/database'
import { sendSuccess, sendError } from '../utils/apiResponse'

const router = Router()

/**
 * GET /api/public/stats
 * Get public platform trading statistics (no auth required)
 */
router.get('/stats', async (req, res) => {
  try {
    // Get aggregate metrics from all users
    const allMetrics = await prisma.performanceMetrics.findMany({
      where: {
        totalTrades: { gt: 0 }
      }
    })

    // Get total users and active bots counts
    const [totalUsers, totalBotsEnabled] = await Promise.all([
      prisma.user.count({ where: { role: 'USER', isActive: true } }),
      prisma.botSettings.count({ where: { isEnabled: true } })
    ])

    // Get total webhook signals (all incoming signals to the platform)
    const totalSignals = await prisma.webhookLog.count()
    
    // Get successful webhook signals (signals that were processed)
    const successfulSignals = await prisma.webhookLog.count({
      where: { status: 'SUCCESS' }
    })

    // Get orders count as backup signal measure
    const totalOrders = await prisma.order.count()
    
    // Active bots = successful signals OR enabled bots (whichever is higher for better UX)
    const activeBots = successfulSignals > 0 ? successfulSignals : totalBotsEnabled

    // Get realtime TradeHistory data
    const tradeHistoryAgg = await prisma.tradeHistory.aggregate({
      _sum: { pnl: true },
      _count: true
    })
    
    const tradeWins = await prisma.tradeHistory.count({ where: { pnl: { gt: 0.01 } } })
    const tradeLosses = await prisma.tradeHistory.count({ where: { pnl: { lt: -0.01 } } })

    // Calculate signal-based stats (same logic as signals-portfolio)
    const allWebhookLogs = await prisma.webhookLog.findMany({
      where: { status: 'SUCCESS' },
      orderBy: { createdAt: 'asc' },
      select: { id: true, payload: true, createdAt: true }
    })

    // Separate open and close signals
    const openSignals: any[] = []
    const closeSignals: any[] = []
    
    for (const log of allWebhookLogs) {
      const payload = log.payload as any
      const action = payload?.action?.toLowerCase()
      if (['open', 'buy', 'sell'].includes(action)) {
        openSignals.push({ log, payload })
      } else if (['close', 'slclose', 'tpclose', 'bep'].includes(action)) {
        closeSignals.push({ log, payload })
      }
    }

    // Match open signals with close signals and calculate PnL
    const usedCloseSignals = new Set<string>()
    let signalTotalPnl = 0
    let signalWins = 0
    let signalLosses = 0
    let signalBep = 0

    for (const { log, payload } of openSignals) {
      const symbol = payload?.symbol
      const entryPrice = payload?.entryPrice || 0
      
      const matchingClose = closeSignals.find(cs => 
        cs.payload?.symbol === symbol && 
        cs.log.createdAt > log.createdAt &&
        !usedCloseSignals.has(cs.log.id)
      )

      if (matchingClose) {
        const closeAction = matchingClose.payload?.action
        const estimatedPnlPercent = closeAction === 'tpclose' ? 2 
          : closeAction === 'slclose' ? -2 
          : closeAction === 'bep' ? 0
          : 1
          
        const signalPnl = entryPrice * (estimatedPnlPercent / 100)
        signalTotalPnl += signalPnl
        
        if (closeAction === 'tpclose' || (closeAction !== 'slclose' && closeAction !== 'bep')) {
          signalWins++
        } else if (closeAction === 'slclose') {
          signalLosses++
        } else if (closeAction === 'bep') {
          signalBep++
        }
        
        usedCloseSignals.add(matchingClose.log.id)
      }
    }

    // USD VALUES - ONLY from REAL TradeHistory (no estimates!)
    const totalPnl = tradeHistoryAgg._sum.pnl || 0  // Real PnL only
    
    // COUNTS - can use webhook signals as fallback
    const totalTrades = tradeHistoryAgg._count > 0 ? tradeHistoryAgg._count : usedCloseSignals.size
    const totalWins = tradeWins > 0 ? tradeWins : signalWins
    const totalLosses = tradeLosses > 0 ? tradeLosses : signalLosses
    
    const avgWinRate = totalTrades > 0
      ? (totalWins / totalTrades) * 100
      : 0
    const avgPnl = tradeHistoryAgg._count > 0  // Only calculate if real trades exist
      ? totalPnl / tradeHistoryAgg._count
      : 0

    // Get monthly data (last 12 months)
    const now = new Date()
    const monthlyPnl = []
    
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      monthEnd.setHours(23, 59, 59, 999)

      // Get webhook signals for this month
      const monthSignals = await prisma.webhookLog.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      })

      // Get successful webhook signals
      const monthSuccessSignals = await prisma.webhookLog.count({
        where: {
          createdAt: { gte: monthStart, lte: monthEnd },
          status: 'SUCCESS'
        }
      })

      // Get failed webhook signals
      const monthFailedSignals = await prisma.webhookLog.count({
        where: {
          createdAt: { gte: monthStart, lte: monthEnd },
          status: { in: ['FAILED'] }
        }
      })

      // Get trade PnL for this month
      const monthTrades = await prisma.tradeHistory.aggregate({
        where: {
          closedAt: {
            gte: monthStart,
            lte: monthEnd
          }
        },
        _sum: { pnl: true },
        _count: true
      })

      // Get winning trades
      const monthWins = await prisma.tradeHistory.count({
        where: {
          closedAt: { gte: monthStart, lte: monthEnd },
          pnl: { gt: 0 }
        }
      })

      // Get losing trades
      const monthLosses = await prisma.tradeHistory.count({
        where: {
          closedAt: { gte: monthStart, lte: monthEnd },
          pnl: { lt: 0 }
        }
      })

      monthlyPnl.push({
        month: monthStart.toLocaleString('en', { month: 'short', year: '2-digit' }),
        pnl: monthTrades._sum.pnl || 0,
        trades: monthTrades._count || 0,
        signals: monthSignals,
        wins: monthWins > 0 ? monthWins : monthSuccessSignals,
        losses: monthLosses > 0 ? monthLosses : monthFailedSignals
      })
    }

    const stats = {
      // PnL Metrics
      totalNetPnl: totalPnl,
      totalTrades,
      totalWins,
      totalLosses,
      avgWinRate: Math.round(avgWinRate * 100) / 100,
      avgPnl: Math.round(avgPnl * 100) / 100,
      
      // Platform Stats  
      totalUsers,
      activeBots,
      totalSignals: totalSignals > 0 ? totalSignals : totalOrders,
      totalOrders,
      
      // Chart Data
      monthlyPnl,
      
      // Metadata
      lastUpdated: new Date().toISOString()
    }

    return sendSuccess(res, stats, 'Platform stats retrieved')
  } catch (error: any) {
    console.error('Public stats error:', error)
    return sendError(res, 'Failed to get stats', 500, error.message)
  }
})

/**
 * GET /api/public/signals-portfolio
 * Get live trading portfolio and Pro Signals statistics (no auth required)
 */
router.get('/signals-portfolio', async (req, res) => {
  try {
    // Get active positions (Regular Signals Portfolio)
    const activePositions = await prisma.position.findMany({
      where: { isOpen: true },
      orderBy: { openedAt: 'desc' },
      take: 20,
      include: {
        user: {
          select: { username: true }
        }
      }
    })

    // Format positions for display
    const positions = activePositions.map(pos => ({
      pair: pos.symbol,
      position: pos.side,
      price: pos.markPrice || pos.entryPrice,
      takeProfit: pos.takeProfit,
      stopLoss: pos.stopLoss,
      entryPrice: pos.entryPrice,
      exitPrice: null, // Still open
      profit: pos.unrealizedPnl,
      profitPercent: pos.unrealizedPnlPercent,
      state: 'Open',
      leverage: pos.leverage,
      exchange: pos.exchange
    }))

    // Get recently closed positions (Filled)
    const recentClosed = await prisma.tradeHistory.findMany({
      orderBy: { closedAt: 'desc' },
      take: 10
    })

    const closedPositions = recentClosed.map(trade => ({
      pair: trade.symbol,
      position: trade.side,
      price: trade.exitPrice,
      takeProfit: null,
      stopLoss: null,
      entryPrice: trade.entryPrice,
      exitPrice: trade.exitPrice,
      profit: trade.pnl,
      profitPercent: trade.pnlPercent,
      state: 'Filled',
      leverage: trade.leverage,
      exchange: trade.exchange
    }))

    // Get recent webhook signals to show as signal entries
    const recentSignals = await prisma.webhookLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50 // Get more to properly match open/close pairs
    })

    // Separate open and close signals
    const openSignals: any[] = []
    const closeSignals: any[] = []
    
    for (const log of recentSignals) {
      const payload = log.payload as any
      if (payload?.action === 'open') {
        openSignals.push({ log, payload })
      } else if (['close', 'slclose', 'tpclose', 'bep'].includes(payload?.action)) {
        closeSignals.push({ log, payload })
      }
    }

    // Match open signals with close signals and calculate PnL
    const signalEntries: any[] = []
    const usedCloseSignals = new Set<string>()
    
    // Track close types for stats
    let tpCloseCount = 0  // Win
    let slCloseCount = 0  // Loss  
    let bepCloseCount = 0 // Cancel
    let regularCloseCount = 0 // Regular close (neutral)
    
    // Track signal-based PnL
    let signalTotalPnl = 0
    let signalTotalProfit = 0
    let signalTotalLoss = 0

    for (const { log, payload } of openSignals) {
      const symbol = payload?.symbol
      const side = payload?.side
      const entryPrice = payload?.entryPrice || 0
      
      // Find a matching close signal for this open (by symbol only - more flexible)
      const matchingClose = closeSignals.find(cs => 
        cs.payload?.symbol === symbol && 
        cs.log.createdAt > log.createdAt &&
        !usedCloseSignals.has(cs.log.id)
      )

      let state = 'Signal' // Default: open/active signal
      let exitPrice = null
      let signalPnl = 0
      
      if (matchingClose) {
        const closeAction = matchingClose.payload?.action
        
        // Estimate PnL based on close type
        // TP close = profit, SL close = loss (regardless of long/short)
        // The close type already tells us if it's a win or loss
        const estimatedPnlPercent = closeAction === 'tpclose' ? 2 
          : closeAction === 'slclose' ? -2 
          : closeAction === 'bep' ? 0
          : 1 // regular close = small profit assumed
          
        // Calculate PnL in USDT (entryPrice * percent / 100)
        // No need to invert for short - close type determines profit/loss
        signalPnl = entryPrice * (estimatedPnlPercent / 100)
        
        if (closeAction === 'tpclose') {
          state = 'TP Hit'
          tpCloseCount++
          signalTotalProfit += Math.abs(signalPnl)
        } else if (closeAction === 'slclose') {
          state = 'SL Hit'
          slCloseCount++
          signalTotalLoss += Math.abs(signalPnl)
        } else if (closeAction === 'bep') {
          state = 'BEP'
          bepCloseCount++
        } else {
          state = 'Closed'
          regularCloseCount++
          if (signalPnl > 0) signalTotalProfit += signalPnl
        }
        
        signalTotalPnl += signalPnl
        usedCloseSignals.add(matchingClose.log.id)
        // Skip closed signals from display - only show active ones
        continue
      }

      signalEntries.push({
        pair: symbol || 'N/A',
        position: side === 'long' ? 'LONG' : side === 'short' ? 'SHORT' : side?.toUpperCase() || 'N/A',
        price: payload?.entryPrice || 0, // Entry price captured from Binance
        takeProfit: null,
        stopLoss: null,
        entryPrice: payload?.entryPrice || 0,
        exitPrice,
        profit: 0,
        profitPercent: 0,
        state,
        leverage: payload?.leverage || 1,
        exchange: 'TradingView',
        action: payload?.action || 'signal',
        createdAt: log.createdAt
      })
    }

    // Combine all: active positions first, then closed, then signals (if no positions)
    let allPositions: any[] = [...positions, ...closedPositions]
    
    // If no positions or closed trades, show signals
    if (allPositions.length === 0 && signalEntries.length > 0) {
      allPositions = signalEntries as any[]
    } else if (allPositions.length < 15) {
      // Fill with signals if fewer than 15 positions
      allPositions = [...allPositions, ...signalEntries].slice(0, 15)
    } else {
      allPositions = allPositions.slice(0, 15)
    }

    // Get aggregate stats for Regular Signals
    const allMetrics = await prisma.performanceMetrics.findMany({
      where: { totalTrades: { gt: 0 } }
    })

    // Get REALTIME trade history count directly from TradeHistory table
    // This ensures Total Trade is updated immediately when a trade closes
    const allTrades = await prisma.tradeHistory.aggregate({
      _count: true,
      _sum: { pnl: true }
    })
    
    // Get realtime trade count - this is the SOURCE OF TRUTH
    const realtimeTradeCount = allTrades._count || 0

    // Count win/loss/bep trades
    const winTrades = await prisma.tradeHistory.count({
      where: { pnl: { gt: 0.01 } } // Win = profit > 0.01
    })
    const lossTrades = await prisma.tradeHistory.count({
      where: { pnl: { lt: -0.01 } } // Loss = profit < -0.01
    })
    const bepTrades = await prisma.tradeHistory.count({
      where: { 
        pnl: { gte: -0.01, lte: 0.01 } // BEP = between -0.01 and 0.01
      }
    })

    // Count REJECTED/FAILED orders from all exchanges (Binance, Bitget, OKX)
    // This is for CANCEL count in Regular Signals
    const rejectedOrders = await prisma.order.count({
      where: {
        status: { in: ['FAILED', 'CANCELLED'] }
      }
    })
    
    // Also count FAILED webhook signals
    const failedWebhooks = await prisma.webhookLog.count({
      where: { status: 'FAILED' }
    })
    
    // Total rejected = failed orders + failed webhooks
    const totalRejectedOrders = rejectedOrders + failedWebhooks

    // Get aggregate realized PnL from ALL users' portfolios
    const allPortfolios = await prisma.portfolio.aggregate({
      _sum: { 
        realizedPnl: true,
        unrealizedPnl: true,
        totalBalance: true
      }
    })
    const aggregateRealizedPnl = allPortfolios._sum.realizedPnl || 0
    const aggregateUnrealizedPnl = allPortfolios._sum.unrealizedPnl || 0
    const aggregateTotalBalance = allPortfolios._sum.totalBalance || 0

    // Calculate totals from TradeHistory directly (REALTIME SOURCE OF TRUTH)
    // NOT from allMetrics which is cached and updates every 60 seconds
    const totalPnl = allTrades._sum.pnl || 0

    // Calculate profit and loss amounts from trade history (REALTIME)
    const profitTrades = await prisma.tradeHistory.aggregate({
      where: { pnl: { gt: 0 } },
      _sum: { pnl: true }
    })
    const lossingTrades = await prisma.tradeHistory.aggregate({
      where: { pnl: { lt: 0 } },
      _sum: { pnl: true }
    })

    // Calculate drawdown from realtime trade history
    // Get all trades sorted by close time and calculate running PnL
    const allTradesForDrawdown = await prisma.tradeHistory.findMany({
      orderBy: { closedAt: 'asc' },
      select: { pnl: true }
    })
    
    let maxDrawdown = 0
    let peak = 0
    let runningPnl = 0
    for (const trade of allTradesForDrawdown) {
      runningPnl += trade.pnl
      if (runningPnl > peak) {
        peak = runningPnl
      }
      const drawdown = peak - runningPnl
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown
      }
    }
    // Calculate drawdown as percentage of peak
    const maxDrawdownPercent = peak > 0 ? (maxDrawdown / peak) * 100 : 0

    // Calculate win rate from realtime data
    const winRate = realtimeTradeCount > 0 
      ? Math.round((winTrades / realtimeTradeCount) * 100 * 10) / 10 
      : 0

    // Calculate PnL percent (based on total profit trades as base)
    const totalProfitValue = profitTrades._sum.pnl || 0
    const avgPnlPercent = totalProfitValue > 0 && realtimeTradeCount > 0
      ? (totalPnl / Math.abs(totalProfitValue)) * 100
      : 0

    // Calculate signal stats from already processed data
    const activeSignalsCount = signalEntries.length // Open signals without close
    const closedSignalsCount = usedCloseSignals.size // Signals that have been closed
    const totalSignalsCount = openSignals.length // Total open signals ever
    
    // Calculate win/loss from signal close types
    const signalWins = tpCloseCount + regularCloseCount // TP hit or manual close = win
    const signalLosses = slCloseCount // SL hit = loss
    const signalCancels = bepCloseCount // BEP = cancel
    
    // Calculate signal-based win rate
    const totalClosedSignals = signalWins + signalLosses + signalCancels
    const signalWinRate = totalClosedSignals > 0 
      ? Math.round((signalWins / totalClosedSignals) * 100 * 10) / 10 
      : 0
    
    // Use trade win rate if available, otherwise signal win rate
    const finalWinRate = winRate > 0 ? winRate : signalWinRate

    // COUNTS - can use webhook signals as fallback
    const finalTotalTrade = realtimeTradeCount > 0 ? realtimeTradeCount : closedSignalsCount
    const finalWinTrade = winTrades > 0 ? winTrades : signalWins
    const finalLossTrade = lossTrades > 0 ? lossTrades : signalLosses
    
    // CANCEL = rejected orders from exchanges (Binance, Bitget, OKX)
    const finalCancelCount = totalRejectedOrders

    // USD VALUES - ONLY from REAL data (no estimates!)
    // Use TradeHistory first, then Portfolio.realizedPnl, but NEVER signal estimates
    const finalPnl = totalPnl !== 0 ? totalPnl : aggregateRealizedPnl  // Real only!
    const finalProfit = profitTrades._sum.pnl || 0  // Real profit only
    const finalLossAmount = lossingTrades._sum.pnl || 0  // Real loss only

    const regularSignals = {
      positions: allPositions,
      stats: {
        win: finalWinTrade,
        loss: finalLossTrade,
        cancel: finalCancelCount, // Rejected orders from exchanges
        profit: finalProfit,  // REAL profit from TradeHistory
        lossAmount: finalLossAmount, // REAL loss from TradeHistory
        totalTrades: finalTotalTrade,
        netPnl: finalPnl, // REAL Net P&L
        winRate: finalWinRate,
        activeSignals: activeSignalsCount
      },
      lastUpdated: new Date().toISOString()
    }

    // Calculate PnL % based on total balance (REAL data only)
    const finalPnlPercent = aggregateTotalBalance > 0 
      ? (finalPnl / aggregateTotalBalance) * 100
      : avgPnlPercent  // Use real avgPnlPercent from TradeHistory

    // Drawdown - use real data, fallback to signals (this is a % so ok to estimate)
    const signalDrawdownPercent = (signalLosses > 0 && (signalWins + signalLosses) > 0)
      ? (signalLosses / (signalWins + signalLosses)) * 100
      : 0
    const finalDrawdown = maxDrawdownPercent > 0 ? maxDrawdownPercent : signalDrawdownPercent

    // Pro Signals - USD VALUES from REAL data only, counts/drawdown can use signals
    const proSignals = {
      pnlUsdt: finalPnl,  // REAL PnL from TradeHistory
      pnlPercent: Math.round(finalPnlPercent * 100) / 100,
      drawdown: Math.round(finalDrawdown * 100) / 100,  // Real or signal-based
      totalTrade: finalTotalTrade,  // Count (can use signals)
      winTrade: finalWinTrade,      // Count (can use signals)
      lossTrade: finalLossTrade,    // Count (can use signals)
      bepTrade: bepTrades > 0 ? bepTrades : signalCancels // Count (can use signals)
    }

    return sendSuccess(res, { regularSignals, proSignals }, 'Signals portfolio retrieved')
  } catch (error: any) {
    console.error('Signals portfolio error:', error)
    return sendError(res, 'Failed to get signals portfolio', 500, error.message)
  }
})

export default router
