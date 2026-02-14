import React from 'react';
import {
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';

export const STATUS_ICONS: Record<string, React.ReactNode> = {
  TODO:        <ClockCircleOutlined />,
  IN_PROGRESS: <SyncOutlined spin />,
  DONE:        <CheckCircleOutlined />,
  HOLD:        <PauseCircleOutlined />,
  CANCELLED:   <StopOutlined />,
};
