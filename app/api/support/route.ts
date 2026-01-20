export const runtime = "edge"

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Client-side submissions use anon key; RLS should allow insert only.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name: string = (body.name || "").trim()
    const email: string = (body.email || "").trim()
    const message: string = (body.message || "").trim()
    const pollId: string | null = body.pollId ? String(body.pollId).trim() : null
    const pollCode: string | null = body.pollCode ? String(body.pollCode).trim() : null

    if (!name || !email || !message) {
      return NextResponse.json({ error: "필수 입력값이 누락되었습니다." }, { status: 400 })
    }

    if (!supabase) {
      return NextResponse.json({ error: "Supabase env가 설정되지 않았습니다." }, { status: 500 })
    }

    const { error } = await supabase.from("support_tickets").insert({
      name,
      email,
      message,
      poll_id: pollId || null,
      poll_code: pollCode || null,
      status: "new",
    })

    if (error) {
      console.error(error)
      return NextResponse.json({ error: "저장에 실패했습니다." }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "요청 처리 중 오류가 발생했습니다." }, { status: 500 })
  }
}
