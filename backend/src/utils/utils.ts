export function generateOrderNo(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
  return `DD${year}${month}${day}${random}`
}

export function formatPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function calculateDiscount(originalAmount: number, level: string): number {
  if (level === 'VIP') {
    return originalAmount * 0.05
  }
  return 0
}

export function calculatePoints(amount: number): number {
  return Math.floor(amount * 10)
}

export function pointsToAmount(points: number): number {
  return points * 0.01
}