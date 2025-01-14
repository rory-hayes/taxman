import { NextResponse } from 'next/server'
import Tesseract from 'tesseract.js'

export async function POST(request: Request) {
  console.log('OCR endpoint called')
  
  try {
    const { url } = await request.json()
    console.log('Processing URL:', url)

    // For testing, return dummy data
    const extractedData = {
      grossPay: 5000,
      netPay: 3500,
      tax: 1000,
      nationalInsurance: 300,
      pension: 200,
      otherDeductions: 0,
      month: new Date().toISOString().slice(0, 7)
    }

    console.log('Returning data:', extractedData)
    return Response.json(extractedData)
  } catch (error) {
    console.error('OCR error:', error)
    return Response.json(
      { error: 'Failed to process payslip' },
      { status: 500 }
    )
  }
} 