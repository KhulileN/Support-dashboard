import * as React from 'react';
import { ISupportDashboardProps } from './ISupportDashboardProps';
export interface ISupportRequest {
    ID: number;
    Title: string;
    Description: string;
    Category: string;
    Progress: string;
    Priority: string;
    AssignedTo: string;
    DueDate: string;
}
declare const SupportDashboard: React.FC<ISupportDashboardProps>;
export default SupportDashboard;
//# sourceMappingURL=SupportDashboard.d.ts.map