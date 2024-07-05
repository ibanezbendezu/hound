"use client"

import * as React from "react"
import * as AccordionPrimitive from '@radix-ui/react-accordion';

import {cn} from "@/lib/utils"

const Accordion = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({className, ...props}, ref) => (
    <AccordionPrimitive.Root
        ref={ref}
        className={cn(
            "w-full overflow-hidden",
            className
        )}
        {...props}
    />
))
Accordion.displayName = AccordionPrimitive.Root.displayName

const AccordionItem = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({className, ...props}, ref) => (
    <AccordionPrimitive.Item
        ref={ref}
        className={cn(
            "items-center justify-between",
            className
        )}
        {...props}
    />
))
AccordionItem.displayName = AccordionPrimitive.Item.displayName

const AccordionTrigger = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({className, ...props}, ref) => (
    <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
            "w-full flex items-center justify-between",
            className
        )}
        {...props}
    />
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({className, ...props}, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className={cn(
            "w-full",
            className
        )}
        {...props}
    />
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export {Accordion, AccordionItem, AccordionTrigger, AccordionContent}