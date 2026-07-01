import { redirect } from "next/navigation";
import { getCurrentUser, getLearning } from "@/lib/queries";
import LearningScreen from "@/components/platform/screens/LearningScreen";

export default async function LearningPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const data = await getLearning(user.track);
  return (
    <LearningScreen
      lessonPoints={data.lessonPoints}
      lessonTitle={data.currentLesson?.title ?? null}
      moduleTitle={data.currentModule?.title ?? null}
    />
  );
}
