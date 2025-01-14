import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  console.log('OCR endpoint called') // Debug log
  
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    console.log('Received file:', file instanceof File ? file.name : 'No file') // Debug log

    // For testing, simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Return dummy data (replace with actual OCR logic)
    const extractedData = {
      grossPay: 5000,
      netPay: 3500,
      tax: 1000,
      nationalInsurance: 300,
      pension: 200,
      otherDeductions: 0,
      month: new Date().toISOString().slice(0, 7)
    }

    console.log('Returning data:', extractedData) // Debug log
    return NextResponse.json(extractedData)
  } catch (error) {
    console.error('OCR error:', error)
    return NextResponse.json(
      { error: 'Failed to process payslip' },
      { status: 500 }
    )
  }
} 