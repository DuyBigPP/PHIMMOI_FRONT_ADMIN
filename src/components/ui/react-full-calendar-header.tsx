import { Tabs, TabsList, TabsTrigger } from "@/components/ui/animated-tabs";
import { Button } from "@/components/ui/button";
import type {
  CalendarView,
  IFullCalendarHeaderProps,
} from "@/types/ReactFullCalendar";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function FullCalendarHeader({
  title,
  onPrev,
  onNext,
  onToday,
  onViewChange,
  currentView,
  t,
}: IFullCalendarHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={onPrev}>
          <ChevronLeft className="size-6" />
        </Button>
        <Button variant="outline" size="icon" onClick={onNext}>
          <ChevronRight className="size-6" />
        </Button>
        <Button variant="outline" className="text-base" onClick={onToday}>
          {t("today")}
        </Button>
      </div>
      <h2 className="font-semibold text-xl">{title}</h2>
      <Tabs
        value={currentView}
        onValueChange={(value) => onViewChange(value as CalendarView)}
      >
        <TabsList>
          <TabsTrigger value="dayGridMonth">{t("month")}</TabsTrigger>
          <TabsTrigger value="timeGridWeek">{t("week")}</TabsTrigger>
          <TabsTrigger value="timeGridDay">{t("day")}</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
