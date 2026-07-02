/* eslint-disable */
import * as React from 'react';
import { useState, useEffect } from 'react';
import { ISupportDashboardProps } from './ISupportDashboardProps'; 
import {
  TextField, PrimaryButton, DefaultButton, Dropdown, IDropdownOption, Stack,
  MessageBar, MessageBarType, Icon, Text, DatePicker, IconButton, 
  Panel, PanelType, Separator
} from '@fluentui/react';

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

const SupportDashboard: React.FC<ISupportDashboardProps> = (props) => {
  
  // --- SUBMISSION FORM STATE ---
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  // --- UI STATE ---
  const [statusMessage, setStatusMessage] = useState<{ type: MessageBarType, text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState<boolean>(false);
  const [tickets, setTickets] = useState<ISupportRequest[]>([]);
  
  // --- POP-UP PANEL STATES ---
  const [isNewPanelOpen, setIsNewPanelOpen] = useState<boolean>(false);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState<boolean>(false);
  const [editedTicket, setEditedTicket] = useState<ISupportRequest | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // --- DROPDOWN OPTIONS ---
  const priorityOptions: IDropdownOption[] = [
    { key: 'Low', text: 'Low' },
    { key: 'Medium', text: 'Medium' },
    { key: 'High', text: 'High' },
    { key: 'Critical', text: 'Critical' }
  ];

  const categoryOptions: IDropdownOption[] = [
    { key: 'Support', text: 'Support' },
    { key: 'Development', text: 'Development' },
    { key: 'Access', text: 'Access/Permissions' },
    { key: 'Training', text: 'Training' },
    { key: 'Consultation', text: 'Consultation' },
    { key: 'Idea', text: 'Just an idea' },
    { key: 'Other', text: 'Other' }
  ];

  const progressOptions: IDropdownOption[] = [
    { key: 'Logged', text: 'Logged' },
    { key: 'In-progress', text: 'In-progress' },
    { key: 'Complete', text: 'Complete' },
    { key: 'Cancelled', text: 'Cancelled' },
    { key: 'On Hold', text: 'On Hold' },
    { key: 'Future Idea', text: 'Future Idea' }
  ];

  // --- DATA LOADING (DYNAMIC) ---
  const loadTickets = async () => {
    try {
      const readFlowUrl = "https://3a4e6253975aee7ca3c118bf7aea22.56.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/0a69a50e413d47e28f9d63e52a4b7d6b/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=yuLbZCj8cIa9Ct-rz1IZv8lQaMueEUbd-aUxWQond_o";

      // Grab just the hostname (e.g., "wahlindustries.sharepoint.com") to match your SourceTenant column
      const currentTenant = window.location.hostname;
      console.log("Sending this tenant to Flow:", currentTenant);

      const response = await fetch(readFlowUrl, {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
    siteUrl: currentTenant
        })
      });
      // ... rest of the code stays the same

      if (response.ok) {
        const rawData = await response.json();
        const dataArray = Array.isArray(rawData) ? rawData : rawData.value || [];
        
        // ... (Keep the rest of your normalizeProgress and mapping code exactly the same!) ...
        
        const normalizeProgress = (rawVal: any): string => {
          if (!rawVal) return 'Logged';
          const text = String(rawVal).toLowerCase().trim();
          if (text.includes('progress')) return 'In-progress';
          if (text.includes('complet') || text === 'done') return 'Complete';
          if (text.includes('cancel')) return 'Cancelled';
          if (text.includes('hold')) return 'On Hold';
          if (text.includes('idea') || text.includes('future')) return 'Future Idea';
          return 'Logged'; 
        };

        const formattedTickets: ISupportRequest[] = dataArray.map((item: any) => {
          const rawProgressVal = item.field_4?.Value || item.field_4 || item.Progress?.Value || item.Progress;
          return {
            ID: item.ID,
            Title: String(item.Title || item.WorkItem || "Untitled"), 
            Description: String(item.field_2 || item.Description || "No description"),
            Category: String(item.field_3?.[0]?.Value || item.Category?.Value || "General"),
            Progress: normalizeProgress(rawProgressVal), 
            Priority: String(item.field_8?.Value || item.Priority?.Value || "Low"),
            AssignedTo: String(item.AssignedTo?.[0]?.DisplayName || item.AssignedTo?.DisplayName || "Unassigned"),
            // FIX: Keep the raw date string in memory instead of forcing it to a local string immediately
            DueDate: item.field_10 ? item.field_10 : (item.DueDate ? item.DueDate : "TBD")
          };
        });

        setTickets(formattedTickets.reverse());
      }
    } catch (error) {
      console.error("Error loading tickets via Flow: ", error);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCancelNew = () => {
    setIsNewPanelOpen(false);
    setTitle(''); setDescription(''); setPriority(''); setCategory(''); setDueDate(undefined);
  };

  // --- SUBMIT NEW TICKET ---
  const submitRequest = async () => {
    if (!title) {
      setStatusMessage({ type: MessageBarType.error, text: "A Work Item title is required." });
      return;
    }
    setIsSubmitting(true);

    const payload = {
      Title: title,
      Description: description || "No description",
      Priority: priority || "Low",
      Category: category || "General",
      DueDate: dueDate ? dueDate.toISOString() : "", 
      SourceTenant: window.location.hostname,
      UserEmail: props.context.pageContext.user.email
    };

    try {
      const response = await fetch("https://3a4e6253975aee7ca3c118bf7aea22.56.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/14f48737218f48f6a3bc4662b21487ad/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=iNN2UG_FWvFy4RORx2hQpKR01LZszgmaMBtYIe_Pf_I", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsNewPanelOpen(false);
        setTitle(''); setDescription(''); setPriority(''); setCategory(''); setDueDate(undefined);
        setSubmittedSuccessfully(true);
        setStatusMessage({ type: MessageBarType.success, text: "Sent! We've received your request." });
        
        loadTickets();
      } else {
        setStatusMessage({ type: MessageBarType.error, text: "Server rejected the request. Please check your inputs." });
      }
    } catch (error) {
      setStatusMessage({ type: MessageBarType.error, text: "Connection error." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // EDITING FUNCTIONS
  // ==========================================

  const handleEditClick = (item: ISupportRequest) => {
    setEditedTicket({ ...item }); 
    setIsEditPanelOpen(true); 
  };

  const handleCancelEdit = () => {
    setIsEditPanelOpen(false);
    setEditedTicket(null);
  };

  const handleEditedFieldChange = (field: keyof ISupportRequest, value: string) => {
    if (editedTicket) {
      setEditedTicket({ ...editedTicket, [field]: value });
    }
  };

  const handleSaveEdit = async () => {
    if (!editedTicket) return;
    setIsUpdating(true);

    // Prepare payload for Power Automate Update Flow
    const updatePayload = {
      ID: editedTicket.ID,
      Title: editedTicket.Title,
      Description: editedTicket.Description,
      Category: editedTicket.Category,
      Priority: editedTicket.Priority,
      Progress: editedTicket.Progress,
      DueDate: editedTicket.DueDate !== 'TBD' ? editedTicket.DueDate : ""
    };

    try {
      // TODO: Paste your new Update Flow URL right here when it's ready!
      const updateFlowUrl = "YOUR_UPDATE_FLOW_HTTP_URL_HERE"; 
      
      // If the URL is just the placeholder, we'll bypass the fetch so it doesn't crash during testing
      if (updateFlowUrl === "YOUR_UPDATE_FLOW_HTTP_URL_HERE") {
        console.warn("Update Flow URL not set yet. Updating local UI only.");
        const updatedTickets = tickets.map(t => t.ID === editedTicket.ID ? editedTicket : t);
        setTickets(updatedTickets);
      } else {
        const response = await fetch(updateFlowUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload)
        });

        if (response.ok) {
          // Success! Update UI
          const updatedTickets = tickets.map(t => t.ID === editedTicket.ID ? editedTicket : t);
          setTickets(updatedTickets);
          setStatusMessage({ type: MessageBarType.success, text: `Ticket #${editedTicket.ID} updated successfully.` });
        } else {
          setStatusMessage({ type: MessageBarType.error, text: "Failed to update ticket in SharePoint." });
        }
      }
    } catch (error) {
      setStatusMessage({ type: MessageBarType.error, text: "Connection error while updating." });
    } finally {
      setIsUpdating(false);
      setIsEditPanelOpen(false);
      setEditedTicket(null);
    }
  };

  // ==========================================
  // BOARD RENDERING HELPERS
  // ==========================================
  
  const boardColumns = ['Logged', 'In-progress', 'Complete', 'Cancelled', 'On Hold', 'Future Idea'];

  const getPriorityColor = (p: string) => {
    if (p === 'Critical') return '#8B0000';
    if (p === 'High') return '#E81123';
    if (p === 'Medium') return '#E68A00';
    return '#107c10'; 
  };

  const renderTicketCard = (ticket: ISupportRequest) => (
    <div 
      key={ticket.ID}
      style={{
        backgroundColor: '#fff',
        borderRadius: '6px',
        padding: '10px',
        marginBottom: '10px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        borderLeft: `4px solid ${getPriorityColor(ticket.Priority)}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}
    >
      <Stack horizontal horizontalAlign="space-between" verticalAlign="start">
        <Text variant="smallPlus" style={{ fontWeight: 600, maxWidth: '80%', lineHeight: '1.2' }}>{ticket.Title}</Text>
        <IconButton 
          iconProps={{ iconName: 'Edit' }} 
          title="Edit Ticket" 
          onClick={() => handleEditClick(ticket)} 
          style={{ height: '20px', width: '20px' }}
        />
      </Stack>
      
      <Stack horizontal tokens={{ childrenGap: 4 }} verticalAlign="center" wrap>
        <span style={{ fontSize: '11px', padding: '2px 6px', backgroundColor: '#f3f2f1', borderRadius: '12px', color: '#605e5c', whiteSpace: 'nowrap' }}>
          {ticket.Category}
        </span>
        <span style={{ fontSize: '11px', color: getPriorityColor(ticket.Priority), fontWeight: 'bold' }}>
          {ticket.Priority}
        </span>
      </Stack>

      <Stack horizontal horizontalAlign="space-between" verticalAlign="center" style={{ marginTop: '4px' }}>
        <Text variant="small" style={{ color: '#605e5c', fontSize: '10px' }}>ID: {ticket.ID === 0 ? '...' : ticket.ID}</Text>
        <Stack horizontal tokens={{ childrenGap: 4 }} verticalAlign="center">
          <Icon iconName="Calendar" style={{ fontSize: '10px', color: '#605e5c' }} />
          {/* FIX: Formats the raw stored string safely for the user to read */}
          <Text variant="small" style={{ color: '#605e5c', fontSize: '10px' }}>
            {ticket.DueDate !== 'TBD' ? new Date(ticket.DueDate).toLocaleDateString() : 'TBD'}
          </Text>
        </Stack>
      </Stack>
    </div>
  );

  return (
    <div style={{ padding: '20px', width: '100%', backgroundColor: '#faf9f8', minHeight: '80vh', boxSizing: 'border-box' }}>
      
      {/* --- HEADER & NEW TICKET BUTTON --- */}
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center" style={{ marginBottom: '20px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: '5px' }}>Support Board</h2>
          <Text variant="medium">Welcome, {props.context.pageContext.user.displayName}!</Text>
        </div>
        {!submittedSuccessfully && (
          <PrimaryButton 
            text="New Support Ticket" 
            iconProps={{ iconName: 'Add' }} 
            onClick={() => setIsNewPanelOpen(true)} 
          />
        )}
      </Stack>

      {statusMessage && (
        <MessageBar messageBarType={statusMessage.type} isMultiline={true} onDismiss={() => setStatusMessage(null)} style={{ marginBottom: '20px' }}>
          {statusMessage.text}
        </MessageBar>
      )}

      {/* --- SUCCESS SCREEN OR KANBAN BOARD --- */}
      {submittedSuccessfully ? (
        <Stack horizontalAlign="center" tokens={{ childrenGap: 20 }} style={{ padding: '40px 0', backgroundColor: '#fff', borderRadius: '8px' }}>
          <Icon iconName="Completed" style={{ fontSize: '48px', color: '#107c10' }} />
          <Text variant="xxLarge">Ticket Submitted!</Text>
          <Text>Thank you for reaching out. The SharePoint Systems team has been notified and will contact you shortly.</Text>
          <PrimaryButton text="Back to Board" onClick={() => setSubmittedSuccessfully(false)} />
        </Stack>
      ) : (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', width: '100%' }}>
          {boardColumns.map(columnName => {
            const columnTickets = tickets.filter(t => 
              t.Progress === columnName || (columnName === 'Logged' && boardColumns.indexOf(t.Progress) === -1)
            );

            return (
              <div 
                key={columnName} 
                style={{ 
                  flex: 1, 
                  minWidth: 0, 
                  backgroundColor: '#f3f2f1', 
                  borderRadius: '8px', 
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Stack horizontal horizontalAlign="space-between" verticalAlign="center" style={{ marginBottom: '12px', padding: '0 2px' }}>
                  <Text variant="medium" style={{ fontWeight: 'bold', color: '#323130', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{columnName}</Text>
                  <span style={{ backgroundColor: '#e1dfdd', borderRadius: '50%', padding: '2px 6px', fontSize: '11px', fontWeight: 'bold' }}>
                    {columnTickets.length}
                  </span>
                </Stack>
                
                {columnTickets.length > 0 ? (
                  columnTickets.map(ticket => renderTicketCard(ticket))
                ) : (
                  <div style={{ padding: '15px 5px', textAlign: 'center', border: '2px dashed #c8c6c4', borderRadius: '6px' }}>
                    <Text variant="small" style={{ color: '#a19f9d' }}>Empty</Text>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* --- NEW TICKET POP-UP PANEL (STYLED) --- */}
      <Panel isOpen={isNewPanelOpen} onDismiss={handleCancelNew} type={PanelType.medium} isBlocking={false}>
        
        {/* Custom Header Area */}
        <div style={{ paddingTop: '20px', paddingBottom: '10px' }}>
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
            <Icon iconName="QuickNote" style={{ fontSize: '24px', color: '#0078d4' }} />
            <Text variant="xLarge" style={{ fontWeight: '600', color: '#323130' }}>New Support Request</Text>
          </Stack>
          <Text variant="medium" style={{ color: '#605e5c', display: 'block', marginTop: '8px' }}>
            Fill out the details below so our team can help you as quickly as possible.
          </Text>
        </div>
        <Separator />

        {/* Form Body */}
        <Stack tokens={{ childrenGap: 20 }} style={{ marginTop: '20px' }}>
          <TextField label="Work Item (Title)" placeholder="Briefly describe the issue..." value={title} onChange={(e, v) => setTitle(v || '')} disabled={isSubmitting} required />
          
          <Stack horizontal tokens={{ childrenGap: 20 }}>
            <Stack.Item grow={1}>
              <Dropdown label="Category" placeholder="Select..." options={categoryOptions} selectedKey={category} onChange={(e, o) => setCategory(o?.key as string)} disabled={isSubmitting} />
            </Stack.Item>
            <Stack.Item grow={1}>
              <Dropdown label="Priority" placeholder="Select..." options={priorityOptions} selectedKey={priority} onChange={(e, o) => setPriority(o?.key as string)} disabled={isSubmitting} />
            </Stack.Item>
          </Stack>

          <DatePicker label="Due Date" placeholder="Select a date..." value={dueDate} onSelectDate={(date) => setDueDate(date || undefined)} disabled={isSubmitting} />
          
          <TextField label="Detailed Description" placeholder="Steps to reproduce, error messages, links..." multiline rows={6} resizable={false} value={description} onChange={(e, v) => setDescription(v || '')} disabled={isSubmitting} />
          
          {/* Action Footer */}
          <div style={{ marginTop: '30px', backgroundColor: '#f3f2f1', padding: '16px', borderRadius: '6px' }}>
            <Stack horizontal tokens={{ childrenGap: 12 }}>
              <PrimaryButton text={isSubmitting ? "Sending..." : "Submit Ticket"} iconProps={{ iconName: 'Send' }} onClick={submitRequest} disabled={isSubmitting} />
              <DefaultButton text="Cancel" onClick={handleCancelNew} disabled={isSubmitting} />
            </Stack>
          </div>
        </Stack>
      </Panel>

      {/* --- EDIT TICKET POP-UP PANEL (STYLED) --- */}
      <Panel isOpen={isEditPanelOpen} onDismiss={handleCancelEdit} type={PanelType.medium} isBlocking={false}>
        {editedTicket && (
          <>
            {/* Custom Header Area */}
            <div style={{ paddingTop: '20px', paddingBottom: '10px' }}>
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
                <Icon iconName="EditNote" style={{ fontSize: '24px', color: '#0078d4' }} />
                <Text variant="xLarge" style={{ fontWeight: '600', color: '#323130' }}>Edit Ticket #{editedTicket.ID}</Text>
              </Stack>
            </div>
            <Separator />

            {/* Form Body */}
            <Stack tokens={{ childrenGap: 20 }} style={{ marginTop: '20px' }}>
              <TextField label="Work Item (Title)" value={editedTicket.Title} onChange={(e, v) => handleEditedFieldChange('Title', v || '')} disabled={isUpdating} />
              
              <Stack horizontal tokens={{ childrenGap: 20 }}>
                <Stack.Item grow={1}>
                  <Dropdown label="Category" options={categoryOptions} selectedKey={editedTicket.Category} onChange={(e, o) => handleEditedFieldChange('Category', o?.key as string)} disabled={isUpdating} />
                </Stack.Item>
                <Stack.Item grow={1}>
                  <Dropdown label="Priority" options={priorityOptions} selectedKey={editedTicket.Priority} onChange={(e, o) => handleEditedFieldChange('Priority', o?.key as string)} disabled={isUpdating} />
                </Stack.Item>
              </Stack>

              <Stack horizontal tokens={{ childrenGap: 20 }}>
                <Stack.Item grow={1}>
                  <Dropdown label="Progress Status" options={progressOptions} selectedKey={editedTicket.Progress} onChange={(e, o) => handleEditedFieldChange('Progress', o?.key as string)} disabled={isUpdating} />
                </Stack.Item>
                <Stack.Item grow={1}>
                  {/* FIX: Properly formats the string to an ISO standard when selected */}
                  <DatePicker label="Due Date" value={editedTicket.DueDate && editedTicket.DueDate !== 'TBD' ? new Date(editedTicket.DueDate) : undefined} onSelectDate={(date) => handleEditedFieldChange('DueDate', date ? date.toISOString() : 'TBD')} disabled={isUpdating} />
                </Stack.Item>
              </Stack>

              <TextField label="Detailed Description" multiline rows={6} resizable={false} value={editedTicket.Description} onChange={(e, v) => handleEditedFieldChange('Description', v || '')} disabled={isUpdating} />
              
              {/* Action Footer */}
              <div style={{ marginTop: '30px', backgroundColor: '#f3f2f1', padding: '16px', borderRadius: '6px' }}>
                <Stack horizontal tokens={{ childrenGap: 12 }}>
                  <PrimaryButton text={isUpdating ? "Saving..." : "Save Changes"} iconProps={{ iconName: 'Save' }} onClick={handleSaveEdit} disabled={isUpdating} />
                  <DefaultButton text="Cancel" onClick={handleCancelEdit} disabled={isUpdating} />
                </Stack>
              </div>
            </Stack>
          </>
        )}
      </Panel>

    </div>
  );
};

export default SupportDashboard;