import React, { useMemo } from 'react';
import { Typography, Tooltip, Tag, Empty } from 'antd';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import type { Task } from '../services/taskService';

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

const { Text } = Typography;

interface GanttChartProps {
    tasks: Task[];
    projectStartDate?: string;
    projectEndDate?: string;
}

// Generate weeks between two dates
const generateWeeks = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
    const weeks: { start: dayjs.Dayjs; end: dayjs.Dayjs; label: string; month: string }[] = [];
    let current = startDate.startOf('week');

    while (current.isBefore(endDate) || current.isSame(endDate, 'week')) {
        weeks.push({
            start: current,
            end: current.endOf('week'),
            label: `W${current.week() % 4 === 0 ? 4 : current.week() % 4}`,
            month: current.format('MMMM YYYY'),
        });
        current = current.add(1, 'week');
    }
    return weeks;
};

import { GANTT_STATUS_COLORS as STATUS_COLORS, GANTT_PRIORITY_COLORS as PRIORITY_COLORS } from '../constants';

export const GanttChart: React.FC<GanttChartProps> = ({ tasks, projectStartDate, projectEndDate }) => {
    // Filter tasks with dates and sort by start date
    const tasksWithDates = useMemo(() => {
        return tasks
            .filter(t => t.startDate || t.dueDate)
            .sort((a, b) => {
                const aStart = a.startDate ? new Date(a.startDate).getTime() : (a.dueDate ? new Date(a.dueDate).getTime() : 0);
                const bStart = b.startDate ? new Date(b.startDate).getTime() : (b.dueDate ? new Date(b.dueDate).getTime() : 0);
                return aStart - bStart;
            });
    }, [tasks]);

    // Calculate date range
    const { weeks, totalDays, rangeStart } = useMemo(() => {
        if (tasksWithDates.length === 0) {
            return { weeks: [], totalDays: 0, rangeStart: dayjs() };
        }

        const allDates = tasksWithDates.flatMap(t => [
            t.startDate ? new Date(t.startDate) : null,
            t.dueDate ? new Date(t.dueDate) : null,
        ]).filter(Boolean) as Date[];

        if (projectStartDate) allDates.push(new Date(projectStartDate));
        if (projectEndDate) allDates.push(new Date(projectEndDate));

        const minDate = dayjs(Math.min(...allDates.map(d => d.getTime()))).subtract(3, 'day');
        const maxDate = dayjs(Math.max(...allDates.map(d => d.getTime()))).add(7, 'day');

        const generatedWeeks = generateWeeks(minDate, maxDate);
        const totalDays = maxDate.diff(minDate, 'day') + 1;

        return { weeks: generatedWeeks, totalDays, rangeStart: minDate };
    }, [tasksWithDates, projectStartDate, projectEndDate]);

    // Group weeks by month
    const monthGroups = useMemo(() => {
        const groups: { month: string; weeks: number }[] = [];
        let currentMonth = '';

        weeks.forEach(week => {
            if (week.month !== currentMonth) {
                groups.push({ month: week.month, weeks: 1 });
                currentMonth = week.month;
            } else {
                groups[groups.length - 1].weeks++;
            }
        });

        return groups;
    }, [weeks]);

    // Calculate bar position for a task
    const getBarStyle = (task: Task) => {
        const start = task.startDate ? dayjs(task.startDate) : dayjs(task.dueDate);
        const end = task.dueDate ? dayjs(task.dueDate) : start;

        const startOffset = start.diff(rangeStart, 'day');
        const duration = end.diff(start, 'day') + 1;

        const leftPercent = (startOffset / totalDays) * 100;
        const widthPercent = (duration / totalDays) * 100;

        const statusStyle = STATUS_COLORS[task.status] || STATUS_COLORS.TODO;

        return {
            left: `${Math.max(0, leftPercent)}%`,
            width: `${Math.max(4, widthPercent)}%`,
            minWidth: '60px',
            backgroundColor: statusStyle.bg,
            borderLeft: `4px solid ${PRIORITY_COLORS[task.priority] || '#1890ff'}`,
            color: statusStyle.text,
        };
    };

    // Format date range text
    const getDateRangeText = (task: Task) => {
        const start = task.startDate ? dayjs(task.startDate) : null;
        const end = task.dueDate ? dayjs(task.dueDate) : null;

        if (start && end) {
            if (start.isSame(end, 'month')) {
                return `${start.format('MMM D')} - ${end.format('D')}`;
            }
            return `${start.format('MMM D')} - ${end.format('MMM D')}`;
        }
        if (start) return start.format('MMM D');
        if (end) return end.format('MMM D');
        return '';
    };

    if (tasksWithDates.length === 0) {
        return (
            <div style={{ padding: 40, textAlign: 'center' }}>
                <Empty
                    description="No tasks with dates to display. Add start/due dates to tasks to see them in the Gantt Chart."
                />
            </div>
        );
    }

    const WEEK_WIDTH = 100; // pixels per week
    const TASK_NAME_WIDTH = 220;
    const DATE_COL_WIDTH = 120;

    return (
        <div className="gantt-container" style={{
            overflowX: 'auto',
            background: '#fff',
            borderRadius: 8,
            border: '1px solid #e8e8e8'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', minWidth: weeks.length * WEEK_WIDTH + TASK_NAME_WIDTH + DATE_COL_WIDTH }}>
                {/* Task name column header */}
                <div style={{
                    width: TASK_NAME_WIDTH,
                    minWidth: TASK_NAME_WIDTH,
                    padding: '12px 16px',
                    borderRight: '1px solid #e8e8e8',
                    borderBottom: '2px solid #e8e8e8',
                    background: '#fafafa',
                    fontWeight: 600,
                    fontSize: '13px'
                }}>
                    Task Name
                </div>

                {/* Date column header */}
                <div style={{
                    width: DATE_COL_WIDTH,
                    minWidth: DATE_COL_WIDTH,
                    padding: '12px 8px',
                    borderRight: '1px solid #e8e8e8',
                    borderBottom: '2px solid #e8e8e8',
                    background: '#fafafa',
                    fontWeight: 600,
                    fontSize: '13px',
                    textAlign: 'center'
                }}>
                    Duration
                </div>

                {/* Timeline header */}
                <div style={{ flex: 1, minWidth: weeks.length * WEEK_WIDTH }}>
                    {/* Month row */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #e8e8e8', background: '#fafafa' }}>
                        {monthGroups.map((group, idx) => (
                            <div
                                key={idx}
                                style={{
                                    width: `${(group.weeks / weeks.length) * 100}%`,
                                    textAlign: 'center',
                                    padding: '8px 0',
                                    fontWeight: 600,
                                    borderRight: '1px solid #e8e8e8',
                                    fontSize: '12px',
                                    color: '#262626',
                                    textTransform: 'uppercase'
                                }}
                            >
                                {group.month}
                            </div>
                        ))}
                    </div>

                    {/* Week row */}
                    <div style={{ display: 'flex', borderBottom: '2px solid #e8e8e8', background: '#fafafa' }}>
                        {weeks.map((week, idx) => (
                            <div
                                key={idx}
                                style={{
                                    width: `${100 / weeks.length}%`,
                                    textAlign: 'center',
                                    padding: '6px 0',
                                    fontSize: '11px',
                                    color: '#8c8c8c',
                                    borderRight: '1px solid #f0f0f0'
                                }}
                            >
                                {week.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Task rows */}
            {tasksWithDates.map((task, idx) => (
                <div
                    key={task.id}
                    style={{
                        display: 'flex',
                        minWidth: weeks.length * WEEK_WIDTH + TASK_NAME_WIDTH + DATE_COL_WIDTH,
                        background: idx % 2 === 0 ? '#fff' : '#fafafa',
                        transition: 'background 0.2s'
                    }}
                >
                    {/* Task name cell */}
                    <div style={{
                        width: TASK_NAME_WIDTH,
                        minWidth: TASK_NAME_WIDTH,
                        padding: '12px 16px',
                        borderRight: '1px solid #e8e8e8',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10
                    }}>
                        <div style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: PRIORITY_COLORS[task.priority] || '#d9d9d9',
                            flexShrink: 0
                        }} />
                        <Text
                            ellipsis={{ tooltip: task.title }}
                            style={{ fontSize: '13px', fontWeight: 500, maxWidth: 180 }}
                        >
                            {task.title}
                        </Text>
                    </div>

                    {/* Date column */}
                    <div style={{
                        width: DATE_COL_WIDTH,
                        minWidth: DATE_COL_WIDTH,
                        padding: '12px 8px',
                        borderRight: '1px solid #e8e8e8',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Tag
                            color={STATUS_COLORS[task.status]?.bg}
                            style={{
                                color: STATUS_COLORS[task.status]?.text,
                                border: 'none',
                                fontSize: '11px',
                                fontWeight: 500
                            }}
                        >
                            {getDateRangeText(task)}
                        </Tag>
                    </div>

                    {/* Gantt bar area */}
                    <div style={{
                        flex: 1,
                        minWidth: weeks.length * WEEK_WIDTH,
                        position: 'relative',
                        borderBottom: '1px solid #f0f0f0',
                        height: 48
                    }}>
                        {/* Grid lines */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            pointerEvents: 'none'
                        }}>
                            {weeks.map((_, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        width: `${100 / weeks.length}%`,
                                        borderRight: '1px solid #f5f5f5'
                                    }}
                                />
                            ))}
                        </div>

                        {/* Task bar */}
                        <Tooltip
                            title={
                                <div style={{ padding: '4px 0' }}>
                                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{task.title}</div>
                                    <div style={{ marginBottom: 4 }}>
                                        📅 {getDateRangeText(task)}
                                    </div>
                                    <Tag>{task.status.replace('_', ' ')}</Tag>
                                    <Tag color={PRIORITY_COLORS[task.priority]}>{task.priority}</Tag>
                                </div>
                            }
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 10,
                                    height: 28,
                                    borderRadius: 4,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    ...getBarStyle(task)
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.02)';
                                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                                }}
                            >
                                {getDateRangeText(task)}
                            </div>
                        </Tooltip>
                    </div>
                </div>
            ))}

            {/* Legend */}
            <div style={{
                padding: '14px 16px',
                borderTop: '1px solid #e8e8e8',
                display: 'flex',
                gap: 20,
                flexWrap: 'wrap',
                background: '#fafafa'
            }}>
                <Text strong style={{ marginRight: 8, fontSize: '12px' }}>Status:</Text>
                {Object.entries(STATUS_COLORS).map(([status, colors]) => (
                    <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{
                            width: 18,
                            height: 18,
                            backgroundColor: colors.bg,
                            borderRadius: 4,
                            border: `1px solid ${colors.text}40`
                        }} />
                        <Text style={{ fontSize: '12px', color: '#595959' }}>{status.replace('_', ' ')}</Text>
                    </div>
                ))}

                <div style={{ marginLeft: 24, display: 'flex', gap: 20 }}>
                    <Text strong style={{ marginRight: 8, fontSize: '12px' }}>Priority:</Text>
                    {Object.entries(PRIORITY_COLORS).map(([priority, color]) => (
                        <div key={priority} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{
                                width: 10,
                                height: 10,
                                backgroundColor: color,
                                borderRadius: '50%'
                            }} />
                            <Text style={{ fontSize: '12px', color: '#595959' }}>{priority}</Text>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
