"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface BotSettingsProps {
  isRunning: boolean
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>
}

export default function BotSettings({ isRunning, setIsRunning }: BotSettingsProps) {
  const [strategy, setStrategy] = useState("simple")
  const [buyThreshold, setBuyThreshold] = useState("0.5")
  const [sellThreshold, setSellThreshold] = useState("0.5")
  const [tradeAmount, setTradeAmount] = useState("0.01")

  const handleToggleBot = () => {
    setIsRunning((prev) => !prev)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Bot Configuration</CardTitle>
          <CardDescription>Configure your trading bot parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="strategy">Trading Strategy</Label>
            <Select value={strategy} onValueChange={setStrategy}>
              <SelectTrigger id="strategy">
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Simple Momentum</SelectItem>
                <SelectItem value="macd">MACD Crossover</SelectItem>
                <SelectItem value="rsi">RSI Oversold/Overbought</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="buy-threshold">Buy Threshold (%)</Label>
            <Input
              id="buy-threshold"
              type="number"
              value={buyThreshold}
              onChange={(e) => setBuyThreshold(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sell-threshold">Sell Threshold (%)</Label>
            <Input
              id="sell-threshold"
              type="number"
              value={sellThreshold}
              onChange={(e) => setSellThreshold(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trade-amount">Trade Amount (BTC)</Label>
            <Input
              id="trade-amount"
              type="number"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleToggleBot}>
            {isRunning ? "Stop Bot" : "Start Bot"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bot Status</CardTitle>
          <CardDescription>Current status and performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="bot-status">Bot Status</Label>
            <div className="flex items-center space-x-2">
              <Switch id="bot-status" checked={isRunning} onCheckedChange={handleToggleBot} />
              <span>{isRunning ? "Running" : "Stopped"}</span>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Simulation Mode</AlertTitle>
            <AlertDescription>
              This bot is running in simulation mode and will not execute real trades.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <div className="text-sm flex justify-between">
              <span>Strategy:</span>
              <span className="font-medium">
                {strategy === "simple"
                  ? "Simple Momentum"
                  : strategy === "macd"
                    ? "MACD Crossover"
                    : "RSI Oversold/Overbought"}
              </span>
            </div>
            <div className="text-sm flex justify-between">
              <span>Buy Threshold:</span>
              <span className="font-medium">{buyThreshold}%</span>
            </div>
            <div className="text-sm flex justify-between">
              <span>Sell Threshold:</span>
              <span className="font-medium">{sellThreshold}%</span>
            </div>
            <div className="text-sm flex justify-between">
              <span>Trade Amount:</span>
              <span className="font-medium">{tradeAmount} BTC</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
