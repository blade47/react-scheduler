# React Scheduler Component

A feature-rich, customizable calendar and scheduling component for React applications, forked from `@aldabil/react-scheduler` with additional features and improvements.

### Notes
This fork was created to address specific requirements for a project. *Not all functionalities have been tested yet*. <br>
For documentation, features, and additional usage examples, visit the [original npm package page](https://www.npmjs.com/package/@aldabil/react-scheduler).

## Overview

This enhanced React Scheduler component provides comprehensive event scheduling capabilities with multiple view options (`day`, `week`, `month`, `agenda`), drag-and-drop functionality, and extensive customization options. It is designed to handle both simple and complex scheduling needs seamlessly.

### Main Enhancements Compared to `@aldabil/react-scheduler`

- Replaced `date-fns` with `dayjs`.
- Enhanced `customDialog` option for better dialog state management.
- Introduced `customTheme` support for tailored styling.
- Added `minDate` and `maxDate` options for calendar range limitation.
- Redesigned and refactored component internals for improved performance.
- Introduced `enableTodayButton` option (automatically activates if "today" is out of the provided date range).
- Added an `enableAgenda` option for toggling the agenda view.
- Added `selectedResource` as optional prop for selecting the default resource view.
- Open-sans / Manrope default font.


https://github.com/user-attachments/assets/0b6676f6-18a5-4142-8870-3f2cd3f50356

---

## Installation

To install the package:

```bash
npm install @blade47/react-scheduler
````

> Notice: This component uses mui / emotion / dayjs. If your project is not already using these libraries, this component may not be suitable.

---

## Usage

### Basic Example

```jsx
import { Scheduler } from "@blade47/react-scheduler";

<Scheduler
    view="month"
    events={[
        {
            event_id: 1,
            title: "Event 1",
            start: new Date("2021/05/02 09:30"),
            end: new Date("2021/05/02 10:30"),
        },
        {
            event_id: 2,
            title: "Event 2",
            start: new Date("2021/05/04 10:00"),
            end: new Date("2021/05/04 11:00"),
        },
    ]}
/>;
```

### Scheduler Props

All props are *optional*.

| Prop              | Value                                                                              | Default |
|-------------------|------------------------------------------------------------------------------------|---------|
| minDate           | Date. Minimum date of the calendar.                                                | `null`  |
| maxDate           | Date. Maximum date of the calendar.                                                | `null`  |
| enableTodayButton | boolean. Show/Hide today button.                                                   | `true`  |
| customTheme       | Material Theme. Custom theme object.                                               | `null`  |
| customDialog      | Function(open: boolean, props: DialogProps): JSX.Element. Custom dialog component. | `null`  |
| enableAgenda      | boolean. Show/Hide agenda view.                                                    | `true`  |
| selectedResource  | string. Default resource view.                                                     | `null`  |

### Original Props

Here are the original props supported by the library. <br>
[Click here to see the full list](https://www.npmjs.com/package/@aldabil/react-scheduler)

---

### SchedulerRef

The `SchedulerRef` allows control over the internal state of the `Scheduler` component from outside its props. 
Here's a usage example:

```js
import { Scheduler, SchedulerRef } from "@blade47/react-scheduler";

const SomeComponent = () => {
    const calendarRef = useRef<SchedulerRef>(null);

    return <Fragment>
        <div>
            <Button onClick={()=>{
                calendarRef.current.scheduler.handleState("day", "view");
            }}>
                Change View
            </Button>
            <Button onClick={()=>{
                calendarRef.current.scheduler.triggerDialog(true, {
                    start: new Date("2023-12-01T09:00:00"),
                    end: new Date("2023-12-01T10:00:00"),
                })
            }}>
                Add Event Tomorrow
            </Button>
        </div>

        <Scheduler ref={calendarRef} events={[]} />
    </Fragment>
};
```

You can utilize `handleState` for dynamic control:

```
calendarRef.current.scheduler.handleState(value, key);
```

### Available Demos

- [Basic](https://codesandbox.io/p/sandbox/standard-x24pqk)
- [Remote Data](https://codesandbox.io/s/remote-data-j13ei)
- [Custom Fields](https://codesandbox.io/s/custom-fields-b2kbv)
- [Editor/Viewer Override](https://codesandbox.io/s/customeditor-tt2pf)
- [Resources/View Mode](https://codesandbox.io/s/resources-7wlcy)
- [Custom Cell Action](https://codesandbox.io/s/custom-cell-action-n02dv)
- [Custom Event Renderer](https://codesandbox.io/s/custom-event-renderer-rkf4xw)

### Todos

- [ ] Tests
- [x] Drag&Drop - partially
- [ ] Resizable
- [x] Recurring events - partially
- [x] Localization
- [x] Hour format 12 | 24
