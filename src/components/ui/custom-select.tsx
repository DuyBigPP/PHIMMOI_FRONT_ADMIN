"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ArrowLeft, Check, ChevronsUpDown } from "lucide-react"
import { type ChangeEvent, useEffect, useState, useRef } from "react"

export type SelectOption = {
  value: string
  label: string
}

type CustomSelectProps = {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
  otherOptionLabel?: string
  otherInputPlaceholder?: string
  disabled?: boolean
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Chọn một giá trị",
  emptyMessage = "Không có dữ liệu",
  className,
  otherOptionLabel = "Khác...",
  otherInputPlaceholder = "Nhập giá trị tùy chỉnh",
  disabled = false,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const [isCustomValue, setIsCustomValue] = useState(false)
  const [customInputValue, setCustomInputValue] = useState("")
  const [triggerWidth, setTriggerWidth] = useState(0)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const isValueInOptions = options.some((option) => option.value === value)
    setIsCustomValue(!isValueInOptions && value !== "")

    if (!isValueInOptions && value !== "") {
      setCustomInputValue(value)
    }
  }, [value, options])

  // Update width when popover opens
  useEffect(() => {
    if (open && triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth)
    }
  }, [open])

  // Update width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (triggerRef.current) {
        setTriggerWidth(triggerRef.current.offsetWidth)
      }
    }

    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const handleSelectChange = (currentValue: string) => {
    if (currentValue === "other") {
      setIsCustomValue(true)
    } else {
      setIsCustomValue(false)
      onChange(currentValue)
      setOpen(false)
    }
  }

  const handleCustomInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomInputValue(e.target.value)
  }

  const handleCustomInputBlur = () => {
    if (customInputValue.trim()) {
      onChange(customInputValue.trim())
    }
  }

  const handleCustomInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && customInputValue.trim()) {
      onChange(customInputValue.trim())
      setOpen(false)
    }
  }

  const toggleBackToSelect = () => {
    setIsCustomValue(false)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between text-lg", !value && "text-muted-foreground")}
            disabled={disabled}
          >
            {isCustomValue
              ? customInputValue || otherOptionLabel
              : value
                ? options.find((option) => option.value === value)?.label || value
                : placeholder}
            <ChevronsUpDown className="opacity-50 ml-2 size-6 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" style={{ width: `${triggerWidth}px` }} align="start">
          {isCustomValue ? (
            <div className="flex flex-col gap-2 p-2">
              <Input
                value={customInputValue}
                onChange={handleCustomInputChange}
                onBlur={handleCustomInputBlur}
                onKeyDown={handleCustomInputKeyDown}
                placeholder={otherInputPlaceholder}
                className="!text-lg !placeholder:text-lg"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleBackToSelect}
                className="justify-start font-normal text-lg"
              >
                <ArrowLeft className="size-4" /> Quay trở lại lựa chọn
              </Button>
            </div>
          ) : (
            <Command>
              <CommandInput placeholder={placeholder} className="text-lg" />
              <CommandList>
                <CommandEmpty className="text-lg">{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={handleSelectChange}
                      className="text-lg"
                    >
                      <Check className={cn("mr-2 size-6", value === option.value ? "opacity-100" : "opacity-0")} />
                      {option.label}
                    </CommandItem>
                  ))}
                  <CommandItem value="other" onSelect={handleSelectChange} className="text-lg">
                    <Check className={cn("mr-2 size-6", isCustomValue ? "opacity-100" : "opacity-0")} />
                    {otherOptionLabel}
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

