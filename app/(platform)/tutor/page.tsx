import { redirect } from "next/navigation";
import { getCurrentUser, getTutorData } from "@/lib/queries";
import TutorChat from "@/components/platform/TutorChat";

export default async function TutorPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const data = await getTutorData(user.id, user.track);

  return (
    <TutorChat
      initialMessages={data.seedMessages}
      chatHistory={data.chatHistory}
      lessonId={data.currentLessonId}
      lessonTitle={data.currentLessonTitle}
      hasAiKey={Boolean(user.geminiApiKeyEnc || user.anthropicApiKeyEnc || user.openaiApiKeyEnc)}
    />
  );
}
