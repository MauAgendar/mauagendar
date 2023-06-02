import React from "react";
import { Weekday ,Date} from "../types";
import { monthDates } from "./configs/MonthDays";
import{Weekdays} from "./configs/weekdays";
import "../botoes/arrow.css";
import "../botoes/teste.css";

export const Calendar: React.FC <{}> = ({}) =>  {

    const generateDates= (date: number) => {
        for (let i=0; i<7; i++){
            return <button className="date" value={date}><p>{date}</p></button>
            }
        }

    const generateWeeks = (dates: Array<Date>) => {
        const daysInWeek = 7;
        let tempArray = [];
        
        for (let i = 0; i < dates.length; i += daysInWeek) {
            tempArray.push(dates.slice(i, i + daysInWeek));
        }
        return tempArray;
        };
    return (
        <div className="calendar-container">
            <div className="date-picker-container">
            
            <span> Feb 2023</span> 

             
            </div>
            <div className = "weekdays-container">
                {Weekdays.map(day => (
                    <div className="week-day">{day}</div>
                ))}
            </div>
            <div className="calendar"> 
                    {generateWeeks(monthDates)?.map(week => (
                        <div className="week">
                           {week.map(day => (generateDates(day.day)))}
                           </div> 
                        ))
                    }
            </div>
        </div>
        )
}
