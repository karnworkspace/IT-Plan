import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { Typography, Tooltip, Tag, Empty, Popover, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import type { Task } from '../../services/taskService';
import { activityLogService } from '../../services/activityLogService';
import type { ActivityLog } from '../../types';

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

const { Text } = Typography;

interface GanttChartProps {
    tasks: Task[];
    projectStartDate?: string;
    projectEndDate?: string;
    onTaskDateChange?: (taskId: string, startDate?: string, dueDate?: string) => Promise<void>;
    onTaskClick?: (taskId: string) => void;
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

import { GANTT_STATUS_COLORS as STATUS_COLORS, GANTT_PRIORITY_COLORS as PRIORITY_COLORS } from '../../constants';

// --- TaskActivityPreview component ---
const TaskActivityPreview: React.FC<{ taskId: string }> = ({ taskId }) => {
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const fetchActivities = async () => {
            try {
                const res = await activityLogService.getTaskActivities(taskId, 3);
                if (!cancelled) {
                    setActivities(res.data?.activities || res.data || []);
                }
            } catch {
                // silently fail
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchActivities();
        return () => { cancelled = true; };
    }, [taskId]);

    if (loading) {
        return (
            <div style={{ padding: '8px 0', textAlign: 'center', minWidth: 200 }}>
                <LoadingOutlined style={{ marginRight: 8 }} />
                Loading...
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div style={{ padding: '4px 0', color: '#8c8c8c', fontSize: 12, minWidth: 200 }}>
                No recent activity
            </div>
        );
    }

    return (
        <div style={{ minWidth: 220, maxWidth: 320 }}>
            {activities.slice(0, 3).map((act) => (
                <div key={act.id} style={{
                    padding: '6px 0',
                    borderBottom: '1px solid #f0f0f0',
                    fontSize: 12,
                }}>
                    <div style={{ fontWeight: 500, color: '#262626' }}>
                        {act.user?.name || 'Unknown'}
                    </div>
                    <div style={{ color: '#595959' }}>
                        {act.action}
                    </div>
                    <div style={{ color: '#8c8c8c', fontSize: 11 }}>
                        {dayjs(act.createdAt).format('DD MMM YYYY HH:mm')}
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- Drag state type ---
interface DragState {
    taskId: string;
    side: 'left' | 'right' | 'move';
    startX: number;
    originalStartDate: dayjs.Dayjs;
    originalDueDate: dayjs.Dayjs;
    currentStartDate: dayjs.Dayjs;
    currentDueDate: dayjs.Dayjs;
}

export const GanttChart: React.FC<GanttChartProps> = ({
    tasks,
    projectStartDate,
    projectEndDate,
    onTaskDateChange,
    onTaskClick,
}) => {
    const [dragState, setDragState] = useState<DragState | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const dragRef = useRef<DragState | null>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

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

    // Pixels per day calculation
    const WEEK_WIDTH = 100;
    const TASK_NAME_WIDTH = 220;
    const DATE_COL_WIDTH = 120;
    const timelineWidth = weeks.length * WEEK_WIDTH;
    const pixelsPerDay = totalDays > 0 ? timelineWidth / totalDays : 1;

    // Calculate bar position for a task (with drag override)
    const getBarStyle = useCallback((task: Task) => {
        let start: dayjs.Dayjs;
        let end: dayjs.Dayjs;

        if (dragState && dragState.taskId === task.id) {
            start = dragState.currentStartDate;
            end = dragState.currentDueDate;
        } else {
            start = task.startDate ? dayjs(task.startDate) : dayjs(task.dueDate);
            end = task.dueDate ? dayjs(task.dueDate) : start;
        }

        const startOffset = start.diff(rangeStart, 'day');
        const duration = end.diff(start, 'day') + 1;

        const leftPercent = (startOffset / totalDays) * 100;
        const widthPercent = (duration / totalDays) * 100;

        const statusStyle = STATUS_COLORS[task.status] || STATUS_COLORS.TODO;

        return {
            left: `${Math.max(0, leftPercent)}%`,
            width: `${Math.max(2, widthPercent)}%`,
            minWidth: '40px',
            backgroundColor: statusStyle.bg,
            borderLeft: `4px solid ${PRIORITY_COLORS[task.priority] || '#1890ff'}`,
            color: statusStyle.text,
        };
    }, [dragState, rangeStart, totalDays]);

    // Format date range text
    const getDateRangeText = useCallback((task: Task) => {
        let start: dayjs.Dayjs | null;
        let end: dayjs.Dayjs | null;

        if (dragState && dragState.taskId === task.id) {
            start = dragState.currentStartDate;
            end = dragState.currentDueDate;
        } else {
            start = task.startDate ? dayjs(task.startDate) : null;
            end = task.dueDate ? dayjs(task.dueDate) : null;
        }

        if (start && end) {
            if (start.isSame(end, 'month')) {
                return `${start.format('MMM D')} - ${end.format('D')}`;
            }
            return `${start.format('MMM D')} - ${end.format('MMM D')}`;
        }
        if (start) return start.format('MMM D');
        if (end) return end.format('MMM D');
        return '';
    }, [dragState]);

    // --- Drag handlers ---
    const handleDragStart = useCallback((e: React.MouseEvent, side: 'left' | 'right' | 'move', task: Task) => {
        if (!onTaskDateChange) return;
        e.preventDefault();
        e.stopPropagation();

        const startDate = task.startDate ? dayjs(task.startDate) : dayjs(task.dueDate);
        const dueDate = task.dueDate ? dayjs(task.dueDate) : startDate;

        const state: DragState = {
            taskId: task.id,
            side,
            startX: e.clientX,
            originalStartDate: startDate,
            originalDueDate: dueDate,
            currentStartDate: startDate,
            currentDueDate: dueDate,
        };

        dragRef.current = state;
        setDragState(state);

        const handleMouseMove = (moveE: MouseEvent) => {
            if (!dragRef.current) return;
            const diff = moveE.clientX - dragRef.current.startX;
            const daysDiff = Math.round(diff / pixelsPerDay);

            let newStart = dragRef.current.originalStartDate;
            let newEnd = dragRef.current.originalDueDate;

            if (dragRef.current.side === 'left') {
                newStart = dragRef.current.originalStartDate.add(daysDiff, 'day');
                // Don't let start go past end
                if (newStart.isAfter(newEnd)) {
                    newStart = newEnd;
                }
            } else if (dragRef.current.side === 'right') {
                newEnd = dragRef.current.originalDueDate.add(daysDiff, 'day');
                // Don't let end go before start
                if (newEnd.isBefore(newStart)) {
                    newEnd = newStart;
                }
            } else {
                // move entire bar
                newStart = dragRef.current.originalStartDate.add(daysDiff, 'day');
                newEnd = dragRef.current.originalDueDate.add(daysDiff, 'day');
            }

            const updated = {
                ...dragRef.current,
                currentStartDate: newStart,
                currentDueDate: newEnd,
            };
            dragRef.current = updated;
            setDragState(updated);
        };

        const handleMouseUp = async () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);

            const finalState = dragRef.current;
            if (!finalState) return;

            const startChanged = !finalState.currentStartDate.isSame(finalState.originalStartDate, 'day');
            const endChanged = !finalState.currentDueDate.isSame(finalState.originalDueDate, 'day');

            if (startChanged || endChanged) {
                setIsSaving(true);
                try {
                    await onTaskDateChange(
                        finalState.taskId,
                        finalState.currentStartDate.format('YYYY-MM-DD'),
                        finalState.currentDueDate.format('YYYY-MM-DD'),
                    );
                } catch {
                    message.error('Failed to update task dates');
                } finally {
                    setIsSaving(false);
                }
            }

            dragRef.current = null;
            setDragState(null);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [onTaskDateChange, pixelsPerDay]);

    if (tasksWithDates.length === 0) {
        return (
            <div style={{ padding: 40, textAlign: 'center' }}>
                <Empty
                    description="No tasks with dates to display. Add start/due dates to tasks to see them in the Gantt Chart."
                />
            </div>
        );
    }

    return (
        <div
            className="gantt-container"
            style={{
                overflowX: 'auto',
                background: '#fff',
                borderRadius: 8,
                border: '1px solid #e8e8e8',
                userSelect: dragState ? 'none' : undefined,
            }}
        >
            {/* Saving overlay */}
            {isSaving && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255,255,255,0.5)',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'all',
                }}>
                    <LoadingOutlined style={{ fontSize: 24 }} />
                </div>
            )}

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
                        <Popover
                            title={<span style={{ fontSize: 13, fontWeight: 600 }}>Recent Activity</span>}
                            trigger="hover"
                            mouseEnterDelay={0.4}
                            content={<TaskActivityPreview taskId={task.id} />}
                            placement="rightTop"
                        >
                            <Text
                                ellipsis={{ tooltip: false }}
                                style={{
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    maxWidth: 180,
                                    cursor: onTaskClick ? 'pointer' : 'default',
                                    color: onTaskClick ? '#1890ff' : undefined,
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onTaskClick?.(task.id);
                                }}
                            >
                                {task.title}
                            </Text>
                        </Popover>
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
                    <div
                        ref={idx === 0 ? timelineRef : undefined}
                        style={{
                            flex: 1,
                            minWidth: weeks.length * WEEK_WIDTH,
                            position: 'relative',
                            borderBottom: '1px solid #f0f0f0',
                            height: 48
                        }}
                    >
                        {/* Grid lines */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            pointerEvents: 'none'
                        }}>
                            {weeks.map((_, wIdx) => (
                                <div
                                    key={wIdx}
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
                                dragState?.taskId === task.id ? null : (
                                    <div style={{ padding: '4px 0' }}>
                                        <div style={{ fontWeight: 600, marginBottom: 4 }}>{task.title}</div>
                                        <div style={{ marginBottom: 4 }}>
                                            {getDateRangeText(task)}
                                        </div>
                                        <Tag>{task.status.replace('_', ' ')}</Tag>
                                        <Tag color={PRIORITY_COLORS[task.priority]}>{task.priority}</Tag>
                                    </div>
                                )
                            }
                            open={dragState?.taskId === task.id ? false : undefined}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 10,
                                    height: 28,
                                    borderRadius: 4,
                                    cursor: onTaskDateChange ? 'grab' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    boxShadow: dragState?.taskId === task.id
                                        ? '0 3px 10px rgba(0,0,0,0.2)'
                                        : '0 1px 3px rgba(0,0,0,0.08)',
                                    transition: dragState?.taskId === task.id ? 'none' : 'transform 0.2s, box-shadow 0.2s',
                                    ...getBarStyle(task),
                                }}
                                onMouseDown={onTaskDateChange ? (e) => handleDragStart(e, 'move', task) : undefined}
                                onMouseEnter={(e) => {
                                    if (!dragState) {
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!dragState) {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                                    }
                                }}
                            >
                                {/* Left drag handle */}
                                {onTaskDateChange && (
                                    <div
                                        onMouseDown={(e) => {
                                            e.stopPropagation();
                                            handleDragStart(e, 'left', task);
                                        }}
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: 8,
                                            cursor: 'col-resize',
                                            borderRadius: '4px 0 0 4px',
                                            background: 'transparent',
                                            transition: 'background 0.15s',
                                            zIndex: 2,
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(0,0,0,0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    />
                                )}

                                {/* Bar label */}
                                <span style={{ pointerEvents: 'none', padding: '0 12px' }}>
                                    {getDateRangeText(task)}
                                </span>

                                {/* Right drag handle */}
                                {onTaskDateChange && (
                                    <div
                                        onMouseDown={(e) => {
                                            e.stopPropagation();
                                            handleDragStart(e, 'right', task);
                                        }}
                                        style={{
                                            position: 'absolute',
                                            right: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: 8,
                                            cursor: 'col-resize',
                                            borderRadius: '0 4px 4px 0',
                                            background: 'transparent',
                                            transition: 'background 0.15s',
                                            zIndex: 2,
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(0,0,0,0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    />
                                )}
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
