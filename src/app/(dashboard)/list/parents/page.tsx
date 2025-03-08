import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// ✅ Convert to async function directly
const ParentPage = async () => {
  const { userId } = auth(); // No need for .getAuth(), auth() directly provides the data

  if (!userId) {
    // Handle unauthenticated users or redirect to login page
    return <div>Please log in</div>;
  }

  // ✅ Fetch data directly in the component (Server-side fetching)
  const students = await prisma.student.findMany({
    where: {
      parentId: userId,
    },
  });

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

export default ParentPage;
