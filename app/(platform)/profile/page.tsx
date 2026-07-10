import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/queries";
import { decryptSecret, maskSecret } from "@/lib/crypto";
import ProfileScreen, { type ProfileUser, type VisibilityInfo } from "@/components/platform/screens/ProfileScreen";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const vs = await prisma.visibilitySubmission.findUnique({ where: { userId: user.id } });

  const mask = (enc: string | null) => {
    const plain = enc ? decryptSecret(enc) : null;
    return plain ? maskSecret(plain) : null;
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
    aiKeysMasked: {
      gemini: mask(user.geminiApiKeyEnc),
      anthropic: mask(user.anthropicApiKeyEnc),
      openai: mask(user.openaiApiKeyEnc),
    },
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

  return <ProfileScreen user={profileUser} visibility={visibility} />;
}
