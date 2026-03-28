"use client";

import Info from "@/app/(dashboard)/(teacher)/_components/pages/Info";
import Rubric from "@/app/(dashboard)/(teacher)/_components/pages/Rubric";
import Steps from "@/app/(dashboard)/(teacher)/_components/Steps";
import UploadPage from "@/app/(dashboard)/(teacher)/_components/pages/UploadPage";
import { AssessmentProvider } from "@/app/(dashboard)/(teacher)/_types/AssessmentProvider";

export default function AssessmentSetup() {
  return (
    <AssessmentProvider>
      <Steps
        steps={[
          {
            title: "Assessment Info",
            component: <Info />,
          },
          {
            title: "Rubric - (Marking Scheme)",
            component: <Rubric />,
          },
          {
            title: "Student Scripts",
            component: <UploadPage />,
          },
        ]}
      />
    </AssessmentProvider>
  );
}
