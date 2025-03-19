import { NextResponse } from 'next/server'
import swaggerJsdoc from 'swagger-jsdoc'

// Swagger 정의
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Web3Auth API',
      version: '1.0.0',
      description: 'Web3Auth API for Aptos blockchain events',
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        description: 'Local server',
      },
    ],
  },
  apis: ['./src/app/api/**/*.ts'],
}

// Swagger 스펙 생성
const swaggerSpec = swaggerJsdoc(options)

/**
 * Swagger JSON 엔드포인트
 */
export async function GET() {
  return NextResponse.json(swaggerSpec)
} 