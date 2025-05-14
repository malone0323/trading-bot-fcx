"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PriceChart from "@/components/price-chart"
import TradingInterface from "@/components/trading-interface"
import BotSettings from "@/components/bot-settings"
import TradeHistory from "@/components/trade-history"
import { ArrowUpRight, ArrowDownRight, BarChart3, Settings, History } from "lucide-react"
import { mockPriceData, generateNewPrice } from "@/lib/mock-data"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [currentPrice, setCurrentPrice] = useState(29876.54)
  const [priceChange, setPriceChange] = useState(2.34)
  const [priceDirection, setPriceDirection] = useState<"up" | "down">("up")
  const [priceHistory, setPriceHistory] = useState(mockPriceData)
  const [isRunning, setIsRunning] = useState(false)
  const [trades, setTrades] = useState<any[]>([])
  const [balance, setBalance] = useState({
    usd: 10000,
    btc: 0.5,
  })

  // Simulate price updates
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      const { newPrice, newChange, direction } = generateNewPrice(currentPrice)
      setCurrentPrice(newPrice)
      setPriceChange(newChange)
      setPriceDirection(direction)

      setPriceHistory((prev) => {
        const newHistory = [
          ...prev,
          {
            time: new Date().toISOString(),
            price: newPrice,
          },
        ]
        // Keep only the last 50 data points
        if (newHistory.length > 50) {
          return newHistory.slice(newHistory.length - 50)
        }
        return newHistory
      })

      // Auto trading logic (very simple example)
      if (isRunning) {
        const shouldBuy = direction === "up" && newChange > 0.5
        const shouldSell = direction === "down" && newChange > 0.5

        if (shouldBuy && balance.usd > 1000) {
          const amount = 0.01
          const cost = amount * newPrice
          if (cost <= balance.usd) {
            setBalance((prev) => ({
              usd: prev.usd - cost,
              btc: prev.btc + amount,
            }))
            setTrades((prev) => [
              ...prev,
              {
                id: Date.now(),
                type: "buy",
                amount,
                price: newPrice,
                total: cost,
                time: new Date().toISOString(),
              },
            ])
          }
        } else if (shouldSell && balance.btc > 0.01) {
          const amount = 0.01
          const value = amount * newPrice
          setBalance((prev) => ({
            usd: prev.usd + value,
            btc: prev.btc - amount,
          }))
          setTrades((prev) => [
            ...prev,
            {
              id: Date.now(),
              type: "sell",
              amount,
              price: newPrice,
              total: value,
              time: new Date().toISOString(),
            },
          ])
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [currentPrice, isRunning, balance.btc, balance.usd])

  const portfolioValue = balance.usd + balance.btc * currentPrice

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Crypto Trading Bot</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current BTC Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span className="text-2xl font-bold">${currentPrice.toLocaleString()}</span>
                <span
                  className={`ml-2 flex items-center ${priceDirection === "up" ? "text-green-500" : "text-red-500"}`}
                >
                  {priceDirection === "up" ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {priceChange.toFixed(2)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                USD: ${balance.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })} | BTC:{" "}
                {balance.btc.toFixed(8)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Bot Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full mr-2 ${isRunning ? "bg-green-500" : "bg-red-500"}`}></div>
                <span className="font-medium">{isRunning ? "Running" : "Stopped"}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="dashboard" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Price Chart</CardTitle>
                    <CardDescription>BTC/USD price movement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PriceChart data={priceHistory} />
                  </CardContent>
                </Card>
              </div>

              <div>
                <TradingInterface
                  currentPrice={currentPrice}
                  balance={balance}
                  setBalance={setBalance}
                  setTrades={setTrades}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <BotSettings isRunning={isRunning} setIsRunning={setIsRunning} />
          </TabsContent>

          <TabsContent value="history">
            <TradeHistory trades={trades} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
