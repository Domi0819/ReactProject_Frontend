import { Button } from "primereact/button";
import type { Route } from "./+types/todos/todos_create";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import { Calendar } from 'primereact/calendar';
import React, { useState } from "react";
import { addLocale } from 'primereact/api';
import { InputText } from "primereact/inputtext";
export function meta({}: Route.MetaArgs) {
    return [
        {title : "Create Todo"},
        {name: "Create Todo", content: "Create Todo page"}
    ];
}
 
export default function Todos_Create() {
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = (month === 0) ? 11 : month - 1;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    let nextMonth = (month === 11) ? 0 : month + 1;
    let nextYear = (nextMonth === 0) ? year + 1 : year;

    const [date1, setDate1] = useState<Date | null | undefined>(undefined);
    const [todoname, setTodoName] = useState<string>("");
    let minDate = new Date();
    minDate.setMonth(prevMonth);
    minDate.setFullYear(prevYear);

    let maxDate = new Date();
    maxDate.setMonth(nextMonth);
    maxDate.setFullYear(nextYear);

    let invalidDates = [today];

    const dateTemplate = (date: any) => {
        if (date.day > 10 && date.day < 15) {
            return (
                <strong style={{ textDecoration: 'line-through' }}>{date.day}</strong>
            );
        }

        return date.day;
    }

    return(
        <main className="container mx-auto p-4">
            <h1>Create Page</h1>
            <div className="flex justify-start fixed ">
                <Card className="text-center m-[16px] w-[30vw] h-[70vh]">
                    <label htmlFor="sidebar">
                        Choose a date:<br />
                        <Calendar id="date" value={date1} onChange={(e: any) => setDate1(e.value)} showIcon />
                        <br />TODO name: <br />
                        <InputText value={todoname} onChange={(e) => setTodoName(e.target.value)} />
                    </label>
                </Card>
            </div>
            <div className="flex justify-end ">
                <Card className="text-center m-[16px] w-[65vw] ">
                    <label htmlFor="todoTextarea">
                        <InputTextarea id="tododescription" className="field-sizing-content w-[50vw] h-40 md:h-56" rows={6} defaultValue={"Type your TODO description here..."} style={{ height: '200px' }} />
                    </label>
                    <div className="mt-2">
                        <Button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onclick={addTodo}>Add</Button>
                    </div>
                </Card>
            </div>
        </main>
    )
}