import { WebPartContext } from '@microsoft/sp-webpart-base'; // Add this to your imports at the top

export interface ISupportDashboardProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext; // <--- ADD THIS LINE
}