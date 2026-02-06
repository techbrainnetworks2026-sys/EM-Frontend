export const employeesTask = [
    {
        id: 1,
        name: "John Doe",
        department: "MERN Stack Developer",
        tasks: [
            {
                taskId: "T-101",
                title: "Build login UI",
                description: "Create responsive login page",
                priority: "High",
                status: "In-Progress",
                assignedDate: "02-01-2026",
                dueDate: "10-01-2026",
                completedDate: null,
                comments: [],
            },
            {
                taskId: "T-102",
                title: "Integrate Auth API",
                description: "Connect login UI with backend",
                priority: "Medium",
                status: "In-Progress",
                assignedDate: "03-01-2026",
                dueDate: "12-01-2026",
                completedDate: null,
                comments: [],
            }
        ],
    },
    {
        id: 2,
        name: "Sarah Smith",
        department: "Backend Developer",
        tasks: [
            {
                taskId: "T-101",
                title: "Build login UI",
                description: "Create responsive login page",
                priority: "High",
                status: "In-Progress",
                assignedDate: "02-01-2026",
                dueDate: "10-01-2026",
                completedDate: null,
                comments: [
                    {
                        author : "employee",
                        description : "Completed the UI of the login",
                        postedOn : "08-01-2026"
                    },
                    {
                        author : "manager",
                        description : "Kindly Post the video Link...",
                        postedOn : "08-01-2026"
                    }
                ],
            },
            {
                taskId: "T-102",
                title: "Integrate Auth API",
                description: "Connect login UI with backend",
                priority: "Medium",
                status: "In-Progress",
                assignedDate: "03-01-2026",
                dueDate: "12-01-2026",
                completedDate: null,
                comments: [],
            },
            {
                taskId: "T-103",
                title: "Fix validation bugs",
                description: "Resolve form validation issues",
                priority: "Low",
                status: "Completed",
                assignedDate: "01-01-2026",
                dueDate: "05-01-2026",
                completedDate: "2026-01-04",
                comments: [],
            },
        ],
        
    },
    {
        id: 3,
        name: "Michael Lee",
        department: "Digital Marketing",
        tasks: [
            {
                taskId: "T-101",
                title: "Build login UI",
                description: "Create responsive login page",
                priority: "High",
                status: "In-Progress",
                assignedDate: "2026-01-02",
                dueDate: "2026-01-10",
                completedDate: null,
                comments: [],
            },
            {
                taskId: "T-102",
                title: "Integrate Auth API",
                description: "Connect login UI with backend",
                priority: "Medium",
                status: "In-Progress",
                assignedDate: "2026-01-03",
                dueDate: "2026-01-12",
                completedDate: null,
                comments: [],
            },
            {
                taskId: "T-103",
                title: "Fix validation bugs",
                description: "Resolve form validation issues",
                priority: "Low",
                status: "Completed",
                assignedDate: "2026-01-01",
                dueDate: "2026-01-05",
                completedDate: "2026-01-04",
                comments: [],
            },
        ],
    },
]