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
import { useAppSettings } from "@/components/app-providers"

interface AuthDialogProps {
  isOpen: boolean
  onSuccess: (participantId: string, name: string) => void
}

export function AuthDialog({ isOpen, onSuccess }: AuthDialogProps) {
  const params = useParams()
  const { language } = useAppSettings()
  const t =
    language === "en"
      ? {
          title: "Pick your name 👋",
          desc: "Enter a name to join.",
          nameLabel: "Name (required)",
          namePlaceholder: "e.g. Alex",
          roleLabel: "Role",
          roleMember: "Member",
          roleLeader: "Leader / presenter",
          weightLabel: "Weight",
          weightHint: "Choose importance for your role.",
          weight1: "1x (default)",
          weight15: "1.5x (important)",
          weight2: "2x (required)",
          submit: "Continue",
          submitting: "Joining...",
          nameRequired: "Please enter your name.",
          duplicate: "This name is already taken. Try another.",
          welcome: "Welcome back!",
          error: "Failed to join.",
        }
      : {
          title: "팀플 시간 정하기 👋",
          desc: "참여하려면 이름을 입력해주세요.",
          nameLabel: "이름 (필수)",
          namePlaceholder: "예: 김팀플",
          roleLabel: "내 역할",
          roleMember: "일반 팀원",
          roleLeader: "팀장/발표자",
          weightLabel: "가중치",
          weightHint: "팀에서 중요도를 정해 가중치를 선택하세요.",
          weight1: "1x (기본)",
          weight15: "1.5x (중요)",
          weight2: "2x (필수 참여)",
          submit: "시간 입력하러 가기",
          submitting: "등록 중...",
          nameRequired: "이름을 입력해주세요.",
          duplicate: "이미 참여한 이름입니다. 다른 이름을 입력해주세요.",
          welcome: "다시 오셨네요!",
          error: "참가 등록 중 오류가 발생했습니다.",
        }
  const [name, setName] = useState("")
  const [role, setRole] = useState("member")
  const [weight, setWeight] = useState("1")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error(t.nameRequired)
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
          toast.success(`${name} ${t.welcome}`)
          onSuccess(existing.data.id, name)
          return
        }
        toast.error(t.duplicate)
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

      toast.success(language === "en" ? `Welcome, ${name}!` : `${name}님 환영합니다!`)
      onSuccess(data.id, data.name) // 부모 컴포넌트에 ID 전달
      
    } catch (error) {
      console.error(error)
      toast.error(t.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>
             {t.desc}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t.nameLabel}</Label>
            <Input
              id="name"
              placeholder={t.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">{t.roleLabel}</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">{t.roleMember}</SelectItem>
                <SelectItem value="leader">{t.roleLeader}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="weight">{t.weightLabel}</Label>
            <Select value={weight} onValueChange={setWeight}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">{t.weight1}</SelectItem>
                <SelectItem value="1.5">{t.weight15}</SelectItem>
                <SelectItem value="2">{t.weight2}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t.weightHint}
            </p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? t.submitting : t.submit}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
