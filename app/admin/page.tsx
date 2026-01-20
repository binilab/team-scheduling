"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Loader2, Shield, RefreshCw } from "lucide-react"

interface SupportTicket {
  id: string
  name: string
  email: string
  message: string
  poll_id?: string | null
  poll_code?: string | null
  status: string
  created_at: string
}

interface PollRow {
  id: string
  title: string | null
  start_date: string | null
  end_date: string | null
  code: string | null
  created_at: string
}

const STATUS_LABEL: Record<string, string> = {
  new: "신규",
  in_progress: "진행 중",
  resolved: "해결됨",
}

export default function AdminPage() {
  const [token, setToken] = useState("")
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState("")
  const [loading, setLoading] = useState(false)
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [polls, setPolls] = useState<PollRow[]>([])

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("timepoll:adminToken") : null
    if (saved) {
      setToken(saved)
      setAuthed(true)
    }
  }, [])

  useEffect(() => {
    if (authed) {
      refreshAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed])

  const refreshAll = async () => {
    if (!token) return
    setLoading(true)
    try {
      const [ticketsRes, pollsRes] = await Promise.all([
        fetch("/api/admin/support", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/polls", { headers: { Authorization: `Bearer ${token}` } }),
      ])

      if (ticketsRes.status === 401 || pollsRes.status === 401) {
        setAuthError("관리자 키가 올바르지 않습니다. 다시 입력해주세요.")
        setAuthed(false)
        setToken("")
        localStorage.removeItem("timepoll:adminToken")
        toast.error("관리자 키가 올바르지 않습니다. 다시 입력해주세요.")
        return
      }

      if (!ticketsRes.ok) throw new Error("문의 조회 실패")
      if (!pollsRes.ok) throw new Error("방 목록 조회 실패")

      const ticketsData = await ticketsRes.json()
      const pollsData = await pollsRes.json()
      setTickets(ticketsData.data || [])
      setPolls(pollsData.data || [])
    } catch (error: any) {
      toast.error(error?.message || "조회 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = () => {
    if (!token.trim()) {
      toast.error("토큰을 입력해주세요.")
      return
    }
    setAuthError("")
    localStorage.setItem("timepoll:adminToken", token.trim())
    setAuthed(true)
    toast.success("관리자 모드가 활성화되었습니다.")
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/support", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) throw new Error("상태 변경 실패")
      setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
      toast.success("상태가 업데이트되었습니다.")
    } catch (error: any) {
      toast.error(error?.message || "업데이트 실패")
    }
  }

  const TicketTable = useMemo(() => {
    if (!tickets.length) return <p className="text-sm text-muted-foreground">접수된 문의가 없습니다.</p>
    return (
      <div className="overflow-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름/이메일</TableHead>
              <TableHead>문의 내용</TableHead>
              <TableHead>방 정보</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>생성일</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((t) => (
              <TableRow key={t.id} className="align-top">
                <TableCell className="whitespace-nowrap">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.email}</div>
                </TableCell>
                <TableCell className="max-w-md">
                  <p className="text-sm whitespace-pre-wrap">{t.message}</p>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {t.poll_id || t.poll_code ? (
                    <div className="space-y-1">
                      {t.poll_id && <div>ID: {t.poll_id}</div>}
                      {t.poll_code && <div>Code: {t.poll_code}</div>}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{STATUS_LABEL[t.status] || t.status}</Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {new Date(t.created_at).toLocaleString()}
                </TableCell>
                <TableCell className="space-x-2 whitespace-nowrap">
                  {Object.keys(STATUS_LABEL).map((s) => (
                    <Button
                      key={s}
                      variant={t.status === s ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateStatus(t.id, s)}
                    >
                      {STATUS_LABEL[s]}
                    </Button>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }, [tickets])

  const PollTable = useMemo(() => {
    if (!polls.length) return <p className="text-sm text-muted-foreground">방 데이터가 없습니다.</p>
    return (
      <div className="overflow-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>코드</TableHead>
              <TableHead>기간</TableHead>
              <TableHead>생성일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {polls.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">
                  {p.title || "(제목 없음)"}
                  <div className="text-xs text-muted-foreground">{p.id}</div>
                </TableCell>
                <TableCell className="text-sm">{p.code || "-"}</TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {p.start_date?.slice(0, 10)} ~ {p.end_date?.slice(0, 10)}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(p.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }, [polls])

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Shield className="h-4 w-4" />
              Admin Access
            </div>
            <CardTitle>관리자 토큰을 입력하세요</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ADMIN_TOKEN"
            />
            {authError && <p className="text-sm text-red-500 text-center">{authError}</p>}
            <Button className="w-full" onClick={handleAuth}>
              입장하기
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              환경변수 ADMIN_TOKEN 값을 사용합니다.
            </p>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 px-4 py-10">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">관리자 대시보드</h1>
            <p className="text-sm text-muted-foreground">방 목록과 문의를 확인하고 상태를 관리하세요.</p>
          </div>
          <Button variant="outline" onClick={refreshAll} disabled={loading} className="gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            새로고침
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="support" className="w-full">
          <TabsList>
            <TabsTrigger value="support">문의 목록</TabsTrigger>
            <TabsTrigger value="polls">방 목록</TabsTrigger>
          </TabsList>
          <TabsContent value="support" className="space-y-3">
            {TicketTable}
          </TabsContent>
          <TabsContent value="polls" className="space-y-3">
            {PollTable}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
