import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GetServerSideProps } from "next";

// ✅ Define types for TypeScript support
interface Student {
  id: string;
  name: string;
  surname: string;
  classId: string;
}

interface ParentPageProps {
  students: Student[];
}

const ParentPage: React.FC<ParentPageProps> = ({ students }) => {
  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="">
        {students.length > 0 ? (
          students.map((student) => (
            <div className="w-full xl:w-2/3" key={student.id}>
              <div className="h-full bg-white p-4 rounded-md">
                <h1 className="text-xl font-semibold">
                  Schedule ({student.name + " " + student.surname})
                </h1>
                <BigCalendarContainer type="classId" id={student.classId} />
              </div>
            </div>
          ))
        ) : (
          <p>No students found.</p>
        )}
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

// ✅ Fetch data on the server using getServerSideProps
export const getServerSideProps: GetServerSideProps = async (context) => {
  // ✅ Use `context.req` for proper authentication
  const authData = auth();
  const { userId } = authData.getAuth(context.req);

  if (!userId) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const students = await prisma.student.findMany({
      where: {
        parentId: userId,
      },
    });

    return {
      props: { students },
    };
  } catch (error) {
    console.error("Error fetching students:", error);
    return {
      props: { students: [] }, // ✅ Prevent crashing if Prisma fails
    };
  }
};

export default ParentPage;
