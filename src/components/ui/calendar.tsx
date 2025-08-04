import * as React from "react";
import { Calendar as UI5Calendar } from "@ui5/webcomponents-react";

export type CalendarProps = React.ComponentProps<typeof UI5Calendar>;

function Calendar({ ...props }: CalendarProps) {
  return (
    <UI5Calendar
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };