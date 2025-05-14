import { Card, CardContent } from "@/components/ui/card";
import type {
  CalendarView,
  IFullCalendarEvent,
  IFullCalendarProps,
} from "@/types/ReactFullCalendar";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { EventDialogs } from "./react-full-calendar-event-dialogs";
import { FullCalendarHeader } from "./react-full-calendar-header";

export const ReactFullCalendar = ({
  events,
  onEventAdd,
  onEventUpdate,
  isEditable = true,
  height = "600px",
  locale = "vi",
}: IFullCalendarProps) => {
  const { t } = useTranslation("ReactFullCalendar");
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [isEventInfoDialogOpen, setIsEventInfoDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<IFullCalendarEvent>>({
    title: "",
    start: "",
    end: "",
  });
  const [selectedEvent, setSelectedEvent] = useState<IFullCalendarEvent | null>(
    null
  );
  const [currentView, setCurrentView] = useState<CalendarView>("timeGridWeek");
  const [calendarTitle, setCalendarTitle] = useState("");
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    if (calendarRef.current) {
      setCalendarTitle(calendarRef.current.getApi().view.title);
    }
  }, []);

  const handleDateSelect = (selectInfo: any) => {
    if (isEditable) {
      setNewEvent({
        title: "",
        start: selectInfo.startStr,
        end: selectInfo.endStr,
      });
      setIsAddEventDialogOpen(true);
    }
  };

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event);
    setIsEventInfoDialogOpen(true);
  };

  const addEvent = () => {
    if (newEvent.title && onEventAdd) {
      const newEventWithColor: IFullCalendarEvent = {
        ...(newEvent as IFullCalendarEvent),
        id: Date.now().toString(),
        backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
      };
      onEventAdd(newEventWithColor);
      setIsAddEventDialogOpen(false);
    }
  };

  const updateEvent = (updatedEvent: IFullCalendarEvent) => {
    if (onEventUpdate) {
      onEventUpdate(updatedEvent);
      setIsEventInfoDialogOpen(false);
    }
  };

  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.prev();
    setCalendarTitle(calendarApi?.view.title || "");
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.next();
    setCalendarTitle(calendarApi?.view.title || "");
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.today();
    setCalendarTitle(calendarApi?.view.title || "");
  };

  const handleViewChange = (view: CalendarView) => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.changeView(view);
    setCurrentView(view);
  };

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardContent className="p-4">
        <FullCalendarHeader
          title={calendarTitle}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
          onViewChange={handleViewChange}
          currentView={currentView}
          t={t}
        />
        <FullCalendar
          locale={locale}
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={false}
          editable={isEditable}
          selectable={isEditable}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height={height}

          slotDuration="00:15:00"
          slotLabelInterval="01:00:00"

          allDaySlot={false}
          slotMinTime="06:00:00"
          slotMaxTime="24:00:00"
          firstDay={1}

          eventOverlap={false}   
          slotEventOverlap={false}

          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            omitZeroMinute: false,
            meridiem: "short",
          }}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
          dayHeaderFormat={{ weekday: "short" }}
          eventContent={(eventInfo) => (
            <div className="p-1 text-xs text-white rounded"
            style={{
              width: "100%",
              padding: "3px",
              fontSize: "11px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              textAlign: "left",
              height: "100%",
              lineHeight: "1.2", 
              overflow: "hidden",
            }}>
              <div className="font-semibold">{eventInfo.timeText}</div>
              <div style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                wordBreak: "break-word",
              }}>{eventInfo.event.title}</div>
            </div>
          )}
          
          eventDidMount={(info) => {
            const eventElement = info.el;
  
            eventElement.style.overflow = "hidden"; 
            eventElement.style.display = "flex";
            eventElement.style.alignItems = "flex-start";
        
            const duration = info.event.end && info.event.start ? 
              (info.event.end.getTime() - info.event.start.getTime()) / (1000 * 60) : 30;
            
            eventElement.style.minHeight = Math.max(duration/2, 20) + "px";
            
            eventElement.title = info.event.title;
          }}
          dayCellClassNames="hover:bg-primary/10 transition-colors"
          nowIndicator
          slotLabelClassNames="text-muted-foreground font-medium"
          dayHeaderClassNames="text-primary font-semibold"
        />
      </CardContent>

      <EventDialogs
        isAddEventDialogOpen={isAddEventDialogOpen}
        setIsAddEventDialogOpen={setIsAddEventDialogOpen}
        isEventInfoDialogOpen={isEventInfoDialogOpen}
        setIsEventInfoDialogOpen={setIsEventInfoDialogOpen}
        isEditable={isEditable}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        addEvent={addEvent}
        selectedEvent={selectedEvent}
        updateEvent={updateEvent}
        t={t}
        currentLocale={locale}
      />
    </Card>
  );
};