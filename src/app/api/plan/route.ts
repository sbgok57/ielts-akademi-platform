// src/app/api/plan/route.ts
// Çalışma programı üretimi ve takvim dışa aktarma
// SAFETY: NextAuth, sid çerezi veya misafir oturumu kabul edilir; 401 hatasıyla plan engellenmez.

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  generateWeeklyPlan,
  validatePlan,
  parseNaturalLanguageConstraints,
  planToIcs,
  type PlanConstraints,
} from "@/lib/plan-generator";

export async function GET(req: NextRequest) {
  const session = await auth();
  const sid = req.cookies.get("sid")?.value;
  const admin = req.cookies.get("admin")?.value;
  const userId = session?.user?.id || sid || (admin ? "admin-sbgok57" : "student-demo");

  const { searchParams } = new URL(req.url);
  const isIcs = searchParams.get("format") === "ics";

  const defaultConstraints: PlanConstraints = {
    userId,
    cefrLevel: "A1",
    dailyMinutes: 20,
    availableDays: [1, 2, 3, 4, 5, 6],
    liveLessonDays: [1, 3], // Pazartesi + Çarşamba
  };

  const items = generateWeeklyPlan(defaultConstraints);

  if (isIcs) {
    const ics = planToIcs(items, "IELTS Akademi");
    return new NextResponse(ics, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="ielts-akademi-plan.ics"',
      },
    });
  }

  return NextResponse.json({ items, count: items.length });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const sid = req.cookies.get("sid")?.value;
  const admin = req.cookies.get("admin")?.value;
  const userId = session?.user?.id || sid || (admin ? "admin-sbgok57" : "student-demo");

  try {
    const body = (await req.json().catch(() => ({}))) as { request?: string; cefrLevel?: string };
    const baseConstraints: PlanConstraints = {
      userId,
      cefrLevel: (body.cefrLevel as any) || "A1",
      dailyMinutes: 20,
      availableDays: [1, 2, 3, 4, 5, 6],
      liveLessonDays: [1, 3],
    };

    const { constraints, notes } = parseNaturalLanguageConstraints(
      String(body.request ?? ""),
      baseConstraints
    );

    const items = generateWeeklyPlan(constraints);
    const issues = validatePlan(items, constraints);

    return NextResponse.json({
      items,
      notes,
      issues,
      isValid: issues.filter((i) => i.severity === "error").length === 0,
    });
  } catch {
    return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
  }
}
