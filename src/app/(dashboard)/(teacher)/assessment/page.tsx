"use client";

import Info from "@/app/(dashboard)/(teacher)/_components/Info";
import Rubric from "@/app/(dashboard)/(teacher)/_components/Rubric";
import Steps from "@/app/(dashboard)/(teacher)/_components/Steps";
import UploadPage from "@/app/(dashboard)/(teacher)/_components/UploadPage";
import { AssessmentProvider } from "@/app/(dashboard)/(teacher)/_types/AssessmentProvider";

export default function AssessmentSetup() {
  // const startGrading = async () => {
  //   if (!workspace) {
  //     toast.error("No workspace");
  //     return;
  //   }
  //   loadingService.show();

  //   try {
  //     const { data } = await axios.post("/api/teacher/assessments", {
  //       name: assessmentName,
  //       classId: workspace?.classId,
  //       subjectId: workspace?.subjectId,
  //       answerKey: markingScheme,
  //       students: simplifiedOMR,
  //     });

  //     console.log(data);

  //     loadingService.hide();
  //     toast.success(data.message);
  //     push(`/assessment/${data.assessmentId}`);
  //   } catch (error) {
  //     loadingService.hide();
  //     toast.error(filterError(error));
  //   }
  // };

  // useEffect(() => {
  //   if (assessmentType === "omr") {
  //     setOmrScheme((prev) => {
  //       const next = [...prev];

  //       if (next.length < questionCount)
  //         next.push(...Array(questionCount - next.length).fill("-"));
  //       else next.length = questionCount;

  //       return next;
  //     });
  //   }
  // }, [questionCount, assessmentType]);

  return (
    <AssessmentProvider>
      <Steps
        grade={() => {}}
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
