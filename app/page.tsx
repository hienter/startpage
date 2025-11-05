"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings, MessageCircle, X } from "lucide-react";

const BENEFIT_TYPES = [
  "방문요양",
  "방문목욕",
  "방문간호",
  "주야간보호",
  "단기보호",
  "복지용구",
  "노인요양시설",
  "노인공동생활가정",
] as const;

type TaskPeriod = "yearly" | "biannual" | "quarterly" | "monthly" | "weekly";

interface Task {
  id: string;
  name: string;
  period: TaskPeriod;
  applicableMonths: number[]; // 1-12
}

// 급여유형별 작업 정의
const TASKS_BY_BENEFIT_TYPE: Record<string, Task[]> = {
  방문요양: [
    { id: "regulation-setup", name: "운영규정 마련 및 정비", period: "yearly", applicableMonths: [12] },
    { id: "staff-meeting", name: "직원회의", period: "monthly", applicableMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: "beneficiary-status-change", name: "수급자 상태변화 기록", period: "weekly", applicableMonths: [] },
    { id: "long-term-care-benefit-record", name: "장기요양급여제공기록지 제공", period: "weekly", applicableMonths: [] },
    { id: "staff-health-check", name: "직원 건강검진", period: "yearly", applicableMonths: [12] },
    { id: "insurance-enrollment", name: "5대보험 가입확인 및 정비", period: "yearly", applicableMonths: [12] },
    { id: "welfare-reward", name: "복지 및 포상", period: "quarterly", applicableMonths: [1, 4, 7, 10] },
    { id: "complaint-handling-setup", name: "고충처리지침 마련 및 절차 정비", period: "yearly", applicableMonths: [12] },
    { id: "fall-risk-assessment", name: "낙상위험도", period: "yearly", applicableMonths: [12] },
    { id: "pressure-ulcer-risk", name: "욕창위험도", period: "yearly", applicableMonths: [12] },
    { id: "cognitive-function-test", name: "인지기능검사", period: "yearly", applicableMonths: [12] },
    { id: "beneficiary-visit-consultation", name: "수급자 방문상담", period: "monthly", applicableMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: "consultation-result-reflection", name: "상담결과 반영", period: "yearly", applicableMonths: [12] },
    { id: "benefit-guideline-setup", name: "급여제공지침 마련 및 정비", period: "yearly", applicableMonths: [12] },
    { id: "regulation-benefit-guideline-education", name: "운영규정 및 급여제공지침 교육", period: "yearly", applicableMonths: [12] },
    { id: "human-rights-education", name: "인권침해 대응지침 교육", period: "yearly", applicableMonths: [12] },
    { id: "elderly-rights-abuse-prevention-education", name: "노인인권 및 학대예방교육", period: "yearly", applicableMonths: [12] },
    { id: "caregiver-job-training", name: "요양보호사 직무교육", period: "yearly", applicableMonths: [12] },
    { id: "needs-assessment", name: "욕구사정", period: "yearly", applicableMonths: [12] },
    { id: "benefit-plan-writing", name: "급여제공계획 작성", period: "yearly", applicableMonths: [12] },
    { id: "benefit-result-evaluation", name: "급여제공결과평가", period: "yearly", applicableMonths: [12] },
    { id: "case-management-meeting", name: "사례관리회의", period: "biannual", applicableMonths: [1, 7] },
  ],
  방문목욕: [
    { id: "regulation-setup-visit-bath", name: "운영규정 마련 및 정비", period: "yearly", applicableMonths: [12] },
    { id: "staff-meeting-visit-bath", name: "직원회의", period: "monthly", applicableMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: "beneficiary-status-change-visit-bath", name: "수급자 상태변화 기록", period: "weekly", applicableMonths: [] },
    { id: "long-term-care-benefit-record-visit-bath", name: "장기요양급여제공기록지 제공", period: "weekly", applicableMonths: [] },
    { id: "staff-health-check-visit-bath", name: "직원 건강검진", period: "yearly", applicableMonths: [12] },
    { id: "insurance-enrollment-visit-bath", name: "5대보험 가입확인 및 정비", period: "yearly", applicableMonths: [12] },
    { id: "welfare-reward-visit-bath", name: "복지 및 포상", period: "quarterly", applicableMonths: [1, 4, 7, 10] },
    { id: "complaint-handling-setup-visit-bath", name: "고충처리지침 마련 및 절차 정비", period: "yearly", applicableMonths: [12] },
    { id: "fall-risk-assessment-visit-bath", name: "낙상위험도", period: "yearly", applicableMonths: [12] },
    { id: "pressure-ulcer-risk-visit-bath", name: "욕창위험도", period: "yearly", applicableMonths: [12] },
    { id: "cognitive-function-test-visit-bath", name: "인지기능검사", period: "yearly", applicableMonths: [12] },
    { id: "beneficiary-visit-consultation-visit-bath", name: "수급자 방문상담", period: "monthly", applicableMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: "consultation-result-reflection-visit-bath", name: "상담결과 반영", period: "yearly", applicableMonths: [12] },
    { id: "regulation-benefit-guideline-education-visit-bath", name: "운영규정 및 급여제공지침 교육", period: "yearly", applicableMonths: [12] },
    { id: "human-rights-education-visit-bath", name: "인권침해 대응지침 교육", period: "yearly", applicableMonths: [12] },
    { id: "elderly-rights-abuse-prevention-education-visit-bath", name: "노인인권 및 학대예방교육", period: "yearly", applicableMonths: [12] },
    { id: "caregiver-job-training-visit-bath", name: "요양보호사 직무교육", period: "yearly", applicableMonths: [12] },
    { id: "needs-assessment-visit-bath", name: "욕구사정", period: "yearly", applicableMonths: [12] },
    { id: "benefit-plan-writing-visit-bath", name: "급여제공계획 작성", period: "yearly", applicableMonths: [12] },
    { id: "benefit-result-evaluation-visit-bath", name: "급여제공결과평가", period: "yearly", applicableMonths: [12] },
    { id: "case-management-meeting-visit-bath", name: "사례관리회의", period: "biannual", applicableMonths: [1, 7] },
  ],
  방문간호: [
    { id: "regulation-setup-visit-nurse", name: "운영규정 마련 및 정비", period: "yearly", applicableMonths: [12] },
    { id: "staff-meeting-visit-nurse", name: "직원회의", period: "monthly", applicableMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: "equipment-management-ledger-visit-nurse", name: "비품관리대장 작성", period: "monthly", applicableMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: "beneficiary-status-change-visit-nurse", name: "수급자 상태변화 기록", period: "weekly", applicableMonths: [] },
    { id: "long-term-care-benefit-record-visit-nurse", name: "장기요양급여제공기록지 제공", period: "weekly", applicableMonths: [] },
    { id: "staff-health-check-visit-nurse", name: "직원 건강검진", period: "yearly", applicableMonths: [12] },
    { id: "insurance-enrollment-visit-nurse", name: "5대보험 가입확인 및 정비", period: "yearly", applicableMonths: [12] },
    { id: "welfare-reward-visit-nurse", name: "복지 및 포상", period: "quarterly", applicableMonths: [1, 4, 7, 10] },
    { id: "complaint-handling-setup-visit-nurse", name: "고충처리지침 마련 및 절차 정비", period: "yearly", applicableMonths: [12] },
    { id: "fall-risk-assessment-visit-nurse", name: "낙상위험도", period: "yearly", applicableMonths: [12] },
    { id: "pressure-ulcer-risk-visit-nurse", name: "욕창위험도", period: "yearly", applicableMonths: [12] },
    { id: "cognitive-function-test-visit-nurse", name: "인지기능검사", period: "yearly", applicableMonths: [12] },
    { id: "beneficiary-visit-consultation-visit-nurse", name: "수급자 방문상담", period: "monthly", applicableMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: "consultation-result-reflection-visit-nurse", name: "상담결과 반영", period: "yearly", applicableMonths: [12] },
    { id: "regulation-benefit-guideline-education-visit-nurse", name: "운영규정 및 급여제공지침 교육", period: "yearly", applicableMonths: [12] },
    { id: "human-rights-education-visit-nurse", name: "인권침해 대응지침 교육", period: "yearly", applicableMonths: [12] },
    { id: "elderly-rights-abuse-prevention-education-visit-nurse", name: "노인인권 및 학대예방교육", period: "yearly", applicableMonths: [12] },
    { id: "needs-assessment-visit-nurse", name: "욕구사정", period: "yearly", applicableMonths: [12] },
    { id: "benefit-plan-writing-visit-nurse", name: "급여제공계획 작성", period: "yearly", applicableMonths: [12] },
    { id: "benefit-result-evaluation-visit-nurse", name: "급여제공결과평가", period: "yearly", applicableMonths: [12] },
    { id: "case-management-meeting-visit-nurse", name: "사례관리회의", period: "biannual", applicableMonths: [1, 7] },
  ],
  주야간보호: [
    { id: "regulation-setup-daycare", name: "운영규정 마련 및 정비", period: "yearly", applicableMonths: [12] },
    { id: "business-plan-daycare", name: "사업계획 수립", period: "yearly", applicableMonths: [12] },
    { id: "beneficiary-status-change-daycare", name: "수급자 상태변화 기록", period: "weekly", applicableMonths: [] },
    { id: "long-term-care-benefit-record-daycare", name: "장기요양급여제공기록지 제공", period: "weekly", applicableMonths: [] },
    { id: "volunteer-activity-daycare", name: "자원봉사자 활동", period: "weekly", applicableMonths: [] },
    { id: "kitchen-equipment-disinfection-daycare", name: "주방 및 주방집기류 소독", period: "weekly", applicableMonths: [] },
    { id: "monthly-program-plan-daycare", name: "월간 프로그램 계획표", period: "monthly", applicableMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: "menu-plan-daycare", name: "식단표", period: "monthly", applicableMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: "institution-news-daycare", name: "기관의 소식 제공", period: "monthly", applicableMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: "beneficiary-visit-consultation-daycare", name: "수급자 방문상담", period: "quarterly", applicableMonths: [1, 4, 7, 10] },
    { id: "beneficiary-consultation-quarterly-daycare", name: "수급자 상담", period: "quarterly", applicableMonths: [1, 4, 7, 10] },
    { id: "consultation-result-reflection-daycare", name: "상담결과 반영", period: "yearly", applicableMonths: [12] },
    { id: "staff-health-check-daycare", name: "직원 건강검진", period: "yearly", applicableMonths: [12] },
    { id: "insurance-enrollment-daycare", name: "5대보험 가입확인 및 정비", period: "yearly", applicableMonths: [12] },
    { id: "welfare-reward-daycare", name: "복지 및 포상", period: "quarterly", applicableMonths: [1, 4, 7, 10] },
    { id: "professional-disinfection-daycare", name: "실내 외 전문소독", period: "quarterly", applicableMonths: [1, 4, 7, 10] },
    { id: "medicine-inspection-daycare", name: "약품 점검", period: "quarterly", applicableMonths: [1, 4, 7, 10] },
    { id: "complaint-handling-setup-daycare", name: "고충처리지침 마련 및 절차 정비", period: "yearly", applicableMonths: [12] },
    { id: "fall-risk-assessment-daycare", name: "낙상위험도", period: "yearly", applicableMonths: [12] },
    { id: "pressure-ulcer-risk-daycare", name: "욕창위험도", period: "yearly", applicableMonths: [12] },
    { id: "cognitive-function-test-daycare", name: "인지기능검사", period: "yearly", applicableMonths: [12] },
    { id: "human-rights-education-daycare", name: "인권침해 대응지침 교육", period: "yearly", applicableMonths: [12] },
    { id: "elderly-rights-abuse-prevention-education-daycare", name: "노인인권 및 학대예방교육", period: "yearly", applicableMonths: [12] },
    { id: "beneficiary-six-prevention-human-rights-education-daycare", name: "수급자 6가지(욕창예방, 낙상예방, 탈수예방, 배변도움, 관절구축예방, 치매예방) 자료 및 노인인권보호지침 교육", period: "yearly", applicableMonths: [12] },
    { id: "regulation-benefit-guideline-education-daycare", name: "운영규정 및 급여제공지침 교육", period: "yearly", applicableMonths: [12] },
    { id: "needs-assessment-daycare", name: "욕구사정", period: "yearly", applicableMonths: [12] },
    { id: "benefit-plan-writing-daycare", name: "급여제공계획 작성", period: "yearly", applicableMonths: [12] },
    { id: "benefit-result-evaluation-daycare", name: "급여제공결과평가", period: "yearly", applicableMonths: [12] },
    { id: "fire-alarm-equipment-education-daycare", name: "소화 및 경보설비 교육", period: "biannual", applicableMonths: [1, 7] },
    { id: "disaster-evacuation-drill-daycare", name: "재난대피훈련", period: "biannual", applicableMonths: [1, 7] },
    { id: "guardian-meeting-daycare", name: "보호자회의", period: "biannual", applicableMonths: [1, 7] },
    { id: "case-management-meeting-daycare", name: "사례관리회의", period: "biannual", applicableMonths: [1, 7] },
  ],
  단기보호: [
    { id: "regulation-setup-short-term", name: "운영규정 마련 및 정비", period: "yearly", applicableMonths: [12] },
    { id: "business-plan-short-term", name: "사업계획 수립", period: "yearly", applicableMonths: [12] },
    { id: "beneficiary-status-change-short-term", name: "수급자 상태변화 기록", period: "weekly", applicableMonths: [] },
    { id: "long-term-care-benefit-record-short-term", name: "장기요양급여제공기록지 제공", period: "weekly", applicableMonths: [] },
    { id: "volunteer-activity-short-term", name: "자원봉사자 활동", period: "weekly", applicableMonths: [] },
    { id: "kitchen-equipment-disinfection-short-term", name: "주방 및 주방집기류 소독", period: "weekly", applicableMonths: [] },
    { id: "beneficiary-consultation-short-term", name: "수급자 상담", period: "monthly", applicableMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: "beneficiary-visit-consultation-short-term", name: "수급자 방문상담", period: "quarterly", applicableMonths: [1, 4, 7, 10] },
    { id: "consultation-result-reflection-short-term", name: "상담결과 반영", period: "yearly", applicableMonths: [12] },
    { id: "staff-health-check-short-term", name: "직원 건강검진", period: "yearly", applicableMonths: [12] },
    { id: "insurance-enrollment-short-term", name: "5대보험 가입확인 및 정비", period: "yearly", applicableMonths: [12] },
    { id: "welfare-reward-short-term", name: "복지 및 포상", period: "quarterly", applicableMonths: [1, 4, 7, 10] },
    { id: "professional-disinfection-short-term", name: "실내 외 전문소독", period: "quarterly", applicableMonths: [1, 4, 7, 10] },
    { id: "medicine-inspection-short-term", name: "약품 점검", period: "quarterly", applicableMonths: [1, 4, 7, 10] },
    { id: "complaint-handling-setup-short-term", name: "고충처리지침 마련 및 절차 정비", period: "yearly", applicableMonths: [12] },
    { id: "fall-risk-assessment-short-term", name: "낙상위험도", period: "yearly", applicableMonths: [12] },
    { id: "pressure-ulcer-risk-short-term", name: "욕창위험도", period: "yearly", applicableMonths: [12] },
    { id: "cognitive-function-test-short-term", name: "인지기능검사", period: "yearly", applicableMonths: [12] },
    { id: "human-rights-education-short-term", name: "인권침해 대응지침 교육", period: "yearly", applicableMonths: [12] },
    { id: "elderly-rights-abuse-prevention-education-short-term", name: "노인인권 및 학대예방교육", period: "yearly", applicableMonths: [12] },
    { id: "beneficiary-six-prevention-human-rights-education-short-term", name: "수급자 6가지(욕창예방, 낙상예방, 탈수예방, 배변도움, 관절구축예방, 치매예방) 자료 및 노인인권보호지침 교육", period: "yearly", applicableMonths: [12] },
    { id: "regulation-benefit-guideline-education-short-term", name: "운영규정 및 급여제공지침 교육", period: "yearly", applicableMonths: [12] },
    { id: "needs-assessment-short-term", name: "욕구사정", period: "yearly", applicableMonths: [12] },
    { id: "benefit-plan-writing-short-term", name: "급여제공계획 작성", period: "yearly", applicableMonths: [12] },
    { id: "benefit-result-evaluation-short-term", name: "급여제공결과평가", period: "yearly", applicableMonths: [12] },
    { id: "fire-alarm-equipment-education-short-term", name: "소화 및 경보설비 교육", period: "biannual", applicableMonths: [1, 7] },
    { id: "disaster-evacuation-drill-short-term", name: "재난대피훈련", period: "biannual", applicableMonths: [1, 7] },
    { id: "case-management-meeting-short-term", name: "사례관리회의", period: "biannual", applicableMonths: [1, 7] },
  ],
  복지용구: [
    { id: "regulation-setup-welfare-equipment", name: "운영규정 마련 및 정비", period: "yearly", applicableMonths: [12] },
    { id: "elderly-rights-abuse-prevention-education-welfare-equipment", name: "노인인권 및 학대예방교육", period: "yearly", applicableMonths: [12] },
    { id: "product-repair-maintenance-guideline-welfare-equipment", name: "제품 수리 및 보수 관리지침 정비", period: "yearly", applicableMonths: [12] },
    { id: "regulation-benefit-guideline-education-welfare-equipment", name: "운영규정 및 급여제공지침 교육", period: "yearly", applicableMonths: [12] },
    { id: "beneficiary-consultation-welfare-equipment", name: "수급자 상담", period: "monthly", applicableMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: "long-term-care-benefit-record-welfare-equipment", name: "장기요양급여제공기록지 제공", period: "monthly", applicableMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: "beneficiary-visit-consultation-welfare-equipment", name: "수급자 방문상담", period: "quarterly", applicableMonths: [1, 4, 7, 10] },
    { id: "consultation-result-reflection-welfare-equipment", name: "상담결과 반영", period: "yearly", applicableMonths: [12] },
    { id: "needs-assessment-welfare-equipment", name: "욕구사정", period: "yearly", applicableMonths: [12] },
  ],
  노인요양시설: [],
  노인공동생활가정: [],
};

export default function Home() {
  const [now, setNow] = useState<Date>(() => new Date());
  const [open, setOpen] = useState<boolean>(false);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [benefitType, setBenefitType] = useState<string>(() => {
    try {
      return localStorage.getItem("benefitType") ?? BENEFIT_TYPES[0];
    } catch {
      return BENEFIT_TYPES[0];
    }
  });

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // 처음 접속한 사용자에게 팝오버 표시
  useEffect(() => {
    const hasSeenPopover = localStorage.getItem("hasSeenSettingsPopover");
    if (!hasSeenPopover) {
      // 즉시 팝오버 표시
      setPopoverOpen(true);
    }
  }, []);

  // 팝오버가 닫힐 때 확인 플래그 설정
  useEffect(() => {
    if (!popoverOpen) {
      try {
        localStorage.setItem("hasSeenSettingsPopover", "true");
      } catch (err) {
        console.error("Failed to save popover flag:", err);
      }
    }
  }, [popoverOpen]);

  // 팝오버 닫기 핸들러
  const handlePopoverClose = () => {
    setPopoverOpen(false);
    try {
      localStorage.setItem("hasSeenSettingsPopover", "true");
    } catch (err) {
      console.error("Failed to save popover flag:", err);
    }
  };

  // 모달 제어는 shadcn Dialog가 담당

  // 초기 로드는 useState 이니셜라이저에서 처리

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const period = hours < 12 ? "오전" : "오후";
  const hour12 = (() => {
    const h = hours % 12;
    return h === 0 ? 12 : h;
  })();
  const mm = String(minutes).padStart(2, "0");
  const time = `${period} ${hour12}:${mm}`;

  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const weekdayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdayNames[now.getDay()];
  const dateStr = `${year}년 ${month}월 ${date}일 ${weekday}요일`;

  function handleSave() {
    try {
      localStorage.setItem("benefitType", benefitType);
      localStorage.setItem("hasSeenSettingsPopover", "true");
    } catch {}
    setOpen(false);
    setPopoverOpen(false);
    // benefitType 상태가 변경되면 자동으로 화면이 업데이트됩니다
  }

  const currentTasks = TASKS_BY_BENEFIT_TYPE[benefitType] || [];

  // 특정 월의 말일 계산 함수
  function getLastDayOfMonth(year: number, month: number): Date {
    // 다음 달의 0일 = 이번 달의 말일
    return new Date(year, month, 0);
  }

  // 다음 실행일 계산 함수 (말일 기준)
  function getNextOccurrenceDate(task: Task): Date | null {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDate = today.getDate();
    
    // 주 단위 작업 처리
    if (task.period === "weekly") {
      const todayDayOfWeek = today.getDay(); // 0(일요일) ~ 6(토요일)
      const daysUntilSunday = (7 - todayDayOfWeek) % 7; // 다음 일요일까지 남은 일수
      
      if (daysUntilSunday === 0) {
        // 오늘이 일요일이면 다음 주 일요일
        const nextSunday = new Date(today);
        nextSunday.setDate(today.getDate() + 7);
        nextSunday.setHours(23, 59, 59, 999); // 일요일 끝
        return nextSunday;
      } else {
        // 이번 주 일요일
        const thisSunday = new Date(today);
        thisSunday.setDate(today.getDate() + daysUntilSunday);
        thisSunday.setHours(23, 59, 59, 999); // 일요일 끝
        return thisSunday;
      }
    }
    
    // 적용 가능한 월 중 다음 날짜 찾기
    const sortedMonths = [...task.applicableMonths].sort((a, b) => a - b);
    
    // 현재 월이 적용 가능한 월에 포함되는지 확인
    if (sortedMonths.includes(currentMonth)) {
      const currentMonthLastDay = getLastDayOfMonth(currentYear, currentMonth);
      const lastDayDate = currentMonthLastDay.getDate();
      // 아직 말일이 지나지 않았으면 이번 달 말일
      if (currentDate < lastDayDate) {
        return currentMonthLastDay;
      }
      // 말일 당일이거나 이미 지났으면 다음 발생일로
    }
    
    // 올해 남은 월 중 다음 월 찾기
    const nextMonthThisYear = sortedMonths.find(m => m > currentMonth);
    
    if (nextMonthThisYear) {
      // 해당 월의 말일 반환
      return getLastDayOfMonth(currentYear, nextMonthThisYear);
    }
    
    // 올해 남은 월이 없으면 내년 첫 번째 월의 말일
    if (sortedMonths.length > 0) {
      return getLastDayOfMonth(currentYear + 1, sortedMonths[0]);
    }
    
    return null;
  }

  // 디데이 계산 함수
  function calculateDaysUntil(targetDate: Date | null): number | null {
    if (!targetDate) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  // 작업을 디데이 순으로 정렬
  const tasksWithDday = currentTasks
    .map(task => {
      const nextDate = getNextOccurrenceDate(task);
      const daysUntil = calculateDaysUntil(nextDate);
      return { task, nextDate, daysUntil };
    })
    .sort((a, b) => {
      if (a.daysUntil === null) return 1;
      if (b.daysUntil === null) return -1;
      return a.daysUntil - b.daysUntil;
    });

  // 섹션별로 분류 (과거 날짜는 제외)
  const thisWeek = tasksWithDday.filter(({ daysUntil }) => daysUntil !== null && daysUntil >= 0 && daysUntil <= 7);
  const thisMonth = tasksWithDday.filter(({ daysUntil }) => daysUntil !== null && daysUntil > 7 && daysUntil <= 30);
  const allTasks = tasksWithDday.filter(({ daysUntil }) => daysUntil === null || daysUntil > 30);

  const handleFeedbackClick = () => {
    window.open("https://open.kakao.com/o/gPtUG8oh", "_blank", "noopener,noreferrer");
  };

  return (
    <main className="center">
      <div className="top-buttons">
        <Button 
          variant="outline" 
          className="feedback-btn" 
          onClick={handleFeedbackClick}
          aria-label="피드백 및 기능요청"
        >
          <MessageCircle className="size-5 mr-2" aria-hidden="true" />
          피드백 및 기능요청
        </Button>
        <Popover open={popoverOpen} onOpenChange={(open) => {
          if (!open) {
            handlePopoverClose();
          } else {
            setPopoverOpen(true);
          }
        }}>
          <Dialog open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="settings-btn" 
                  aria-label="설정 열기"
                  onClick={() => {
                    setOpen(true);
                    handlePopoverClose();
                  }}
                >
                  <Settings className="size-5" aria-hidden="true" />
                </Button>
              </DialogTrigger>
            </PopoverTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>설정</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Label className="field-label">급여유형설정</Label>
                <RadioGroup value={benefitType} onValueChange={setBenefitType} className="grid grid-cols-2 gap-3">
                  {BENEFIT_TYPES.map((opt) => {
                    const isEnabled = opt !== "노인요양시설" && opt !== "노인공동생활가정";
                    const id = `benefit-${opt}`;
                    return (
                      <div key={opt} className={`flex items-center gap-2 ${isEnabled ? "" : "opacity-50 cursor-not-allowed"}`}>
                        <RadioGroupItem id={id} value={opt} disabled={!isEnabled} />
                        <Label htmlFor={id} className={isEnabled ? "cursor-pointer" : "cursor-not-allowed"}>
                          {opt}{!isEnabled ? " (개발 중)" : ""}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
                <Button onClick={handleSave}>저장</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <PopoverContent className="w-auto p-2 text-sm bg-black text-white border-black popover-with-arrow relative pr-8" side="bottom" align="end">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePopoverClose}
              className="absolute top-1 right-1 h-6 w-6 text-white hover:bg-white/10"
              aria-label="닫기"
            >
              <X className="size-4" />
            </Button>
            우리 센터 급여 유형을 설정할 수 있어요!
          </PopoverContent>
        </Popover>
      </div>
      <div className="clock-wrap">
        <div className="date">{dateStr}{benefitType ? ` · ${benefitType}` : ""}</div>
        <h1 className="clock">{time}</h1>
      </div>

      {tasksWithDday.length > 0 && (
        <div className="dday-widget-container">
          {thisWeek.length > 0 && (
            <div className="dday-section">
              <h2 className="dday-section-title">7일 이내</h2>
              <div className="dday-widget-grid">
                {thisWeek.map(({ task, nextDate, daysUntil }) => (
                  <Card key={task.id} className="border-foreground/30">
                    <CardHeader>
                      <CardTitle className="text-base">{task.name}</CardTitle>
                      <CardDescription>{getPeriodLabel(task.period)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {daysUntil !== null ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-foreground">
                            {`D-${daysUntil}`}
                          </span>
                          {nextDate && (
                            <span className="text-sm text-muted-foreground">
                              {nextDate.getFullYear()}년 {nextDate.getMonth() + 1}월
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">예정 없음</span>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {thisMonth.length > 0 && (
            <div className="dday-section">
              <h2 className="dday-section-title">30일 이내</h2>
              <div className="dday-widget-grid">
                {thisMonth.map(({ task, nextDate, daysUntil }) => (
                  <Card key={task.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{task.name}</CardTitle>
                      <CardDescription>{getPeriodLabel(task.period)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {daysUntil !== null ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-foreground">
                            {`D-${daysUntil}`}
                          </span>
                          {nextDate && (
                            <span className="text-sm text-muted-foreground">
                              {nextDate.getFullYear()}년 {nextDate.getMonth() + 1}월
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">예정 없음</span>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {allTasks.length > 0 && (
            <div className="dday-section">
              <h2 className="dday-section-title">전체</h2>
              <div className="dday-widget-grid">
                {allTasks.map(({ task, nextDate, daysUntil }) => (
                  <Card key={task.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{task.name}</CardTitle>
                      <CardDescription>{getPeriodLabel(task.period)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {daysUntil !== null ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-muted-foreground">
                            {`D-${daysUntil}`}
                          </span>
                          {nextDate && (
                            <span className="text-sm text-muted-foreground">
                              {nextDate.getFullYear()}년 {nextDate.getMonth() + 1}월
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">예정 없음</span>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="source-info">
        <p className="text-xs text-muted-foreground">
          출처: 2024 재가급여 평가매뉴얼
        </p>
      </div>
    </main>
  );
}

function getPeriodLabel(period: TaskPeriod): string {
  switch (period) {
    case "yearly":
      return "연간";
    case "biannual":
      return "반기별";
    case "quarterly":
      return "분기별";
    case "monthly":
      return "월간";
    case "weekly":
      return "주간";
    default:
      return "";
  }
}
