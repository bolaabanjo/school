import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Tailwind,
} from "@react-email/components";
import * as React from "react";

interface CourseReadyEmailProps {
    studentName: string;
    courseTitle: string;
    courseUrl: string;
    message?: string;
}

export const CourseReadyEmail = ({
    studentName,
    courseTitle,
    courseUrl,
    message,
}: CourseReadyEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Your course is ready — {courseTitle}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Heading className="text-black text-[28px] font-bold text-center p-0 my-[20px] mx-0">
                            Your Course Is Ready 🎉
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hello {studentName || "there"},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Great news — <strong>{courseTitle}</strong> is now live and ready for you. All the lessons and materials are available for you to start learning right away.
                        </Text>

                        {message && (
                            <Section className="bg-[#f4f4f5] rounded-[8px] p-[16px] my-[16px]">
                                <Text className="text-[#3f3f46] text-[14px] leading-[24px] m-0 italic">
                                    {message}
                                </Text>
                            </Section>
                        )}

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-6 py-3"
                                href={courseUrl}
                            >
                                Start Learning
                            </Button>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            If you need any help, contact us at{" "}
                            <a href="mailto:hello@cornelabs.com" className="text-[#10b981] font-medium no-underline">
                                hello@cornelabs.com
                            </a>{" "}
                            or reply to this email.
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Happy learning,
                            <br />
                            Corne Labs Learning Team
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default CourseReadyEmail;
