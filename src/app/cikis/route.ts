// app/cikis/route.ts — çıkış: oturumu kapat ve ana sayfaya dön
import { signOut } from "@/auth";
export async function POST() {
  await signOut({ redirectTo: "/" });
}
export async function GET() {
  await signOut({ redirectTo: "/" });
}
