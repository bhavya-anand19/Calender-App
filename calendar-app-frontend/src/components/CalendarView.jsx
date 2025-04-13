import React, { useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import Sidebar from "./Sidebar";
import EventModal from "./EventModal";
import "../App.css";
import { fetchEvents, createEvent } from "../features/calendar/calendarSlice";
import axios from "axios";

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import {
  openModal,
  closeModal,
  updateFormData,
  resetFormData,
} from "../features/calendar/calendarSlice";

const CalendarView = () => {
  const dispatch = useDispatch();
  const { modalOpen, formData, events } = useSelector(
    (state) => state.calendar
  );

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    const draggableEl = document.querySelector(".sidebar");
    new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        const data = JSON.parse(eventEl.getAttribute("data-event"));
        return {
          title: data.title,
          color: data.color,
          extendedProps: {
            category: data.category,
          },
        };
      },
    });
  }, []);

  const formatDateTimeLocal = (date) => {
    const pad = (n) => n.toString().padStart(2, "0");
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  const handleDateClick = (info) => {
    const clickedDate = new Date(info.date);
    const localDateTime = formatDateTimeLocal(clickedDate);

    dispatch(
      updateFormData({
        start: localDateTime,
        end: "",
        date: localDateTime.split("T")[0],
        title: "",
        category: "",
        color: "",
      })
    );
    dispatch(openModal());
  };

  const handleEventReceive = (info) => {
    const dropped = info.event;
    const start = new Date(info.event.startStr);
    const localDateTime = formatDateTimeLocal(start);

    dispatch(
      updateFormData({
        title: dropped.title,
        category: dropped.extendedProps.category,
        color: dropped.backgroundColor,
        start: localDateTime,
        end: "",
        date: localDateTime.split("T")[0],
      })
    );
    dispatch(openModal());
    info.event.remove();
  };

  const handleEventResize = async (info) => {
    const updatedEvent = {
      start: info.event.startStr,
      end: info.event.endStr,
      title: info.event.title,
      color: info.event.backgroundColor,
      extendedProps: {
        category: info.event.extendedProps?.category || "",
      },
    };

    await axios.put(
      `http://localhost:5000/api/events/${info.event.id}`,
      updatedEvent
    );
    dispatch(fetchEvents());
  };

  const handleEventDrop = async (info) => {
    const updatedEvent = {
      start: info.event.startStr,
      end: info.event.endStr,
      title: info.event.title,
      color: info.event.backgroundColor,
      extendedProps: {
        category: info.event.extendedProps?.category || "",
      },
    };

    await axios.put(
      `http://localhost:5000/api/events/${info.event.id}`,
      updatedEvent
    );
    dispatch(fetchEvents());
  };

  const handleModalSubmit = async () => {
    try {
      console.log("🔥 Modal Submit Clicked");

      const eventData = {
        title: formData.title,
        start: formData.start,
        end: formData.end || formData.start,
        color: formData.color || "#4285f4",
        extendedProps: {
          category: formData.category,
        },
      };

      console.log("📦 Data being sent:", eventData);

      if (formData._id) {
        await axios.put(
          `http://localhost:5000/api/events/${formData._id}`,
          eventData
        );
      } else {
        console.log("🛰 Dispatching createEvent...");
        await dispatch(createEvent(eventData)); // ✅ await this
        await dispatch(fetchEvents()); // ✅ fetch new list
        console.log("✅ Event dispatch done");
      }

      dispatch(resetFormData());
      dispatch(closeModal());
    } catch (err) {
      console.error("❌ Error in handleModalSubmit:", err);
    }

    console.log("⏰ start:", formData.start);
    console.log("⏰ end:", formData.end);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,today,next",
            center: "title",
            right: "timeGridDay,timeGridWeek,dayGridMonth,dayGridYear",
          }}
          views={{
            dayGridYear: {
              type: "dayGridMonth",
              duration: { years: 1 },
              buttonText: "Year",
            },
          }}
          height="auto"
          slotDuration="00:15:00"
          slotLabelInterval="01:00:00"
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          allDaySlot={false}
          editable={true}
          droppable={true}
          selectable={true}
          dateClick={handleDateClick}
          eventReceive={handleEventReceive}
          events={events}
          eventResize={handleEventResize}
          eventDrop={handleEventDrop}
          eventClick={(info) => {
            const event = info.event;
            dispatch(
              updateFormData({
                _id: event.id,
                title: event.title || "",
                category: event.extendedProps?.category || "",
                color: event.backgroundColor || "",
                start: formatDateTimeLocal(new Date(event.start)),
                end: event.end ? formatDateTimeLocal(new Date(event.end)) : "",
                date: event.startStr.split("T")[0],
              })
            );
            dispatch(openModal());
          }}
        />
        <EventModal
          isOpen={modalOpen}
          onClose={() => dispatch(closeModal())}
          onSubmit={handleModalSubmit}
          formData={formData}
          setFormData={(data) => dispatch(updateFormData(data))}
        />
      </div>
    </div>
  );
};

export default CalendarView;
