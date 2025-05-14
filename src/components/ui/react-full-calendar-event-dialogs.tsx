import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  IEventDialogsProps,
  IFullCalendarEvent,
} from "@/types/ReactFullCalendar";
import { getLocaleFromLanguage } from "@/utils/functions/weekDate";
import { format } from "date-fns";
import {
  CalendarIcon,
  ClockIcon,
  Edit2Icon,
  MapPinHouse,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { useState } from "react";

export function EventDialogs({
  isAddEventDialogOpen,
  setIsAddEventDialogOpen,
  isEventInfoDialogOpen,
  setIsEventInfoDialogOpen,
  isEditable,
  newEvent,
  setNewEvent,
  selectedEvent,
  addEvent,
  updateEvent,
  t,
  currentLocale,
}: IEventDialogsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<IFullCalendarEvent | null>(
    null
  );

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedEvent(selectedEvent);
  };

  const handleSaveEdit = () => {
    if (editedEvent) {
      updateEvent(editedEvent);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedEvent(null);
  };

  return (
    <>
      <Dialog
        open={isAddEventDialogOpen}
        onOpenChange={setIsAddEventDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addEvent")}</DialogTitle>
            <DialogDescription>{t("enterEventInfo")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="event-title" className="text-right">
                {t("eventName")}
              </Label>
              <Input
                id="event-title"
                value={newEvent.title || ""}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addEvent}>{t("add")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEventInfoDialogOpen}
        onOpenChange={setIsEventInfoDialogOpen}
      >
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {isEditing ? (
                <Input
                  value={editedEvent?.title || ""}
                  onChange={(e) =>
                    setEditedEvent((prev) =>
                      prev ? { ...prev, title: e.target.value } : null
                    )
                  }
                />
              ) : (
                selectedEvent?.title
              )}
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedEvent?.extendedProps?.location && (
              <div className="grid grid-cols-[24px_150px_1fr] items-center gap-2">
                <MapPinHouse className="size-6 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">
                  {t("location")}:
                </span>
                <span className="font-medium">
                  {selectedEvent.extendedProps.location}
                </span>
              </div>
            )}

            <div className="grid grid-cols-[24px_150px_1fr] items-center gap-2">
              <CalendarIcon className="size-6 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">
                {t("eventDate")}:
              </span>
              <span className="font-medium">
                {selectedEvent?.start &&
                  format(new Date(selectedEvent.start), "dd/MM/yyyy", {
                    locale: getLocaleFromLanguage(currentLocale),
                  })}
              </span>
            </div>

            <div className="grid grid-cols-[24px_150px_1fr] items-center gap-2">
              <ClockIcon className="size-6 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">
                {t("eventTime")}:
              </span>
              <span className="font-medium">
                {selectedEvent?.start &&
                  format(new Date(selectedEvent.start), "hh:mm aa", {
                    locale: getLocaleFromLanguage(currentLocale),
                  })}
                {" - "}
                {selectedEvent?.end &&
                  format(new Date(selectedEvent.end), "hh:mm aa", {
                    locale: getLocaleFromLanguage(currentLocale),
                  })}
              </span>
            </div>

            {selectedEvent?.extendedProps?.attendees && (
              <div className="grid grid-cols-[24px_150px_1fr] items-center gap-2">
                <Users className="size-6 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">
                  {t("attendees")}:
                </span>
                <span className="font-medium">
                  {selectedEvent.extendedProps.attendees}
                </span>
              </div>
            )}

            {selectedEvent?.extendedProps?.preparation && (
              <div className="grid grid-cols-[24px_150px_1fr] items-center gap-2">
                <SlidersHorizontal className="size-6 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">
                  {t("preparation")}:
                </span>
                <span className="font-medium">
                  {selectedEvent.extendedProps.preparation}
                </span>
              </div>
            )}
          </div>

          {isEditable && (
            <DialogFooter>
              {isEditing ? (
                <>
                  <Button onClick={handleSaveEdit}>{t("save")}</Button>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    {t("cancel")}
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleEditClick}>
                    <Edit2Icon className="size-4" />
                    {t("edit")}
                  </Button>
                </>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
