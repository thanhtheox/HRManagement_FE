"use client";
import { Input } from "@nextui-org/react";
import CustomDropdown from "src/components/customDropdown";
import RegularButton from "src/components/regularButton";
import TableFirstForm, {
    ColumnEnum,
    ColumnType,
} from "src/components/tableFirstForm";
import { SearchIcon } from "src/svgs";
import { format, parseISO, startOfToday } from "date-fns";
import { useEffect, useState } from "react";
import StackChart from "src/components/stackChart";
import { User, Department } from "src/types/userType";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import { useRouter } from "next/navigation";

type Employee = User & {
    createdAt: string;
    department?: string;
};

type dDepartment = Department & {
    value: string;
};

const AttendanceList = () => {
    const router = useRouter();
    const axiosPrivate = useAxiosPrivate();
    const [employees, setEmployees] = useState<Employee[]>();
    const [departments, setDepartments] = useState<dDepartment[]>();
    const [sortedDept, setSortedDept] = useState<string>();
    const [searchQuery, setSearchQuery] = useState<string>();
    useEffect(() => {
        const getEmployees = async () => {
            try {
                const res = await axiosPrivate.get<Employee[]>("/all-user", {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                });
                res.data.map((employee) => {
                    employee.createdAt = format(
                        parseISO(employee.createdAt),
                        "dd/MM/yyyy"
                    );
                    employee.department = employee?.departmentId?.name;
                });
                setEmployees(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        const getDepartments = async () => {
            try {
                const res = await axiosPrivate.get<dDepartment[]>(
                    "/departments"
                );
                res.data.map((dept) => (dept.value = dept.name));
                setDepartments(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        getDepartments();
        getEmployees();
    }, []);
    const statusFilterOps = [
        { name: "Working", value: "working" },
        { name: "Absent", value: "absent" },
    ];
    const columns: ColumnType[] = [
        {
            title: "No",
            type: ColumnEnum.indexColumn,
            key: "no",
        },
        {
            title: "Employee Code",
            type: ColumnEnum.textColumn,
            key: "code",
        },
        {
            title: "Full Name",
            type: ColumnEnum.textColumn,
            key: "name",
        },
        {
            title: "Started Date",
            type: ColumnEnum.textColumn,
            key: "createdAt",
        },
        {
            title: "Department",
            type: ColumnEnum.textColumn,
            key: "department",
        },
        {
            title: "Status",
            type: ColumnEnum.filterColumn,
            key: "status",
            filterOptions: statusFilterOps,
        },
        {
            title: "Action",
            type: ColumnEnum.functionColumn,
            key: "action",
        },
    ];

    const today = startOfToday();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const rows = () => {
        let sortedEmp = employees;
        if (searchQuery) {
            sortedEmp = sortedEmp?.filter(
                (emp) =>
                    emp.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    emp.code.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (sortedDept) {
            sortedEmp = sortedEmp?.filter(
                (emp) => emp?.departmentId?.name == sortedDept
            );
        }
        return sortedEmp;
    };
    const moveToAddNew = () => {
        return router.replace("/attendance/add-employee");
    };

    const handleView = (id: string) => {
        router.replace("/account/profile?id=" + id);
    };
    return (
        <div className="flex flex-1 flex-col px-[4%] pb-4 rounded gap-y-9">
            <div className="flex flex-1 flex-col bg-white w-full items-start py-4 gap-5 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
                <div className="w-[95%] self-center flex flex-col">
                    <div className="w-full flex flex-row gap-3 items-center">
                        <h3 className="text-[26px] font-semibold text-[#2C3D3A]">
                            Employee list
                        </h3>
                        <Input
                            className="rounded w-auto flex-1"
                            classNames={{
                                inputWrapper: "bg-white border",
                            }}
                            radius="sm"
                            variant="bordered"
                            key={"a"}
                            type="email"
                            placeholder="Search"
                            labelPlacement={"outside"}
                            endContent={
                                <div className="bg-black p-1 rounded opacity-80">
                                    <SearchIcon />
                                </div>
                            }
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <CustomDropdown
                            placeholder="Select department"
                            additionalStyle="flex-1 h-full"
                            buttonStyle="bg-white border h-[39px]"
                            options={departments}
                            onSelect={setSortedDept}
                            value={sortedDept}
                        />
                        <div className="flex gap-3">
                            <RegularButton
                                label="add new"
                                callback={moveToAddNew}
                                additionalStyle="min-w-[100px]"
                            />
                        </div>
                    </div>
                    <TableFirstForm
                        columns={columns}
                        rows={rows()}
                        viewFunction={handleView}
                    />
                </div>
            </div>
        </div>
    );
};

export default AttendanceList;
