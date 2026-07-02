"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* eslint-disable */
var React = tslib_1.__importStar(require("react"));
var react_1 = require("react");
var react_2 = require("@fluentui/react");
var SupportDashboard = function (props) {
    // --- SUBMISSION FORM STATE ---
    var _a = (0, react_1.useState)(''), title = _a[0], setTitle = _a[1];
    var _b = (0, react_1.useState)(''), description = _b[0], setDescription = _b[1];
    var _c = (0, react_1.useState)(''), category = _c[0], setCategory = _c[1];
    var _d = (0, react_1.useState)(''), priority = _d[0], setPriority = _d[1];
    var _e = (0, react_1.useState)(undefined), dueDate = _e[0], setDueDate = _e[1];
    // --- UI STATE ---
    var _f = (0, react_1.useState)(null), statusMessage = _f[0], setStatusMessage = _f[1];
    var _g = (0, react_1.useState)(false), isSubmitting = _g[0], setIsSubmitting = _g[1];
    var _h = (0, react_1.useState)(false), submittedSuccessfully = _h[0], setSubmittedSuccessfully = _h[1];
    var _j = (0, react_1.useState)([]), tickets = _j[0], setTickets = _j[1];
    // --- POP-UP PANEL STATES ---
    var _k = (0, react_1.useState)(false), isNewPanelOpen = _k[0], setIsNewPanelOpen = _k[1];
    var _l = (0, react_1.useState)(false), isEditPanelOpen = _l[0], setIsEditPanelOpen = _l[1];
    var _m = (0, react_1.useState)(null), editedTicket = _m[0], setEditedTicket = _m[1];
    var _o = (0, react_1.useState)(false), isUpdating = _o[0], setIsUpdating = _o[1];
    // --- DROPDOWN OPTIONS ---
    var priorityOptions = [
        { key: 'Low', text: 'Low' },
        { key: 'Medium', text: 'Medium' },
        { key: 'High', text: 'High' },
        { key: 'Critical', text: 'Critical' }
    ];
    var categoryOptions = [
        { key: 'Support', text: 'Support' },
        { key: 'Development', text: 'Development' },
        { key: 'Access', text: 'Access/Permissions' },
        { key: 'Training', text: 'Training' },
        { key: 'Consultation', text: 'Consultation' },
        { key: 'Idea', text: 'Just an idea' },
        { key: 'Other', text: 'Other' }
    ];
    var progressOptions = [
        { key: 'Logged', text: 'Logged' },
        { key: 'In-progress', text: 'In-progress' },
        { key: 'Complete', text: 'Complete' },
        { key: 'Cancelled', text: 'Cancelled' },
        { key: 'On Hold', text: 'On Hold' },
        { key: 'Future Idea', text: 'Future Idea' }
    ];
    // --- DATA LOADING ---
    var loadTickets = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var readFlowUrl, response, rawData, dataArray, normalizeProgress_1, formattedTickets, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    readFlowUrl = "https://3a4e6253975aee7ca3c118bf7aea22.56.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/0a69a50e413d47e28f9d63e52a4b7d6b/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=yuLbZCj8cIa9Ct-rz1IZv8lQaMueEUbd-aUxWQond_o";
                    return [4 /*yield*/, fetch(readFlowUrl, {
                            method: 'GET',
                            headers: { 'Accept': 'application/json' }
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    rawData = _a.sent();
                    dataArray = Array.isArray(rawData) ? rawData : rawData.value || [];
                    normalizeProgress_1 = function (rawVal) {
                        if (!rawVal)
                            return 'Logged';
                        var text = String(rawVal).toLowerCase().trim();
                        if (text.includes('progress'))
                            return 'In-progress';
                        if (text.includes('complet') || text === 'done')
                            return 'Complete';
                        if (text.includes('cancel'))
                            return 'Cancelled';
                        if (text.includes('hold'))
                            return 'On Hold';
                        if (text.includes('idea') || text.includes('future'))
                            return 'Future Idea';
                        return 'Logged';
                    };
                    formattedTickets = dataArray.map(function (item) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                        var rawProgressVal = ((_a = item.field_4) === null || _a === void 0 ? void 0 : _a.Value) || item.field_4 || ((_b = item.Progress) === null || _b === void 0 ? void 0 : _b.Value) || item.Progress;
                        return {
                            ID: item.ID,
                            Title: String(item.Title || item.WorkItem || "Untitled"),
                            Description: String(item.field_2 || item.Description || "No description"),
                            Category: String(((_d = (_c = item.field_3) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.Value) || ((_e = item.Category) === null || _e === void 0 ? void 0 : _e.Value) || "General"),
                            Progress: normalizeProgress_1(rawProgressVal),
                            Priority: String(((_f = item.field_8) === null || _f === void 0 ? void 0 : _f.Value) || ((_g = item.Priority) === null || _g === void 0 ? void 0 : _g.Value) || "Low"),
                            AssignedTo: String(((_j = (_h = item.AssignedTo) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.DisplayName) || ((_k = item.AssignedTo) === null || _k === void 0 ? void 0 : _k.DisplayName) || "Unassigned"),
                            // FIX: Keep the raw date string in memory instead of forcing it to a local string immediately
                            DueDate: item.field_10 ? item.field_10 : (item.DueDate ? item.DueDate : "TBD")
                        };
                    });
                    setTickets(formattedTickets.reverse());
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error("Error loading tickets via Flow: ", error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        loadTickets();
    }, []);
    var handleCancelNew = function () {
        setIsNewPanelOpen(false);
        setTitle('');
        setDescription('');
        setPriority('');
        setCategory('');
        setDueDate(undefined);
    };
    // --- SUBMIT NEW TICKET ---
    var submitRequest = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var payload, response, error_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!title) {
                        setStatusMessage({ type: react_2.MessageBarType.error, text: "A Work Item title is required." });
                        return [2 /*return*/];
                    }
                    setIsSubmitting(true);
                    payload = {
                        Title: title,
                        Description: description || "No description",
                        Priority: priority || "Low",
                        Category: category || "General",
                        DueDate: dueDate ? dueDate.toISOString() : "",
                        SourceTenant: window.location.hostname,
                        UserEmail: props.context.pageContext.user.email
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, fetch("https://3a4e6253975aee7ca3c118bf7aea22.56.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/14f48737218f48f6a3bc4662b21487ad/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=iNN2UG_FWvFy4RORx2hQpKR01LZszgmaMBtYIe_Pf_I", {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        setIsNewPanelOpen(false);
                        setTitle('');
                        setDescription('');
                        setPriority('');
                        setCategory('');
                        setDueDate(undefined);
                        setSubmittedSuccessfully(true);
                        setStatusMessage({ type: react_2.MessageBarType.success, text: "Sent! We've received your request." });
                        loadTickets();
                    }
                    else {
                        setStatusMessage({ type: react_2.MessageBarType.error, text: "Server rejected the request. Please check your inputs." });
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    setStatusMessage({ type: react_2.MessageBarType.error, text: "Connection error." });
                    return [3 /*break*/, 5];
                case 4:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // ==========================================
    // EDITING FUNCTIONS
    // ==========================================
    var handleEditClick = function (item) {
        setEditedTicket(tslib_1.__assign({}, item));
        setIsEditPanelOpen(true);
    };
    var handleCancelEdit = function () {
        setIsEditPanelOpen(false);
        setEditedTicket(null);
    };
    var handleEditedFieldChange = function (field, value) {
        var _a;
        if (editedTicket) {
            setEditedTicket(tslib_1.__assign(tslib_1.__assign({}, editedTicket), (_a = {}, _a[field] = value, _a)));
        }
    };
    var handleSaveEdit = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var updatePayload, updateFlowUrl, updatedTickets, response, updatedTickets, error_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!editedTicket)
                        return [2 /*return*/];
                    setIsUpdating(true);
                    updatePayload = {
                        ID: editedTicket.ID,
                        Title: editedTicket.Title,
                        Description: editedTicket.Description,
                        Category: editedTicket.Category,
                        Priority: editedTicket.Priority,
                        Progress: editedTicket.Progress,
                        DueDate: editedTicket.DueDate !== 'TBD' ? editedTicket.DueDate : ""
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    updateFlowUrl = "YOUR_UPDATE_FLOW_HTTP_URL_HERE";
                    if (!(updateFlowUrl === "YOUR_UPDATE_FLOW_HTTP_URL_HERE")) return [3 /*break*/, 2];
                    console.warn("Update Flow URL not set yet. Updating local UI only.");
                    updatedTickets = tickets.map(function (t) { return t.ID === editedTicket.ID ? editedTicket : t; });
                    setTickets(updatedTickets);
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, fetch(updateFlowUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatePayload)
                    })];
                case 3:
                    response = _a.sent();
                    if (response.ok) {
                        updatedTickets = tickets.map(function (t) { return t.ID === editedTicket.ID ? editedTicket : t; });
                        setTickets(updatedTickets);
                        setStatusMessage({ type: react_2.MessageBarType.success, text: "Ticket #".concat(editedTicket.ID, " updated successfully.") });
                    }
                    else {
                        setStatusMessage({ type: react_2.MessageBarType.error, text: "Failed to update ticket in SharePoint." });
                    }
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_3 = _a.sent();
                    setStatusMessage({ type: react_2.MessageBarType.error, text: "Connection error while updating." });
                    return [3 /*break*/, 7];
                case 6:
                    setIsUpdating(false);
                    setIsEditPanelOpen(false);
                    setEditedTicket(null);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // ==========================================
    // BOARD RENDERING HELPERS
    // ==========================================
    var boardColumns = ['Logged', 'In-progress', 'Complete', 'Cancelled', 'On Hold', 'Future Idea'];
    var getPriorityColor = function (p) {
        if (p === 'Critical')
            return '#8B0000';
        if (p === 'High')
            return '#E81123';
        if (p === 'Medium')
            return '#E68A00';
        return '#107c10';
    };
    var renderTicketCard = function (ticket) { return (React.createElement("div", { key: ticket.ID, style: {
            backgroundColor: '#fff',
            borderRadius: '6px',
            padding: '10px',
            marginBottom: '10px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            borderLeft: "4px solid ".concat(getPriorityColor(ticket.Priority)),
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
        } },
        React.createElement(react_2.Stack, { horizontal: true, horizontalAlign: "space-between", verticalAlign: "start" },
            React.createElement(react_2.Text, { variant: "smallPlus", style: { fontWeight: 600, maxWidth: '80%', lineHeight: '1.2' } }, ticket.Title),
            React.createElement(react_2.IconButton, { iconProps: { iconName: 'Edit' }, title: "Edit Ticket", onClick: function () { return handleEditClick(ticket); }, style: { height: '20px', width: '20px' } })),
        React.createElement(react_2.Stack, { horizontal: true, tokens: { childrenGap: 4 }, verticalAlign: "center", wrap: true },
            React.createElement("span", { style: { fontSize: '11px', padding: '2px 6px', backgroundColor: '#f3f2f1', borderRadius: '12px', color: '#605e5c', whiteSpace: 'nowrap' } }, ticket.Category),
            React.createElement("span", { style: { fontSize: '11px', color: getPriorityColor(ticket.Priority), fontWeight: 'bold' } }, ticket.Priority)),
        React.createElement(react_2.Stack, { horizontal: true, horizontalAlign: "space-between", verticalAlign: "center", style: { marginTop: '4px' } },
            React.createElement(react_2.Text, { variant: "small", style: { color: '#605e5c', fontSize: '10px' } },
                "ID: ",
                ticket.ID === 0 ? '...' : ticket.ID),
            React.createElement(react_2.Stack, { horizontal: true, tokens: { childrenGap: 4 }, verticalAlign: "center" },
                React.createElement(react_2.Icon, { iconName: "Calendar", style: { fontSize: '10px', color: '#605e5c' } }),
                React.createElement(react_2.Text, { variant: "small", style: { color: '#605e5c', fontSize: '10px' } }, ticket.DueDate !== 'TBD' ? new Date(ticket.DueDate).toLocaleDateString() : 'TBD'))))); };
    return (React.createElement("div", { style: { padding: '20px', width: '100%', backgroundColor: '#faf9f8', minHeight: '80vh', boxSizing: 'border-box' } },
        React.createElement(react_2.Stack, { horizontal: true, horizontalAlign: "space-between", verticalAlign: "center", style: { marginBottom: '20px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } },
            React.createElement("div", null,
                React.createElement("h2", { style: { marginTop: 0, marginBottom: '5px' } }, "Support Board"),
                React.createElement(react_2.Text, { variant: "medium" },
                    "Welcome, ",
                    props.context.pageContext.user.displayName,
                    "!")),
            !submittedSuccessfully && (React.createElement(react_2.PrimaryButton, { text: "New Support Ticket", iconProps: { iconName: 'Add' }, onClick: function () { return setIsNewPanelOpen(true); } }))),
        statusMessage && (React.createElement(react_2.MessageBar, { messageBarType: statusMessage.type, isMultiline: true, onDismiss: function () { return setStatusMessage(null); }, style: { marginBottom: '20px' } }, statusMessage.text)),
        submittedSuccessfully ? (React.createElement(react_2.Stack, { horizontalAlign: "center", tokens: { childrenGap: 20 }, style: { padding: '40px 0', backgroundColor: '#fff', borderRadius: '8px' } },
            React.createElement(react_2.Icon, { iconName: "Completed", style: { fontSize: '48px', color: '#107c10' } }),
            React.createElement(react_2.Text, { variant: "xxLarge" }, "Ticket Submitted!"),
            React.createElement(react_2.Text, null, "Thank you for reaching out. The SharePoint Systems team has been notified and will contact you shortly."),
            React.createElement(react_2.PrimaryButton, { text: "Back to Board", onClick: function () { return setSubmittedSuccessfully(false); } }))) : (React.createElement("div", { style: { display: 'flex', gap: '12px', alignItems: 'flex-start', width: '100%' } }, boardColumns.map(function (columnName) {
            var columnTickets = tickets.filter(function (t) {
                return t.Progress === columnName || (columnName === 'Logged' && boardColumns.indexOf(t.Progress) === -1);
            });
            return (React.createElement("div", { key: columnName, style: {
                    flex: 1,
                    minWidth: 0,
                    backgroundColor: '#f3f2f1',
                    borderRadius: '8px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column'
                } },
                React.createElement(react_2.Stack, { horizontal: true, horizontalAlign: "space-between", verticalAlign: "center", style: { marginBottom: '12px', padding: '0 2px' } },
                    React.createElement(react_2.Text, { variant: "medium", style: { fontWeight: 'bold', color: '#323130', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, columnName),
                    React.createElement("span", { style: { backgroundColor: '#e1dfdd', borderRadius: '50%', padding: '2px 6px', fontSize: '11px', fontWeight: 'bold' } }, columnTickets.length)),
                columnTickets.length > 0 ? (columnTickets.map(function (ticket) { return renderTicketCard(ticket); })) : (React.createElement("div", { style: { padding: '15px 5px', textAlign: 'center', border: '2px dashed #c8c6c4', borderRadius: '6px' } },
                    React.createElement(react_2.Text, { variant: "small", style: { color: '#a19f9d' } }, "Empty")))));
        }))),
        React.createElement(react_2.Panel, { isOpen: isNewPanelOpen, onDismiss: handleCancelNew, type: react_2.PanelType.medium, isBlocking: false },
            React.createElement("div", { style: { paddingTop: '20px', paddingBottom: '10px' } },
                React.createElement(react_2.Stack, { horizontal: true, verticalAlign: "center", tokens: { childrenGap: 10 } },
                    React.createElement(react_2.Icon, { iconName: "QuickNote", style: { fontSize: '24px', color: '#0078d4' } }),
                    React.createElement(react_2.Text, { variant: "xLarge", style: { fontWeight: '600', color: '#323130' } }, "New Support Request")),
                React.createElement(react_2.Text, { variant: "medium", style: { color: '#605e5c', display: 'block', marginTop: '8px' } }, "Fill out the details below so our team can help you as quickly as possible.")),
            React.createElement(react_2.Separator, null),
            React.createElement(react_2.Stack, { tokens: { childrenGap: 20 }, style: { marginTop: '20px' } },
                React.createElement(react_2.TextField, { label: "Work Item (Title)", placeholder: "Briefly describe the issue...", value: title, onChange: function (e, v) { return setTitle(v || ''); }, disabled: isSubmitting, required: true }),
                React.createElement(react_2.Stack, { horizontal: true, tokens: { childrenGap: 20 } },
                    React.createElement(react_2.Stack.Item, { grow: 1 },
                        React.createElement(react_2.Dropdown, { label: "Category", placeholder: "Select...", options: categoryOptions, selectedKey: category, onChange: function (e, o) { return setCategory(o === null || o === void 0 ? void 0 : o.key); }, disabled: isSubmitting })),
                    React.createElement(react_2.Stack.Item, { grow: 1 },
                        React.createElement(react_2.Dropdown, { label: "Priority", placeholder: "Select...", options: priorityOptions, selectedKey: priority, onChange: function (e, o) { return setPriority(o === null || o === void 0 ? void 0 : o.key); }, disabled: isSubmitting }))),
                React.createElement(react_2.DatePicker, { label: "Due Date", placeholder: "Select a date...", value: dueDate, onSelectDate: function (date) { return setDueDate(date || undefined); }, disabled: isSubmitting }),
                React.createElement(react_2.TextField, { label: "Detailed Description", placeholder: "Steps to reproduce, error messages, links...", multiline: true, rows: 6, resizable: false, value: description, onChange: function (e, v) { return setDescription(v || ''); }, disabled: isSubmitting }),
                React.createElement("div", { style: { marginTop: '30px', backgroundColor: '#f3f2f1', padding: '16px', borderRadius: '6px' } },
                    React.createElement(react_2.Stack, { horizontal: true, tokens: { childrenGap: 12 } },
                        React.createElement(react_2.PrimaryButton, { text: isSubmitting ? "Sending..." : "Submit Ticket", iconProps: { iconName: 'Send' }, onClick: submitRequest, disabled: isSubmitting }),
                        React.createElement(react_2.DefaultButton, { text: "Cancel", onClick: handleCancelNew, disabled: isSubmitting }))))),
        React.createElement(react_2.Panel, { isOpen: isEditPanelOpen, onDismiss: handleCancelEdit, type: react_2.PanelType.medium, isBlocking: false }, editedTicket && (React.createElement(React.Fragment, null,
            React.createElement("div", { style: { paddingTop: '20px', paddingBottom: '10px' } },
                React.createElement(react_2.Stack, { horizontal: true, verticalAlign: "center", tokens: { childrenGap: 10 } },
                    React.createElement(react_2.Icon, { iconName: "EditNote", style: { fontSize: '24px', color: '#0078d4' } }),
                    React.createElement(react_2.Text, { variant: "xLarge", style: { fontWeight: '600', color: '#323130' } },
                        "Edit Ticket #",
                        editedTicket.ID))),
            React.createElement(react_2.Separator, null),
            React.createElement(react_2.Stack, { tokens: { childrenGap: 20 }, style: { marginTop: '20px' } },
                React.createElement(react_2.TextField, { label: "Work Item (Title)", value: editedTicket.Title, onChange: function (e, v) { return handleEditedFieldChange('Title', v || ''); }, disabled: isUpdating }),
                React.createElement(react_2.Stack, { horizontal: true, tokens: { childrenGap: 20 } },
                    React.createElement(react_2.Stack.Item, { grow: 1 },
                        React.createElement(react_2.Dropdown, { label: "Category", options: categoryOptions, selectedKey: editedTicket.Category, onChange: function (e, o) { return handleEditedFieldChange('Category', o === null || o === void 0 ? void 0 : o.key); }, disabled: isUpdating })),
                    React.createElement(react_2.Stack.Item, { grow: 1 },
                        React.createElement(react_2.Dropdown, { label: "Priority", options: priorityOptions, selectedKey: editedTicket.Priority, onChange: function (e, o) { return handleEditedFieldChange('Priority', o === null || o === void 0 ? void 0 : o.key); }, disabled: isUpdating }))),
                React.createElement(react_2.Stack, { horizontal: true, tokens: { childrenGap: 20 } },
                    React.createElement(react_2.Stack.Item, { grow: 1 },
                        React.createElement(react_2.Dropdown, { label: "Progress Status", options: progressOptions, selectedKey: editedTicket.Progress, onChange: function (e, o) { return handleEditedFieldChange('Progress', o === null || o === void 0 ? void 0 : o.key); }, disabled: isUpdating })),
                    React.createElement(react_2.Stack.Item, { grow: 1 },
                        React.createElement(react_2.DatePicker, { label: "Due Date", value: editedTicket.DueDate && editedTicket.DueDate !== 'TBD' ? new Date(editedTicket.DueDate) : undefined, onSelectDate: function (date) { return handleEditedFieldChange('DueDate', date ? date.toISOString() : 'TBD'); }, disabled: isUpdating }))),
                React.createElement(react_2.TextField, { label: "Detailed Description", multiline: true, rows: 6, resizable: false, value: editedTicket.Description, onChange: function (e, v) { return handleEditedFieldChange('Description', v || ''); }, disabled: isUpdating }),
                React.createElement("div", { style: { marginTop: '30px', backgroundColor: '#f3f2f1', padding: '16px', borderRadius: '6px' } },
                    React.createElement(react_2.Stack, { horizontal: true, tokens: { childrenGap: 12 } },
                        React.createElement(react_2.PrimaryButton, { text: isUpdating ? "Saving..." : "Save Changes", iconProps: { iconName: 'Save' }, onClick: handleSaveEdit, disabled: isUpdating }),
                        React.createElement(react_2.DefaultButton, { text: "Cancel", onClick: handleCancelEdit, disabled: isUpdating })))))))));
};
exports.default = SupportDashboard;
//# sourceMappingURL=SupportDashboard.js.map