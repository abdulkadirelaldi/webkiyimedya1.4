// src/components/ContentCalendar.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'moment/locale/tr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { 
    Box, Paper, Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, FormControl, InputLabel, Select, MenuItem,
    List, ListItem, ListItemText, IconButton, Tooltip, Typography, 
    ToggleButton, ToggleButtonGroup, useTheme 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import calendarService from '../services/calendarService';

moment.locale('tr');
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const ContentCalendar = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // --- DİNAMİK RENKLER ---
    const colors = {
        bg: theme.palette.background.paper,
        textPrimary: theme.palette.text.primary,
        textSecondary: theme.palette.text.secondary,
        border: theme.palette.divider,
        offRangeBg: isDark ? 'rgba(0,0,0,0.2)' : '#f9f9f9', // Ay dışındaki günler
        todayBg: isDark ? 'rgba(25, 118, 210, 0.15)' : '#e3f2fd',
        hoverBg: theme.palette.action.hover,
        toolbarText: theme.palette.text.primary
    };

    // --- STATE TANIMLARI ---
    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date()); 
    const [currentView, setCurrentView] = useState(Views.MONTH);

    const [openDialog, setOpenDialog] = useState(false); 
    const [openDayList, setOpenDayList] = useState(false);
    const [dayEvents, setDayEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [form, setForm] = useState({ title: '', start: new Date(), end: new Date(), status: 'planned' });

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const res = await calendarService.getEvents();
            if(res.success) {
                const formattedEvents = res.data.map(ev => ({
                    ...ev,
                    start: new Date(ev.start),
                    end: new Date(ev.end)
                }));
                setEvents(formattedEvents);
            }
        } catch (error) {
            console.error("Takvim verisi çekilemedi", error);
        }
    };

    // --- 1. ÖZEL TOOLBAR (Themed) ---
    const CustomToolbar = (toolbar) => {
        const goToBack = () => toolbar.onNavigate('PREV');
        const goToNext = () => toolbar.onNavigate('NEXT');
        const goToCurrent = () => toolbar.onNavigate('TODAY');
        
        const handleViewChange = (event, newView) => {
            if (newView !== null) {
                toolbar.onView(newView);
                setCurrentView(newView);
            }
        };

        const label = () => {
            const date = moment(toolbar.date);
            const style = { fontSize: '1.2rem', fontWeight: '500', color: colors.textPrimary, marginLeft: '20px' };
            
            if (currentView === 'day') return <span style={style}>{date.format('D MMMM YYYY, dddd')}</span>;
            if (currentView === 'week') {
                const start = date.clone().startOf('week');
                const end = date.clone().endOf('week');
                return <span style={style}>{start.format('D MMM')} - {end.format('D MMM YYYY')}</span>;
            }
            return <span style={{ ...style, fontSize: '1.5rem', fontWeight: '400' }}>{date.format('MMMM YYYY')}</span>;
        };

        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, px: 1, flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                        variant="outlined" 
                        onClick={goToCurrent} 
                        sx={{ 
                            color: colors.textPrimary, borderColor: colors.border, 
                            textTransform: 'none', borderRadius: '20px', px: 3, fontWeight: '500', mr: 2,
                            '&:hover': { borderColor: theme.palette.primary.main, bgcolor: colors.hoverBg }
                        }}
                    >
                        Bugün
                    </Button>
                    <IconButton onClick={goToBack} size="small" sx={{ color: colors.textSecondary }}><ChevronLeftIcon /></IconButton>
                    <IconButton onClick={goToNext} size="small" sx={{ color: colors.textSecondary }}><ChevronRightIcon /></IconButton>
                    {label()}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ToggleButtonGroup
                        value={currentView}
                        exclusive
                        onChange={handleViewChange}
                        size="small"
                        sx={{ 
                            '& .MuiToggleButton-root': { 
                                textTransform: 'none', px: 2, fontWeight: 500, color: colors.textSecondary, border: `1px solid ${colors.border}`,
                                '&.Mui-selected': { color: '#fff', bgcolor: theme.palette.primary.main }
                            } 
                        }}
                    >
                        <ToggleButton value={Views.DAY}>Gün</ToggleButton>
                        <ToggleButton value={Views.WEEK}>Hafta</ToggleButton>
                        <ToggleButton value={Views.MONTH}>Ay</ToggleButton>
                        <ToggleButton value={Views.AGENDA}>Yıl (Liste)</ToggleButton> 
                    </ToggleButtonGroup>
                </Box>
            </Box>
        );
    };

    // --- 2. ETKİNLİK GÖRÜNÜMÜ ---
    const CustomEvent = ({ event }) => {
        let bgcolor = '#ea4335'; // Kırmızı (Planlandı)
        if (event.status === 'inprogress') bgcolor = '#fbbc04'; // Sarı
        if (event.status === 'published') bgcolor = '#34a853'; // Yeşil

        return (
            <Tooltip title={event.title} arrow>
                <Box sx={{ 
                    bgcolor: bgcolor, color: '#fff', // Her zaman beyaz yazı (renkli zemin üstü)
                    borderRadius: '4px', px: 1, fontSize: '0.80rem', fontWeight: '600',
                    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', height: '100%', 
                    display: 'flex', alignItems: 'center', boxShadow: 1
                }}>
                    {event.title}
                </Box>
            </Tooltip>
        );
    };

    // --- ETKİLEŞİMLER ---
    const handleNavigate = (newDate) => setCurrentDate(newDate); 
    const handleView = (newView) => setCurrentView(newView); 

    const handleSelectSlot = ({ start, end }) => {
        setSelectedEvent(null);
        setForm({ title: '', start, end, status: 'planned' });
        setOpenDialog(true);
    };

    const handleSelectEvent = (event) => {
        setOpenDayList(false);
        setSelectedEvent(event);
        setForm({ ...event });
        setOpenDialog(true);
    };

    const handleShowMore = (events, date) => {
        setDayEvents(events);
        setSelectedDate(date);
        setOpenDayList(true);
    };

    const handleEventDrop = async ({ event, start, end }) => {
        const updatedEvents = events.map(e => e._id === event._id ? { ...e, start, end } : e);
        setEvents(updatedEvents);
        await calendarService.updateEvent(event._id, { start, end });
    };

    const handleSubmit = async () => {
        if (selectedEvent) {
            await calendarService.updateEvent(selectedEvent._id, form);
        } else {
            await calendarService.addEvent(form);
        }
        setOpenDialog(false);
        loadEvents();
    };

    const handleDelete = async () => {
        if(selectedEvent && window.confirm('Silinsin mi?')) {
            await calendarService.deleteEvent(selectedEvent._id);
            setOpenDialog(false);
            loadEvents();
        }
    };

    // --- DİNAMİK TAKVİM CSS ---
    const calendarStyles = {
        height: '80vh',
        fontFamily: "'Inter', 'Roboto', sans-serif",
        color: colors.textPrimary,
        // Header (Pzt, Sal...)
        '& .rbc-header': { 
            padding: '12px 0', fontWeight: '600', 
            color: colors.textSecondary, fontSize: '0.85rem', 
            textTransform: 'uppercase', borderBottom: `1px solid ${colors.border}` 
        },
        // Genel Grid
        '& .rbc-month-view': { border: `1px solid ${colors.border}`, borderRadius: '12px', overflow: 'hidden' },
        '& .rbc-day-bg': { borderLeft: `1px solid ${colors.border}` },
        '& .rbc-month-row': { borderTop: `1px solid ${colors.border}` },
        // Gün Rakamları
        '& .rbc-date-cell': { padding: '8px', fontWeight: '500', color: colors.textPrimary },
        // Bugün
        '& .rbc-today': { bgcolor: colors.todayBg },
        // Ay Dışı Günler
        '& .rbc-off-range-bg': { bgcolor: colors.offRangeBg },
        // Etkinlik Container
        '& .rbc-event': { backgroundColor: 'transparent', padding: '2px' },
        // Agenda (Liste) Görünümü
        '& .rbc-agenda-view table.rbc-agenda-table': { border: `1px solid ${colors.border}`, borderRadius: '8px' },
        '& .rbc-agenda-view table.rbc-agenda-table thead > tr > th': { padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.textPrimary },
        '& .rbc-agenda-view table.rbc-agenda-table tbody > tr > td': { padding: '10px', verticalAlign: 'middle', borderBottom: `1px solid ${colors.border}`, color: colors.textSecondary },
        '& .rbc-agenda-date-cell': { color: colors.textPrimary, fontWeight: 'bold' }
    };

    return (
        <Paper elevation={0} sx={{ p: 0, bgcolor: 'transparent' }}>
            <Box sx={calendarStyles}>
                <DnDCalendar
                    localizer={localizer}
                    events={events}
                    date={currentDate}
                    view={currentView}
                    onNavigate={handleNavigate}
                    onView={handleView}
                    startAccessor="start"
                    endAccessor="end"
                    selectable
                    resizable
                    popup={false}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    onEventDrop={handleEventDrop}
                    onEventResize={handleEventDrop}
                    components={{ toolbar: CustomToolbar, event: CustomEvent }}
                    eventPropGetter={() => ({ style: { backgroundColor: 'transparent', border: 'none' } })}
                    onShowMore={handleShowMore}
                    messages={{ showMore: (total) => `+${total} diğer` }}
                />
            </Box>

            {/* --- LİSTE MODALI (Dinamik) --- */}
            <Dialog 
                open={openDayList} onClose={() => setOpenDayList(false)} 
                maxWidth="xs" fullWidth
                PaperProps={{ sx: { bgcolor: colors.bg, color: colors.textPrimary, borderRadius: 3 } }}
            >
                <DialogTitle sx={{ fontSize: '1rem', borderBottom: `1px solid ${colors.border}` }}>
                    {selectedDate ? moment(selectedDate).format('LL') : ''}
                </DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    <List>
                        {dayEvents.map((ev) => (
                            <ListItem button key={ev._id} onClick={() => handleSelectEvent(ev)} divider sx={{ borderColor: colors.border }}>
                                <Box sx={{ width: 10, height: 10, borderRadius: '50%', mr: 2, bgcolor: ev.status === 'published' ? '#34a853' : ev.status === 'inprogress' ? '#fbbc04' : '#ea4335' }} />
                                <ListItemText 
                                    primary={ev.title} 
                                    secondary={ev.status === 'published' ? 'Yayında' : ev.status === 'inprogress' ? 'Hazırlanıyor' : 'Planlandı'} 
                                    primaryTypographyProps={{ color: colors.textPrimary }}
                                    secondaryTypographyProps={{ color: colors.textSecondary }}
                                />
                                <EditIcon sx={{ color: colors.textSecondary, fontSize: 18 }} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions sx={{ borderTop: `1px solid ${colors.border}` }}>
                    <Button onClick={() => { setOpenDayList(false); handleSelectSlot({ start: selectedDate, end: selectedDate }); }}>Yeni Ekle</Button>
                </DialogActions>
            </Dialog>

            {/* --- FORM MODALI (Dinamik) --- */}
            <Dialog 
                open={openDialog} onClose={() => setOpenDialog(false)} 
                maxWidth="sm" fullWidth
                PaperProps={{ sx: { bgcolor: colors.bg, borderRadius: 3 } }}
            >
                <DialogTitle sx={{ color: colors.textPrimary }}>
                    {selectedEvent ? 'İçeriği Düzenle' : 'Yeni İçerik Planla'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 1 }}>
                        <TextField 
                            margin="normal" fullWidth label="İçerik Başlığı" required 
                            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} 
                            InputLabelProps={{ style: { color: colors.textSecondary } }}
                            InputProps={{ style: { color: colors.textPrimary } }}
                            sx={{ '& .MuiOutlinedInput-root fieldset': { borderColor: colors.border } }}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel sx={{ color: colors.textSecondary }}>Durum</InputLabel>
                            <Select 
                                value={form.status} label="Durum" 
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                sx={{ color: colors.textPrimary, '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.border } }}
                            >
                                <MenuItem value="planned">🔴 Planlandı</MenuItem>
                                <MenuItem value="inprogress">🟡 Hazırlanıyor</MenuItem>
                                <MenuItem value="published">🟢 Yayında</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    {selectedEvent && <Button onClick={handleDelete} color="error" startIcon={<DeleteIcon />} sx={{ mr: 'auto' }}>Sil</Button>}
                    <Button onClick={() => setOpenDialog(false)} sx={{ color: colors.textSecondary }}>İptal</Button>
                    <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: theme.palette.primary.main }}>Kaydet</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default ContentCalendar;