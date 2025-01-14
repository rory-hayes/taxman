import { NextResponse } from 'next/server'
import Tesseract from 'tesseract.js'

export async function POST(request: Request) {
  console.log('OCR endpoint called') // Debug log
  
  try {
    const { url } = await request.json()
    console.log('Processing URL:', url) // Debug log

    const { data: { text } } = await Tesseract.recognize(
      url,
      'eng',
      { logger: m => console.log(m) }
    )

    console.log('Extracted text:', text) // Debug log

    // Basic extraction logic (improve this based on your payslip format)
    const extractedData = {
      grossPay: parseFloat(text.match(/Gross Pay:?\s*[£€]?(\d+(?:\.\d{2})?)/i)?.[1] || '0'),
      netPay: parseFloat(text.match(/Net Pay:?\s*[£€]?(\d+(?:\.\d{2})?)/i)?.[1] || '0'),
      tax: parseFloat(text.match(/Tax:?\s*[£€]?(\d+(?:\.\d{2})?)/i)?.[1] || '0'),
      nationalInsurance: parseFloat(text.match(/NI:?\s*[£€]?(\d+(?:\.\d{2})?)/i)?.[1] || '0'),
      pension: parseFloat(text.match(/Pension:?\s*[£€]?(\d+(?:\.\d{2})?)/i)?.[1] || '0'),
      otherDeductions: 0,
      month: new Date().toISOString().slice(0, 7)
    }

    console.log('Extracted data:', extractedData) // Debug log
    return NextResponse.json(extractedData)
  } catch (error) {
    console.error('OCR error:', error) // Debug log
    return NextResponse.json(
      { error: 'Failed to process payslip' },
      { status: 500 }
    )
  }
} 