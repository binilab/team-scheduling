"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface AuthDialogProps {
  isOpen: boolean
  onSuccess: (participantId: string, name: string) => void
}

export function AuthDialog({ isOpen, onSuccess }: AuthDialogProps) {
  const params = useParams()
  const [name, setName] = useState("")
  const [role, setRole] = useState("member")
  const [weight, setWeight] = useState("1")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("이름을 입력해주세요.")
      return
    }

    try {
      setLoading(true)
      const pollId = params.id as string

      // 중복 이름 검사
      const existing = await supabase
        .from("participants")
        .select("id, name")
        .eq("poll_id", pollId)
        .eq("name", name)
        .maybeSingle()

      if (existing.data?.id) {
        const storedId = localStorage.getItem(`poll:${pollId}:participantId`)
        const storedName = localStorage.getItem(`poll:${pollId}:participantName`)
        if (storedId === existing.data.id || storedName === name) {
          toast.success(`${name}님 다시 오셨네요!`)
          onSuccess(existing.data.id, name)
          return
        }
        toast.error("이미 참여한 이름입니다. 다른 이름을 입력해주세요.")
        return
      }

      // 참가자 등록
      let { data, error } = await supabase
        .from("participants")
        .insert([
          {
            poll_id: pollId,
            name: name,
            role: role,
            weight: parseFloat(weight),
          },
        ])
        .select()
        .single()

      if (error && /weight|column/i.test(error.message)) {
        ;({ data, error } = await supabase
          .from("participants")
          .insert([
            {
              poll_id: pollId,
              name: name,
              role: role,
            },
          ])
          .select()
          .single())
      }

      if (error) throw error

      toast.success(`${name}님 환영합니다!`)
      onSuccess(data.id, data.name) // 부모 컴포넌트에 ID 전달
      
    } catch (error) {
      console.error(error)
      toast.error("참가 등록 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>팀플 시간 정하기 👋</DialogTitle>
          <DialogDescription>
             참여하려면 이름을 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">이름 (필수)</Label>
            <Input
              id="name"
              placeholder="예: 김팀플"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">내 역할</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">일반 팀원</SelectItem>
                <SelectItem value="leader">팀장/발표자</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="weight">가중치</Label>
            <Select value={weight} onValueChange={setWeight}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1x (기본)</SelectItem>
                <SelectItem value="1.5">1.5x (중요)</SelectItem>
                <SelectItem value="2">2x (필수 참여)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              팀에서 중요도를 정해 가중치를 선택하세요.
            </p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "등록 중..." : "시간 입력하러 가기"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
