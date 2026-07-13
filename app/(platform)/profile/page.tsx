import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser, getVisibilityHistory } from "@/lib/queries";
import { lcwatPlatformEnabled } from "@/lib/settings";
import { decryptSecret, maskSecret } from "@/lib/crypto";
import ProfileScreen, { type ProfileUser, type VisibilityInfo, type VisibilityEvent } from "@/components/platform/screens/ProfileScreen";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [vs, history, platformLcwat] = await Promise.all([
    prisma.visibilitySubmission.findUnique({ where: { userId: user.id } }),
    user.role === "student" ? getVisibilityHistory(user.id) : Promise.resolve([]),
    lcwatPlatformEnabled(),
  ]);

  // A stored key can be present but undecryptable (e.g. AUTH_SECRET was
  // rotated). Distinguish that from "not set" so the student is asked to
  // re-enter it rather than seeing a silent failure.
  const keyState = (enc: string | null): { masked: string | null; unreadable: boolean } => {
    if (!enc) return { masked: null, unreadable: false };
    const plain = decryptSecret(enc);
    if (plain === null) return { masked: null, unreadable: true };
    return { masked: maskSecret(plain), unreadable: false };
  };

  const profileUser: ProfileUser = {
    name: user.name,
    email: user.email,
    role: user.role,
    bio: user.bio,
    city: user.city,
    phone: user.phone,
    portfolioUrl: user.portfolioUrl,
    githubUrl: user.githubUrl,
    linkedinUrl: user.linkedinUrl,
    xUrl: user.xUrl,
    mediumUrl: user.mediumUrl,
    huggingfaceUrl: user.huggingfaceUrl,
    kaggleUrl: user.kaggleUrl,
    talentVisible: user.talentVisible,
    mustChangePassword: user.mustChangePassword,
    aiKeys: {
      gemini: keyState(user.geminiApiKeyEnc),
      anthropic: keyState(user.anthropicApiKeyEnc),
      openai: keyState(user.openaiApiKeyEnc),
      lcwat: keyState(user.lcwatApiKeyEnc),
    },
    lcwatPlatformEnabled: platformLcwat,
  };

  const visibility: VisibilityInfo = vs
    ? {
        status: vs.status,
        reviewNote: vs.reviewNote,
        githubUrl: vs.githubUrl,
        linkedinUrl: vs.linkedinUrl,
        xUrl: vs.xUrl,
        mediumUrl: vs.mediumUrl,
        huggingfaceUrl: vs.huggingfaceUrl,
        kaggleUrl: vs.kaggleUrl,
      }
    : null;

  const visibilityHistory: VisibilityEvent[] = history.map((h) => ({
    id: h.id,
    decision: h.decision,
    note: h.note,
    reviewerName: h.reviewer?.name ?? null,
    createdAt: h.createdAt.toISOString(),
  }));

  return <ProfileScreen user={profileUser} visibility={visibility} visibilityHistory={visibilityHistory} />;
}
