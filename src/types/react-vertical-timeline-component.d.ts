declare module 'react-vertical-timeline-component' {
  import { ReactNode } from 'react';

  interface VerticalTimelineProps {
    children: ReactNode;
    animate?: boolean;
    lineColor?: string;
  }

  interface VerticalTimelineElementProps {
    children: ReactNode;
    className?: string;
    contentStyle?: React.CSSProperties;
    contentArrowStyle?: React.CSSProperties;
    date?: string;
    dateClassName?: string;
    iconStyle?: React.CSSProperties;
    icon?: ReactNode;
  }

  export const VerticalTimeline: React.FC<VerticalTimelineProps>;
  export const VerticalTimelineElement: React.FC<VerticalTimelineElementProps>;
} 