export const runtime = "edge"

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const adminToken = process.env.ADMIN_TOKEN

const supabase = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } })
  : null

function requireAdmin(request: Request) {
  const auth = request.headers.get("authorization") || ""
  const token = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7) : auth
  if (!adminToken || token !== adminToken) {
    return false
  }
  return true
}

export async function GET(request: Request) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!supabase) {
    return NextResponse.json({ error: "Supabase env가 설정되지 않았습니다." }, { status: 500 })
  }
  const { data, error } = await supabase
    .from("support_tickets")
    .select("id,name,email,message,poll_id,poll_code,status,created_at")
    .order("created_at", { ascending: false })
    .limit(200)

  if (error) {
    console.error(error)
    return NextResponse.json({ error: "조회에 실패했습니다." }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function PATCH(request: Request) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!supabase) {
    return NextResponse.json({ error: "Supabase env가 설정되지 않았습니다." }, { status: 500 })
  }

  try {
    const body = await request.json()
    const id: string = body.id
    const status: string = body.status
    if (!id || !status) {
      return NextResponse.json({ error: "id와 status가 필요합니다." }, { status: 400 })
    }

    const { error } = await supabase
      .from("support_tickets")
      .update({ status })
      .eq("id", id)

    if (error) {
      console.error(error)
      return NextResponse.json({ error: "업데이트에 실패했습니다." }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "요청 처리 중 오류가 발생했습니다." }, { status: 500 })
  }
}
