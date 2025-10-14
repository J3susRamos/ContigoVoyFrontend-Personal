"use client";
// cambio
import React, { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Modal,
  ModalContent,
  Button,
  Calendar,
  CalendarProps,
  Select,
  SelectItem,
} from "@heroui/react";
import { today, getLocalTimeZone, CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date";

interface DatePickerCustomProps extends CalendarProps {
  onConfirm?: (date: CalendarDate | null) => void;
  label?: string;
}

type DateType = CalendarDate | CalendarDateTime | ZonedDateTime;

export default function DatePickerCustom({
  onConfirm,
  label,
  ...props
}: DatePickerCustomProps) {
  const defaultDate = new CalendarDate(today(getLocalTimeZone()).year - 100, today(getLocalTimeZone()).month, 1); //100 años antes para evitar bypass de fecha
  const [tempDate, setTempDate] = useState<DateType>(
    (props.value as DateType) || defaultDate
  );

  const [confirmedDate, setConfirmedDate] = useState<CalendarDate | null>(
    (props.value as CalendarDate) || defaultDate
  );

  const [isOpen, setIsOpen] = useState(false);

  const calendarWrapperRef = useRef<HTMLDivElement | null>(null);

  const HIDE_SELECTORS = [
    'button[aria-label*="Anterior"]',
    'button[aria-label*="Siguiente"]',
  ];

  const hideCalendarHeader = () => {
    const root = calendarWrapperRef.current;
    if (!root) return;
    for (const sel of HIDE_SELECTORS) {
      const els = Array.from(root.querySelectorAll<HTMLElement>(sel));
      els.forEach((el) => {
        el.style.display = "none";
      });
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    hideCalendarHeader();
    const root = calendarWrapperRef.current;
    if (!root) return;
    const mo = new MutationObserver(() => {
      hideCalendarHeader();
    });
    mo.observe(root, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [isOpen, tempDate]);

  const formatDate = (date: CalendarDate | null): string => {
    if (!date) return "";

    const d = date.toDate(getLocalTimeZone());
    return d.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("es-PE", { month: "long" })
  );

  const currentYear = today(getLocalTimeZone()).year;
  const minYear = currentYear - 100;
  const years = Array.from({ length: currentYear - minYear + 1 }, (_, i) => currentYear - i);

  useEffect(() => {
    if (!tempDate) return;
    const y = Math.min(Math.max(tempDate.year, minYear), currentYear);
    const m = tempDate.month || 1;
    let d = tempDate.day || 1;

    const maxDay = new Date(y, m, 0).getDate();
    if (d > maxDay) d = maxDay;

    if (y !== tempDate.year || d !== tempDate.day) {
      setTempDate(new CalendarDate(y, m, d));
    }
  }, [tempDate, currentYear, minYear]);

  const handleMonthChange = (month: number) => {
    const currentDay = (tempDate && tempDate.day) || 1;
    const newCal = new CalendarDate(tempDate.year, month, 1);
    const day = Math.min(
      currentDay,
      new Date(newCal.year, newCal.month, 0).getDate()
    );
    setTempDate(new CalendarDate(newCal.year, newCal.month, day));
  };

  const handleYearChange = (year: number) => {
    const currentDay = (tempDate && tempDate.day) || 1;
    const newCal = new CalendarDate(year, tempDate.month, 1);
    const day = Math.min(
      currentDay,
      new Date(newCal.year, newCal.month, 0).getDate()
    );
    setTempDate(new CalendarDate(newCal.year, newCal.month, day));
  };

  const handleConfirm = () => {
    let calendarDate: CalendarDate | null = null;

    if (!tempDate) {
      calendarDate = null;
    } else if (tempDate instanceof CalendarDate) {
      calendarDate = tempDate;
    } else if ("toCalendarDate" in tempDate && typeof tempDate.toCalendarDate === "function") {
      calendarDate = tempDate.toCalendarDate();
    } else {
      calendarDate = null;
    }

    setConfirmedDate(calendarDate);
    if (onConfirm) onConfirm(calendarDate);
    setIsOpen(false);
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  const PickerContent = (
    <div className="flex flex-col gap-3 p-3 h-full">
      <div className="flex items-center justify-between gap-2 mb-2">
        <Select
          aria-label="Seleccionar mes"
          defaultSelectedKeys={[String(tempDate.month)]}
          selectedKeys={[String(tempDate.month)]}
          onSelectionChange={(keys) => {
            const key = Array.from(keys)[0];
            if (key) handleMonthChange(Number(key));
          }}
          className="w-36"
        >
          {months.map((m, i) => (
            <SelectItem key={String(i + 1)} textValue={m}>
              {m}
            </SelectItem>
          ))}
        </Select>

        <Select
          aria-label="Seleccionar año"
          defaultSelectedKeys={[String(tempDate.year)]}
          selectedKeys={[String(tempDate.year)]}
          onSelectionChange={(keys) => {
            const key = Array.from(keys)[0];
            if (key) handleYearChange(Number(key));
          }}
          className="w-28"
        >
          {years.map((y) => (
            <SelectItem key={String(y)} textValue={String(y)}>
              {y}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div ref={calendarWrapperRef} className="flex-1 overflow-auto">
        <Calendar
          {...props}
          value={tempDate}
          onChange={(date) => {
            if (!date) return;
            const isValid = props.onChange ? props.onChange(date) : true;
            if (isValid) {
              setTempDate(date);
            }
          }}
          focusedValue={tempDate}
          minValue={new CalendarDate(minYear, 1, 1)}
          maxValue={today(getLocalTimeZone())}
        />
      </div>

      <Button
        color="primary"
        radius="lg"
        className="w-full mt-2"
        onPress={handleConfirm}
        isDisabled={!tempDate}
      >
        Confirmar
      </Button>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <>
          <Button
            variant="bordered"
            className="w-full h-12 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary transition-all duration-200 shadow-sm"
            onPress={() => setIsOpen(true)}
          >
            {confirmedDate
              ? formatDate(confirmedDate)
              : `Selecciona una ${label ?? "fecha"}`}
          </Button>

          <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
            <ModalContent className="bg-white dark:bg-gray-800 h-full flex justify-center items-center p-4">
              {PickerContent}
            </ModalContent>
          </Modal>
        </>
      ) : (
        <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="top-start">
          <PopoverTrigger>
            <Button
              variant="bordered"
              className="w-full h-12 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary transition-all duration-200 shadow-sm"
            >
              {confirmedDate
                ? formatDate(confirmedDate)
                : `Selecciona una ${label ?? "fecha"}`}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="p-3 bg-white dark:bg-gray-800 shadow-lg rounded-xl flex flex-col gap-3">
            {PickerContent}
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}