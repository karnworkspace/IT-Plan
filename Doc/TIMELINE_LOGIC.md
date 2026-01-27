# Project Timeline & Deadline Calculation

The system automatically calculates the project's deadline and timeline based on the individual tasks within it.

## 1. Project Deadline (วันกำหนดส่งโปรเจกต์)
- **Calculation**: The system looks at all tasks in the project that have a `Due Date` set. The **latest** (maximum) due date among all tasks is considered the *Project Deadline*.
- **Display**: This date is displayed prominently in the Project Header with a calendar icon.
- **Example**: 
    - Task A: Due Jan 10
    - Task B: Due Jan 20
    - **Project Deadline**: Jan 20

## 2. Days Remaining (จำนวนวันที่เหลือ)
- **Calculation**: Current Date vs. Project Deadline.
- **Display**: Shows the number of days left until the final task is due. This helps with sprint planning and urgency assessment.

## 3. Task Due Dates (วันกำหนดส่งงานย่อย)
- Each task card on the board displays its own individual due date.
- Tasks without due dates do not contribute to the deadline calculation.

## How to Set Deadlines
To set the project timeline:
1. Create or Edit a Task.
2. Select a "Due Date" in the form.
3. The Project Deadline will update automatically to reflect the furthest date.
